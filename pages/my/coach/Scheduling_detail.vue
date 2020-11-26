<template>
	<view class="main" v-if="ready">
		<view class="pd15 title">{{info.date}}（{{this.$api.getWeek(info.date)}}）</view>
		<view class="list_box" :class="isClose(i)?'close-bg':''" v-for="(i,idx) in info.period_schedule"
		 :key='idx'>
			<view class="item-title h_center jc_sb botom">
				<text class=" bold">{{i.periodName}} {{i.startTime + '-' + i.endTime}}</text>
				<text>{{isClose(i)?'已关闭':'已开启'}}</text>
			</view>
			<view class="">
				<view class="time-item h_center jc_sb colorb3">
					<text class="left-text">车型</text>
					<!-- <text>{{n.driving_type==1?'C1':'C2'}} {{n.speed==1?'科二':'科三'}}</text> -->
					<text>{{drivingType(i.drivingType)}}</text>
				</view>
				<view class="time-item h_center jc_sb colorb3">
					<text class="left-text">科目</text>
					<!-- <text>{{n.driving_type==1?'C1':'C2'}} {{n.speed==1?'科二':'科三'}}</text> -->
					<text>{{subject(i.subject)}}</text>
				</view>
				<view class="time-item h_center jc_sb colorb3">
					<text class="left-text">预约人数</text>
					<!-- <text>{{n.driving_type==1?'C1':'C2'}} {{n.speed==1?'科二':'科三'}}</text> -->
					<text>{{i.setQuota}}人</text>
				</view>
			</view>
		</view>
		<view class="center" style="height: 500rpx;" v-if="info==''">
			暂无安排教练
		</view>
		<view class="list_box">
			<view class="h_center jc_sb botom" style="padding-bottom: 30rpx;">
				<text>指定人员名单</text>
				<!-- <view class="h_center colorb3" @click="gotolist">
					<image src="/static/icons/edit.png" mode="" style="width: 36rpx;height: 36rpx;margin-right: 17rpx;"></image>
					<text>编辑</text>
				</view> -->
			</view>
			<view class="h_center f_wrap" style="margin-top: 30rpx;">
				<view class="stu_btn" v-for="(i,idx) in topUser" :key='idx' v-if="topUser.length>0">
					{{i.person_name}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ready:false,
				day: '',
				id: '',
				info: '',
				topUser: []
			}
		},
		onLoad(options) {
			this.id = options.id
			this.day = options.day
			console.log(this.id)
		},
		onShow() {
			this.load()
		},
		onNavigationBarButtonTap(e) {
			this.gotoedit()
		},
		methods: {
			load() {
				let that = this
				that.$api.request('Train/TrainClass/getTrainClassInfo', {
					classId: that.id
				}).then(res => {
					that.info = res.data
					that.info.period_schedule = JSON.parse(that.info.period_schedule)
					this.topUser = this.info.special_student
					this.ready = true
				})
			},
			drivingType(type){
				switch(type){
					case 1:
					return 'C1'
					break
					case 2:
					return 'C2'
					break
					case 3:
					return 'C1,C2'
					break
				}
			},
			subject(type){
				switch(type){
					case 1:
					return '科目二'
					break
					case 2:
					return '科目三'
					break
					case 3:
					return '科目二,科目三'
					break
				}
			},
			isClose(item){
				return (item.drivingType == 0 && item.subject == 0 && item.setQuota == 0)
			},
			deluser(idx, id) {
				this.$api.request('Main/Schedule/delTopUser', {
					day: this.day,
					userId: id
				}).then(res => {
					this.topUser.splice(idx, 1)
				})
			},
			call(phone) {
				// console.log(phone)
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			gotolist() {
				let ids = []
				for (let i = 0; i < this.topUser.length; i++) {
					ids.push(this.topUser[i].uid)
				}
				uni.navigateTo({
					url: 'list?type=2&day=' + this.day + '&ids=' + ids.join(),
				});
			},
			gotoedit() {
				this.$store.commit('setSelectAddress',null)
				uni.navigateTo({
					url: 'Scheduling_edit?id=' + this.info.id
				});
			},
			delcoach(id) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该教练排班？',
					success: function(res) {
						if (res.confirm) {
							that.$api.request('Main/Schedule/delScheduleById', {
								listIds: id,
								day: that.day
							}).then(res => {
								that.$api.Toast(res.msg)
								if (res.res == 1) {
									that.load()
								}
							})
						}
					}
				});

			}
		},
		onPullDownRefresh() {
			this.load()
			uni.stopPullDownRefresh();
		},
	}
</script>

<style>
	.main{
		padding-bottom: 30rpx;
	}
	.title{
		font-size: 34rpx;
		font-weight: bold;
		color: #FFFFFF;
	}
	
	.btn {
		padding: 15rpx 24rpx;
		border-radius: 8rpx;
		font-size: 26rpx;
		color: #B3B3BB;
		background-color: #3A3C55;
		margin-left: 53rpx;
	}

	.stu_btn {
		min-width: 144rpx;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		background: #3A3C55;
		border-radius: 8rpx;
		margin-right: 8rpx;
		font-size: 26rpx;
		position: relative;
		margin-bottom: 14rpx;
		/* padding: 0 34rpx; */
	}

	.del_icon {
		position: absolute;
		right: 0;
		top: 0;
		height: 36rpx;
		width: 36rpx;
	}

	.main {
		padding-top: 15rpx;
	}

	.list_box {
		margin: 35rpx;
		border-radius: 16rpx;
		background-color: #2E3045;
		padding: 38rpx 43rpx 52rpx 43rpx;
	}
	
	.close-bg{
		background-color: #23263A!important;
	}

	.item-title {
		padding-bottom: 32rpx;
	}

	.time-item {
		margin-top: 32rpx;
	}

	text {
		font-size: 30rpx;
	}

	.nav_box {
		height: 96rpx;
		color: #8D8D8D
	}

	.nav_box>view {
		height: 100%;
		flex-grow: 1;
	}

	.nav_active {
		color: #F6A704;
		position: relative;
	}

	.nav_active:after {
		content: '';
		display: block;
		width: 80rpx;
		height: 6rpx;
		background: #F6A704;
		border-radius: 2rpx;
		position: absolute;
		bottom: 10rpx;
		left: 0;
		right: 0;
		margin: auto
	}
</style>
