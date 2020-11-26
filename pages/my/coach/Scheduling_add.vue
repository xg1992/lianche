<template>
	<view class="main">
		<view class="h_center jc_sa" style="padding: 32rpx 0;background-color: #24263A;">
			<view class="date_item" v-for="(i,idx) in date.dates" :key='idx'>
				<view class="week_box">
					{{i.week}}
				</view>
				<view class="day_box" :class="i.cur?'day_cur':''" @click="clickday(idx)">
					{{i.day}}
				</view>
			</view>
		</view>
		<view class="list_box address" @tap="addressTap">
			<text>{{selectAddress&&selectAddress.name||'选择教练以前绑定的训练场'}}</text>
			<text class="iconfont icon-lc-21" style="color: #647ee6;"></text>
		</view>
		<view class="list_box" v-for="(i,idx) in list" :key='idx'>
			<view class="mc_box center" v-if="i.isEdit==0">不可操作</view>
			<view class="pd20 h_center jc_sb">
				<text>{{i.periodName}}（{{i.startTime + '-' + i.endTime}}）</text>
				<switch @change="checkoff($event,idx)" color='#F6A704' :checked="i.isOpen==1" />
			</view>
			<view class="" v-show="i.isOpen==1">
				<view class="pd20 h_center jc_sb">
					<text>科目</text>
					<view class="h_center">
						<view class="sku_btn" :class="i.subject==1?'cu_cur':''" @click="subject(idx,1)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.subject==1"></text>
							科目二
						</view>
						<view class="sku_btn" :class="i.subject==2?'cu_cur':''" @click="subject(idx,2)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.subject==2"></text>
							科目三
						</view>
					</view>
				</view>
				<view class="pd20 h_center jc_sb">
					<text>车型</text>
					<view class="h_center">
						<view class="sku_btn" :class="i.drivingType==1?'cu_cur':''" @click="driving(idx,1)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.drivingType==1"></text>
							C1
						</view>
						<view class="sku_btn" :class="i.drivingType==2?'cu_cur':''" @click="driving(idx,2)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.drivingType==2"></text>
							C2
						</view>
					</view>
				</view>
				<view class="pd20 h_center jc_sb">
					<text>可约人数</text>
					<view class="h_center num_box">
						<view class="num_item" @click="sum(idx)">-</view>
						<input type="text" class="num_item" :value="i.setQuota" @input="numinput($event,idx)" maxlength="2" />
						<view class="num_item" @click="plus(idx)">+</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				date: {},
				selectDate: [2,5],
				list: [],
				ids: []
			}

		},
		computed:{
			...mapGetters(['userInfo','selectAddress']),
			platform(){
				return this.$api.platform
			}
		},
		onLoad() {
			let that = this
			let month = new Date().getMonth() + 1
			let year_month = new Date().getFullYear() + '-' + (month < 10 ? '0' + month : month)
			let list = []
			for (let i = 0; i < 7; i++) {
				let item = {
					week: that.GetDateStr(i)[1],
					day: that.GetDateStr(i)[0],
					cur: false,
					timestamp:year_month + '-' + that.GetDateStr(i)[0]
				};
				list.push(item)
			}
			list[0].day = '今'
			let date = {
				dates: [],
				days: ''
			};
			date.days = new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'
			date.dates = list
			this.date = date
			console.log(date)
			this.load()
		},
		onShow() {
			// console.log(this.$api.storage('scheduling_data'))
			if (this.$api.storage('scheduling_data')) {
				this.ids = this.$api.storage('scheduling_data').ids
				uni.removeStorageSync('scheduling_data');
			}
		},
		onNavigationBarButtonTap(e){
			console.log(e)
			this.Submission()
		},
		methods: {
			addressTap(){
				uni.navigateTo({
					url:'./address/list?isSelect=true'
				})
			},
			clickday(idx) {
				this.date.dates[idx].cur = !this.date.dates[idx].cur
			},
			load() {
				let coachId = this.$api.storage('uid')
				this.$api.request('Train/TrainClass/getTrainClassConfigByCoach',{coachId}).then(res => {
					console.log(res)
					let list = Object.values(res.data)
					for (let i = 0; i < list.length; i++) {
						let item = {
							drivingType: 1,
							subject: 1,
							setQuota: 4,
							isOpen: 1
						}
						list[i] = Object.assign(list[i], item)
					}
					console.log(list)
					this.list = list
				})
			},
			sum(idx) {
				let setQuota = this.list[idx].setQuota
				setQuota = setQuota > 0 ? --setQuota : 0
				this.list[idx].setQuota = setQuota
			},
			plus(idx) {
				let setQuota = this.list[idx].setQuota
				setQuota = ++setQuota
				this.list[idx].setQuota = setQuota
			},
			numinput(e, idx) {
				// console.log(e.detail.value,idx)
				this.list[idx].setQuota = e.detail.value

			},
			subject(idx, stu) {
				this.list[idx].subject = stu
			},
			driving(idx, stu) {
				this.list[idx].drivingType = stu
			},
			checkoff(e, idx) {
				// console.log(e.target.value,idx)
				if (e.target.value) {
					this.list[idx].isOpen = 1
				} else {
					this.list[idx].isOpen = 0
				}
			},
			Submission() {
				let that = this
				// if (this.ids == '') {
				// 	this.$api.Toast('请选择教练');
				// 	return false
				// }
				let date = this.date
				let day = []
				for (let i = 0; i < date.dates.length; i++) {
					if (date.dates[i].cur == true) {
						day.push(date.dates[i].timestamp)
					}
				}
				if (day == '') {
					this.$api.Toast('请选择日期');
					return false
				}
				if(!this.selectAddress){
					this.$api.Toast('请选择训练场');
					return false
				}
				console.log(this.userInfo)
				let list = JSON.parse(JSON.stringify(this.list))
				let classInfo = {}
				list.forEach((item,index)=>{
					if(item.isOpen == 0){
						item.setQuota = 0
						item.subject = 0
						item.drivingType = 0
					}
					classInfo[index+1] = item
					// delete item.isOpen
				})
				console.log(classInfo);
				that.$api.request('Train/TrainClass/addTrainClass', {
					dates: day.join(),
					coachId: this.userInfo.uid,
					classInfo: JSON.stringify(classInfo),
					trainAddressId:this.selectAddress.trainAddressId
				}).then(res => {
					// console.log(res)
					that.$api.Toast(res.msg)
					if (res.res == 1) {
						setTimeout(function() {
							wx.navigateBack({
								delta: 1
							})
						}, 1000)
					}
				})
			},
			GetDateStr(AddDayCount) {
				let dd = new Date();
				dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
				let d = /^\d$/.test(dd.getDate()) ? dd.getDate() : dd.getDate();
				d = d < 10 ? '0' + d : d
				let a = new Array("日", "一", "二", "三","四", "五", "六", "日", "一", "二", "三","四", "五", "六", "日");
				let week = new Date().getDay() + AddDayCount;
				let w = a[week];
				return [d, w];
			},
		}
	}
</script>

<style lang="scss">
	.main{
		padding-bottom: 30rpx;
	}
	.date_item {
		text-align: center;
		width: 106rpx;
	}

	.week_box {
		padding: 22rpx 0;
		font-size: 32rpx;
	}

	.day_box {
		height: 72rpx;
		width: 72rpx;
		font-size: 32rpx;
		position: relative;
		line-height: 72rpx;
		border: 1rpx solid #3A3C55;
		border-radius: 50%;
		margin: auto;
		background-color: #3A3C55;
	}

	.day_cur {
		border: 1rpx solid #F6A704;
		color: #F7F6F5;
		background-color: #F6A704;
	}

	.list_box {
		margin: 30rpx;
		border-radius: 16rpx;
		background-color: #2E3045;
	}
	
	.address{
		padding: 42rpx 45rpx;
		@include fr(b,c);
	}

	.stu_btn {
		width: 144rpx;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		background: #3A3C55;
		border-radius: 8rpx;
		margin-right: 8rpx;
		font-size: 26rpx;
		position: relative;
		margin-bottom: 14rpx;
	}

	.del_icon {
		position: absolute;
		right: 0;
		top: 0;
		height: 36rpx;
		width: 36rpx;
	}

	.sku_btn {
		width: 144rpx;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		background: #494C6A;
		border: 2rpx solid #494C6A;
		border-radius: 8rpx;
		margin-left: 20rpx;
		position: relative;
		overflow: hidden;
	}

	.cu_cur {
		border: 2rpx solid #F6A704;
	}

	.num_box {
		border-radius: 8rpx;
		background-color: #3A3C55;
		border: 1rpx solid #3A3C55;
		overflow: hidden;
	}

	.num_item {
		width: 100rpx;
		height: 64rpx;
		font-size: 28rpx;
		color: #B3B3BB;
		text-align: center;
		line-height: 68rpx;
		background-color: #3A3C55;
	}

	.num_item:nth-child(2) {
		border-right: 1rpx solid #494C6A;
		border-left: 1rpx solid #494C6A;
		background-color: #494C6A;
		color: #FFFFFF
	}

	.qrbtn {
		height: 88rpx;
		background: #F6A704;
		border-radius: 16rpx;
		color: #FFFFFF;
		font-size: 34rpx;
	}

	/* #ifdef APP-PLUS */
	.icon-sel {
		position: absolute;
		right: -3rpx;
		color: #F6A704;
		font-size: 50rpx;
		z-index: 999;
	}
	.icon-sel-ios{
		bottom: -8rpx;
	}
	.icon-sel-android{
		bottom: -10rpx;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN */
	.icon-sel {
		position: absolute;
		bottom: -7rpx;
		right: 0;
		color: #F6A704;
		font-size: 50rpx;
	}

	/* #endif */
	.btn {
		width: 95%;
		height: 88rpx;
		border-radius: 40rpx;
		background-color: #F6A704;
		color: white;
		margin: 30rpx auto;
	}
</style>
