<template>
	<view>
		<view class="center" style="height: 320rpx;flex-direction: column;align-items: center; justify-content: center;">
			<view class="portrait-box"  @click="upimg">
				<image :src="avatar?$realSrc(avatar):'../../static/tx.png'" mode="" style="width: 128rpx;height: 128rpx;border-radius: 50%;overflow: hidden;display: block;"></image>
				<view class="center portrait_mc">
					<text class="iconfont icon-lc-23"></text>
				</view>
			</view>
			<view class="center" style="margin-top: 27rpx;">点击更换头像</view>
		</view>
		<form @submit="formSubmit">
			<view class="h_center jc_sb cell_list">
				<view class="font30 colorb3">昵称</view>
				<input type="text" v-model="all.nickname"  class="f_grow cell_input" name='nickname' maxlength='8' placeholder="请输入昵称"/>
			</view>
			<view class="h_center jc_sb cell_list">
				<view class="font30 colorb3">账号</view>
				<input type="text" v-model="all.username"  class="f_grow cell_input" name='username' disabled="true"/>
			</view>
			<view class="h_center jc_sb cell_list">
				<view class="font30 colorb3">姓名</view>
				<input type="text" v-model="all.person_name"  class="f_grow cell_input" name='person_name' placeholder="请输入姓名"/>
			</view>
			<view class="h_center jc_sb cell_list">
				<view class="font30 colorb3">性别</view>
				<view class="f_grow" @click="sexclick" style="text-align: right;">{{sex==0?'保密':(sex==1?'男':'女')}}</view>
			</view>
			<view class="h_center jc_sb cell_list">
				<view class="font30 colorb3">电话号码</view>
				<input type="number" v-model="all.mobile"  class="f_grow cell_input" name='mobile' maxlength='11'/>
			</view>
			<view class="h_center jc_sb cell_list font30 colorb3">简介</view>
			<view class="pdzy15">
				<textarea v-model="all.intro" placeholder="请输入简介,让大家多认识你" name='intro' style="height: 239rpx;width: 100%;" maxlength='200'/>
			</view>
			<button form-type="submit" class="btn">保存</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				all:{
					nickname:'',
					username:'',
					person_name:'',
					mobile:'',
					intro:''
				},
				sex:0,
				avatar:'',
				avatar_url:''
			}
		},
		onLoad() {
			if(this.$api.storage('uid')){this.load()}
			
		},
		methods: {
			load(){
				let that=this
				that.$api.request('My/Material/materialInfo', {uid:this.$api.storage('uid')}).then(res => {
					// console.log(res)
					that.all=res.data
					that.sex=that.all.sex
					that.avatar=that.all.avatar
					that.avatar_url=that.all.avatar
				})
			},
			formSubmit(e) {
                console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				let that=this
                let all = e.detail.value
				that.$api.request('My/Material/setMaterial', {headPhoto:that.avatar_url,nickname:all.nickname,truename:all.person_name,sex:that.sex,mobile:all.mobile,
				intro:all.intro,}).then(res => {
					// console.log(res)
					that.$api.Toast(res.msg)
					if(res.res==1){uni.navigateBack({delta:1});}
				})
            },
			sexclick(){
				let that=this
				uni.showActionSheet({
				    itemList: ['保密','男', '女'],
				    success: function (res) {
				        that.sex=res.tapIndex
				    }
				});
			},
			upimg(){
				let that=this
				that.$api.chooseImage(1).then(res => {
					uni.showLoading({
						title:"头像上传中",
						mask:true
					})
					// console.log(res[0])
					let path=res[0]
					uni.uploadFile({
					    url: that.$api.config.baseUrl+'Appointment/Uploads/headUploaded',
					    filePath: path,
					    name: 'image',
					    formData: {
					        'uid':that.$api.storage('uid'),
							_uuid:that.$api.storage('uuid'),
							_token:that.$api.storage('token'),
							_time:new Date().getTime(),
							_pf:that.$api.platform,
							_version:that.$api.config.version
							
					    },
					    success: (result) => {  
							console.log(result)
					        // console.log(JSON.parse(res.data).data);
							let data=JSON.parse(result.data).data
							// that.avatar=data.img_url
							that.$set(that,"avatar",data.img_url)
							that.avatar_url=data.img_url
							that.$api.Toast(JSON.parse(result.data).msg)
							console.log(data.img_url);
							that.$api.request('My/Material/uploadHeadPhoto', {headPhoto:data.img_url})
					    },
						complete:function(){
							uni.hideLoading()
							// console.log({'uid':that.$api.storage('uid'),
						// 	_uuid:that.$api.storage('uuid'),
						// 	_token:that.$api.storage('token'),
						// 	_time:new Date().getTime(),
						// 	_pf:that.$api.storage('SystemInfo').platform,
						// 	_version:that.$api.config.version})
						}
					});
				})
			},
		}
	}
</script>

<style>
.cell_list{height: 112rpx;padding: 0 30rpx;}
.btn{width: 90%;height: 88rpx;background-color: #F6A704;border-radius:16rpx;font-size:34rpx;color:white;margin:20rpx auto 120rpx auto;}
.cell_input{text-align: right;color: white;font-size: 34rpx;}
.portrait-box{width: 128rpx;height: 128rpx;border-radius: 50%;position: relative;overflow: hidden;}
.portrait-box image{width: 100%;height:100%}
.portrait_mc{position: absolute;background:rgba(25,28,47,1);width: 100%;height:100%;opacity:0.5;border-radius:50%;top: 0;left: 0;}
.portrait_mc .iconfont{font-size: 40rpx;}
</style>
