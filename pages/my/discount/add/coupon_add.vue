<template>
	<view class="coupon-body">
		<view class="coupon-form">
			<template v-for="(item,key) in formData">
				<!-- 抵扣券和折扣券切换 -->
				<view v-if="item.isSwitch">
					<!-- 数字输入框 -->
					<view class="coupon-item" :key="key" v-if="item.isNumber && form.type === item.type">
						<text class="coupon-item-title">{{item.label}}</text>
						<view class="coupon-item-content coupon-item-flex">
							<input class="coupon-item-input" :class="{disabled:item.disabled}" type="number" v-model="form[key]" :placeholder="item.placeholder" placeholder-class="coupon-input-placeholder" :disabled="item.disabled" />
							<text class="unit">{{item.unit}}</text>
						</view>
					</view>
				</view>
				<!-- 满减数字输入框 -->
				<view class="coupon-item" :key="key" v-else-if="item.isManjian">
					<text class="coupon-item-title">{{item.label}}</text>
					<view class="coupon-item-content coupon-item-flex">
						<text class="unit">满</text>
						<input class="coupon-item-input manjian-input" :class="{disabled:item.disabled}" type="number" v-model="form[key]" :placeholder="item.placeholder" placeholder-class="manjian-input-placeholder" :disabled="item.disabled" />
						<text class="unit">元可用</text>
					</view>
				</view>
				<!-- 数字输入框 -->
				<view class="coupon-item" :key="key" v-else-if="item.isNumber">
					<text class="coupon-item-title">{{item.label}}</text>
					<view class="coupon-item-content coupon-item-flex">
						<input class="coupon-item-input" :class="{disabled:item.disabled}" type="number" v-model="form[key]" :placeholder="item.placeholder" placeholder-class="coupon-input-placeholder" :disabled="item.disabled" />
						<text class="unit">{{item.unit}}</text>
					</view>
				</view>
				<!-- 数字输入框 增发数量，修改页面才显示 -->
				<view class="coupon-item" :key="key" v-else-if="item.isEdit && isEdit">
					<text class="coupon-item-title">{{item.label}}</text>
					<view class="coupon-item-content coupon-item-flex">
						<input class="coupon-item-input" :class="{disabled:item.disabled}" type="number" v-model="form[key]" :placeholder="item.placeholder" placeholder-class="coupon-input-placeholder" :disabled="item.disabled" />
						<text class="unit">{{item.unit}}</text>
					</view>
				</view>
				<!-- 单选按钮 -->
				<view class="coupon-item" :key="key" v-else-if="item.isRadio">
					<text class="coupon-item-title">{{item.label}}</text>
					<view class="coupon-item-content">
						<view class="radio" :class="{'active': form[key] === item2.value}" v-for="item2 in item.options" @click="typeChange(key,item2.value)">
							<text class="radio-circle"></text>
							<text>{{item2.title}}</text>
						</view>
					</view>
				</view>
				<!-- 日期时间选择 -->
				<view class="coupon-item" :key="key" v-else-if="item.isDate">
					<text class="coupon-item-title">{{item.label}}</text>
					<view class="coupon-item-content">
						<view class="date-box"  @click="openDateTime(item.start,item.end,1)">
							<text class="time-style" :class="{'is-edit':isEdit}" v-if="form[item.start]">{{form[item.start]}}</text>
							<text v-else>开始时间</text>
							<text class="iconfont icon-lc-59"></text>
						</view>
						<view class="range-text">至</view>
						<view class="date-box" v-model="form[item.end]" @click="openDateTime(item.start,item.end,2)">
							<text class="time-style" :class="{'is-edit':item.disabled}" v-if="form[item.end]">{{form[item.end]}}</text>
							<text v-else>结束时间</text>
							<text class="iconfont icon-lc-59"></text>
						</view>
					</view>
				</view>
				<!-- 多行文本框 -->
				<view class="coupon-item coupon-item-column" :key="key" v-else-if="item.isTextarea">
					<view class="coupon-item-title">{{item.label}}</view>
					<view class="coupon-item-content">
						<textarea class="coupon-textarea" :class="{disabled:item.disabled}" :placeholder="item.placeholder" placeholder-class="coupon-input-placeholder" maxlength="36" v-model="form[key]" :disabled="item.disabled" @input="textareaInput"/>
						<view class="text-length">{{currLength}}/{{textareaMaxlength}}</view>
					</view>
				</view>
				<!-- 普通输入文本框 -->
				<view class="coupon-item" :key="key" v-else-if="!item.isEdit">
					<text class="coupon-item-title">{{item.label}}</text>
					<view class="coupon-item-content">
						<input class="coupon-item-input" :class="{disabled:item.disabled}" type="text" v-model="form[key]" :placeholder="item.placeholder" placeholder-class="coupon-input-placeholder" :disabled="item.disabled" />
					</view>
				</view>
			</template>
		</view>
		<view class="rule" @click="openRule">
			<text>使用规则，优惠券使用详则</text>
			<view class="iconfont icon-arrow-right"></view>
		</view>
		
		<button class="submit-btn" @click="submit">{{isEdit ? '修改并发放':'新增并发放'}}</button>
		<view class="tig-text">{{isEdit ? '修改并发放':'新增并发放'}}，即代表您已同意优惠券使用规则</view>
		<mx-date-picker :disabledSelectStart="disabledSelectStart" :value="dateValue" :show="isShowDateTime" format="yyyy-mm-dd hh:ii:ss" type="rangetime" :show-tips="true" begin-text="开始" end-text="结束" :show-seconds="true" @confirm="confirm" @cancel="isShowDateTime=false" />
	</view>
</template>

<script>
	const graceChecker = require('@/graceUI/jsTools/graceChecker.js')
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue"
	import {formData,rules} from './formData.js'
	import {parseTime} from '@/common/filter.js'
	export default {
		components: {
			MxDatePicker,
		},
		data(){
			return {
				formData: JSON.parse(JSON.stringify(formData)),
				form: {
					name: '', // 名称
					type: 1, // 类型
					whoGet: 0, // 领取人群
					whoUse: 0, // 使用人
					discountMoney: '', // 优惠金额
					rebateThreshold: '', // 满多少可使用优惠
					circulation: '', // 发行总量
					addCirculation: 0, // 增发量
					issueStartTime: '', // 领取开始时间
					issueEndTime: '', // 领取结束时间
					useStartTime: '', // 使用开始时间
					useEndTime: '', // 使用结束时间
					status: 'fafang', // 代发状态
					instruction: '', // 使用说明
				},
				textareaMaxlength: 36, // 多行文本最大输入量
				currLength: 0, // 当前输入量
				isEdit: false, // 是否为修改页面
				isShowDateTime: false,
				couponType: 'ziying', // 优惠券自营（ziying）还是代发（daifa）
				editId: 1,
				disabledSelectStart: false, // 是否禁止改变开始日期
				dateValue: '', // 当前打开的日期控件显示的开始时间
			}
		},
		onLoad(options) {
			if(options.id){
				uni.setNavigationBarTitle({
					title: '修改优惠券'
				})
				this.editId = options.id;
				this.isEdit = true;
				this.formData.name.disabled = true; // 修改时，禁用不可修改项
				this.formData.circulation.disabled = true;
				this.formData.instruction.disabled = true;
				this.getInfo();
			};
		},
		onReady() {
		},
		methods: {
			// 获取修改优惠券的详情
			getInfo(){
				this.$api.request('Activity/Coupon/getCouponInfoToWorker',{couponId:this.editId}).then(res=>{
					let data = res.data;
					console.log(parseTime(data.get_end_time))
					this.form = {
						name: data.name,
						type: data.type,
						whoGet: data.who_get,
						whoUse: data.who_use,
						discountMoney: moneyTransform(data.discount,2),
						discount: moneyTransform(data.discount,2),
						rebateThreshold: moneyTransform(data.rebate_threshold,2),
						circulation: data.circulation,
						addCirculation: 0,
						issueStartTime: parseTime(data.get_start_time),
						issueEndTime: parseTime(data.get_end_time),
						useStartTime: parseTime(data.use_start_time),
						useEndTime: parseTime(data.use_end_time),
						status: data.state,
						instruction: data.instruction,
						agentCirculation: data.agentCirculation
					};
				})
			},
			typeChange(key,value){
				if(this.isEdit && (key === 'type' || key === 'whoUse')) return ;
				this.form[key] = value;
			},
			openRule(){
				uni.navigateTo({
					url: 'rule_detail'
				})
			},
			textareaInput(e){
				this.form.instructions = e.detail.value;
				this.currLength = e.detail.cursor;
			},
			submit(){
				let form = this.form;
				// 判断类型，添加对应的验证字段
				let r = rules.concat([]);
				if(form.type == 1){
					r.splice(1,0,
						{name: 'discountMoney', checkType: "between", checkRule:"1,10000",  errorMsg:"优惠金额在1到10000之间"},
						{name: 'discountMoney', checkType: "reg", checkRule:"^(([1-9][0-9]*)|(([0]\\.\\d{1,2}|[1-9][0-9]*\\.\\d{1,2})))$",  errorMsg:"优惠金额最多为两位小数"},
					)
				}else{
					r.splice(1,0,...[
						{name: 'discount', checkType: "reg", checkRule:"^[1-9]$|[0-9]\\.[1-9]{1}?$", errorMsg: '折扣应在0.1~9.9之间，并且只保留一位小数'},
					])
				}
				// graceui的表单验证插件
				let pase = graceChecker.check(form, r);
				if(!pase) {
					uni.showToast({
						title: graceChecker.error,
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				console.log(pase,graceChecker.error)
				// 判断日期,结束日期是否大于开始日期
				let st1 = new Date(form.issueStartTime).getTime(),
						et1 = new Date(form.issueEndTime).getTime(),
						st2 = new Date(form.useStartTime).getTime(),
						et2 = new Date(form.useEndTime).getTime();
				if(st1 > et1) {
					uni.showToast({
						title: '领取时间的结束时间不能小于开始时间',
						icon: 'none',
						duration: 3000
					})
					return false;
				}
				if(st2 > et2) {
					uni.showToast({
						title: '使用时间的结束时间不能小于开始时间',
						icon: 'none',
						duration: 3000
					})
					return false;
				};
				if(et1 > et2) {
					uni.showToast({
						title: '使用结束时间应大于领取结束时间',
						icon: 'none',
						duration: 3000
					})
					return false;
				};
				if(this.submiting) return ; // 防止快速点击
				this.submiting = true;
				let params,url;
				// 需要提交的数据，区分修改和新增
				if(this.isEdit) {
					url = 'Activity/Coupon/updateCouponZy';
					params = {
						id: this.editId,
						type: form.type,
						discount: form.type == 1 ? moneyTransform(form.discountMoney,1) : form.discount * 10,
						rebateThreshold: moneyTransform(form.rebateThreshold,1),
						addCirculation: form.addCirculation,
						circulation: form.circulation,
						whoGet: form.whoGet,
						getEtime: calcTime(et1),
						useEtime: calcTime(et2),
					}
				}else{
					url = 'Activity/Coupon/addCoupon';
					params = {
						name: form.name,
						type: form.type,
						discount: form.type == 1 ? moneyTransform(form.discountMoney,1) : form.discount * 10,
						rebateThreshold: moneyTransform(form.rebateThreshold,1),
						circulation: form.circulation,
						whoGet: form.whoGet,
						whoUse: form.whoUse,
						getStime: calcTime(st1),
						getEtime: calcTime(et1),
						useStime: calcTime(st2),
						useEtime: calcTime(et2),
						instruction: form.instruction,
					}
				}
				console.log(params)
				// 提交数据
				this.$api.request(url, params).then(res => {
					console.log(res)
					if(res.res === 1){
						let msg = '优惠券发放成功';
						if(this.isEdit) msg = '修改成功';
						uni.showToast({
							title: msg,
							icon: 'none',
						})
						setTimeout(()=>{
							uni.navigateBack();
						},1500)
					}
					this.submiting = false;
				});
			},
			// 打开日期选择弹窗
			openDateTime(startKey,endKey){
				if(this.isEdit){ // 修改时，不能改变开始时间
					this.disabledSelectStart = true;
					console.log([this.form[startKey],this.form[endKey]])
					this.dateValue = [this.form[startKey],this.form[endKey]]
				} 
				this.startKey = startKey; // 保存正在设置的是哪一个时间
				this.endKey = endKey;
				this.isShowDateTime = true;
			},
			// 确认日期回调
			confirm(res){
				let value = res.value;
				// 判断开始时间是否大于结束时间
				let startDate = new Date(value[0]).getTime();
				let endDate = new Date(value[1]).getTime();
				if(startDate > endDate){
					uni.showToast({
						title: '开始时间不能大于结束时间',
						icon: 'none',
						duration: 3000
					})
					return ;
				}
				this.$set(this.form,this.startKey, value[0])
				this.$set(this.form,this.endKey, value[1])
				this.isShowDateTime = false;
			}
		}
	}
	// 金额单位由元转为分
	function moneyTransform(money,type){
		let o = {
			1: money * 100,
			2: money / 100
		}
		return o[type]
	}
	// 时间戳只精确到秒
	function calcTime(time){
		return time / 1000
	}
</script>

<style lang="scss" scoped>
$textColor: '#B3B3BB';
$placeholderColor: '#494C6A';
.coupon-body {
	padding: 20rpx 30rpx;
	box-sizing: border-box;
}
.coupon-form {
	padding: 40rpx 46rpx 20rpx;
	width: 100%;
	background-color: #1E2135;
	border-radius: 16rpx 16rpx 0 0;
	
	.coupon-item {
		padding: 20rpx 20rpx 20rpx 0;
		display: flex;
		justify-content: center;
		width: 100%;
		background-color: #2E3045;
		line-height: 68rpx;
		font-size: 32rpx;
		border-radius: 8rpx;
		margin-bottom: 20rpx;
		
		&.coupon-item-column {
			flex-direction: column;
			
			.coupon-item-title {
				width: 100%;
			}
			
			.coupon-item-content {
				margin-left: 36rpx;
				padding: 20rpx 30rpx;
				height: 220rpx;
				border: 1px solid #3A3C55;
				border-radius: 8rpx;
			}
			.coupon-textarea {
				width: 100%;
				height: calc(100% - 40rpx);
				&.disabled {
					color: #999;
				}
			}
			.text-length {
				text-align: right;
				color: #{$placeholderColor};
			}
		}
	}
	.coupon-item-flex {
		display: flex;
		justify-content: space-between;
		align-content: center;
	}
	
	.coupon-item-title {
		width: 200rpx;
		min-width: 200rpx;
		padding: 0 36rpx;
		color: #{$textColor};
		box-sizing: border-box;
	}
	
	.coupon-item-content {
		flex: 1;
	}
	
	.coupon-item-input {
		height: 70rpx;
		&.manjian-input {
			padding: 0 30rpx;
		}
		&.disabled {
			color: #999;
		}
	}
	.coupon-input-placeholder {
		color: #{$placeholderColor};
	}
	.manjian-input-placeholder, .range-text {
		color: #{$textColor};
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
	.unit {
		display: inline-block;
		white-space: nowrap;
		font-size: 32rpx;
		color: #{$placeholderColor};
	}
	.date-box {
		padding: 0 20rpx;
		display: flex;
		width: 100%;
		justify-content: space-between;
		border: 1px solid #3A3C55;
		border-radius: 8rpx;
		color: #{$placeholderColor};
		
		
		.time-style {
			display: inline-block;
			max-width: 280rpx;
			color: #fff;
			white-space: nowrap;
			overflow: hidden;
			
			&.is-edit {
				color: #999;
			}
		}
	}
	
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
	padding: 0 30rpx;
	box-sizing: border-box;
	
	.icon-arrow-right {
		color: #B3B3BB;
		font-size: 36rpx;
	}
}
.submit-btn {
	margin-top: 80rpx;
	background-color: #F6A704;
	color: #fff;
}
.tig-text {
	margin: 30rpx 0;
	color: #494C6A;
	font-size: 28rpx;
	text-align: center;
}
</style>
