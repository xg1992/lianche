import browerTip from '../BrowerTip.vue'
import launchapp from '../launchApp.vue'
import {wxConfig} from '@/common/weixin.js'
import {getAppInfo,isIos} from '../comm.js'
export default {
	components:{
		browerTip,
		launchapp
	},
	data() {
		return {
			type: 1,
			all: '',
			page: 1,
			list: '',
			navtop: false,
			isShowMore: false,
			extinfo: {
				"path":"/pages/homepage/homepage?",
				"openType":"navigate",
			}, // 跳转app携带的参数
			isIos: isIos(),
		};
	},
	onLoad(options) {
		if(!this.isWeixin()){
			uni.redirectTo({
				url: `/pages/share/download?route=pages/homepage/homepage&uid=${options.uid}`
			})
		}else{
			this.extinfo.path = `${this.extinfo.path}uid=${options.uid}`;
			this.extinfo = JSON.stringify(this.extinfo)
			this.id = options.uid;
			this.load();
			getAppInfo(this);
			wxConfig()
		}
	},
	onReachBottom() {
		let that = this;
		let act;
		if (that.type == 1) {
			act = 'Video/Works/myVideo';
		} //作品
		that.$api.request(act, {
			page: that.page + 1,
			pagesize: 10,
			uid: that.all.uid,
			typeShow: 2
		}).then(res => {
			that.list = that.list.concat(res.data);
			if (res.data) {
				that.page = that.page + 1;
			}
		});
	},
	onPullDownRefresh() {
		this.page = 1;
		this.load();
		uni.stopPullDownRefresh();
	},
	onPageScroll: function(e) {
		// 根据滚动高度动态吸顶
		if (e.scrollTop >= 190) {
			this.navtop = true;
		} else {
			this.navtop = false;
		}
	},
	methods: {
		load() {
			console.log(this.id);
			let that = this;
			that.$api.request('Video/Homepage/homepageUserinfo', {
				uid: this.id
			}).then(res => {
				that.all = res.data;
			});
			let act;
			if (that.type == 1) {
				act = 'Video/Works/myVideo';
			} //作品
			if (that.type == 2) {
				act = 'Video/Works/myZans';
			} //喜欢
			if (that.type == 3) {
				act = 'Video/Works/myOrder';
			} //练车（课程）
			that.$api.request(act, {
				uid: this.id,
				typeShow: 2
			}).then(res => {
				that.list = res.data;
			});
		},
		follow() {
			let that = this;
			if (!that.$api.storage('token')) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
				return false;
			}
			that.$api.request('Video/Follow/doFollow', {
				followedUid: that.all.uid,
				fanIt: that.all.hadFollow ? '0' : '1'
			}, 'post', false).then(res => {
				if (res.res == 13) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return false;
				}
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
				if (res.res == 1) {
					that.$api.request('Video/Homepage/homepageUserinfo', {
						uid: that.id
					}).then(res => {
						console.log(res)
						that.all = res.data;
					});
				}
			});
		},
		nav(e) {
			this.type = e;
			this.page = 1;
			let list = this.list;
			this.list = [];
			let that = this;
			let act;
			if (that.type == 1) {
				act = 'Video/Works/myVideo';
			} //作品
			if (that.type == 2) {
				act = 'Video/Works/myZans';
			} //喜欢
			if (that.type == 3) {
				act = 'Video/Works/myOrder';
			} //练车（课程）
			that.$api.request(act, {
				uid: that.all.uid,
				typeShow: 2
			}).then(res => {
				that.list = res.data;
			});
		},

		/**
		 * 播放视频及列表
		 * @param {int} currentVideoId 当前视频id  
		 * @param {array} videoList 当前视频列表 
		 */
		openBrowerTip() {
			this.$refs.browerTip.openTip();
		},
		showMore(){
			this.isShowMore = !this.isShowMore;
		},
		//检查是否微信浏览器
		isWeixin() {
			var ua = navigator.userAgent.toLowerCase();
			var isWeixin = ua.indexOf('micromessenger') != -1;
			if (isWeixin) {
				return true;
			}else{
				return false;
			}
		},
		openAppError(e){
			const _this = this;
			if(_this.isIos){
				location.href = _this.appDownloadUrl
			}else{
				_this.openBrowerTip();
			}
		},
	},
};
