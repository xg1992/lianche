<template>
	<view>
		<view class="pd15 posre">
			<textarea placeholder="请填写8字以上的问题描述，以便我们提供更好的帮助"  class="textarea" placeholder-style='color:#494C6A' maxlength="200" @input='textarea' :value='value'/>
			<view class="maxtext">{{textlen}}/200</view>
		</view>
		<view class="pd15 h_center f_wrap">
			<view class="upimgbox" @click="upimg">
				<text class="iconfont icon-lc-23 colorb3" style="font-size: 50rpx;"></text>
			</view>
			<block >
				<view  class="posre" v-for="(n,idx) in imgurls" :key='idx'>
					<image src="/static/gg.png" style="width:40rpx;height:40rpx;position:absolute;right:0rpx;top:0rpx;z-index: 99;" @click='del(idx)'></image>
					<image :src="$realSrc(n.img_url)" style="width: 160rpx;height: 160rpx;" ></image>
				</view>
			</block>
		</view>
		<view class="btn center" :class="textlen>7?'btn_ok':''" @click="sub">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				textlen:0,
				imgurls:[],
				value:''
			}
		},
		methods: {
			textarea(e){
				let value=e.detail.value
				this.textlen=value.length
				this.value=e.detail.value
			},
			sub(){
				let that=this
				if(this.textlen<8){that.$api.Toast('不能少于8字');return false;}
				let image=[]
				if(that.imgurls){
					for(let i=0;i<that.imgurls.length;i++){
						image.push(that.imgurls[i].data)
					}
				}
				that.$api.request('User/Opinion/setOpinion', {content:this.value,image:image.join()}).then(res => {
					// console.log(res)
					that.$api.Toast(res.msg)
					if(res.res==1){
						that.imgurls=[];that.value='';
						setTimeout(function () {uni.navigateBack({delta: 1});}, 1000)
					}
				})
			},
			upimg(){
				let that=this
				if(that.imgurls.length>=3){that.$api.Toast('不能超出3张');return false;}
				that.$api.chooseImage(3,['compressed']).then( async (result) => {
					console.log(result);
					let arr = []
					for(let src of result){
						let url = await this.compressImage(src)
						arr.push(url)
					}
					console.log(arr);
					that.$api.toUpfile(arr).then(res => {
						console.log(res)
						setTimeout(function () {that.imgurls=that.imgurls.concat(res).splice(0,3)}, 300)
					})
				})
			},
			del(idx) {
			   this.imgurls.splice(idx, 1)
			},
			compressImage(src){
				return new Promise((resolve,reject)=>{
					uni.compressImage({
						src:src,
						quality:1,
						success: (res) => {
							resolve(res.tempFilePath)
						},
						fail: (err) => {
							console.log('压缩失败:',err);
						}
					})
				})
			}
		}
	}
</script>

<style>
.textarea{padding:51rpx 37rpx ;border-radius:8rpx;font-size: 30rpx;width: 100%;height: 452rpx;box-sizing: border-box;background-color: #24263A;}
.upimgbox{display: flex;align-items: center;justify-content: center;width: 160rpx;height: 160rpx;background:#24263A;border-radius:8rpx;}
.btn{width: 90%;height: 88rpx;background-color: #3A3C55;border-radius: 16rpx;font-size: 34rpx;color: #F7F6F5;margin: 20rpx auto;}
.btn_ok{background-color:#F6A704;color:white}
.maxtext{position: absolute;bottom:50rpx;right:50rpx;color: #B3B3BB;}
</style>
