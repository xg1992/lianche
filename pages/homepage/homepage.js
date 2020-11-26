
import share2 from '@/components/share.nvue'
export default {
	components: {
		share2,
	},
	data() {
		return {
			type: 1,
			all: '',
			page: 1,
			list: '',
			navtop: false,
			isShowMore: false,
			shareOptions: {
				params:{
					uid: ''
				}, // 分享的参数
				shareUrl: "pages/share/homepage/homepage",
				title: '来练车观看精彩视频吧！',
				summary: '给你分享一个链车大神，快来看看吧！',
				imageUrl: '',
			},
			institutionId: '', // 机构id，传递给优惠券列表
		};
	},
	onLoad(options) {
		this.id = options.uid;
		this.shareOptions.params.uid = options.uid;
		this.load();
	},
	onReachBottom() {
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
	onNavigationBarButtonTap(e){
		this.$refs.share.openShare()
	},
	methods: {
		load() {
			console.log(this.id);
			let that = this;
			that.$api.request('Video/Homepage/homepageUserinfo', {
				uid: this.id
				// uid: 1000003,
			}).then(res => {
				that.all = res.data;
				that.shareOptions.imageUrl = that.$realSrc(res.data.avatar);
				if(res.data.institutionId) that.institutionId = res.data.institutionId;
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
						uid: this.id
					}).then(res => {
						that.all = res.data;
						// 关注或取消关注时更新主页用户添加关注图标 
						uni.$emit('follow',{uid: res.data.uid, fanIt:res.data.hadFollow ? 1:0})
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
		tolook(currentVideoId, videoList = []) {
			let that = this;
			let act;
			if (that.type == 1) { //作品
				act = 'Video/Works/myVideo';
			}
			if (that.type == 2) { //喜欢
				act = 'Video/Works/myZans';
			}
			if (that.type == 3) { //练车（课程）
				act = 'Video/Works/videoByIdsShow';
			}
			if (that.type != 3) {
				uni.navigateTo({
					url: '/pages/video/video?act=' + act + '&currentVideoId=' + currentVideoId + '&uid=' + this.all.uid
				});
			} else {
				let ids = [];
				videoList.list.forEach(item => {
					ids.push(item.id);
				});
				uni.navigateTo({
					url: '/pages/video/video?act=' + act + '&currentVideoId=' + currentVideoId + '&uid=' + this.all.uid + '&ids=' +
						ids.join()
				});
			}
		},
		showMore(){
			this.isShowMore = !this.isShowMore;
		},
		// 分享
		share(){
			uni.share({
				provider: all.provider,
				scene: all.scene,
				href: 'https://lianche.haoshuninfo.com/html/download.html?userId=' + that.dataList[that.k].video_id,
				title: '来链车观看精彩视频吧！',
				summary: that.dataList[that.k].title,
				imageUrl: that.dataList[that.k].cover,
				success: function(res) {
					// console.log('success:' + JSON.stringify(res));
					// type 分享类型，0:其他，1：短视频   channel 分享渠道,0:其他，1:微信好友或群，2:微信朋友圈, 3:微博, 4:qq, 5:qq空间
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		}
	},
};
