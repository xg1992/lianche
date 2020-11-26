<template>
	<view>
		<view class="input_box center">
			<view class="h_center f_grow" style="background-color: #24263A;height: 80rpx;border-radius: 16rpx;">
				<view class="iconfont icon-lc-25 colorb3"></view>
				<input type="text" :value="value" placeholder="请输入学员姓名" class="f_grow" @confirm='search' />
			</view>
			<!-- 			<view class="colorb3" style="width:15%;text-align: center;">
						搜索
					</view> -->
		</view>
		<view class="box" style="background-color: #2E3045;" v-for="(i,idx) in list" :key='idx'>
			<view class="h_center pd15 jc_sb ">
				<image :src="$realSrc(i.avatar)" style="width:64rpx;height:64rpx;border-radius:50%;margin-right: 22rpx;"></image>
				<text class="pdy20">{{i.truename}}</text>
				<text class="f_grow txtcen">{{i.driving_type==1?'C1':'C2'}}  {{api.speed(i.speed)}}
					{{i.totaltime}}个学时</text>
				<text class="iconfont icon-lc-49" @click="Save(idx)"></text>
			</view>
			<view class="bottom_box" v-if="i.speed==1||i.speed==4||i.speed==6||i.speed==7">
				<view hover-class="none" :url="'/pages/my/exam_info?id='+i.id"  @click="goto(i)" class="btn" v-if="i.info==''" >约考信息填写</view>
				<view class="h_center jc_sb" v-if="i.info!=''">
					<view class="f_grow txtcen font26 colorb3">
						<text>考试时间:{{i.info.exam_time}}</text> 
						<text style="padding-top: 10rpx;">考场地址:{{i.info.address}}</text>
					</view>
					<view :url="'/pages/my/exam_info?id='+i.id" @click="goto(i)" class="del_btn center">编辑</view>
				</view>
			</view>
		</view>
		<!--  -->
		<!--  -->
		<view class="" v-if="popup_show">
			<view class="ui_mask"></view>
			<view class=" ui_banner">
				<view class="iconfont icon-lc-39 gbbtn" @click="close"></view>
				<view class=" bg_w radius16">
					<view class="pd15 center bold font36  color33" style="border-bottom: 1rpx solid #E5E5E5;">学员进度</view>
					<view class="h_center jc_sb pd15">
						<view class="cz_left">车型</view>
						<view class=" f_grow h_center">
							<view class="radbox" :class="cartype==1?'radbox_cur':''" style="margin-right: 40rpx;" @click="this.cartype=1">C1<view class="iconfont icon-lianchexiangmutubiao- icon-sel"
								 v-show="cartype==1"></view>
							</view>
							<view class="radbox" :class="cartype==2?'radbox_cur':''" @click="this.cartype=2">C2<view class="iconfont icon-lianchexiangmutubiao- icon-sel"
								 v-show="cartype==2"></view>
							</view>
						</view>
					</view>
					<view class="h_center jc_sb pd15">
						<view class="cz_left">学习进度</view>
						<picker @change="bindPickerChange" :value="index" :range="array" class="f_grow">
						<view class="h_center f_grow" >
							<view class="h_center jc_sa  pdzy15 selebox">
								<view class="f_grow color33">{{array[index]}}</view>
								<view class="iconfont icon-lc-22 colorb3"></view>
							</view>
						</view>
						</picker>
					</view>
					<view class="h_center jc_sb pd15">
						<view class="cz_left">学时数</view>
						<view class="h_center f_grow" >
							<view class="h_center num_box">
								<view class="num_item" @click="this.num==0?'0':this.num--">-</view>
								<input type="text" class="num_item" :value="num" @input="numinput"/>
								<view class="num_item" @click="this.num++">+</view>
							</view>
							<text class="colorb3 pdz10">学时</text>
						</view>
					</view>
					<view class="pd15">
						<view class="qrbtn center" @click="saveup">确定</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import speedList from '@/config/speedList.js'
	export default {
		data() {
			return {
				api:this.$api,
				popup_show: false,
				cartype: 1,
				num:0,
				idx:0,
				array: Object.values(speedList),
				index: 0,
				list:''
			}
		},
		onLoad(options) {
			this.load()
		},
		
		methods: {
			load() {
				let that=this
				that.$api.request('My/LearnSpeed/stuSpeedList', {}).then(res => {
					// that.$api.Toast(res.msg)
					that.list=res.data
					// console.log(that.list)
				})
			},
			close() {
				this.popup_show = false
			},
			Save(idx,open){
				this.idx=idx
				this.popup_show = true
				this.index=this.list[idx].speed-1
				this.cartype=this.list[idx].driving_type
				this.num=this.list[idx].totaltime
			},
			bindPickerChange(e) {
			    this.index = e.target.value
			},
			numinput(e){
				this.num=e.detail.value
			},
			goto(item){
				// console.log(item)
				uni.navigateTo({url: '/pages/my/exam_info?item='+JSON.stringify(item)});
			},
			saveup(){
				let that=this
				that.$api.request('My/LearnSpeed/editSpeed', {lId:that.list[that.idx].id,drivingType:this.cartype,speed:Number(that.index)+1,period:that.num}).then(res => {
					that.$api.Toast(res.msg)
					setTimeout(function () {
						if(res.res==1){that.load();that.index=0;that.popup_show = false;that.cartype=1;that.num=0}
					}, 1300) 
					
				})
			},
			search(e) {
				// console.log(e.detail.value)
				let value=e.detail.value
				this.value=value
				let that=this
				that.$api.request('My/LearnSpeed/stuSpeedList', {username:value}).then(res => {
					that.list=res.data
				})
			}
		},
		onReachBottom() {
			let that=this
			that.$api.request('My/LearnSpeed/stuSpeedList', {page: that.page+1}).then(res => {
				that.list=that.list.concat(res.data)
				if(res.data){that.page=that.page+1}
			})
		},
		onPullDownRefresh() {
			this.load()
			this.page=1
			this.value=''
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
.input_box{margin: 30rpx;border-radius: 16rpx;overflow: hidden;}
.input_box .iconfont{margin:0 26rpx;}
.box{margin: 30rpx;border-radius: 16rpx;overflow: hidden;}
.bottom_box{padding:35rpx 40rpx;border-top: 1rpx solid #191C2F;}
.btn{background-color: #3A3C55;font-size:26rpx;text-align: center;height: 72rpx;line-height: 72rpx;border-radius:8rpx;color:#B3B3BB}
.del_btn{color:#B3B3BB;font-size: 22rpx;width:88rpx;height:56rpx;background:#3A3C55;border-radius:4rpx;}
.txtcen{display: flex;flex-direction:column;justify-content: center;}
.gbbtn{position: absolute;right:0;top:-50rpx;font-size:39rpx;color:#B3B3BB}
/* #ifdef APP-PLUS */
.icon-sel{position: absolute;bottom:-7rpx;right:-3rpx;color:#F6A704;font-size:50rpx;}
/* #endif */   
/* #ifdef MP-WEIXIN */
.icon-sel{position: absolute;bottom:-4rpx;right: 0;color:#F6A704;font-size:50rpx;}
/* #endif */
.radbox{width:160rpx;height:68rpx;background:#F7F6F5;border:1rpx solid #B3B3BB;font-size: 28rpx;color:#191C2F;border-radius:8rpx;line-height: 68rpx;text-align: center;position: relative;}
.radbox:last-child{margin-right: 40rpx;}
.radbox_cur{border:2rpx solid #F6A704; color: #F6A704;}
.cz_left{width: 160rpx;color:#191C2F ;}
.selebox{width:337rpx;height:68rpx;background:#F7F6F5;border:1rpx solid #B3B3BB;border-radius:8rpx;color: #191C2F;font-size: 28rpx;box-sizing: border-box;}
.num_box{border-radius: 8rpx;background-color: #F7F6F5;border: 1rpx solid #B3B3BB;}
.num_item{width:112rpx;height:68rpx;font-size: 28rpx;color: #191C2F;text-align: center;line-height: 68rpx;}
.num_item:nth-child(2){border-right:1rpx solid #B3B3BB;border-left:1rpx solid #B3B3BB;}
.qrbtn{height:88rpx;background:#F6A704;border-radius:16rpx;color: #FFFFFF;font-size: 34rpx;}
</style>
