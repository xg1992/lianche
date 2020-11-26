<template>
	<view>
		<view class="discount-body">
			<template v-for="(item,key) in formData">
				<view class="detail" v-if="item.isHtml">
					<view class="detail-title">{{item.title}}</view>
					<view class="detail-content" v-html="item.content"></view>
				</view>
				<view class="detail" v-else-if="item.isInput">
					<view class="detail-title">{{item.title}}</view>
					<view class="detail-content">
						<input v-model="form[key]" class="coupon-item-input" type="number" value="" placeholder="请输入代发上限量"/>
					</view>
				</view>
				<view class="detail"  style="align-items: flex-start;" v-else-if="item.isTextarea">
					<view class="detail-title">{{item.title}}</view>
					<view class="detail-content">
						<textarea v-model="form[key]" class="coupon-textarea" value="" placeholder="优惠券备注" />
					</view>
				</view>
				<view class="detail" :key="key" v-else-if="item.isRadio">
					<text class="detail-title">{{item.label}}</text>
					<view class="detail-content">
						<view class="radio" :class="{'active': form[key] === item2.value}" v-for="item2 in item.options" @click="typeChange(key,item2.value)">
							<text class="radio-circle"></text>
							<text>{{item2.title}}</text>
						</view>
					</view>
				</view>
				<view class="detail" v-else>
					<view class="detail-title">{{item.title}}</view>
					<view class="detail-content">
						<text>{{item.content}}</text>
					</view>
				</view>
			</template>
			<view class="rule" @click="openRule">
				<text>使用规则，优惠券使用详则</text>
				<view class="iconfont icon-arrow-right"></view>
			</view>
		</view>
		<view class="bottom-view" v-if="isEdit || isAdd">
			<button class="submit-btn" type="default" @click="submit">{{isEdit ? '确定修改' : '一键代发'}}</button>
			<view class="daifa-hint" v-if="isAdd">
				点击一键代发，即代表您已同意优惠券使用规则
			</view>
		</view>
	</view>
</template>

<script>
	const graceChecker = require('@/graceUI/jsTools/graceChecker.js')
	import {
		parseTime
	} from '@/common/filter.js'
	const getPeople = {
		'0': '所有',
		'1': '粉丝',
		'2': '学员'
	}
	export default {
		components: {},
		data() {
			return {
				formData: {},
				form: {
					status: 1,
				},
				agentCirculation: '', // 代发上限
				desc: '', // 备注
				isEdit: false, // 是否为修改页面
				isAdd: false, // 是否为新增（一键代发）
			}
		},
		onLoad(options) {
			this.id = options.id;
			// 修改
			if(options.isEdit && ~~options.isEdit === 1){
				this.isEdit = true;
				uni.setNavigationBarTitle({
					title: '修改优惠券'
				})
			}
			// 新增
			if(options.isAdd && ~~options.isAdd === 1){
				this.isAdd = true;
			}
			this.getInfo();
		},
		methods: {
			getInfo() {
				let url = 'Activity/Coupon/getCouponInfoToWorker';
				let params = {couponId: this.id};
				if(this.isEdit){
					url = 'Activity/Coupon/getCouponGiveInfoToWorker';
					params = {giveId:this.id}
				}
				this.$api.request(url, params).then(res => {
					console.log(res)
					if(res.res === 1){
						let data = res.data;
						// 详情和修改接口字段不一致，需要统一修改
						let getStime = data.get_start_time;
						let getEtime = data.get_end_time;
						let useStime = data.use_start_time;
						let useEtime = data.use_end_time;
						if(this.isEdit){
							getStime = data.getStime;
							getEtime = data.getEtime;
							useStime = data.useStime;
							useEtime = data.useEtime;
						}
						this.formData = {
							name: {
								title: '名称',
								content: data.name,
							}, // 1:驾校，2：学员
							type: {
								title: '类型',
								content: data.type == 2 ? '折扣券' : '抵用券',
							},
							money: {
								title: data.type == 2 ? '折扣' : '优惠金额',
								content: data.type == 2 ? data.discount / 10 + '折' : moneyTransform(data.discount, 2) + '元'
							},
							manjian: {
								title: '使用门槛',
								content: data.rebate_threshold ? '满' + data.rebate_threshold / 100 + '可用' : '无门槛',
							},
							count: {
								title: '发行总量',
								content: data.circulation,
							},
							getPeople: {
								title: '领取人群',
								content: getPeople[data.who_get],
							},
							usePeople: {
								title: '使用人',
								content: data.who_use ? '仅限本人' : '不限制',
							},
							getTime: {
								title: '领取时间',
								content: `<text>${parseTime(getStime)} 至</text><br /><text>${parseTime(getEtime)}</text>`,
								isHtml: true
							},
							useTime: {
								title: '使用时间',
								content: `<text>${parseTime(useStime)} 至</text><br /><text>${parseTime(useEtime)}</text>`,
								isHtml: true
							},
							instruction: {
								title: '使用说明',
								content: data.instruction,
							},
							agentCirculation: {
								title: '代发上限',
								content: this.isEdit ? data.agentCirculation : '',
								isInput: this.isEdit || this.isAdd ? true : false
							},
							desc: {
								title: '备注',
								content: this.isEdit ? data.desc : '',
								isTextarea: this.isEdit || this.isAdd ? true : false
							},
						}
						// 如果是修改，增加修改状态
						if(this.isEdit){
							this.formData.status = {
								isRadio: true,
								label: '状态',
								options: [
									{title: '发放', value:1},
									{title: '暂停', value:2}
								]
							},
							this.form.status = data.giveState;
						}
					}else{
						this.$api.Toast(res.msg)
					}
					
				})
			},
			openRule() {
				uni.navigateTo({
					url: 'rule_detail'
				})
			},
			submit() {
				let r = [
					{name: 'agentCirculation', checkType: "notnull", errorMsg: '请输入代发上限'},
					{name: 'agentCirculation', checkType: "int", checkRule:"1,10", errorMsg: '代发上限必须为整数'},
				];
				let pase = graceChecker.check(this.form, r);
				if(!pase) {
					uni.showToast({
						title: graceChecker.error,
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				
				if(this.agentCirculation > this.formData.count.content){
					this.$api.Toast('代发上限不能大于发行总量')
					return ;
				}
				let url = 'Activity/Coupon/onekeyDf';
				let params = {
							couponId: this.id,
							agentCirculation: this.form.agentCirculation,
							desc: this.form.desc || ''
						}
				if(this.isEdit){
					url = 'Activity/Coupon/updateCouponDf',
					params.giveId = this.id;
					params.state = this.form.status;
				}
				this.$confirm({
					content: '确定代发该优惠券吗？',
					confirm: () => {
						this.$api.request(url, params).then(res => {
							if(res.res === 1){
								this.$api.Toast('代发成功！');
								uni.navigateBack();
							}
						})
					}
				})
			},
			typeChange(key,value){
				this.form[key] = value;
			},
		}
	}
	// 金额单位由元转为分
	function moneyTransform(money, type) {
		let o = {
			1: money * 100,
			2: money / 100
		}
		return o[type]
	}
</script>

<style lang="scss" scoped>
	$textColor: '#B3B3BB';
	.h4-title {
		margin: 30rpx 50rpx;
		color: #aaa;
		font-size: 28rpx;
	}

	.discount-body {
		display: flex;
		justify-content: center;
		flex-direction: column;
		margin: 30rpx 50rpx;
		font-size: 28rpx;
		background: #1E2135;
		border-radius: 16rpx;
	}

	.detail {
		display: flex;
		align-items: center;
		margin: 20rpx 30rpx 20rpx 50rpx;

		.in-right {
			width: 36rpx;
			height: 36rpx;
			margin-left: 100rpx;
		}
	}

	.detail-title {
		min-width: 160rpx;
		color: #B3B3BB;
	}

	.detail-content {
		flex: 1;
	}
	
	.coupon-item-input {
		padding: 0 16rpx;
		height: 70rpx;
		border: 1px solid #aaa;
		border-radius: 8rpx;
		&.manjian-input {
			padding: 0 30rpx;
		}
		&.disabled {
			color: #999;
		}
	}
	
	.coupon-textarea {
		padding: 16rpx;
		width: 100%;
		height: 160rpx;
		border: 1px solid #aaa;
		border-radius: 8rpx;
	}

	.rule {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 112rpx;
		line-height: 112rpx;
		color: #B3B3BB;
		background: #25273C;
		border-radius: 0px 0px 16rpx 16rpx;
		margin-top: 30rpx;
		padding: 0 30rpx;
		box-sizing: border-box;

		.icon-arrow-right {
			color: #B3B3BB;
			font-size: 36rpx;
		}
	}

	// 二维码弹窗样式
	.qrcode {
		box-sizing: border-box;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		.qrcode-body {
			margin-top: -150rpx;
			position: relative;
			border-radius: 20rpx;
			overflow: hidden;

			.qrcode-top {
				background-color: #fff;
				padding: 20rpx;
			}

			.qrcode-bottom {
				background-color: #fff;
				padding: 48rpx 60rpx;
			}

			.qrcode-h2 {
				margin-bottom: 20rpx;
				font-size: 36rpx;
				color: #313131;
				text-align: center;
			}

			.qrcode-h2+.qrcode-h2 {
				font-size: 60rpx;
				margin-bottom: 0;
			}

			.qrcode-content {
				color: #707070;
				line-height: 20px;
			}
		}

		.circle-box {
			width: 100%;
			display: flex;
			justify-content: space-between;
		}

		.circle-left {
			width: 20px;
			height: 20px;
			background-image: radial-gradient(circle farthest-side at 0 10px, transparent 10px, white 10px);
		}

		.circle-center {
			position: relative;
			flex: 1;
			height: 20px;
			background-color: #fff;
		}

		.circle-center::before {
			content: '';
			position: absolute;
			left: 0;
			top: 10px;
			display: inline-block;
			width: 100%;
			height: 0;
			border-top: 1px dashed #C9C9CA;
		}

		.circle-right {
			width: 20px;
			height: 20px;
			background-image: radial-gradient(circle farthest-side at 20px 10px, transparent 10px, white 10px);
		}

		.qrcode-img {
			width: 220px;
		}
	}

	.canvas-hide {
		position: fixed;
		right: 100vw;
		bottom: 100vh;
		z-index: -9999;
		opacity: 0;
		width: 220px;
		height: 220px;
	}

	.icon-lc-68 {
		text-shadow: 3px -2px 0 #787A86;
	}

	.bottom-view {
		padding: 50rpx;
	}

	.submit-btn {
		margin-top: 20rpx;
		background-color: #F6A704;
		color: #fff;
	}

	.daifa-hint {
		margin: 30rpx 0;
		color: #494C6A;
		font-size: 28rpx;
		text-align: center;
	}
	.radio {
		display: inline-block;
		width: 180rpx;
		color: #{$textColor};
		
		&.active {
			color: #fff;
			
			.radio-circle{
				border: 1px solid #F6A704;
				&::before {
					background-color: #F6A704;
				}
			}
		}
		.radio-circle {
			margin-right: 16rpx;
			display: inline-flex;
			justify-content: center;
			align-items: center;
			width: 30rpx;
			height: 30rpx;
			line-height: 22rpx;
			padding: 4rpx;
			border: 1px solid #{$textColor};
			border-radius: 50%;
			vertical-align: middle;
			box-sizing: border-box;
			
			&::before {
				content: '';
				display: inline-block;
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: #{$textColor};
			}
		}
	}
</style>
