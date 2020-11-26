<template>
	<view class="main" v-if="ready">
		<!-- 		<view class="" v-if="navtop" style="height: 96rpx;"></view>
		<view class="h_center jc_sa nav_box" :class="navtop?'topnav':''">
			<view class="center font34 colorb3 " :class="type==1?'nav_active':''" @click="nav(1)">科二</view>
			<view class="center font34 colorb3 " :class="type==2?'nav_active':''" @click="nav(2)">科三</view>
		</view> -->
		<navigator hover-class="none" :url="'Scheduling_detail?id='+i.id+'&day='+i.date" class="list_box" v-for="(i,idx) in list"
		 :key='idx'>
			<view class="item-title h_center jc_sb botom">
				<text class=" bold">{{i.date}}</text>
				<!-- <text>排班教练{{i.coachCount}}人</text> -->
			</view>
			<view class="">
				<view class="time-item h_center jc_sb colorb3" v-for="(n,index) in i.period_schedule" :key='index'>
					<text>{{n.periodName}} {{n.startTime + '-' + n.endTime}}</text>
					<!-- <text>{{n.driving_type==1?'C1':'C2'}} {{n.speed==1?'科二':'科三'}}</text> -->
					<text>{{n.setQuota}}人</text>
				</view>
			</view>
		</navigator>
		<list-empty v-if="list == null || list.length == 0" :top="240" :msg="msg" img="/static/images/chahua.png" :button="showBtn" btn-text="去排班"
		 @btnCallback="goAdd"></list-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ready:false,
				navtop: false,
				type: 1,
				page: 1,
				list: null,
				msg: '当前日期暂无排班~',
				showBtn:false,
				train_type:0
			}
		},
		onPageScroll: function(e) {
			// 根据滚动高度动态吸顶
			if (e.scrollTop >= 190) {
				this.navtop = true;
			} else {
				this.navtop = false;
			}
		},
		onNavigationBarButtonTap(e) {
			this.goAdd()
		},
		onShow() {
			this.getConfig()
			this.load()
		},
		methods: {
			getConfig(){
				this.$api.request('User/User/configByQiyeShow',{}).then(res=>{
					console.log(res);
					this.train_type = res.data.train_type
					if(res.data.train_type == 1){
						this.showBtn = true
					}else{
						var webView = this.$mp.page.$getAppWebview();  
						// 修改buttons  
						webView.setTitleNViewButtonStyle(0, {  
						    text: '',  
						}); 
					}
				})
			},
			load() {
				let that = this
				that.$api.request('Train/TrainClass/getTrainClasses', {
					type: that.type
				}).then(res => {
					that.list = res.data
					that.list.forEach(item => {
						item.period_schedule = Object.values(JSON.parse(item.period_schedule))
					})
					this.ready = true
				})
			},
			goAdd() {
				this.$store.commit('setSelectAddress',null)
				uni.navigateTo({
					url: '/pages/my/coach/Scheduling_add'
				})
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.load()
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.main {
		padding-top: 15rpx;
		padding-bottom: 30rpx;
	}

	.list_box {
		margin: 35rpx;
		border-radius: 16rpx;
		background-color: #2E3045;
		padding: 38rpx 43rpx 52rpx 43rpx;
	}
	
	.item-title{
		padding-bottom: 32rpx;
	}
	
	.time-item{
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

	.btn {
		width: 95%;
		height: 88rpx;
		border-radius: 40rpx;
		background-color: #F6A704;
		color: white;
		position: fixed;
		bottom: 5%;
		left: 0;
		right: 0;
		margin: auto;
	}
</style>
