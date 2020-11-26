<template>
	<view>
		<view class="h_center jc_sa nav_box">
			<view class="center  color8d " :class="type==0?'nav_active':''" @click="nav(0)">全部</view>
			<view class="center  color8d " :class="type==1?'nav_active':''" @click="nav(1)">未开始</view>
			<view class="center  color8d " :class="type==2?'nav_active':''" @click="nav(2)">已结束</view>
		</view>
		<!-- <text :class="'iconfont icon-lc-'+i" v-for="i in 71"></text> -->
		<navigator :url="'record_detail?orderno='+n.orderno" hover-class="none" class="record_item" v-for="(n,idx) in list" :key='idx'>
			<!-- <view class="font24 colorb3">{{n.day}}</view> -->
			<view class="t_center jc_sb mgto26">
				<image class="item-image" :src="n.cover?$realSrc(n.cover):'/static/images/yyfm.png'" @click="tovideo(n.uid,n.video_id)"></image>
				<view class="record_text">
					<view class="record_tw">
						<text class="speed-title">{{ n.speed|speed}}</text>
						<text class="line">时间：{{n.day}}（{{ n.period|periodText }}）</text>
						<text class="address">地点：{{n.name}}<text class="iconfont icon-lc-21" style="margin-left: 20rpx;"></text></text>
					</view>
					<view class="record-status t_center">
						<view class="icon-jiashiyuan"></view>
						<view class="record-text">{{ n|recordStatus }}</view>
					</view>
				</view>
			</view>
		</navigator>
		<list-empty v-if="ready&&list.length == 0" :top="188" :msg="msg" img="/static/images/yyjl.png" button
		 btn-text="我要预约" @btnCallback="goAdd"></list-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ready:false,
				type: 0,
				page: 1,
				list: [],
				msg: '您还没有预约记录，去预约吧~'
			}
		},
		filters:{
			recordStatus(data){
				let now = Date.now()
				let s = data.day + ' ' + data.start_time
				let e = data.day + ' ' + data.end_time
				s = s.replace(/\-/g, '/')
				e = e.replace(/\-/g, '/')
				let start = new Date(s).getTime()
				let end = new Date(e).getTime()
				console.log(now,start,end,s,e)
				switch(data.status){
					case -2:
					return '已取消'
					break
					case -1:
					return '取消中'
					break
					case 1:
					if(now<start) return '未开始'
					if(start<now<end) return '进行中'
					break
					case 2:
					return '进行中'
					break
					case 3:
					return '待笔记'
					break
					case 4:
					return '已完成'
					break
				}
			},
			periodText:function(period){
				period = parseInt(period)
				switch(period){
					case 1:
					return '上午'
					break
					case 2:
					return '下午'
					break
					case 3:
					return '夜晚'
					break
				}
			}
		},
		onLoad() {
			this.load()
		},
		methods: {
			load() {
				this.$api.request('Train/Appointment/getList', {
					page:this.page,
					status: this.type
				}).then(res => {
					if(res.data.length>0){
						this.list = this.list.concat(res.data)
					}else{
						this.msg = res.msg
					}
					this.ready = true
				})
			},
			nav(e) {
				this.type = e
				this.page = 1
				this.list = []
				this.ready = false
				this.load()
			},
			goAdd() {
				uni.switchTab({
					url:'/pages/appointment/appointment'
				})
			}
		},
		onReachBottom() {
			let that = this
			this.page += 1
			this.load()
		},
		onPullDownRefresh() {
			this.page = 1
			this.list = []
			this.ready = false
			this.load()
			uni.stopPullDownRefresh();
		}
	}
</script>

<style lang="scss">
	.nav_box {
		height: 120rpx;
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
		width: 125rpx;
		height: 4rpx;
		background: #F6A704;
		border-radius: 2rpx;
		position: absolute;
		bottom: 10rpx;
		left: 0;
		right: 0;
		margin: auto
	}

	.record_item {
		padding: 62rpx 22rpx;
		background: #2E3045;
		border-radius: 16rpx;
		margin: 30rpx;
	}

	.record_btn {
		width: 337rpx;
		height: 56rpx;
		border-radius: 8rpx;
		font-size: 26rpx;
		margin-top: 30rpx;
	}

	.record_wc {
		background-color: #3A3C55;
		color: #B3B3BB
	}

	.record_no {
		background-color: #F6A704;
		color: white
	}

	.record_text {
		display: flex;
		justify-content: center;
		flex-direction: column;
		flex-grow: 1;
		margin-left: 50rpx;
	}

	.record_tw {
		display: flex;
		flex-direction: column;
	}

	.record_tw>text {
		padding-bottom: 26rpx;
	}

	.item-image {
		// flex: 1;
		width: 200rpx;
		height: 304rpx;
		display: block;
		border-radius: 8rpx;
	}
	
	.record_text{
		flex: 1;
	}

	.speed-title {
		@include font(34rpx, #FFFFFF, Bold);
	}

	.line,
	.address {
		@include font(30rpx, #FFFFFF);
	}

	.address {
		line-height: 60rpx;
	}
	
	.icon-jiashiyuan {
		@include size(33rpx);
		background-image: url('../../static/icons/jiashiyuan.png');
		background-size: cover;
		margin-right: 20rpx;
	}
	.record-text{
		line-height: 33rpx;
	}
</style>
