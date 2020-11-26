<template>
	<view>
		<view class="input_box center">
			<view class="h_center f_grow" style="background-color: #24263A;height: 80rpx;border-radius: 16rpx;" >
				<view class="iconfont icon-lc-25 colorb3"></view>
				<input type="text" :value="username" :placeholder="type==1?'请输入教练姓名':'请输入学员姓名'" class="f_grow" confirm-type="search" @confirm='search'/>
			</view>
<!-- 			<view class="colorb3" style="width:15%;text-align: center;">
				搜索
			</view> -->
		</view>
		<view class="" v-show="type==1">
			<view class="list h_center"  v-for="(i,idx) in list" :key='idx' @click="Checklist(idx)">
				<image :src="i.chose?'/static/Selected.png':'/static/default.png'" class="sleimg"></image>
				<image :src="i.avatar?$realSrc(i.avatar):'/static/tx.png'" class="tximg"></image>
				<view class="name">{{i.person_name}}</view>
				<text>{{i.mobile}}</text>
			</view>
		</view>
		<view class="" v-show="type==2">
			<view class="pd15 h_center botop"  v-for="(i,idx) in list" :key='idx' @click="Checklist(idx)">
				<image :src="i.chose?'/static/Selected.png':'/static/default.png'" class="sleimg"></image>
				<!-- <image :src="i.avatar?i.avatar:'/static/tx.png'" class="tximg"></image> -->
				<view class="">
					<view class="h_center">
						<text class="pdy20">{{i.person_name}}</text>
						<text>{{i.mobile}}</text>
					</view>
					<view class="font26 colorb3 mgto10 speed">{{api.speed(i.speed) }}</view>
					<!-- <view class="font26 colorb3 mgto10">所属教练：{{i.person_name}}</view> -->
					
				</view>
			</view>
		</view>
		<view class="center btn" @click="add">添加</view>
		<view class="" style="height: 120rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				api:this.$api,
				type:2,
				username:'',
				list:'',
				classId:'',
				coachId:''
			}
		},
		onLoad(options) {
			this.type=options.type
			this.day=options.day
			this.ids=options.ids
			this.classId = options.classId
			this.coachId = options.coachId
			this.load()
			if(this.type==1){uni.setNavigationBarTitle({title: '添加教练'});}else{uni.setNavigationBarTitle({title: '添加学员'});}
		},
		methods: {
			load(){
				let that = this
				let act=this.type==1?'Main/Schedule/coachList':'Train/TrainClass/getSpecialStudent'
				that.$api.request(act, {classId:that.classId,coachId:that.coachId}).then(res => {
					if(that.type==2){
						let list=res.data
						for (let i = 0; i < list.length; i++) {
							list[i].chose=false
						}
						that.list = list
					}else{
						that.list = res.data
					}
				})
			},
			search(e){
				// console.log(e.detail.value)
				this.username=e.detail.value
				this.load()
			},
			Checklist(idx){
				this.list[idx].chose=!this.list[idx].chose
			},
			add(){
				let that = this
				let ids=[]
				let list=that.list
				let userlist=[]
				for (let i = 0; i < list.length; i++) {
					if(list[i].chose){
						userlist.push(list[i])
						ids.push(list[i].uid)
					}
				}
				if(this.type==2){
					let data={userlist:userlist,ids:ids}
					// this.$api.storage('scheduling_data',data)
					this.$store.commit('schedulingInfo',data)
					uni.navigateBack();
				}else{
					that.$api.request('Main/Schedule/addTopUser', {day:that.day,userIds:ids.join()}).then(res => {
						// console.log(res)
						that.$api.Toast(res.msg)
						if(res.res==1){uni.navigateBack();}
					})
				}
			}
			
		}
	}
</script>

<style>
.input_box{margin: 30rpx;border-radius: 16rpx;overflow: hidden;}
.input_box .iconfont{margin:0 26rpx;}
.list{padding: 0 30rpx;height: 112rpx;border-top: 1rpx solid #2E3045;}
.sleimg{width: 48rpx;height: 48rpx;margin-right: 53rpx;}
.tximg{width:70rpx;height:70rpx;border-radius:50%;margin-right: 34rpx;}
.name{width: 30%;}
.btn{width: 95%;height: 88rpx;border-radius: 40rpx;background-color: #F6A704;color:white;position: fixed;bottom: 5%;left: 0;right:0;margin: auto;}
.speed{margin-top: 35rpx;}
</style>
