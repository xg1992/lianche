<template>
	<view>
		<view class="pd15">
			<view class="learn_box" v-for="(i,idx) in list" :key='idx'>
				<view class="h_center jc_sb pd20">
					<text>{{i.type}}（{{i.period}}个学时）</text>
					<text class="fraction" >
					<block v-if="i.speedType==3&&idx==2">{{i.poine?i.poine+'分':'待考'}} <text class="font20 colorb3" v-if="!i.poine" @click="Popup(i.ipoine,i.theSpeed,idx)">(已考请填分数)</text></block>
					<block v-if="i.speedType==2&&idx!=2">{{i.poine?i.poine+'分':'待考'}} <text class="font20 colorb3" v-if="!i.poine" @click="Popup(i.ipoine,i.theSpeed,idx)">(已考请填分数)</text></block>
					</text>
				</view>
				<view class="" >
					<view class="center posre" style="margin-top: 54rpx;" >
						<!-- 2科二基础，3科二实操、4科二待考、5科三实操、6科三待考 -->
						<block v-if="idx==1||idx==4">
							<view class="circular " :class="i.speedType>=1?'bg_w':''" ></view>
							<view class="xian_line " style="width: 70%;" :class="i.speedType>=2?'bg_w':''"></view>
							<view class="circular " :class="i.speedType>=2?'bg_w':''"></view>
						</block> 
						<block v-if="idx==2">
							<view class="circular " :class="i.speedType>=1?'bg_w':''"></view>
							<view class="xian_line " :class="i.speedType>=2?'bg_w':''"></view>
							<view class="circular " :class="i.speedType>=2?'bg_w':''"></view>
							<view class="xian_line" :class="i.speedType>=3?'bg_w':''"></view>
							<view class="circular" :class="i.speedType>=3?'bg_w':''"></view>
						</block>
						<block v-if="idx==3">
							<view class="circular " :class="i.speedType>=1?'bg_w':''"></view>
							<view class="xian_line " style="width: 70%;" :class="i.speedType>=2?'bg_w':''"></view>
							<view class="circular " :class="i.speedType>=2?'bg_w':''"></view>
						</block>
					</view>
					<view class="h_center jc_sb pd15" >
						<block v-if="idx==2||idx==3">
							<view class="learn_time" v-for="(item,index) in i.data" :key='index'>
								<text class="font24">{{item.speed==2?'基础':''}}{{item.speed==3?'实操':''}}{{item.speed==4?'待考':''}}{{item.speed==5?'实操':''}}{{item.speed==6?'待考':''}}</text>
								<text class="font20" v-if="item.speed==2||item.speed==3||item.speed==5">（{{item.totaltime?item.totaltime:0}}/{{item.speedPeriod}}学时）</text>
							</view>
						</block>
						<block v-if="idx==1||idx==4">
							<view class="learn_time" >
								<text class="font24">理论</text>
								<text class="font20" >（{{i.period}}学时）</text>
							</view>
							<view class="learn_time" >
								<text class="font24">待考</text>
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<!--  -->
		<view class="" v-if="popup_show">
			<view class="ui_mask"></view>
			<view class=" ui_banner">
				<view class="pd15 center color33">{{title}}</view>
				<view class="iconfont icon-lc-39 gbbtn" @click="this.popup_show = false"></view>
				<view class="pd15">
					<input type="number" value="" placeholder="输入分数" class="f_input" maxlength="3" @input="editnum"/>
					<view class="upbtn" @click="upnum">提交</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: '',
				popup_show: false,
				title:'',
				point:0
			}
		},
		onLoad(options) {
			this.load()
		},
		methods: {
			load() {
				let that = this
				that.$api.request('My/LearnSpeed/examSpeed', {uid: that.$api.storage('uid')}).then(res => {
					that.list = res.data
				})
			},
			editnum(e){
				this.point=e.detail.value
			},
			upnum(){
				let that = this
				if(this.point<=0||this.point>100){that.$api.Toast('请输入正确分数!');}
				that.$api.request('My/LearnSpeed/setExamPoint', {point: this.point}).then(res => {
					that.$api.Toast(res.msg)
					setTimeout(function () {if(res.res==1){that.load();that.popup_show=false}}, 1300) 
					
				})
			},
			Popup(fraction=0,speed,idx){
				let that=this
				console.log(fraction,speed,idx)
				if(fraction>0){return false;}
				switch(Number(idx)) {
				     case 1:
				        that.title='科目一分数'
				        break;
				     case 2:
				        that.title='科目二分数'
				        break;
				     case 3:
				        that.title='科目三分数'
				        break;
					 case 4:
					   that.title='科目四分数'
					   break;
				} 
				this.popup_show=true
			},
		},
		onPullDownRefresh() {
			this.load()
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
.learn_box{border-radius: 16rpx;overflow:hidden;background-color: #2E3045;margin-bottom: 33rpx;}
.fraction{color:#FF6562;font-size: 34rpx;}
.circular{width:24rpx;height:24rpx;background:#3A3C55;border-radius:50%;}
.xian_line{height:2rpx;background:#3A3C55;flex-flow: 1;width: 230rpx;}
.bg_w{background-color: #F6A704;}
.learn_time{display: flex;flex-direction:column;justify-content: center;align-items: center;text-align: center;color:#B3B3BB;min-width: 20%;}
.bottom_box{padding:35rpx 40rpx;border-top: 1rpx solid #191C2F;}
.btn{background-color: #3A3C55;font-size:26rpx;text-align: center;height: 72rpx;line-height: 72rpx;border-radius:8rpx;color:#B3B3BB}
.del_btn{color:#B3B3BB;font-size: 22rpx;width:88rpx;height:56rpx;background:#3A3C55;border-radius:4rpx;}
.txtcen{display: flex;flex-direction:column;justify-content: center;}
.gbbtn{position: absolute;right:0;top:-50rpx;font-size:39rpx;color:#B3B3BB}
.upbtn{border-radius: 16rpx;background-color:#F6A704 ;color:white;margin: auto;height: 88rpx;line-height: 88rpx;text-align: center;}
.f_input{width: 100%;height: 80rpx;margin-bottom: 30rpx;border:1rpx solid #B3B3BB;text-indent: 20rpx;border-radius: 8rpx;color:#000000}
</style>
