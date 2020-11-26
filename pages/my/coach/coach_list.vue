<template>
	<view class="lc-page">
		<tab class="top-tab" :list="tab" :active="tabFlag" @tab="tabChange"></tab>
		<view class="thick-lines"></view>
		<view class="input_box center">
			<view class="h_center f_grow">
				<view class="iconfont icon-lc-25 colorb3"></view>
				<input type="text" v-model="coachName" placeholder="请输入教练姓名" @confirm="searchCoach" class="f_grow"/>
			</view>
		</view>
		<view class="" v-show="tabFlag == 0">
			<navigator hover-class="none" :url="'./coach_detail?uid=' + i.uid + '&id='+i.id" class="h_center  jc_sb pdzy15 yylist" v-for="(i, idx) in list" :key="idx">
				<image class="headimg" :src="i.avatar ? $realSrc(i.avatar) : '/static/tx.png'"></image>
				<view class="coach-name">
					<text>{{ i.receive_truename }}</text>
					<text class="iconfont icon-lc-" v-if="i.sex === 1"></text>
					<text class="iconfont icon-lc-2" v-else-if="i.sex === 2"></text>
				</view>
				<view class="f_grow">{{ i.receive_mobile }}</view>
				<view class="iconfont icon-arrow-right color3b"></view>
			</navigator>
		</view>
		<view class="" v-show="tabFlag == 1">
			<view class="list" v-for="(i, idx) in list2" :key="idx">
				<view class="h_center  jc_sb pdzy15  botom font26 colorb3" style="height: 112rpx;">
					<image src="/static/tx.png" style="display: block;margin-right: 24rpx;width: 64rpx;height: 64rpx;"></image>
					<text class="coach-name">
						<text>{{ i.receive_truename }}</text>
						<text class="iconfont icon-lc-" v-if="i.sex === 1"></text>
						<text class="iconfont icon-lc-2" v-else-if="i.sex === 2"></text>
					</text>
					<text class="f_grow">{{ i.receive_mobile }}</text>
				</view>
				<view class="pd15 h_center " style="flex-direction:row-reverse;background-color: #2E3045;">
					<view class="czbox center cur" @click="saveup(i, 1,idx)">是教练</view>
					<view class="czbox center" @click="saveup(i, -1,idx)">非教练</view>
				</view>
			</view>
		</view>
		<view class="btn_box" @click="share">
			<view class="btn-share">
				<text>添加教练发送邀请</text>
				<text class="colorb3 font24 btn_box_jingjin">+150奖励金</text>
			</view>
		</view>
		<share2 ref="share" :options="shareOptions"></share2>
		<list-empty v-if="isEmpty && ((!list.length && tabFlag == 0) || (!list2.length && tabFlag == 1))" :top="180" :msg="emptyMsg" :img-width="500" img="/static/images/dl.png"></list-empty>
	</view>
</template>

<script>
import tab from '@/components/tab.vue'
import share2 from '@/components/share.nvue'
export default {
	components: {
		tab,
		share2
	},
	data() {
		return {
			tab: ['教练','待确认'],
			tabFlag: 0,
			all: '',
			page: 1, // 已确认的教练列表已经拉取到第几页
			list: [], // 已确认的教练列表
			page2: 1, // 待确认的教练列表已经拉取到第几页
			list2: [], // 待确认的教练列表
			pagesize: 20,
			navtop: false,
			shareshow: false,
			coachName: '', // 搜索的教练姓名
			shareOptions: {
				params:{
					uid: '',
					invitation_type: 3
				}, // 分享的参数
				shareUrl: "pages/share/invitation",
				title: '恭喜你成为一名教练',
				summary: '你的好友邀请你加入驾校，担任教练，请尽快与之联系',
				// imageUrl: '',
			},
			isEmpty: false,
			emptyMsg: '暂无教练'
		};
	},
	onLoad(options) {
		this.shareOptions.params.uid = this.uid = this.$api.storage('uid');
		this.load();
	},
	methods: {
		load() {
			if (this.tabFlag == 0) {
				this.getCoachUserList(1)
			} else {
				this.getCoachUserList(0)
			}
		},
		// 获取教练列表,-1:待确认,1:已确认
		getCoachUserList(confirm_status,name){
			this.$api.request('User/Confirm/confirmUser', { 
				invitationType: 3,
				confirm_status,
				page: this.tabFlag == 0 ? this.page : this.page2,
				pagesize: this.pagesize,
				truename: name || '',
			}).then(res => {
				console.log(res)
				if(this.tabFlag == 0){
					if(this.page === 1){ // 如果是第一页，直接替换数据，否则组合数据
						this.list = res.data;
					}else{
						this.list = this.list.concat(res.data);
					}
					this.page = +1;
				}else{
					if(this.page2 === 1){
						this.list2 = res.data;
					}else{
						this.list2 = this.list2.concat(res.data);
					}
					this.page2 = +1;
				}
				if (res.data.length) {
					this.isEmpty = false;
				}else{
					this.isEmpty = true;
				}
			});
		},
		share(){
			this.$refs.share.openShare()
		},
		// 确定分部和教练的关系
		saveup(item, type,idx) {
			let that = this;
			let text = `确认${item.receive_truename}是驾校的教练吗？`;
			if(type === -1) text = `确认${item.receive_truename}不是驾校的教练吗？`;
			this.$confirm({
				content: text,
				confirm: ()=>{
					that.$api.request('User/Confirm/confirmCoachs', { confirmType: type, id: item.id, to_uid: item.uid }).then(res => {
						that.$api.Toast(res.msg);
						if (res.res == 1) {
							that.page = 1;
							that.page2 = 1;
							that.load();
						}
					});
				}
			})
		},
		tabChange(e) {
			console.log(e)
			this.tabFlag = e.index;
			this.page = 1;
			this.isEmpty = false;
			let that = this;
			if (that.tabFlag == 0) {
				this.emptyMsg = '暂无教练';
				if(this.list.length) return false; // 如果有数据，则不再请求
				this.getCoachUserList(1)
			} else {
				this.emptyMsg = '暂无待确认的教练';
				if(this.list2.length) return false; // 如果有数据，则不再请求
				this.getCoachUserList(0)
			}
		},
		searchCoach(){
			this.page = 1;
			this.list = [];
			if(this.tabFlag == 0){
				this.getCoachUserList(1,this.coachName)
			}else{
				this.getCoachUserList(0,this.coachName)
			}
		}
	},
	onReachBottom() {
		let that = this;
		if (that.tabFlag == 0) {
			this.getCoachUserList(1);
		} else {
			this.getCoachUserList(0);
		}
	},
	onPullDownRefresh() {
		// 下拉刷新,一切从头开始
		this.page = 1;
		this.page2 = 1;
		this.load();
		uni.stopPullDownRefresh();
	}
};
</script>

<style scoped>
.lc-page {
	padding-top: 120rpx;
	padding-bottom: 140rpx;
}
.top-tab {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 99;
	background-color: #191C2F;
}
.input_box {
	margin: 30rpx;
	border-radius: 16rpx;
	overflow: hidden;
	background-color: #24263a;
	height: 80rpx;
}
.input_box .iconfont {
	margin: 0 26rpx;
}
.yylist {
	background-color: #2e3045;
	border-bottom: 1px solid #191c2f;
	margin: 30rpx;
	height: 112rpx;
	border-radius: 16rpx;
}
.yylist > view, .list > view {
	font-size: 32rpx;
	color: #fff;
}
.list {
	background-color: #2e3045;
	margin: 15rpx 30rpx;
	border-radius: 16rpx;
	overflow: hidden;
}
.czbox {
	width: 160rpx;
	height: 64rpx;
	background: rgba(46, 48, 69, 1);
	border: 2rpx solid rgba(58, 60, 85, 1);
	border-radius: 8rpx;
	font-size: 26rpx;
	color: #b3b3bb;
	margin-left: 20rpx;
}
.cur {
	border: 1rpx solid #3a3c55;
	background-color: #3a3c55;
	color: #ffffff;
	margin-left: 30rpx;
}
.selebox {
	width: 337rpx;
	height: 68rpx;
	background: #f7f6f5;
	border: 1rpx solid #b3b3bb;
	border-radius: 8rpx;
	color: #191c2f;
	font-size: 28rpx;
	box-sizing: border-box;
}

.scroll-view-item_H {
	width: 52px;
	height: 52px;
	padding: 5px 10px;
	text-align: center;
}
.view-item_H_image {
	width: 50px;
	height: 50px;
	border-radius: 25px;
}
.share-box {
	width: 750rpx;
	height: 268rpx;
	position: absolute;
	bottom: 0;
	z-index: 99;
	background-color: #fff;
}
.cancel-btn {
	width: 734rpx;
	margin: 16rpx 16rpx 30rpx 0;
	flex-direction: row-reverse;
	text-align: right;
}
.btn_box_jingjin {
	margin-left: 20rpx;
}
/* =======new css for xg====== */
.headimg {
	display: block;
	margin-right: 24rpx;
	width: 64rpx;
	height: 64rpx;
	overflow: hidden;
	border-radius: 50%;
}
.coach-name {
	width: 190rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.btn_box {
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 30rpx;
	width: 100%;
	background-color: #191C2F;
	box-sizing: border-box;
}
.btn-share {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background-color: #2E3045;
	border-radius: 16rpx;
	text-align: center;
}
.thick-lines {
	width: 100%;
	height: 10rpx;
	background-color: #2E3045;
}
.icon-lc- {
	color: #6982F9;
}
.icon-lc-2 {
	color: #E96C8B;
}
</style>
