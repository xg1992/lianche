<template>
	<view>
		
		<view class="" style="" v-if="type==1">
			<view class="font30 colorb3" style="margin-top: 50rpx; margin-bottom: 50rpx; margin-left: 30rpx;">营业执照</view>
			<view class="portrait-box" @click="business_img">
				<image :src="business?$realSrc(business):'../../static/yyzz.png'" mode="" style="width: 90%;height: 400rpx;display: block; text-align: center; margin-left: 35rpx;"></image>
				<view class="center portrait_mc">
					<text class="iconfont icon-lc-23"></text>
				</view>
			</view>
		
		</view>

		<view class="" style="" v-if="type==3">
			<view class="font30 colorb3" style="margin-top: 50rpx; margin-bottom: 50rpx; margin-left: 30rpx;">教练车行驶证</view>
			<view class="portrait-box" @click="license_img">
				<image :src="license?$realSrc(license):'../../static/xsz.png'" mode="" style="width: 90%;height: 400rpx;display: block; text-align: center; margin-left: 35rpx;"></image>
				<view class="center portrait_mc">
					<text class="iconfont icon-lc-23"></text>
				</view>
			</view>

		</view>


		<view class="" style="">
			<view class="font30 colorb3" style="margin-top: 50rpx; margin-bottom: 50rpx;margin-left: 30rpx;">身份证正面</view>
			<view class="portrait-box" @click="upimg_a">
				<image :src="card_positive?$realSrc(card_positive):'../../static/zm.png'" mode="" style="width: 90%;height: 400rpx;display: block; text-align: center; margin-left: 35rpx;"></image>
				<view class="center portrait_mc">
					<text class="iconfont icon-lc-23"></text>
				</view>
			</view>

		</view>

		<view class="" style="">
			<view class="font30 colorb3" style="margin-top: 50rpx; margin-bottom: 50rpx;margin-left: 30rpx;">身份证反面：</view>
			<view class="portrait-box" @click="upimg_b">
				<image :src="card_side?$realSrc(card_side):'../../static/fm.png'" mode="" style="width: 90%;height: 400rpx;display: block; text-align: center; margin-left: 35rpx;"></image>
				<view class="center portrait_mc">
					<text class="iconfont icon-lc-23"></text>
				</view>
			</view>

		</view>


		<view class="" style="">
			<view class="font30 colorb3" style="margin-top: 50rpx; margin-bottom: 10rpx;margin-left: 30rpx; width: 90%;">
				<text class="psText">
					* 请提供证件的正面清晰照，拍摄时确保朝向正确、清晰、亮度均匀、边框完整，无倾斜。 
				</text>
			</view>
			<view class="font26 colorb3" style="margin-top: 20rpx; margin-bottom: 50rpx;margin-left: 30rpx;width: 90%">
				<text class="psText">
					* 如提供真实证件但反馈验证无效，请按上文调整证件位置、光亮等、确保图片中所有文字清晰可识别。
				</text>
			</view>

		</view>


		<form @submit="formSubmit">

			<!-- 总部、分校 -->
			<block v-if="type==2||type==1">
				<view class="h_center jc_sb cell_list">
					<view class="nameText">驾校名称</view>
					<input type="text" :value="all.name" class="f_grow cell_input" name='name' placeholder="请输入驾校名称" />
				</view>
				<view class="h_center jc_sb cell_list">
					<view class="nameText">驾校地址</view>
					<input type="text" :value="all.address" class="f_grow cell_input" name='address' placeholder="请输入驾校地址" />
				</view>
				<view class="h_center jc_sb cell_list">
					<view class="nameText">手机号码</view>
					<input type="text" :value="all.phone" class="f_grow cell_input" name='phone' placeholder="请输入手机号码" />
				</view>
			</block>
			<!-- 总部 -->
			<!-- <block v-if="type==1">
				<view class="h_center jc_sb cell_list">
					<view class="nameText">银行名称</view>
					<input type="text" :value="all.bank" class="f_grow cell_input" name='bank' placeholder="请输入银行名称" />
				</view>
				<view class="h_center jc_sb cell_list">
					<view class="nameText">银行账号</view>
					<input type="text" :value="all.bank_account" class="f_grow cell_input" name='bank_account' placeholder="请输入银行账号" />
				</view>
			</block> -->
			
			<!-- 总部、分校、教练 -->
			<view class="h_center jc_sb cell_list">
				<view class="nameText">姓名</view>
				<input type="text" :value="all.person_name" class="f_grow cell_input" name='person_name' placeholder="请输入姓名" />
			</view>
			<view class="h_center jc_sb cell_list">
				<view class="nameText">身份证</view>
				<input type="text" :value="all.idcard" class="f_grow cell_input" name='idcard' placeholder="请输入身份证" />
			</view>
			<view class="h_center jc_sb cell_list">
				<view class="nameText">执教日期</view>
				<picker mode="date" @change="bindPickerChange" class="f_grow cell_input" :value="all.teaching_date" fields="month">
					<input type="text" :value="all.teaching_date" class="f_grow cell_input" name='teaching_date' disabled placeholder="请选择开始教学的年月" />
				</picker>
			</view>

			<button form-type="submit" class="btn">保存</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:3,
				all: {},
				sex: 0,
				avatar: '',
				avatar_url: '',
				card_positive: '',
				card_positive_url: '',
				card_side: '',
				card_side_url: '',
				license: '',
				license_url: '',
				idcard: '',
				business: '',
				business_url: '',
				pageTitle:{
					1:'总部认证',
					3:'教练认证'
				}
			}
		},
		onLoad(e) {
			this.type = Number(e.type) || 3
			let title = this.pageTitle[this.type] || '教练认证'
			uni.setNavigationBarTitle({title})
			if (this.$api.storage('uid')) {
				this.load()
			}

		},
		methods: {
			load() {
				let that = this
				that.$api.request('User/Examine/materialInfo', {
					uid: this.$api.storage('uid')
				}).then(res => {
					console.log(res)
					that.all = res.data
					that.card_positive = that.all.card_positive
					that.card_side = that.all.card_side
					that.license = that.all.license
					that.idcard = that.all.idcard
					that.business = that.all.business


				})
			},
			formSubmit(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				let that = this
				let all = e.detail.value
				let params = {
					type: this.type,
					card_positive_url: this.card_positive_url,
					card_side_url: this.card_side_url,
					license_url: this.license_url,
					person_name: all.person_name,
					idcard: all.idcard,
					business_url: this.business_url,
					...all
				}
				console.log(params);
				that.$api.request('User/Examine/add', params).then(res => {
					// console.log(res)
					that.$api.Toast(res.msg)
					if (res.res == 1) {
						uni.navigateBack({
							delta: 1
						});
					}
				})
			},
			bindPickerChange(event){
				console.log(event.detail.value);
				this.$set(this.all,'teaching_date',event.detail.value)
				console.log(this.all);
			},
			sexclick() {
				let that = this
				uni.showActionSheet({
					itemList: ['保密', '男', '女'],
					success: function(res) {
						that.sex = res.tapIndex
					}
				});
			},
			business_img() {
				let that = this
				that.$api.chooseImage(1).then(res => {
					that.business = res[0];
					let business_a = res[0]
					uni.uploadFile({
						url: that.$api.config.baseUrl + 'User/Examine/Uploaded',
						filePath: business_a,
						name: 'image',
						formData: {
							'uid': that.$api.storage('uid'),
							_uuid: that.$api.storage('uuid'),
							_token: that.$api.storage('token'),
							_time: new Date().getTime(),
							_pf: that.$api.platform,
							_version: that.$api.config.version

						},
						success: (res) => {
							// console.log(res)
							// console.log(JSON.parse(res.data).data);
							let data = JSON.parse(res.data).data
							that.business_url = data.img_url
							that.$api.Toast(JSON.parse(res.data).msg)
							//that.$api.request('My/Material/setMaterial', {headPhoto:data.img_url}).then(res => {})
						},
						complete: function() {
							console.log({
								'uid': that.$api.storage('uid'),
								_uuid: that.$api.storage('uuid'),
								_token: that.$api.storage('token'),
								_time: new Date().getTime(),
								_pf: that.$api.platform,
								_version: that.$api.config.version
							})
						}
					});

				})
			},
			license_img() {
				let that = this
				that.$api.chooseImage(1).then(res => {
					that.license = res[0];
					let license_a = res[0]
					uni.uploadFile({
						url: that.$api.config.baseUrl + 'User/Examine/Uploaded',
						filePath: license_a,
						name: 'image',
						formData: {
							'uid': that.$api.storage('uid'),
							_uuid: that.$api.storage('uuid'),
							_token: that.$api.storage('token'),
							_time: new Date().getTime(),
							_pf: that.$api.platform,
							_version: that.$api.config.version

						},
						success: (res) => {
							// console.log(res)
							// console.log(JSON.parse(res.data).data);
							let data = JSON.parse(res.data).data
							that.license_url = data.img_url
							that.$api.Toast(JSON.parse(res.data).msg)
							//that.$api.request('My/Material/setMaterial', {headPhoto:data.img_url}).then(res => {})
						},
						complete: function() {
							console.log({
								'uid': that.$api.storage('uid'),
								_uuid: that.$api.storage('uuid'),
								_token: that.$api.storage('token'),
								_time: new Date().getTime(),
								_pf: that.$api.platform,
								_version: that.$api.config.version
							})
						}
					});

				})
			},
			upimg_a() {
				let that = this
				that.$api.chooseImage(1).then(res => {
					that.card_positive = res[0];
					let path_a = res[0]
					uni.uploadFile({
						url: that.$api.config.baseUrl + 'User/Examine/Uploaded',
						filePath: path_a,
						name: 'image',
						formData: {
							'uid': that.$api.storage('uid'),
							_uuid: that.$api.storage('uuid'),
							_token: that.$api.storage('token'),
							_time: new Date().getTime(),
							_pf: that.$api.platform,
							_version: that.$api.config.version

						},
						success: (res) => {
							// console.log(res)
							// console.log(JSON.parse(res.data).data);
							let data = JSON.parse(res.data).data
							that.card_positive_url = data.img_url
							that.$api.Toast(JSON.parse(res.data).msg)
							//that.$api.request('My/Material/setMaterial', {headPhoto:data.img_url}).then(res => {})
						},
						complete: function() {
							// console.log({
							// 	'uid': that.$api.storage('uid'),
							// 	_uuid: that.$api.storage('uuid'),
							// 	_token: that.$api.storage('token'),
							// 	_time: new Date().getTime(),
							// 	_pf: that.$api.platform,
							// 	_version: that.$api.config.version
							// })
						}
					});

				})
			},
			upimg_b() {
				let that = this
				that.$api.chooseImage(1).then(res => {
					that.card_side = res[0];
					let path_b = res[0]
					uni.uploadFile({
						url: that.$api.config.baseUrl + 'User/Examine/Uploaded',
						filePath: path_b,
						name: 'image',
						formData: {
							'uid': that.$api.storage('uid'),
							_uuid: that.$api.storage('uuid'),
							_token: that.$api.storage('token'),
							_time: new Date().getTime(),
							_pf: that.$api.platform,
							_version: that.$api.config.version

						},
						success: (res) => {
							console.log(res)
							console.log(JSON.parse(res.data).data);
							let data = JSON.parse(res.data).data
							that.card_side_url = data.img_url
							that.$api.Toast(JSON.parse(res.data).msg)
							//that.$api.request('My/Material/setMaterial', {headPhoto:data.img_url}).then(res => {})
						},
						complete: function() {
							console.log({
								'uid': that.$api.storage('uid'),
								_uuid: that.$api.storage('uuid'),
								_token: that.$api.storage('token'),
								_time: new Date().getTime(),
								_pf: that.$api.platform,
								_version: that.$api.config.version
							})
						}
					});

				})
			},

			upimg() {
				let that = this
				that.$api.chooseImage(1).then(res => {

					// console.log(res[0]);
					let path = res[0]
					uni.uploadFile({
						url: that.$api.config.baseUrl + 'Appointment/Uploads/headUploaded',
						filePath: path,
						name: 'image',
						formData: {
							'uid': that.$api.storage('uid'),
							_uuid: that.$api.storage('uuid'),
							_token: that.$api.storage('token'),
							_time: new Date().getTime(),
							_pf: that.$api.platform,
							_version: that.$api.config.version

						},
						success: (res) => {
							// console.log(res)
							// console.log(JSON.parse(res.data).data);
							let data = JSON.parse(res.data).data
							that.avatar = path
							that.avatar_url = data.img_url
							that.$api.Toast(JSON.parse(res.data).msg)
							that.$api.request('My/Material/setMaterial', {
								headPhoto: data.img_url
							}).then(res => {})
						},
						complete: function() {
							// console.log({
							// 	'uid': that.$api.storage('uid'),
							// 	_uuid: that.$api.storage('uuid'),
							// 	_token: that.$api.storage('token'),
							// 	_time: new Date().getTime(),
							// 	_pf: that.$api.platform,
							// 	_version: that.$api.config.version
							// })
						}
					});
				})
			},
		}
	}
</script>

<style>
	.cell_list {
		height: 112rpx;
		padding: 0 30rpx;
	}

	.btn {
		width: 90%;
		height: 88rpx;
		background-color: #F6A704;
		border-radius: 16rpx;
		font-size: 34rpx;
		color: white;
		margin: 20rpx auto 120rpx auto;
	}

	.cell_input {
		text-align: right;
		color: white;
		font-size: 26rpx;
		border-bottom: 1rpx solid #5b5b5b;
		
	}

	.portrait-box {
		position: relative;
		overflow: hidden;
	}

	.portrait-box image {
		width: 100%;
		height: 100%
	}

	.portrait_mc {
		position: absolute;
		background: rgba(25, 28, 47, 1);
		width: 100%;
		height: 100%;
		opacity: 0.5;
		top: 0;
		left: 0;
	}

	.portrait_mc .iconfont {
		font-size: 80rpx;
	}

	.psText {
		padding-left: 50rpx;
		color: #707074;
		font-size: 26rpx;
	}
	.nameText{ font-size:28upx;width: 130rpx;color: #B3B3BB;}
	
</style>
