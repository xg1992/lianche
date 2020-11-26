<template>
	<view>
		<view class="h_center jc_sa nav_box">
			<view class="center color8d " :class="type==1?'nav_active':''" >收益</view>
			<view class="center color8d " :class="type==2?'nav_active':''" @click="nav(2)">奖励金</view>
		</view>
		<view class="" v-show="type==1">
			<view class="pd15">
				<view class="  radius16" style="background-color: #F6A704;">
					<view class="colorb3 h_center pd15">
						<view class="iconfont icon-lc-19 font34 pdy20"></view>
						<view>可用余额</view>
					</view>
					<view class="" style="font-size:72rpx;color:#F7F6F5;margin: 65rpx auto;text-align: center;">￥0</view>
					<view class="h_center jc_sb font28 pdzy15" style="color:#F7F6F5">
						<text class="">带货收益: <text>￥0</text></text>
						<text class="">推广货收益：<text>￥0</text></text>
					</view>
					<navigator url="extract" hover-class="none" class="center txbtn">提现</navigator>
				</view>
			</view>
			<view class="pd15 h_center jc_sb">
				<view class="gobtn">我要去购物</view>
				<view class="gobtn">立即推广</view>
			</view>
			<view style="height:32rpx;background:#212438;"></view>
			<view class="pd15 botom">收益记录</view>
			<view class="pd15 t_center jc_sb botom">
				<image src="../../static/Notice.png" mode="" style="width: 72rpx;height: 72rpx;display: block;margin-right: 24rpx;"></image>
				<view class="f_grow">
					<view class="h_center jc_sb">
						<text>商品标题商品标题商品标题商...</text><text style="color:#F6A704">+71.70</text>
					</view>
					<view class="h_center  colorb3 font26 mgto26">
						<text>购买人：小红帽</text><text class="pdz20">数量：2</text>
					</view>
					<view class="h_center jc_sb  colorb3 font26 mgto26">
						<text>2019-10-12 10:28 创建</text><text class="status_btn">已结算</text>
					</view>
				</view>
			</view>
			<view class="pd15 t_center jc_sb botom">
				<image src="../../static/Notice.png" mode="" style="width: 72rpx;height: 72rpx;display: block;margin-right: 24rpx;"></image>
				<view class="f_grow">
					<view class="h_center jc_sb">
						<text>商品标题商品标题商品标题商...</text><text >+71.70</text>
					</view>
					<view class="h_center  colorb3 font26 mgto26">
						<text>购买人：小红帽</text><text class="pdz20">数量：2</text>
					</view>
					<view class="h_center jc_sb  colorb3 font26 mgto26">
						<text>2019-10-12 10:28 创建</text><text class="status_btn">未结算</text>
					</view>
				</view>
			</view>
		</view>
		<view class="" v-show="type==2">
			<view class="pd15">
				<view class=" radius16" style="background-color: #F6A704;">
					<view class=" h_center pd15 jc_sb" style="color: #FFFFFF;">
						<view class=""><text class="iconfont icon-lc-17 font34 pdy20"></text><text>可用奖励金</text></view>
						<view class=" h_center font24"><text class="">购物当现金</text><text class="right-arrow"></text></view>
					</view>
					<view class="center">
						<view class="posre" style="font-size:72rpx;color:#FFFFFF;margin: 65rpx auto;text-align: center;">
						{{current_own_bonus}}
							<!-- <text class="pr-icon">￥10</text> -->
						</view>
					</view>
					<view class="h_center jc_sb font24 pdzy15 " style="color: #FFFFFF;">
						<!-- <text>奖励金总数：{{bonusSum}}</text> 
						<text>铂金<text class="iconfont icon-lc-27 pdz10"></text></text>-->
					</view>
					<view class="h_center jc_sb txbtn">
						<view class="center f_grow font28" style="border-right:1px solid #BF8101;height: 100%;">奖励金兑换使用</view>
						<navigator url="obtain_bonus" hover-class="none" class="center f_grow font28">获取更多奖励金</navigator>
					</view>
				</view>
			</view>
			<!--<view class="pd15"></view>
			 <view class="h_center jc_sa tab_box">
				<view class="tab_box_item" :class="status==1?'tab_active':''" @click="tab(1)">全部</view>
				<view class="tab_box_item" :class="status==2?'tab_active':''" @click="tab(2)">获取</view>
				<view class="tab_box_item" :class="status==3?'tab_active':''" @click="tab(3)">使用</view>
			</view>-->
			<view class="h_center pd15 botom">
				<text style="margin-right: 22rpx;padding:16rpx 4rpx;background-color: white;"></text><text>奖励金记录</text>
			</view>
			<view class="pd15 h_center jc_sb botom"  v-for="(item,idx) in list" :key='idx'>
				<text style="width: 30%;">{{item.eventTxt}}</text>
				<text style="width: 20%;" class="colorzth">{{item.change_value}}</text>
				<text style="width: 50%;" class="colorb3">{{item.operate_time}}</text>
			</view>
			
		</view>
		<popup ref="popup" type="center"  :mask-click="true">
			<view class="popup_tip">
				<view class="iconfont icon-lc-39 gbbtn" @click="close"></view>
				<view class="font36 bold color33 pd15 center">关于收益</view>
				<view class="pd15" >
					<view class="font32 bold colorb3">1、带货收益</view>
					<view class="mgto10 colorb3">
						用户发布视频时，选择去带货，选择想要带货的商品。视频发布后可以在视频播放页进行该商品的购买，每个单品的佣金就是用户获取的带货收益
					</view>
					<view class="font32 bold colorb3" style="margin-top: 69rpx;">2、推广收益</view>
					<view class="mgto10 colorb3">
						<text>邀请分部或总部：邀请分部或总部后，该负责人在平台提交资质认证，认证成功后，并成功登录，可以获取对应的奖励金。</text>
						<text>
							注意:成功邀请一个分部或驾校（分校或驾校负责人），并且认证分部或驾校成功。
							
							如果您是分部可以获取该分部旗下教练和学员商城上线后一年的（月结）商城消费总额的0.7%的收益；
							
							如果您是总部可以获取该总部旗下所有教练和学员商城上线后一年的（月结）商城消费总额的0.3%的收益；；
						</text>
					</view>
					<view class="colorb3 center" style="margin-top: 72rpx;">
						上述收益可以提现也可以当现金使用！
					</view>
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	import Popup from "@/components/Popup.vue"
	export default {
		components: {Popup},
		data() {
			return {
				type: 2,
				status: 1,
				page:1,
				list:'',
				bonusSum:0,
				current_own_bonus:0,
				
			}
		},
		onLoad() {
			this.nav(2);
		},
		methods: {
			nav(e) {
				this.type = e;
				
				//奖励金列表
				if(e == 2 ){
					this.page=1;
					let that = this;
		
					that.$api.request('User/Bonus/bonusLog', {
						page: 1,
						pagesize: 10,
						
						}).then(res => {
							
							that.current_own_bonus = res.data.bonusSum;
							that.list=res.data.list;
						
					})
					
				}
				
				
			},
			tab(e) {
				this.status = e
			},
			open(){
				this.$refs.popup.open()
			},
			close(){
				this.$refs.popup.close()
			},
		},
		onReachBottom() {
			let that = this
			that.$api.request('User/Bonus/bonusLog', {
				page: that.page+1,
				pagesize: 10,
				
				}).then(res => {
				var  content = that.list.concat(res.data.list);
				that.list = content;
				if(res.data){that.page=that.page+1}
			})
		},
		onNavigationBarButtonTap(e){
			// console.log(JSON.stringify(e))
			this.$refs.popup.open()
			
		}
	}
</script>

<style>
	.nav_box {
		height: 120rpx;
		border-bottom: 1rpx solid #24263a;
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
		width: 100rpx;
		height:5rpx;
		background: #F6A704;
		border-radius: 2rpx;
		position: absolute;
		bottom: 24rpx;
		left: 0;
		right: 0;
		margin: auto
	}

	.bg2e {
		background-color: #2E3045;
	}

	.txbtn {
		height: 88rpx;
		border-radius: 0px 0px 16rpx 16rpx;
		background-color: #DA9403;
		margin-top: 55rpx;
		border-top: 1px solid #BF8101;
		color:#FFFFFF
	}

	.gobtn {
		width: 320rpx;
		height: 88rpx;
		background: #2E3045;
		border: 1px solid #2E3045;
		border-radius: 16rpx;
		font-size: 28rpx;
		color: #F7F6F5;
		text-align: center;
		line-height: 88rpx;
	}

	.status_btn {
		padding: 12rpx 25rpx;
		font-size: 24rpx;
		color: #B3B3BB;
		border-radius: 8rpx;
		background-color: #2E3045;
	}

	.pr-icon {
		padding: 9rpx 20rpx;
		border: 1rpx solid #FFFFFF;
		border-radius: 40rpx;
		position: absolute;
		font-size: 24rpx;
		color: #FFFFFF;
		margin-left: 20rpx;
	}

	.tab_box {
		margin: 30rpx;
		border: 1px solid #2E3045;
		height: 96rpx;
		border-radius: 8rpx;
		overflow: hidden;
	}

	.tab_box_item {
		flex-grow: 1;
		height: 100%;
		line-height: 100%;
		text-align: center;
		line-height: 96rpx;
	}

	.tab_box_item:nth-child(2) {
		border-right: 1rpx solid #2E3045;
		border-left: 1rpx solid #2E3045;
	}

	.tab_active {
		background: #2E3045;
		color: #F6A704
	}
	.right-arrow{display:inline-block;position:relative;width:18px;height:18px;margin-right:5px}
	.right-arrow::after{display:inline-block;content:"";height:9px;width:9px;border-width:1px 1px 0 0;border-color:#FFFFFF;
	border-style:solid;transform:matrix(0.71,0.71,-0.71,0.71,0,0);position:absolute;top:50%;right:3px;margin-top:-4px}
	.popup_tip{width: 80%;background-color: #FFFFFF;border-radius: 16rpx;position: fixed;left: 50%;top: 50%;
	transform: translate(-50%, -50%);margin: auto;}
	.gbbtn{position: absolute;right:0;top:-28px;font-size:39rpx;color:#B3B3BB}
	.color2f{color:#191C2F}
</style>
