<template>
	<view>
		<view class="" v-if="navtop" style="height:96rpx;"></view>
		<view class="h_center jc_sa nav_box" :class="navtop?'topnav':''">
			<view class="center font34 colorb3 " :class="type==1?'nav_active':''" @click="nav(1)">在学学员</view>
			<view class="center font34 colorb3 " :class="type==2?'nav_active':''" @click="nav(2)">结业学员</view>
			<view class="center font34 colorb3 " :class="type==3?'nav_active':''" @click="nav(3)">待确认</view>
		</view>
		<!-- 		<view class="input_box center">
			<view class="h_center f_grow">
				<view class="iconfont icon-lc-25 colorb3"></view>
				<input type="text" value="" placeholder="请输入学员姓名" class="f_grow"/>
			</view>
		</view> -->
		<view class="" v-show="type==1">
			<navigator hover-class="none" :url="'./student_detail?id='+i.uid" class="h_center  jc_sb pdzy15 yylist" v-for="(i,idx) in list" :key='idx'>
				<image :src="i.avatar?$realSrc(i.avatar):'/static/tx.png'" style="display: block;margin-right: 24rpx;width: 64rpx;height: 64rpx;overflow: hidden;border-radius: 50%;"></image>
				<view class="" style="width:200rpx;">{{i.truename}}</view>
				<view class="" style="width:50rpx;color:#fff">{{i.driving_type==1?'C1':'C2'}}</view>
				<view class="f_grow">
					{{api.speed(i.speed)}}
					{{i.totaltime}}个学时
				</view>
				<view class="iconfont icon-arrow-right color3b"></view>
			</navigator>
		</view>
		<view class="" v-show="type==2">
			<navigator hover-class="none"  :url="'./student_detail?id='+i.uid"  class="h_center  jc_sb pdzy15 yylist" v-for="(i,idx) in list" :key='idx'>
				<image :src="i.avatar?$realSrc(i.avatar):'/static/tx.png'" style="display: block;margin-right: 24rpx;width: 64rpx;height: 64rpx;overflow: hidden;border-radius: 50%;"></image>
				<view class="" style="width:200rpx;">{{i.truename}}</view>
				<view class="" style="width:50rpx;color:#fff">{{i.driving_type==1?'C1':'C2'}}</view>
				<view class="f_grow tx_r">毕业</view>
			</navigator>
		</view>
		<view class="" v-show="type==3">
			<view class="list" v-for="(i,idx) in list" :key='idx'>
				<view class="h_center  jc_sb pdzy15  botom font26 colorb3" style="height: 112rpx;">
					<image :src="i.avatar?$realSrc(i.avatar):'/static/tx.png'" style="display: block;margin-right: 24rpx;width: 64rpx;height: 64rpx;overflow: hidden;border-radius: 50%;"></image>
					<view class="" style="width:200rpx;">{{i.receive_truename}}</view>
					<text class="f_grow tx_r">{{i.receive_mobile}}</text>
				</view>
				<view class="pd15 h_center " style="flex-direction:row-reverse;background-color: #2E3045;">
					<view class="czbox center cur" @click="Save(idx,true)">是学员</view>
					<view class="czbox center" @click="Save(idx)">非学员</view>

				</view>
			</view>

		</view>
		<view class="" style="height: 200rpx;"></view>
		<view class="btn_box center" @click="share">
			<text>添加学员发送邀请</text>
			<text class="colorb3 font24">+150奖励金</text>
		</view>
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
							<view class="radbox" :class="cartype==1?'radbox_cur':''" style="margin-right: 40rpx;" @click="cartype=1">C1<view class="iconfont icon-lianchexiangmutubiao- icon-sel"
								 v-show="cartype==1"></view>
							</view>
							<view class="radbox" :class="cartype==2?'radbox_cur':''" @click="cartype=2">C2<view class="iconfont icon-lianchexiangmutubiao- icon-sel"
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
						<view class="cz_left">已修学时</view>
						<view class="h_center f_grow" >
							<view class="h_center num_box">
								<view class="num_item" @click="num>0&&num--">-</view>
								<input type="text" class="num_item" :value="num" @input="numinput"/>
								<view class="num_item" @click="num++">+</view>
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
		
		<view :hidden="!shareshow" style="width:750rpx;border-top-right-radius: 16rpx;border-top-left-radius: 16rpx;position: absolute; bottom:0;z-index:99;background-color:#fff;">
				<view  class="grace-btdialog-btns" style="text-align:center;width: 750rpx; height: 90rpx; line-height: 90rpx;">
					<text class="grace-btdialog-btn "  style="text-align: center;width: 750rpx; color: #000000;font-weight:bold;">分享到</text>
				</view>
				<view class="scroll-view_H">
					<view  class="scroll-view-item_H uni-bg-red" v-for="(item, index) in fenxiang" :key="index" @click="actshare(index)">
						<image class="view-item_H_image" :src="item.src"></image>
						<text class="view-item_H_text">{{ item.name }}</text>
					</view>
				</view>
				
				<view class="line"></view>
				<view class="grace-btdialog-btns link-top" style="text-align:center;width: 750rpx;height: 90rpx; line-height: 90rpx;">
					<text class="grace-btdialog-btn" style=" text-align: center;width: 750rpx; color:#666666" @click="closeDialog">取消</text>
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
				type: 1,
				all: '',
				page: 1,
				list: '',
				navtop: false,
				popup_show: false,
				cartype: 1,
				num:0,
				idx:0,
				array: Object.values(speedList),
				index: 0,
				shareshow: false,
				fenxiang: [
					{ src: '/static/fenxiang1.png', name: '微信' },
					{ src: '/static/fenxiang2.png', name: '朋友圈' },
					/*{ src: '/static/fenxiang5.png', name: '微博' },
					{ src: '/static/fenxiang3.png', name: 'QQ' },
					{ src: '/static/fenxiang4.png', name: 'QQ空间' }*/
				]
			}
		},
		onLoad(options) {
			this.id = options.uid
			this.load()
			console.log(this.array)
		},
		onPageScroll: function(e) {
			// 根据滚动高度动态吸顶
			if (e.scrollTop >= 100) {
				this.navtop = true;
			} else {
				this.navtop = false;
			}
		},
		methods: {
			load() {
		
				let that = this
				if(that.type==1||that.type==2){
					that.$api.request('User/Confirm/studentList', {speedType: that.type,}).then(res => {
						// console.log(res)
						that.list = res.data
					})
				}else{
					// 邀请类型 1：普通用户，2：学员，3：教练， 5：分校 6:总部 7商户
					that.$api.request('User/Confirm/confirmUser', {invitationType:2}).then(res => {
						that.list = res.data
					})
				}
			},
			numinput(e){
				this.num=e.detail.value
			},
			Save(idx,open){
				let that=this
				if(open){
					that.idx=idx
					this.popup_show = true
				}else{
					that.$api.request('User/Confirm/confirmStudentSave', {confirmType:1,id:that.list[idx].id}).then(res => {
						that.$api.Toast(res.msg)
						if(res.res==1){that.load()}
					})
				}
			},
			close() {
				this.popup_show = false
			},
			share() {
				this.shareshow = true;
			},
			actshare(idx) {
				let all = { provider: '', scene: '' };
				if (idx == 0) {
					all.provider = 'weixin';
					all.scene = 'WXSceneSession';
				}
				if (idx == 1) {
					all.provider = 'weixin';
					all.scene = 'WXSenceTimeline';
				}
				if (idx == 2) {
					all.provider = 'sinaweibo';
					all.scene = '';
				}
				if (idx == 3) {
					all.provider = 'qq';
					all.scene = '';
				}
				if (idx == 4) {
					all.provider = 'qq';
					all.scene = '';
				}
				// console.log(all);
				let that = this;
				let uid = this.$api.storage('uid');
				// console.log(uid);
				uni.share({
					provider: all.provider,
					scene: all.scene,
					href: 'https://lianche.haoshuninfo.com/h5/share/index.html#/pages/share/invitation?uid=' + uid + '&invitation_type=2',
					title: that.$api.storage("userinfo").nickname + '邀请您加入链车',
					summary: '链车短视频以汽车驾驶教练学员、汽车自媒体KOL为短视频作品生产端，学车意向者、汽车爱好者为作品消费端',
					imageUrl: '/static/logo.png',
					success: function(res) {
						// console.log('success:' + JSON.stringify(res));
						// type 分享类型，0:其他，1：短视频   channel 分享渠道,0:其他，1:微信好友或群，2:微信朋友圈, 3:微博, 4:qq, 5:qq空间
						/*request('Video/Video/sharesAdd', {type:1,channel:idx+1,videoid:that.dataList[that.k].video_id,url:'http://uniapp.dcloud.io/',message:that.dataList[that.k].title}).then(res => {
				
							})*/
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			},
			closeDialog() {
				this.shareshow = false;
			},
			saveup(){
				let that=this
				let speed = Object.keys(speedList)[that.index]
				that.$api.request('User/Confirm/confirmStudentSave', {confirmType:2,id:that.list[that.idx].id,speed:speed,driving_type:that.cartype,
				userType:that.list[that.idx].userType,totaltime:that.num}).then(res => {
					that.$api.Toast(res.msg)
					if(res.res==1){that.load();that.index=0;that.popup_show = false;that.cartype=1;that.num=0}
				})
			},
			bindPickerChange: function(e) {
			    this.index = e.target.value
			},
			nav(e) {
				this.type = e
				this.page = 1
				this.list = []
				let that = this
				if(that.type==1||that.type==2){
					that.$api.request('User/Confirm/studentList', {speedType: that.type,}).then(res => {
						// console.log(res)
						that.list = res.data
					})
				}else{
					// 邀请类型 1：普通用户，2：学员，3：教练， 5：分校 6:总部 7商户
					that.$api.request('User/Confirm/confirmUser', {invitationType:2,confirm_status:0}).then(res => {
						that.list = res.data
					})
				}
			},
			onReachBottom(){
				let that = this
				if(that.type==1||that.type==2){
					that.$api.request('User/Confirm/studentList', {speedType: that.type,page:that.page}).then(res => {
						// console.log(res)
						that.list = that.list.concat(res.data)
						if(res.data){that.page=+1}
					})
				}else{
					// 邀请类型 1：普通用户，2：学员，3：教练， 5：分校 6:总部 7商户
					that.$api.request('User/Confirm/confirmUser', {invitationType:2,page:that.page}).then(res => {
						that.list = that.list.concat(res.data)
						if(res.data){that.page=+1}
					})
				}
			},
			onPullDownRefresh() {
				this.page = 1
				this.load()
				uni.stopPullDownRefresh();
			}
		}
	}
</script>

<style>
.nav_box{height: 96rpx;color:#8D8D8D}
.nav_box>view{height: 100%;flex-grow: 1;}
.nav_active{color: #F6A704;position: relative;}
.nav_active:after{content:'';display: block;width:80rpx;height:6rpx;background:#F6A704;
border-radius:2rpx;position: absolute;bottom: 10rpx;left:0;right:0;margin:auto}
.topnav{position: fixed;width: 100%;left: 0;top: 0;z-index:10;background-color: #191C2F;}
.input_box{margin: 30rpx;border-radius: 16rpx;overflow: hidden;background-color: #24263A;height: 80rpx;}
.input_box .iconfont{margin:0 26rpx;}
.yylist{background-color:#2E3045;border-bottom:1px solid #191C2F;margin: 15rpx 30rpx;height: 112rpx;border-radius: 16rpx;}
.yylist>view{font-size: 26rpx;color: #B3B3BB;}
.list{background-color:#2E3045;margin: 15rpx 30rpx;border-radius: 16rpx;}
.btn_box{height:88rpx;background:#2E3045;border-radius:16rpx;position: fixed;bottom: 30rpx;width: 90%;left: 0;right: 0;margin: auto;}
.czbox{width:160rpx;height:64rpx;background:rgba(46,48,69,1);border:2rpx solid rgba(58,60,85,1);border-radius:8rpx;font-size: 26rpx;color:#B3B3BB ;margin-left: 20rpx;}
.cur{border: 1rpx solid #3A3C55; background-color: #3A3C55;color: #FFFFFF;}
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
.scroll-view_H {
	display: flex;
	flex-direction: row;
	width: 750rpx;
}
.scroll-view-item_H {
	width: 52px;
	height: 52px;
	padding: 5px 10px;
	text-align: center;
	padding-left: 160rpx;
}
.view-item_H_image {
	width: 50px;
	height: 50px;
	border-radius: 25px;
}
.view-item_H_text {
	font-size: 12px;
	text-align: center;
	margin-top: 20rpx;
	color: #000000;
}
.share-box {
	width: 750rpx;
	height: 268rpx;
	position: absolute;
	bottom: 0;
	z-index: 99;
	background-color: #fff;
}

.line{
width:750rpx;
height:2rpx;
background-color: #CFD6D7;
margin-top: 80rpx;

}
</style>
