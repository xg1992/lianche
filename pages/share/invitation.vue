<template>
	<view class="invit-body">
		<view class="inviter">
			<image class="headimg" :src="headimg" mode=""></image>
			<view class="invit-text" v-if="invitation_type == 2">
				<text class="username">{{name}}</text>添加您为学员，并邀请你加入链车，一起来记录和分享您的学车短视频！
			</view>
			<view class="invit-text" v-else-if="invitation_type == 3">
				<text class="username">{{name}}</text>驾校邀请你加入团队，帮助你打造品牌形象、拓展业务渠道！
			</view>
			<view class="invit-text" v-else-if="invitation_type == 5">
				您的好友<text class="username">{{name}}</text>邀请你入驻链车平台，帮助你打造品牌形象、拓展业务渠道！
			</view>
		</view>
		<view class="line"></view>
		<form class="invit-form" @submit="submit" @reset="">
			<view class="form-item" v-if="invitation_type == 2">
				<radio-group @change="radioChange">
						<label class="radio-label" v-for="(item, index) in items" :key="item.value">
								<radio :value="item.value" :checked="index === current" />
								<text>{{item.name}}</text>
						</label>
				</radio-group>
			</view>
			<view class="form-item">
				<input class="form-input" v-model="form.receive_truename" type="text" value="" placeholder="姓名" />
			</view>
			<view class="form-item">
				<input class="form-input" v-model="form.receive_mobile" type="number" value="" placeholder="手机号码" />
			</view>
			<template  v-if="invitation_type == 3">
				<view class="form-item">
					<picker mode="date" fields="month" :end="endDate" @change="dateChange">
						<input class="form-input" v-model="form.teaching_date" type="text" value="" placeholder="开始教学年月" disabled />
					</picker>
				</view>
			</template>
			<template  v-if="invitation_type == 5">
				<view class="form-item">
					<input class="form-input" v-model="form.school_name" type="text" value="" placeholder="驾校名称" />
				</view>
				<view class="form-item has-icon" >
					<input class="form-input" v-model="form.address" type="text" value="" placeholder="地址" />
					<text class="iconfont icon-lc-21" @click="openMap"></text>
				</view>
			</template>
			<view class="form-item has-code">
				<input class="form-input" v-model="form.code" type="text" value="" placeholder="验证码" />
				<image class="code-img" :src="$api.config.baseUrl + 'User/Confirm/showImg?key=' + form.key" mode="" @click="getCode"></image>
			</view>
			<button class="submit-btn" type="primary" form-type="submit" :disabled="hasSubmit">提交申请</button>
		</form>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				invitation_type: 1, // 邀请类型 1：普通用户，2：学员，3：教练， 5：分校 6:总部 7商户 
				name: '123',
				headimg: '../../static/tx.png',
				form: {
					key: '', // 生成验证码的key
				},
				current: 0,
				items: [{
						value: '1',
						name: '正在学车',
				},
				{
						value: '2',
						name: '我已毕业',
				}],
				startDate: '1950-01-01',
				endDate: '',
				hasSubmit: false, // 是否已经提交成功，提交成功后按钮不可点击
			}
		},
		onLoad(options){
			console.log(options)
			this.form.uid = options.uid;
			this.form.invitation_type = this.invitation_type = options.invitation_type;
			if(options.invitation_type == 2) this.form.userType = '1'; // 如果是添加学员，默认显示学员类型
			this.getCode();
			this.getInfo();
			let date = new Date();
			this.endDate = `${date.getFullYear()}-12-01`
			console.log(this.endDate)
		},
		methods: {
			getInfo(){
				console.log(Date.parse(new Date()))
				this.$api.request("User/Confirm/getNickname",{
					"uid": this.form.uid,
					"_time": Date.parse(new Date())
				}).then(res=>{
					console.log(res)
					this.name = res.data.nickname;
					this.headimg = this.$realSrc(res.data.avatar);
				})
			},
			radioChange(e){
				this.form.userType = e.detail.value
				console.log(e.detail.value)
			},
			// 获取验证码
			getCode(){
				let r = this.getRandom(1000,9999);
				this.form.key = Date.now().toString() + r;
			},
			// 获取随机数
			getRandom(minNum,maxNum){
					switch(arguments.length){
							case 1:
									return parseInt(Math.random()*minNum+1,10);
							break;
							case 2:
									return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
							break;
					default:
						return 0;
					break;
					}
			},
			//验证是否手机号码
			isPhoneNo(value) {
				var rex = /^1[3-9]+\d{9}$/;
				if (rex.test(value)) {
					return true;
				} else {
					return false;
				}
			},
			submit(){
				let pase = this.verify(); // 验证必填
				if(pase){
					if(!this.isPhoneNo(this.form.receive_mobile) && this.form.receive_mobile.length !== 11){
						uni.showToast({
							title: '请输入正确的手机号码',
							icon: 'none'
						});
						return false;
					}
					this.$api.request("User/Confirm/invitationSave",this.form).then(res=>{
						if(res.res === 1){
							this.hasSubmit = true;
							uni.showModal({
								title: '成功提示',
								content: '申请成功，等待确认',
								showCancel: false
							})
						}else{
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				}				
			},
			verify(){
				let rule = [
					{name: 'receive_truename',msg: '请填写姓名'},
					{name: 'receive_mobile',msg: '请填写手机号码'},
					{name: 'code',msg: '请输入验证码'},
				];
				if(Number(this.invitation_type) === 3){
					rule.splice(2,0,...[
						{name: 'teaching_date',msg: '请选择开始教学年月'},
					])
				}
				if(Number(this.invitation_type) === 5){
					rule.splice(2,0,...[
						{name: 'school_name',msg: '请输入驾校名称'},
						{name: 'address',msg: '请输入地址'},
					])
				}
				for(let i = 0; i < rule.length; i++){
					// 检查前去除内容的空格及换行
					if(typeof(rule[i].name) == 'string'){rule[i].name = rule[i].name.replace(/\s/g,"");}
					if(!this.form[rule[i].name]){
						uni.showToast({
							title: rule[i].msg,
							icon: 'none'
						})
						return false;
					}
				}
				return true;
			},
			dateChange(e){
				this.$set(this.form,'teaching_date',e.detail.value)
			},
			openMap(){
				uni.chooseLocation({
					success:(res)=> {
						this.form.address = res.address;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
$textColor: #333;
page {
	height: 100%;
	background-color: #f9f9f9;
}
.invit-body {
	color: #333;
}
.inviter {
	display: flex;
	align-items: center;
	padding: 30px 15px 15px;
}
.headimg {
	margin-right: 10px;
	width: 50px;
	height: 50px;
	flex: 0 0 50px;
	border-radius: 50%;
}
.username {
	color: orange;
	margin: 0 2px;
}
.invit-text {
	color: $textColor;
	font-size: 14px;
}
.invit-form {
	display: flex;
	justify-content: center;
	width: 100%;
	padding: 15px;
	box-sizing: border-box;
	color: $textColor;
}
.radio-label {
	margin-right: 15px;
	color: $textColor;
}
.form-item {
	position: relative;
	padding: 15px 0;
	width: 690rpx;
	
	.iconfont {
		position: absolute;
		right: 0;
		top: 15px;
		width: 36px;
		height: 36px;
		line-height: 36px;
		font-size: 24px;
		text-align: center;
		color: #aaa;
	}
	&.has-icon {
		.form-input {
			padding-right: 40px;
		}
	}
}
.form-input {
	border: 1px solid #ddd;
	padding: 5px 10px;
	height: 36px;
	border-radius: 4px;
	color: $textColor;
	background-color: #f1f3f5;
}
.has-code {
	display: flex;
}
.code-img {
	width: 200rpx;
	height: 36px;
	margin-left: 15px;
	background-color: #f1f1f1;
}
.submit-btn {
	margin-top: 30px;
}
.line {
	border-top: 1px solid #ccc;
	margin: 15px 15px 0;
}
</style>
