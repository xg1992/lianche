<template>
	<view>
		<view class="pd15 botom botop h_center jc_sb ">
			<view class=" f_grow posre" style="min-width:50%;">
				<textarea @input='textarea' :value='value' placeholder="写标题并使用合适的话题，能让更多人看到~~~" class="fb_text" placeholder-class="color3b"
				 maxlength="50" :focus="focus" @blur="focus=false" />
				<text class="ht_icon" @click="insert">#添加话题</text>
				<view class="maxtext">{{textlen}}/50</view>
			</view>
			<view class="posre">
				<image :src="coverurl" class="fm_img" @click="fullScreenPlay"></image>
				<!-- <view class="xuan_btn" @click="clickcover">选封面</view> -->
			</view>
		</view>
		<scroll-view class="topics-list" scroll-y="true" >
		    <view class="pd15 h_center font24 colorb3 colorw" v-for="(n,idx) in topics_list" :key='idx' @click="opt_topic(n)">
		    	#{{n.name}}
		    </view>
		</scroll-view>
		<view class="h_center jc_fs botop botom pdzy15" style="height: 112rpx;flex-wrap:wrap;" v-if="hot_topics.length>0&&topics_list.length==0">
			<view class="hot-pic" v-for="(i,index) in hot_topics" :key="index" @click="opt_topic(i,index,true)">#{{i.name}}</view>
		</view>
		<view class="h_center jc_sb botop botom pdzy15" style="height: 112rpx;">
			<text>相关预约记录</text>
			<xfl-select  :list="mentlist" :clearable="false" :showItemNum="5"  :listShow="false" :isCanInput="false"  
			    :style_Container="'font-size: 15px;'" :placeholder = "'placeholder'" :initValue="'选择预约记录'"
			    :selectHideType="'hideAll'" style="width: 50%;" @change='mentclick'></xfl-select>
		</view>
		<view class="center fb_btn" @click="upvideo">发布</view>
		<fullScreenVideo :src="$realSrc(videourl)" hideCtrl="showFullScreen" v-if="showFullScreen"></fullScreenVideo>
	</view>
</template>

<script>
	import xflSelect from '../../components/xfl-select/xfl-select.vue'; 
	import fullScreenVideo from '@/components/fullscreenVideo.nvue'
	// #ifdef APP-PLUS
	const modal = uni.requireNativePlugin('modal');
	const ShortVideo = uni.requireNativePlugin('LianCheShortVideo');
	// #endif
	//const plugins = require('../../common/LianCheShortVideo.js');
	const delay = (function () {
	 let timer = 0
	 return function (callback, ms) {
	  clearTimeout(timer)
	  timer = setTimeout(callback, ms)
	 }
	})()
	export default {
		components: {
			xflSelect,
			fullScreenVideo
		},
		data() {
			return {
				textlen:0,
				value:'',
				mentlist: [],
				topics_list:[],
				hot_topics:[],
				trainingOrderId:'',
				topics_box:'',
				oldvalue:'',
				videourl:'',
				coverurl:'', // 封面缩略图路径
				all:'',
				//plugins:plugins,
				topic:[],
				coverimg:'', // 封面原图路径
				timer:null,
				showFullScreen: false,
				focus:false
			}
		},
		onLoad(options) {
			// 测试数据,接口完善后记得删除
			// let list = [],list2=[];
			// for(let i=0; i < 6; i++){
			// 	list.push('训练场'+i)
			// 	list2.push({
			// 		title: '训练场' + i,
			// 		lng: i,
			// 		lat: i,
			// 		id: i
			// 	})
			// }
			// this.mentlist = list;
			// this.mentlist2 = list2;
			// console.log(this.mentlist)
			// 测试数据结束
			this.load()
			console.log(JSON.parse(options.result))
			if(options.result){
				this.all=JSON.parse(options.result)
				if(this.all.cover){
					this.upcover(this.all.cover);
					this.coverurl = this.all.cover;
				}
				this.videourl=this.all.localVoideoPath
			}
		},
		onBackPress() {
			if(this.showFullScreen){
				this.showFullScreen = false;
				return true;
			}
		},
		methods: {
			load(){
				let that=this
				that.$api.request('Video/Video/showPublishVideo', {}).then(res => {
					let list=[]
					if(res.data.applyOrder){
						res.data.applyOrder.forEach(function(v){
						    list.push(v.title)
						});
					}
					that.mentlist=list
					if(res.data.hotTopic){
						this.hot_topics = res.data.hotTopic
					}
				})
			},
			insert(){
				this.value=this.value+'#'
				this.focus = true
			},
			// 发布视频
			upvideo(){
				let that=this
				let list=[];
				let maxSize = 30 * 1024 * 1024; //限制最大上传的视频大小30M
				if(this.all.length && this.all.length > maxSize){
					uni.showToast({
						title: '视频大小不能超过30M！',
						icon: 'none'
					})
					return ;
				}
				// 判断是否正在上传视频
				if(!that.inUpload){
					that.inUpload = true;
					console.log(that.all)
					if(!that.all.lon||!that.all.lat){
						uni.getLocation({
							type: 'gcj02',
							success: (res)=> {
									that.all.lat=res.latitude;
									that.all.lon=res.longitude;
							},
							fail: (err)=>{
								console.log(err)
							},
							complete:(err)=>{
								fb()
							}
						});
					}else{
						fb()
					}
				}else{
					return ;
				}
				
				function fb(){
					delay(() => {
					    let topiclist=that.ReplaceTopic(that.value)
					    topiclist.forEach(v=>{
					    	list.push(v.replace("#",""))
					    });
					    if(list.length>3){that.$api.Toast('话题不得超出3个');}
					    let topic=[]
					    list.forEach(v=>{
					    	topic.push({topicId:0,name:v})
					    });
					    topiclist.forEach(v=>{
					    	that.value=that.value.replace(v,'')
					    });
							console.log(that.all)
					    console.log(JSON.stringify(topic))
							let videoInfo = {
								title:that.value,
								trainingOrderId:that.trainingOrderId,
								topic:JSON.stringify(topic),
								cover:that.coverimg,
								coverThumb: that.coverurl,
								video:'',
								duration:that.all.duration?that.all.duration:'',
								width:that.all.width?that.all.width:'',  
								height:that.all.height,
								address:that.all.address?that.all.address:'',
								lon:that.all.lon,
								lat:that.all.lat
					    };
					    that.$api.request('Video/Video/publishVideoinfo', videoInfo).then(res => {
								console.log(res)
								// 本地缓存上传的视频信息，以防上传失败时能够重新上传
								that.saveLocalVideo(videoInfo,res.data.vid);
					    	if(res.res!=1){uni.hideLoading();that.$api.Toast(res.msg);return false;}
					    	// #ifdef APP-PLUS
					    	if(res.res==1){
									console.log(res);
					    		that.uploadVideo(res,videoInfo);
									// 开始上传视频时就跳转,减少等待时间
									uni.redirectTo({url: '/pages/my/my_works'});
					    	}else{
									that.inUpload = false;
								}
					    	// #endif
					    }).catch(err=>{
								that.inUpload = false;
							})
					}, 0)
				}
			},
			saveLocalVideo(videoInfo,videoId){
				let that = this;
				uni.setStorageSync('uploadVideoInfo' + videoId, videoInfo);
				uni.saveFile({
					tempFilePath: that.videourl,
					success: function (res) {
						console.log(res)
						videoInfo.video = res.savedFilePath;
						videoInfo.videoId = videoId;
						videoInfo.state = 0;
						videoInfo.timeStamp = new Date().getTime();
						uni.setStorageSync('uploadVideoInfo' + videoId, videoInfo);
					}
				});
			},
			// 上传视频
			uploadVideo(res,videoInfo){
				let that = this;
				let videoId = res.data.vid;
				const uploadTask = uni.uploadFile({
				    url:that.$api.config.baseUrl+'Video/Video/uploadVideo',
				    filePath:that.all.localVoideoPath,
				    name: 'video',
				    formData: {
						vid:videoId,
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
						let data = res.data;
						if(typeof data == 'string'){
							data = JSON.parse(data);
						}
						if(data.res === 1){
							uni.$emit('videoUploadSuccess',{videoId})
							// 上传成功，删除对应视频文件和缓存
							let storageVideoInfo = uni.getStorageSync('uploadVideoInfo' + res.data.vid);
							if(storageVideoInfo){
								uni.removeSavedFile({
									filePath: storageVideoInfo.video
								})
								uni.removeStorage({
									key: 'uploadVideoInfo' + videoInfo.videoId
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
						console.log(err)
						console.log(videoInfo.state)
						// 上传失败，修改缓存对应视频信息的状态
						videoInfo.state = -1000;
						uni.setStorageSync('uploadVideoInfo' + videoInfo.videoId,videoInfo)
						
					},
					complete(res){
						console.log(res)
						uni.hideLoading()
					}
				});
				// 监听文件上传进度
				uploadTask.onProgressUpdate((res)=>{
					// console.log(res)
				})
			},
			upcover(path){
				console.log(path)
				let that=this
				uni.uploadFile({
				    url:that.$api.config.baseUrl+'Video/Video/uploadVideoCover' ,
				    // filePath: 'file://'+path,
				    filePath:path,
				    name: 'cover',
				    formData: {
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
				        console.log(JSON.parse(res.data));
								let data = JSON.parse(res.data);
								if(data.res==13){uni.navigateTo({url: '/pages/login/login'});}
								that.coverimg = data.data.cover;
								that.$set(that,'coverurl',this.$realSrc(data.data.coverThumb))
				    }
				});
				
			},
			clickcover(){
				let that=this
				/* if(that.$api.platform=='ios'){
					plugins.screenshot({localVoideoPath:that.all.localVoideoPath},function(result) {
							console.log("callback---coverPath--" + result.imagePath);
							that.upcover(JSON.parse(result).imagePath)
					    },
					    function(result) {
					    }
					);
				}else{
					ShortVideo.screenshot({localVoideoPath:that.all.localVoideoPath}, function(result) {
						console.log("callback---coverPath--" + result.imagePath);
						that.upcover(JSON.parse(result).imagePath)
					});
				} */
				
			},
			mentclick(e){
				this.trainingOrderId=this.mentlist[e.index].id;
				// this.all.lon = this.mentlist2[e.index].lng;
				// this.all.lat = this.mentlist2[e.index].lat;
				console.log(this.all)
			},
			textarea(e){
				let that=this
				let oldvalue=this.value
				let value=e.detail.value
				this.textlen=value.length
				this.value=e.detail.value
				let topic=this.ReplaceTopic(value)
				if(topic!=''){
					let key=topic.pop().replace("#","");
					that.$api.request('Search/Search/topics', {key:key},'post',false).then(res => {
						that.topics_list=res.data.list
					})
				}
			},
			opt_topic(e,index,hot){
				console.log(e);
				let that=this
				let str=this.value
				console.log(str);
				if(hot){
					str = str + "#"
				}
				console.log(str.match(/#([^\s]*)/ig));
				// [/#话题\s/,/#话题$/]
				let matching=str.match(/#([^\s]*)/ig).pop();
				
				// console.log(matching)
				// matching=new RegExp(""+matching+"$");
				str=str.replace(new RegExp(matching+"\s"), '#'+e.name+' ');
				// console.log(str)
				str=str.replace(new RegExp(matching+"$"), '#'+e.name+' ');
				// console.log(str)
				this.value=str
				this.textlen=str.length
				this.topics_list = []
				this.focus = true
				console.log(index);
				if(index!==undefined){
					this.hot_topics.splice(index,1)
				}
			},
			ReplaceTopic(str){
				// var str = '#话题1 #话题2 我是内容内容。。。';
				// console.log(str);
				let arr =str.match(/#([^\s]+)/ig)
				// console.log(arr)
				return arr?arr:[]
			},
			fullScreenPlay(){
				this.showFullScreen = true;
			}
		}
	}
</script>

<style>
	.fm_img{width:200rpx;height: 300rpx;}
	.xuan_btn{width: 100%;height: 56rpx;text-align: center;line-height: 56rpx;background:rgba(247,246,245,0.2);color:#B3B3BB;font-size: 26rpx;position: absolute;bottom: 0;}
	.fb_text{padding:15rpx ;width: 100%;box-sizing: border-box;}
	.ht_icon{font-size: 26rpx;color: #ffffff;padding: 11rpx 23rpx;border-radius: 4rpx;background-color: #2E3045;}
	.maxtext{position: absolute;bottom:0;right:15rpx;color: #B3B3BB;font-size: 24rpx;}
	.fb_btn{height:88rpx;background:rgba(246,167,4,1);border-radius:16rpx;font-size:34rpx;width: 95%;margin:100rpx auto;}
</style>
<style scoped>
	.hot-pic{flex-shrink: 0;margin-right: 20rpx;color: #B3B3BB;}
	.colorw{color: #ffffff;font-size: 28rpx;}
	.topics-list{max-height: 250rpx;}
</style>
