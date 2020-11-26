<template>
	<view>
		<view class="" v-if="this.$api.qx([8])">
			<swiper class="swiper" :autoplay="true">
				<swiper-item v-for="n in 5" :key='n'>
					<image src="/static/lb1.png" mode=""></image>
				</swiper-item>
			</swiper>
			<view class="pdzy15 h_center" style="border-bottom:1px solid #24263a;height: 112rpx;">
				<text class="font28 colorb3" v-show="all!=''">
					我的进度： {{all.driving_type==1?'C1':'C2'}} {{ all.speed|speed }}
				</text>
			</view>
			<view class="pd15">
				<view class="radius16" style="background-color: #2E3045;overflow: hidden;">
					<view class="font28 colorb3" style="padding:19rpx 24rpx;">{{date.days}}</view>
					<view class="h_center jc_sb" style="overflow: hidden;">
						<view class="date_box center" style="overflow: hidden;" :class="dayclick==idx?'date_box_active':''" v-for="(n,idx) in date.dates" :key='idx' @tap="clickday(idx,n)">
							<view class="icon-select" v-show="dayclick==idx"></view>
							<text>{{n.week}}</text>
							<text>{{n.day}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="pdzy15">
				<view class="" v-if="Object.keys(selectDayInfo).length>0" :class="selectDayInfo.period_schedule.length>2?'h_center jc_sb':'h_center two_box'">
					<view v-for="(n,idx) in selectDayInfo.period_schedule" :key='idx'>
						<view class="time_box" :class="n.cur?'date_box_active':''" @click="clicktime(idx,n.status)" v-if="n.status==1">
							<view class="icon-select r-b-radius" v-show="n.cur"></view>
							<text class="font30">{{n.periodName}}</text>
							<text>{{n.startTime}}-{{n.endTime}}</text>
							<text style="padding-top: 23rpx;">还有{{n.setQuota - n.order_quota_period}}名额</text>
						</view>
						<view class="time_box center full-box" v-if="n.status==2||n.status==3">
							<view class="full">{{n.status==2?'满':'休'}}</view>
							<text class="font30">{{n.periodName}}</text>
							<text>{{n.startTime}}-{{n.endTime}}</text>
							<text style="padding-top: 23rpx;">还有0名额</text>
						</view>
					</view>
				</view>
				<view v-else class="radius16" style="background-color: #2E3045;padding: 30rpx;">该日期暂无排班</view>
			</view>
			<view class=" font26" style="color: #FF6562;margin: 30rpx;line-height: 39rpx;">温馨提示：有名额可多选预约，报考成功请立即到我的->学习进度填写考试信息,以便安排练车！</view>
			<view class="yybtn center yybtn_ok btn-active" @click="subment">提交预约</view>
			<popup ref="popup" type="center" :mask-click="false" @change="change">
				<view class="popup_tip">
					<view class="iconfont icon-lc-30 popup_tip_icon"></view>
					<view class="font36 bold color2F">您{{day}}的预约成功！</view>
					<view class="font30 mgto26 color2F">预约成功可获得8块奖励金！</view>
					<view class="popup_tip_button h_center jc_sb">
						<view class="confirm_btn center" @click="close()">确定</view>
					</view>
				</view>
			</popup>
		</view>
		<view class="" v-else-if="this.$api.qx([16,32])">
			<view class="h_center jc_sa" style="padding: 32rpx 0;background-color: #24263A;">
				<view class="date_item" v-for="(i,idx) in date.dates" :key='idx'>
					<view class="week_box">
						{{i.week}}
					</view>
					<view class="day_box" :class="dayclick==idx?'day_cur':''" @click="daycur(idx)">
						<!-- <text class="iconfont icon-lianchexiangmutubiao- icon-sel" v-show="dayclick==idx"></text> -->
						{{i.day}}
					</view>
				</view>
			</view>
			<view class="" style="margin: 30rpx; border-radius:16rpx;overflow: hidden;" v-for="(item,idx) in list" :key='idx' v-if="list.length>0">
				<view class="h_center pd15 jc_sb" style="background-color: #2E3045;border-radius:16rpx 16rpx 0 0;">
					<text>{{item.periodName}} （{{item.startTime + '-' + item.endTime}}）</text>
					<text v-if="item.orderQuota&&item.orderQuota>0">已预约 {{item.orderQuota}}/{{item.periodQuota}}人</text>
					<text v-else>暂无预约</text>
				</view>
				<view class="center colorb3" v-if="item.periodUsers.length==0" style="height: 112rpx;background-color: #2E3045;border-top:1rpx solid #191C2F;border-radius:0px 0px 16rpx 16rpx;">
					{{item.periodUsers.length==0&&item.periodQuota&&item.periodQuota>0?'暂无学员预约':"暂无排班"}}
				</view>
				<navigator hover-class="none" :url="'/pages/my/coach/ment_detail?orderno='+n.orderno" class="h_center pd15 jc_sb yylist"
				 v-for="(n,index) in item.periodUsers" :key='index'>
					<image :src="n.avatar?$realSrc(n.avatar):'/static/tx.png'" style="display: block;margin-right: 24rpx;width:72rpx;height:72rpx;"></image>
					<view class="f_grow">{{n.truename}}</view>
					<view class="" style="width:260rpx;">{{ n.speed|speed }} {{n.nowSpeedTime}}学时</view>
					<view class="" style="width: 150rpx;color:#fff">{{n.stateMsg}}</view>
					<view class="iconfont icon-arrow-right color3b"></view>
				</navigator>
			</view>
			<list-empty v-if="!list || list.length==0" :top="100" msg="当前日期暂无排班" :button="showBtn" btn-text="去排班" @btnCallback="goScheduling" ></list-empty>
		</view>
		<view v-else-if="!$api.qx([8,16,32]) || !userInfo"><visitor></visitor></view>
		<!-- <list-empty v-if="!userInfo" :top="200" msg="您当前尚未登录，请前往登录" img="/static/images/dl.png" button btn-text="登录"
		 @btnCallback="goLogin" :img-width="540"></list-empty> -->
	</view>
</template>

<script>
	import { mapGetters } from "vuex"
	import Popup from "@/components/Popup.vue"
	import visitor from "./yiqingyuyue.vue"
	export default {
		components: {
			Popup,
			visitor
		},
		data() {
			return {
				api: this.$api,
				dayclick: 0,
				date: {},
				daylist: '',
				classInfo:[],
				selectDayInfo: {},
				ids: [],
				day: '',
				period:'',
				all: '',
				list: [],
				lookday: this.getFormatDate(new Date(), '-'),
				speed:'',
				showBtn:false
			}
		},
		computed:{
			...mapGetters(['userInfo']),
			platform(){
				return this.$api.platform
			}
		},
		onLoad() {
			this.getConfig()
			this.load()
		},
		onShow() {
			!this.classInfo && this.load()
		},
		methods: {
			getConfig(){
				this.$api.request('User/User/configByQiyeShow',{}).then(res=>{
					console.log(res);
					this.showBtn = (res.data.train_type == 1)
				})
			},
			async load() {
				let that = this
				// this.$api.request('Video/Homepage/homepageUserinfo', {uid:this.$api.storage('uid')}).then(async (res) => {
					// this.all = res.data
					// let userinfo = this.$store.getters.userInfo
					// userinfo.roleVal=res.data.roleVal
					// this.$store.commit('setUserInfo',userinfo)
					if (this.$api.qx([8])) {
						uni.setNavigationBarTitle({
							title: '预约'
						});
						uni.setTabBarItem({
						  index: 2,
						  text: '预约'
						})
						this.date = this.timefilter(3, 1)
						this.$api.request('Train/Appointment/getClasses', {}).then(res => {
							let classInfo = res.data
							console.log(classInfo)
							classInfo.forEach((item,index) => {
								item.period_schedule = Object.values(JSON.parse(item.period_schedule))
								for(let i=0;i<item.period_schedule.length;i++){
									item.period_schedule[i]['cur'] = false
									item.period_schedule[i]['order_quota_period'] = item['order_quota_period' + (i+1)]
									// console.log(item.period_schedule[i].order_quota_period)
									if(item.period_schedule[i].setQuota==0){
										// 休息
										item.period_schedule[i]['status'] = 3
									}else{
										if(item.period_schedule[i].setQuota<=item.period_schedule[i].order_quota_period){
											// 满
											item.period_schedule[i]['status'] = 2
										}else{
											item.period_schedule[i]['status'] = 1
										}
									}
								}
							})
							this.selectDayInfo = classInfo[0]
							this.classInfo = classInfo
							console.log(classInfo);
							this.clickday(0,this.date.dates[0])
						});
						let speed = await that.$api.request('Train/Appointment/getSpeed',{})
						this.all = speed.data
						// console.log(speed)
						// this.$api.request('Appointment/Appointment/appointmentConfig', {uid: this.$api.storage('uid')}).then(res => {this.all = res.data})
					}
					if (this.$api.qx([16,32])) {
						uni.setNavigationBarTitle({
							title: '教学'
						});
						uni.setTabBarItem({
						  index: 2,
						  text: '教学'
						})
						this.date = this.timefilter(7, 2, '')
						this.$api.request('Train/TrainClass/getTeachingInfo', {
							coachId:this.$store.getters.userInfo.uid,
							date: this.lookday
						}).then(res => {
							this.list = Object.values(res.data)
							console.log(this.list)
						})
					}
				// })
			},
			timefilter(daynum, type = 1, seperator = '-') {
				let that = this
				let month = new Date().getMonth() + 1
				let year_month = new Date().getFullYear() + seperator + (month < 10 ? '0' + month : month)
				let list = []
				let timestamp = []
				for (let i = 0; i < daynum; i++) {
					let item = {
						week: this.GetDateStr(i, type)[1],
						day: this.GetDateStr(i, type)[0],
						date:this.GetDateStr(i, type)[2]
					};
					list.push(item)
					timestamp.push(year_month + seperator + this.GetDateStr(i)[0])
				}
				list[0].day = '今'
				let date = {
					dates: [],
					days: '',
					timestamp: []
				};
				date.days = new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'
				date.dates = list
				date.timestamp = timestamp
				return date
			},
			subment() {
				let that = this
				let ids = []
				let list = this.selectDayInfo.period_schedule
				console.log(list)
				if(!list) return
				for (let i = 0; i < list.length; i++) {
					if (list[i].cur == true) {
						ids.push(i+1)
					}
				}
				if (ids.length == 0) {
					this.$api.Toast('请选择时段');
					return false;
				}
				this.$api.request('Train/Appointment/save', {
					classe_id: this.period,
					day: this.day,
					period:ids.join(',')
				}).then(res => {
					// this.$api.Toast(res.msg);
					if (res.res == 1) {
						this.$refs.popup.open()
					}
				})

			},
			close() {
				this.$refs.popup.close()
				uni.navigateTo({
					url: '/pages/my/record'
				});
			},
			change(e) {
				console.log(e)
			},
			goLogin(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
			goScheduling(){
				uni.navigateTo({
					url:'/pages/my/coach/Scheduling'
				})
			},
			clickday(idx,item) {

				// let list = this.daylist[idx].date
				// for (let i = 0; i < list.length; i++) {
				// 	list[i].cur = false
				// }
				
				// this.timelist = list
				
				let timestamp = item.date
				let info = this.classInfo.find(i => i.date == timestamp) || {}
				this.dayclick = idx
				this.day = item.date
				this.$set(this,'selectDayInfo',info)
				// this.selectDayInfo = info
			},
			clicktime(idx, stu) {
				// if (stu == 2) {return false;}

				let selectDayInfo = JSON.parse(JSON.stringify(this.selectDayInfo))
				this.selectDayInfo = {}
				selectDayInfo.period_schedule[idx].cur = !selectDayInfo.period_schedule[idx].cur
				this.selectDayInfo = selectDayInfo
				this.period = selectDayInfo.id
				// let list = this.timelist
				// this.timelist = ''
				// list[idx].cur = !list[idx].cur
				// this.timelist = list

			},
			daycur(idx) {
				let that = this
				if (that.dayclick != idx) {
					// that.list = []
					that.dayclick = idx
					that.lookday = that.date.timestamp[idx]
					this.$api.request('Train/TrainClass/getTeachingInfo', {
						coachId:that.$store.getters.userInfo.uid,
						date: that.lookday
					}).then(res => {
						this.list = Object.values(res.data)
						console.log(this.list)
					})
				}
			},
			GetDateStr(AddDayCount, type = 1) {
				let dd = new Date();
				dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
				let d = /^\d$/.test(dd.getDate()) ? dd.getDate() : dd.getDate();
				d = d < 10 ? '0' + d : d
				let a = type == 1 ? new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日") : new Array("日", "一", "二", "三",
					"四", "五", "六", "日", "一", "二", "三","四", "五", "六", "日");
				let week = new Date().getDay() + AddDayCount;
				let w = a[week];
				let date = this.getFormatDate(dd)
				return [d, w, date];
			},
			getFormatDate(date = new Date(), seperator = '-') {
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				let currentdate = year + seperator + month + seperator + strDate;
				return currentdate;
			}
		},
		onPullDownRefresh() {
			this.load()
			uni.stopPullDownRefresh();
		},
	}
</script>

<style lang="scss">
	
	.swiper {
		height: 320rpx;
	}

	.swiper image {
		width: 100%;
		height: 100%;
	}

	.date_box {
		position: relative;
		flex-grow: 1;
		height: 184rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-right: 1rpx solid #24263a;
		border-top: 1rpx solid #24263a;
		flex-direction: column;
		position: relative;
		color: #B3B3BB;
		font-size: 26rpx;
		box-sizing: border-box;
	}

	.date_box:first-child {
		border-radius: 0px 0px 0px 16rpx;
		overflow: hidden;
	}

	.date_box:last-child {
		border-radius: 0px 0px 16rpx 0px;
		overflow: hidden;
	}

	.date_box text:last-child {
		margin-top: 40rpx;
		font-size: 40rpx;
		color: #B3B3BB;
	}

	.date_box text:first-child {
		font-size: 26rpx;
		color: #B3B3BB;
	}

	.time_box {
		position: relative;
		width: 200rpx;
		height: 200rpx;
		border: 1rpx solid #3A3C55;
		display: flex;
		box-sizing: border-box;
		align-items: center;
		flex-direction: column;
		font-size: 28rpx;
		color: #B3B3BB;
		background-color: #2E3045;
		border-radius: 16rpx;
		box-sizing: border-box;
	}

	.full-box {
		color: #494A5D;
	}

	.full {
		position: absolute;
		top: -8rpx;
		right: -8rpx;
		z-index: 2;
		background-color: #3A3C55;
		@include size(54rpx);
		@include font(24rpx,#B3B3BB);
		border-radius: 50%;
		text-align: center;
		line-height: 54rpx;
	}

	.yybtn {
		width: 90%;
		height: 88rpx;
		background-color: #3A3C55;
		border-radius: 16rpx;
		font-size: 34rpx;
		color: #F7F6F5;
		margin: 20rpx auto;
	}

	.yybtn_ok {
		background-color: #F6A704;
		color: white
	}

	.btn-active {
		background-color: #F6A704;
	}

	.date_box_active {
		border: 1px solid #F6A704;
		box-sizing: border-box;
		overflow: hidden;
	}

	/* #ifdef APP-PLUS */
	.icon-sel {
		position: absolute;
		right: 0rpx;
		color: #F6A704;
		font-size: 120rpx!important;
		// background-color: #FFFFFF;
		bottom: -5px!important;
		width: 79rpx;
		height: 68rpx;
	}
	
	.icon-select{
		position: absolute;
		right: 0rpx!important;
		bottom: 0px!important;
		width: 79rpx;
		height: 68rpx;
		background-image: url(../../static/icons/select.png);
		background-size: cover;
	}
	
	.r-b-radius{
		border-radius: 0 0 16rpx 0;
	}
	
	.b-8-ios{
		bottom: -8rpx!important;
	}
	
	.b-8-android{
		bottom: -18rpx!important;
	}
	
	.i-radius{
		// border-radius: 16rpx!important;
		// overflow: hidden;
		// background-color: #FFFFFF;
	}

	.time_box text:nth-child(2) {
		margin: 20rpx 0;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN */
	.icon-sel {
		position: absolute;
		bottom: -4rpx;
		right: 0;
		color: #F6A704;
		font-size: 100rpx;
	}

	.time_box text:nth-child(2) {
		margin: 30rpx 0;
	}

	/* #endif */
	.popup_tip {
		width: 80%;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		height: 450rpx;
		margin: auto;
		text-align: center;
		overflow: hidden;
	}

	.popup_tip_icon {
		font-size: 103rpx;
		margin: 39rpx auto 45rpx auto;
		color: #F6A704;
		text-align: center;
	}

	.popup_tip_button {
		height: 104rpx;
		border-radius: 0px 0px 16rpx 16rpx;
		margin-top: 50rpx;
	}

	.color2F {
		color: #191C2F
	}

	.confirm_btn {
		width: 100%;
		background-color: #F6A704;
		font-size: 34rpx;
		height: 100%;
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

	/* #ifdef APP-PLUS */
	.icon-sel {
		position: absolute;
		bottom: -7rpx;
		right: -3rpx;
		color: #F6A704;
		font-size: 50rpx;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN */
	.icon-sel {
		position: absolute;
		bottom: -20rpx;
		right: 0;
		color: #F6A704;
		font-size: 50rpx;
	}

	/* #endif */
	.day_cur {
		border: 1rpx solid #F6A704;
		color: #F7F6F5;
		background-color: #F6A704;
	}

	.yylist {
		background-color: rgba(46, 48, 69, 0.5);
		border-bottom: 1px solid #191C2F;
	}

	.yylist>view {
		font-size: 26rpx;
		color: #B3B3BB;
	}

	.mr50 {
		margin-right: 50rpx;
	}

	.two_box>.time_box {
		margin-right: 50rpx;
	}
</style>
