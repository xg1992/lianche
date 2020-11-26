<template>
	<view>
		<view class="h_center jc_sa" style="padding: 32rpx 0">
			<view class="date_item" v-for="(i,idx) in date.dates" :key='idx'>
				<view class="week_box" >
					{{i.week}}
				</view>
				<view class="day_box" :class="dayclick==idx?'day_cur':''" @click="clickday(idx)">
					<!-- <text class="iconfont icon-lianchexiangmutubiao- icon-sel" v-show="dayclick==idx"></text> -->
					{{i.day}}
				</view>
			</view>
		</view>
		<view class="" style="margin: 30rpx; border-radius:16rpx;overflow: hidden;" v-for="(i,idx) in 3" :key='idx'>
			<view class="h_center pd15 jc_sb" style="background-color: #2E3045;border-radius:16rpx 16rpx 0 0;">
				<text>上午 (08:00-12:00)</text>
				<text>已预约 5/10人</text>
			</view>
			<navigator hover-class="none" url="./ment_detail" class="h_center pd15 jc_sb yylist" v-for="(i,idx) in 5" :key='idx'>
				<image src="/static/tx.png" style="display: block;margin-right: 24rpx;width: 40rpx;height: 40rpx;"></image>
				<view class="" style="width: 100rpx;">李晓红</view>
				<view class="f_grow">科目二实操8个学时</view>
				<view class="" style="width: 150rpx;color:#fff">申请取消</view>
				<view class="iconfont icon-arrow-right color3b"></view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dayclick:0,
				date:{}
			}
		},
		onLoad() {
			let that = this
			let year_month=new Date().getFullYear()+'-'+(new Date().getMonth()+1)
			let list=[]
			let timestamp=[]
			for (let i = 0; i < 7; i++) {
				let item={week:that.GetDateStr(i)[1],day:that.GetDateStr(i)[0]};
				list.push(item)
				timestamp.push(year_month+'-'+that.GetDateStr(i)[0])
			}
			list[0].day='今'
			let date={dates:[],days:'',timestamp:[]};
			date.days=new Date().getFullYear()+'年'+(new Date().getMonth()+1)+'月'
			date.dates=list
			date.timestamp=timestamp
			this.date=date
			this.load()
		},
		methods: {
			load(){
				let that = this
				that.$api.request('	Appointment/Appointment/coachsAppintment', {day:1}).then(res => {
					// console.log(res)
					that.list = res.data
				})
			},
			clickday(idx){
				this.dayclick=idx
			},
			GetDateStr(AddDayCount) {
				let dd = new Date();
				dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
				let d = /^\d$/.test(dd.getDate()) ?  dd.getDate() : dd.getDate();
				let a = new Array("一", "二", "三", "四", "五", "六","日","一");
				let week = new Date().getDay() + AddDayCount;
				let w = a[week-1];
				return [d, w];
			},
		}
	}
</script>

<style>
.date_item{text-align: center;width: 106rpx;}
.week_box{padding: 22rpx 0;font-size: 32rpx;}
.day_box{height: 72rpx;width: 72rpx;font-size: 32rpx;position: relative;line-height:72rpx;border:1rpx solid #3A3C55;border-radius: 50%;margin: auto;background-color: #3A3C55;}
/* #ifdef APP-PLUS */
.icon-sel{position: absolute;bottom:-7rpx;right:-3rpx;color:#F6A704;font-size:50rpx;}
/* #endif */   
/* #ifdef MP-WEIXIN */
.icon-sel{position: absolute;bottom:-20rpx;right: 0;color:#F6A704;font-size: 50rpx;}
/* #endif */
.day_cur{border:1rpx solid #F6A704;color: #F7F6F5;background-color: #F6A704;}
.yylist{background-color: rgba(46,48,69,0.5);border-bottom:1px solid #191C2F;}
.yylist>view{font-size: 26rpx;color: #B3B3BB;}
</style>
