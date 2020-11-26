<template>
	<view>
		<view class="h_center jc_sa nav_box">
			<view class="center font34 colorb3 " :class="type == 1 ? 'nav_active' : ''" @click="nav(1)">作品</view>
			<view class="center font34 colorb3 " :class="type == 2 ? 'nav_active' : ''" @click="nav(2)">喜欢</view>
			<view class="center font34 colorb3 " :class="type == 3 ? 'nav_active' : ''" @click="nav(3)">课程</view>
		</view>
		<view class="h_center f_wrap" v-show="type == 1">
			<view class="list_box" v-for="(item, idx) in list" :key="item.videoId" @click="tolook(item.videoId)">
				<image :src="$realSrc(item.cover)"></image>
				<view class="item_like" v-if="item.state === 2">
					<text class="iconfont icon-lc-18 font36"></text>
					{{ item.recommends }}
				</view>
				<view class="video-istop" v-if="item.istop > 0">
					<view class="istop-center">
						<text class="font24">置顶</text>
					</view>
				</view>
				<!-- 作品状态:-2:用户删除,-1:系统删除,0:保存草稿,1:审核中,2:正常 3:不通过 -->
				<view class="video-state" v-if="item.state === 1 || item.state === 0">
					<view class="state-center">
						<view><text class="iconfont icon-lc-4"></text></view>
						<text>{{item.state === 1 ? '审核中' : '上传中'}}</text>
					</view>
				</view>
				<view class="video-state" v-else-if="item.state === failState">
					<view class="state-uploadfail">
						<text>上传失败</text>
					</view>
					<view class="reupload" @click.stop="uploadVideo(item)">
						<text>重新上传</text>
					</view>
				</view>
			</view>
		</view>
		<view class="h_center f_wrap" v-show="type == 2">
			<view class="list_box" v-for="(item, idx) in list" :key="item.videoId" @click="tolook(item.videoId)">
				<image :src="$realSrc(item.cover)"></image>
				<view class="item_like">
					<text class="iconfont icon-lc-18"></text>
					{{ item.recommends }}
				</view>
			</view>
		</view>
		<view class="" v-show="type == 3">
			<view class="video_gather " v-for="(item, idx) in list" :key="item.videoId">
				<view class="h_center font34">
					<text class="pdy20">{{ item.day }}</text>
				</view>
				<view class="" style="margin: 30rpx 0;">
					<!-- 					<view class="font26">
								<text class=" color8d">内容：</text>
								<text>科二实操</text>
							</view> -->
					<view class="font26 mgto10">
						<text class=" color8d">学员：</text>
						<text>{{ item.nicknames }}</text>
					</view>
				</view>
				<scroll-view scroll-x class="scroll_video">
					<view class="list_box" v-for="(i, index) in item.list" :key="i.id" @click="tolook(i.id, item)">
						<image :src="$realSrc(i.cover)"></image>
						<view class="item_like">
							<text class="iconfont icon-lc-18"></text>
							{{ i.recommends }}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<list-empty v-if="!list || list.length==0" :msg="msg"></list-empty>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				type: 1,
				all: '',
				page: 1,
				list: '',
				msg: '',
				failState: -1000, // 上传失败的状态码
			};
		},
		onLoad(options) {
			this.id = this.$api.storage('uid');
			this.load();
		},
		onShow(){
			console.log(globalData);
			this.cancelTopVideo(); // 先处理取消置顶，再处理添加置顶
			this.updateTopVideo();
			this.delVideo(); 
		},
		onHide(){
			// 页面隐藏时清空数据
			globalData.delvideoList = []; // 已删除的视频列表
			globalData.setTopvideoList = []; // 已置顶的视频列表
			globalData.cancelSetTopvideoList = []; // 取消置顶的视频列表
		},
		onReady(){
			this.videoUploadSuccess();
		},
		methods: {
			load() {
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
				} //课程
				that.$api.request(act, {
					uid: this.id,
					typeShow: 1
				}).then(res => {
					// console.log(res);
					that.list = res.data;
					that.msg = res.msg;
					that.videoInUpload(res.data)
				});
			},
			// 判断视频是否上传失败
			videoInUpload(data){
				if(Array.isArray(data)){
					data.forEach(item=>{
						if(item.state === 0){
							let videoInfo = uni.getStorageSync('uploadVideoInfo'+item.videoId);
							console.log(videoInfo);
							if(videoInfo){
								let time = new Date().getTime() - videoInfo.timeStamp; // 上传开始和进入页面的时间差，低于5分钟不做处理
								let limitTime = 1000 * 60 * 5; // 限定时间超过5分钟仍未上传成功，判定上传失败
								if(videoInfo.state === this.failState || time > limitTime){
									item.state = this.failState; // 上传超时，状态改为上传失败
									this['videoInfo'+item.videoId] = videoInfo;
								}
							}else{
								item.state = this.failState;
							}
						}
					})
				}
			},
			// 上传视频
			uploadVideo(item){
				let that = this;
				let videoInfo = this['videoInfo'+item.videoId];
				console.log(videoInfo)
				// 先获取视频文件，是否存在
				uni.getSavedFileInfo({
					filePath: videoInfo.video,
					success(res) {
						console.log(res)
						item.state = 0;
						const uploadTask = uni.uploadFile({
						    url:that.$api.config.baseUrl+'Video/Video/uploadVideo',
						    filePath:videoInfo.video,
						    name: 'video',
						    formData: {
								vid:videoInfo.videoId,
								_uuid:that.$api.storage('uuid'),
								_token:that.$api.storage('token'),
								_time:new Date().getTime(),
								_pf:that.$api.platform,
								_version:that.$api.config.version
							},
							header: {
								'content-type': 'multipart/form-data'
							},
						  success: (res) => {
								console.log(res)
								let data = res.data;
								if(typeof data == 'string'){
									data = JSON.parse(data);
								}
								console.log(data)
								if(data.res == 1){
									// 上传成功，删除对应视频信息的缓存
									let storageVideoInfo = uni.getStorageSync('uploadVideoInfo' + videoInfo.videoId);
									if(storageVideoInfo){
										uni.removeSavedFile({
											filePath: storageVideoInfo.video
										})
										uni.removeStorage({
											key: 'uploadVideoInfo' + videoInfo.videoId
										})
										item.state = 1;
										uni.showToast({
											title: '上传成功',
											icon: 'none'
										})
									}
								}else{
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
						  },
							fail(err){
								// 上传失败，修改缓存对应视频信息的状态
								console.log(err)
								item.state = that.failState;
								uni.setStorageSync('uploadVideoInfo' + videoInfo.videoId,videoInfo);
								uni.showToast({
									title: '上传失败',
									icon: 'none'
								})
							},
							complete(res){
								uni.hideLoading()
							}
						});
						uploadTask.onProgressUpdate((res)=>{
							console.log(res)
						})
					},
					fail(err) {
						uni.showToast({
							title: '视频文件不存在',
							icon: 'none'
						})
					}
				})
				
			},
			follow() {
				let that = this;
				if (!that.$api.storage('token')) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return false;
				}
				that.$api
					.request('Video/Follow/doFollow', {
						followedUid: that.all.uid,
						fanIt: that.all.hadFollow ? '0' : '1'
					})
					.then(res => {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						if (res.res == 1) {
							that.load();
						}
					});
			},
			nav(e) {
				this.type = e;
				this.page = 1;
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
				} //课程
				that.$api
					.request(act, {
						uid: this.id,
						typeShow: 1
					})
					.then(res => {
						that.list = res.data;
						that.msg = res.msg
						// console.log(res);
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
				if (that.type == 1) {
					act = 'Video/Works/myVideo';
				} //作品
				if (that.type == 2) {
					act = 'Video/Works/myZans';
				} //喜欢
				if (that.type == 3) {
					act = 'Video/Works/myOrder';
				} //课程
				if (that.type != 3) {
					uni.navigateTo({
						url: '/pages/video/video?act=' + act + '&currentVideoId=' + currentVideoId + '&uid=' + this.id + '&typeShow=1'
					});
				} else {
					let ids = [];
					videoList.list.forEach(item => {
						ids.push(item.id);
					});
					uni.navigateTo({
						url: '/pages/video/video?act=' + act + '&currentVideoId=' + currentVideoId + '&uid=' + this.id + '&ids=' + ids.join() +
							'&typeShow=1'
					});
				}
			},
			// 根据置顶视频列表更新置顶视频
			updateTopVideo(){
				let topVideoList = globalData.setTopvideoList;
				if(topVideoList && topVideoList.length > 0){
					let len = this.list.length;
					topVideoList.forEach((item,index)=>{
						for(let i = 0; i < len; i++){
							if(item === this.list[i].videoId){
								this.list[i].istop = 1000 + index;
								this.list.unshift(this.list[i])
								this.list.splice(i+1,1);
								break;
							}
						}
					})
				}
			},
			// 根据取消置顶视频列表更新列表
			cancelTopVideo(){
				let cancelSetTopvideoList = globalData.cancelSetTopvideoList;
				if(cancelSetTopvideoList && cancelSetTopvideoList.length > 0){
					let len = this.list.length;
					cancelSetTopvideoList.forEach((item,index)=>{
						for(let i = 0; i < len; i++){
							if(item === this.list[i].videoId){
								this.list[i].istop = 0;
								if(len < 4){
									this.list.splice(len,0,this.list[i]); // 先把取消置顶的视频添加到列表，再进行删除
								}else{
									this.list.splice(4,0,this.list[i]); // 先把取消置顶的视频添加到列表，再进行删除
								}
								this.list.splice(i,1);
								break;
							}
						}
					})
				}
			},
			// 根据删除的视频列表更新列表
			delVideo(){
				let delvideoList = globalData.delvideoList;
				if(delvideoList && delvideoList.length > 0){
					let len = this.list.length;
					delvideoList.forEach((item,index)=>{
						for(let i = 0; i < len; i++){
							if(item === this.list[i].videoId){
								this.list.splice(i,1);
								break;
							}
						}
					})
				}
			},
			// 监听发布视频上传成功后，修改上传视频的状态
			videoUploadSuccess(){
				uni.$once('videoUploadSuccess',(res)=>{
					if(this.type === 1){
						let list = this.list;
						for(let i = 0, len = list.length; i < len; i++){
							if(list[i].videoId == res.videoId){
								list[i].state = 1;
								break ;
							}
						}
					}
				})
			}
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
			} //课程
			that.$api
				.request(act, {
					page: that.page + 1,
					pagesize: 10,
					uid: this.id,
					typeShow: 1
				})
				.then(res => {
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
		}
	};
</script>

<style>
	.nav_box {
		height: 96rpx;
	}

	.nav_box>view {
		height: 100%;
		flex-grow: 1;
	}

	.nav_active {
		color: #f6a704;
		position: relative;
	}

	.nav_active:after {
		content: '';
		display: block;
		width: 125rpx;
		height: 4rpx;
		background: #f6a704;
		border-radius: 2rpx;
		position: absolute;
		bottom: 10rpx;
		left: 0;
		right: 0;
		margin: auto;
	}

	.list_box {
		position: relative;
		width: 246rpx;
		height: 352rpx;
		border: 1rpx solid #191C2F;
	}

	.list_box image {
		width: 100%;
		height: 100%;
	}

	.item_like {
		position: absolute;
		bottom: 28rpx;
		left: 19rpx;
		font-size: 22rpx;
	}

	.item_like .iconfont {
		font-size: 22rpx;
		padding-right: 9rpx;
	}

	.video_gather {
		padding: 35rpx 30rpx;
		background-color: #2e3045;
		margin-bottom: 33rpx;
	}

	.scroll_video {
		display: inline-block;
		white-space: nowrap;
		width: 100%;
	}

	.scroll_video .list_box {
		width: 200rpx;
		margin-right: 5rpx;
		display: inline-block;
		height: 264rpx;
	}

	.scroll_video .item_like {
		position: absolute;
		bottom: 23rpx;
		left: 16rpx;
		font-size: 16rpx;
	}

	.scroll_video .item_like .iconfont {
		font-size: 20rpx;
		padding-right: 9rpx;
	}
	
	/* xg 2020.9.2 */
	.video-state {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.state-center {
		padding-top: 40rpx;
		background-color: rgba(0,0,0,.5);
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		text-align: center;
		box-sizing: border-box;
	}
	.video-istop,.state-uploadfail {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		padding: 0 12rpx;
		height: 40rpx;
		border-radius: 8rpx;
		line-height: 34rpx;
		background-color: orange;
		font-size: 24rpx;
	}
	.state-uploadfail {
		line-height: 40rpx;
		background-color: red;
	}
	.reupload {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: center;
		height: 36px;
		line-height: 36px;
		background-color: orange;
		color: #fff;
	}
</style>
