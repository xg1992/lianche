<template>
	<view class="main">
		<form @submit="login" ref="form" class="form">
			<view class="box" style="margin-top: 220upx;">
				<view class="h_center pdzy15">
					<image src="../../static/phone.png" mode="" style="width: 25upx;height: 33upx;margin-right: 30upx;display: block;"></image>
					<view class="f_grow botom">
						<input type="number" value="" placeholder="+86" class="font16" maxlength="11" name='phone' style="height: 96upx;line-height: 96upx;"
						 @input="phone_text" />
					</view>
				</view>
			</view>
			<view class="box">
				<view class="h_center pdzy15 jc_sb">
					<image src="../../static/password@2x.png" mode="" style="width: 25upx;height: 33upx;margin-right: 30upx;"></image>
					<view class="f_grow botom h_center jc_sb">
						<input @input="onInput" type="number" value="" placeholder="请输入验证码" class="font16 f_grow" name='code' style="height: 96upx;line-height: 96upx;"
						 maxlength="4" />
						<view class="font28" @click="code">{{yzm? '获取验证码':count+'秒后再试'}}</view>
					</view>
				</view>
			</view>
			<button formType="submit" class="btn font14 center">登录</button>
			<view class="center" style="position: absolute;bottom: 5%;left: 0;right: 0;margin: auto;">
				登录即代表已阅读并同意 <text style="color:#F6A704" @click="open">《服务条款》</text>
			</view>
			<Popup ref="popup" type="center">
				<view class="popup_tip">
					<view class="iconfont icon-lc-39 gbbtn" @click="close"></view>
					<!-- <view class="font36 bold color33 pd15 center">服务条款</view> -->
					<view class="pd15 colorb3">
						<scroll-view class="scroll-view_H" scroll-y="true" style="height: 900rpx;">
							<rich-text :nodes="content"></rich-text>
						</scroll-view>

					</view>
				</view>

			</Popup>
		</form>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	import Popup from "@/components/Popup.vue"
	import { debounce } from "@/common/common.js"
	// #ifdef APP-PLUS
	const modal = uni.requireNativePlugin('modal');
	const hsfMobmessage = uni.requireNativePlugin('Hs-MobMessage');
	import config from '@/config/index.js'
	import {agreement} from './agreement.js'
	// #endif 
	export default {
		components: {
			Popup
		},
		data() {
			return {
				current: 0,
				phone: '',
				yzm: true,
				count: '',
				timer: null,
				login_way: 1,
				content: ''
			}
		},
		onLoad() {
			this.load()
		},
		methods: {
			...mapMutations(['setUserInfo', 'setToken']),
			to(e) {
				uni.navigateTo({
					url: e
				});
			},
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			phone_text(e) {
				this.phone = e.detail.value
			},
			code:debounce(function() {
				let that = this
				if (that.phone == '' || that.phone.length < 11) {
					// #ifdef APP-PLUS
					modal.toast({
						message: '手机号为空或者低于11位',
						duration: 2.0
					});
					// #endif 
					// #ifdef MP-WEIXIN
					that.$api.Toast('手机号为空或者低于11位')
					// #endif 
					return false
				}
				if (!that.yzm) {
					return false;
				}
				console.log('发送验证码');
				hsfMobmessage.sendCode({
					phoneNumber: that.phone,
					zone: "86",
					template: '7760845',
					getCodeMethod: 'SMS',
				}, result => {
					console.log("callback---success--" + result);
					if (typeof result == "string") {
						result = JSON.parse(result)
					}
					console.log(result)
					switch (result.type) {
						case 'success':
							console.log("callback---success--" + result.type);
							// #ifdef APP-PLUS
							modal.toast({
								message: '发送成功',
								duration: 2.0
							});
							// #endif 
							// #ifdef MP-WEIXIN
							that.$api.Toast('发送成功')
							// #endif 
				
							const TIME_COUNT = 60;
							if (!that.timer) {
								that.count = TIME_COUNT;
								that.yzm = false;
								that.timer = setInterval(() => {
									if (that.count > 0 && that.count <= TIME_COUNT) {
										that.count--;
									} else {
										that.yzm = true;
										clearInterval(that.timer);
										that.timer = null;
									}
								}, 1000)
							}
						break;
						case 'error':
							console.log("callback---success--" + result.type);
							// #ifdef APP-PLUS
							modal.toast({
								message: '发送失败',
								duration: 2.0
							});
							// #endif 
							// #ifdef MP-WEIXIN
							that.$api.Toast('发送失败')
							// #endif 
						break;
					}
				});
			},200),
			// 输入验证码后自动登录
			onInput(e){
				console.log(e);
				let { value } = e.detail
				if(this.phone&&value&&value.length===4){
					let val = {
						detail:{
							value:{
								phone:this.phone,
								code:value
							}
						}
					}
					this.login(val)
				}
			},
			login: function(e) {
				let that = this
				let form = e.detail.value
				console.log(config.debug)
				// if(config.debug){
				// 	if(this.$api.platform == 'ios'){
				// 		form.phone = '13711444751'
				// 	}else{
				// 		form.phone = '13112769689'
				// 	}
				// 	form.code = '1234'
				// }
				if (form.phone == '' || form.phone.length < 11) {
					that.$api.Toast('手机号为空或者低于11位', 'none');
					return false
				}
				let api_router, data
				if (that.login_way == 1) {
					if (form.code == '') {
						that.$api.Toast('验证码为空', 'none');
						return;
					} else {
						api_router = "User/User/loginByMobileCode"
						data = {
							mobile: form.phone,
							code: form.code,
							platform: that.$api.platform
						}
						that.$api.request(api_router, data).then(res => {
							// console.log(res)
							// #ifdef APP-PLUS
							modal.toast({
								message: res.msg,
								duration: 2.0
							});
							// #endif 
							// #ifdef MP-WEIXIN
							that.$api.Toast(res.msg)
							// #endif 
							if (res.res == 1) {
								that.afterLogin(res)
							}
						})
					}
				}
			},
			afterLogin(res) {
				let that = this
				that.$api.storage('logintime', new Date().getTime())
				that.$api.storage('userinfo', res.data)
				that.$api.storage('token', res.data.token)
				that.$api.storage('uid', res.data.uid)
				console.log(res.data)
				that.setUserInfo(res.data)
				that.setToken(res.data.token)
				setTimeout(function() {
					uni.navigateBack({
						delta: 1
					})
				}, 1300)
			},
			load() {
				this.content = agreement;
			}
		},

	}
</script>

<style>
	page {
		display: flex;
		flex: 1
	}
	
	.main{
		flex:1;
	}
	
	.form{
		overflow: hidden;
	}

	.login {
		width: 55px;
		height: 55px;
		margin: 50px auto;
		display: block
	}

	.tab_item_active {
		font-weight: bold;
		color: #333
	}

	.btn {
		width: 90%;
		margin: auto;
		height: 96upx;
		background-color: #F6A704;
		border-radius: 48upx;
		color: white;
		margin-top: 220upx
	}

	.pwd_yan {
		width: 18px;
		height: 11px
	}

	.popup_tip {
		width: 80%;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		margin: auto;
	}

	.gbbtn {
		position: absolute;
		right: 0;
		top: -50rpx;
		font-size: 39rpx;
		color: #B3B3BB
	}
</style>
