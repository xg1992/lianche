<template>
	<view>
		<view class="grace-header-body">
			<!-- 中间内容 -->
			<view class="grace-search">
				<view class="grace-search-in">
					<view class="icons grace-icons icon-search"></view>
					<view class="input"><input class="ipt_txt" type="text" placeholder="搜索关键字" @confirm="search" confirm-type='search' /></view>
				</view>
			</view>
		</view>
		<view>
			<!-- 内容开始区域  -->
			<view class="nav_title h_center jc_sa">
				<view :class="type == 1 ? 'nav_title_act' : '' ">
					<text @tap="act_url(1)">综合</text>
				</view>
				<view :class="type == 2 ? 'nav_title_act' : '' ">
					<text @tap="act_url(2)">用户</text>
				</view>
				<view :class="type == 3 ? 'nav_title_act' : '' ">
					<text @tap="act_url(3)">话题</text>
				</view>
			</view>


			<view :hidden="type != 1">
				<view class="pd15" v-for="(item,idx) in list" :key='idx'>
					<view class="h_center jc_sb">
						<view class="h_center">
							<view class="posre" style="margin-right: 25rpx;">
								<image :src="item.avatar == '' ? '/static/tx.png' : $realSrc(item.avatar) " mode="" style="width: 96rpx;height:96rpx;border-radius: 50%;"></image>
								<text class="coach_icon" v-if="item.role_val&16">教练</text>
								<text class="student_icon" v-if="item.role_val&8">学员</text>
							</view>
							<view>{{item.nickname}}</view>
						</view>
						<text class="grace-gray grace-text-small">{{date.fromTimer(item.create_time)}}</text>
					</view>
					<view class="mgto10">
						<!-- <text class="colorzt">#视频介绍</text> -->
						<text>{{item.title}}</text>
					</view>
					<view class="dynamic_box">
						<!-- <video id="myVideo" :src="item.video" enable-danmu danmu-btn controls></video> -->
						<image :src="$realSrc(item.cover)" @click="tovideo(item.uid,item.videoId)"></image>
					</view>
					<!-- <view class="h_center">
						<view class="h_center mgr84">
							<text class="iconfont icon-lc-20"  style="font-size: 54rpx;margin-right: 16rpx;"></text>
							<text>{{item.zans}}</text>
						</view>
						<view class="h_center mgr84">
							<text class="iconfont icon-lc-15" style="font-size: 54rpx;margin-right: 16rpx;"></text>
							<text>{{item.talks}}</text>
						</view>
						<view class="h_center mgr84">
							<text class="iconfont icon-lc-28" style="font-size: 54rpx;margin-right: 16rpx;"></text>
							<text>{{item.shares}}</text>
						</view>
					</view> -->
				</view>
			</view>



			<!-- 用户  -->
			<view :hidden="type != 2">
				<navigator class="user_list" v-for="(item,idx) in list" :key='idx' hover-class="none" :url="'/pages/homepage/homepage?uid='+item.uid">
					<view class="user_row h_center jc_sb">
						<view class="posre mgr10" >
							<image :src="item.avatar == '' ? '/static/tx.png' : $realSrc(item.avatar) " mode="" style="width: 96rpx;height:96rpx;border-radius: 50%;"></image>
							<text class="coach_icon" v-if="item.role_val&16">教练</text>
							<text class="student_icon" v-if="item.role_val&8">学员</text>
						</view>
						<view class="user_info f_grow">
							<view><text>{{item.nickname}}</text></view>
							<view class="user_info_data"><text>粉丝：{{item.fans}}  </text><text>  作品：{{item.video_sum}}</text></view>
						</view>
						<view class="follow">
							<view class="btn center" :class=" item.is_fans_it==1?'bg-cancel':''" @click.stop="follow(idx,item.is_fans_it)">{{item.is_fans_it==1?'取消关注':'关注'}}</view>
						</view>
					</view>
				</navigator>
			</view>


			<!-- 话题 -->
			<view :hidden="type != 3">
				<navigator hover-class="none" :url="'/pages/similar/topic?id='+item.id+'&type=1'" class="topic_row h_center" style="padding: 26rpx 35rpx;" v-for="(item,idx) in list" :key='idx'>
					<view class="h_center f_grow">
						<view class="topic_a center mgr10 colorb3">#</view>
						<view class="topic_b">{{item.name}}</view>
					</view>
					<view class="topic_c">{{item.play_number}}播放量</view>
				</navigator>
			</view>
			<view class="center colorb3 hei48 pd15" v-if="list==''">
                <block v-if="hadInput==false">
                    <text>请输入关键词</text>
                </block>
                <block v-else>
                    <graceEmpty>
                        <view slot="img" class="empty-view">
                            <!-- 请根据您的项目要求制作并更换为空图片 -->
                            <image class="empty-img" mode="widthFix" src="/static/empty.png"></image>
                        </view>
                        <text slot="text" class="grace-text grace-gray">抱歉，没有搜索到任何数据</text>
                    </graceEmpty>
                </block>
			</view>
		</view>
	</view>
	

</template>
<script>
	import date from '../../graceUI/jsTools/date.js';
    import graceEmpty from "../../graceUI/components/graceEmptyNew.vue";
	export default {
        components:{
            graceEmpty
        },
		data() {
			return {
				date,
				type: 1,
				value: '',
				page:1,
				list:'',
                hadInput: false //是否已经输入过关键词
			};
		},
		onLoad() {},
		methods: {
			search(e) {
                let value = e.detail.value
                if(value=='') return; //空字符串就不给搜索了
                uni.hideKeyboard() //确认搜索后隐藏键盘
				if (!this.$api.storage('token')) {uni.navigateTo({url: '/pages/login/login'});return false}
                this.hadInput = true
                this.value = e.detail.value
				let that = this
				let act;
				if (that.type == 1) {act = 'Search/Search/allList'} //综合
				if (that.type == 2) {act = 'Search/Search/userList'} //用户
				if (that.type == 3) {act = 'Search/Search/topics'} //话题
				that.$api.request(act, {page: 1,pagesize: 10,key: value}).then(res => {
					that.list=res.data.list
				})
			},
			act_url(type) {
				if (!this.$api.storage('token')) {uni.navigateTo({url: '/pages/login/login'});return false}
				this.type = type;
				this.list=''
				this.page=1
				let that = this
				let act;
				if (that.type == 1) {act = 'Search/Search/allList'} //综合
				if (that.type == 2) {act = 'Search/Search/userList'} //用户
				if (that.type == 3) {act = 'Search/Search/topics'} //话题
				if(this.value==''){return false}
				that.$api.request(act, {page: 1,pagesize: 10,key: this.value}).then(res => {
					that.list=res.data.list
					// console.log(res)
				})
			},
			follow(idx,stu){
				let that=this
				if(!that.$api.storage('token')){uni.navigateTo({url: '/pages/login/login',});return false};
				let fanIt;
				if(stu==1){fanIt=0}else{fanIt=1}
				that.$api.request('Video/Follow/doFollow', {followedUid:that.list[idx].uid,fanIt:fanIt}).then(res => {
					uni.showToast({title:res.msg,icon:'none'})
					if(res.res==1){that.load()}
				})
				
			},
			tovideo(uid,videoid){
				uni.navigateTo({url: '/pages/video/video?act=Video/Works/videoByIdsShow&uid='+uid+'&ids='+videoid,});
			},
		},
		onReachBottom() {
			let that = this
			let act;
			if (that.type == 1) {act = 'Search/Search/allList'} //综合
			if (that.type == 2) {act = 'Search/Search/userList'} //用户
			if (that.type == 3) {act = 'Search/Search/topics'} //话题
			that.$api.request(act, {page: that.page+1,pagesize: 10,key: this.value}).then(res => {
				if (res.res==13) {uni.navigateTo({url: '/pages/login/login'});return false}
				that.list=that.list.concat(res.data.list)
				if(res.data.list){that.page=that.page+1}
				// console.log(res)
			})
		}
	}
</script>
<style>
	/* 页面个性化样式 */
	.menus {
		line-height: 100rpx;
		font-size: 28rpx;
		border-bottom: 1rpx solid #E8E8E8;
		margin-left: 30rpx;
		text-align: left;
	}

	.bg {
		background-color: #191C2F;
	}

	.grace-header-body {
		padding: 6rpx 30rpx 0rpx 30rpx;
	}
	.grace-search{padding: none;}
	.grace-search-in {
		height: 70rpx;
		line-height: 70rpx;
		background-color: #2E3045;
		border-radius: 20rpx;
		width: 750rpx;
	}

	.grace-search-in>.input>input {
		color: #F0F0F0;
	}

	.nav_title {
		height: 120rpx;
	}

	.nav_title view {
		width: 33%;
		text-align: center;
		float: left;
	}

	.nav_title view text {
		font-size: 33rpx;
	}

	.nav_title_act {
		position: relative;
	}

	.nav_title_act text {
		color: #F6A704;
	}

	.nav_title_act:after {
		content: '';
		display: block;
		position: absolute;
		bottom: -20upx;
		width: 70rpx;
		height: 5rpx;
		background-color: #F6A704;
		left: 0;
		right: 0;
		margin: auto;
	}

	.user_row {
		padding: 47rpx 30rpx;
	}

	.coach_icon {
		position: absolute;
		width: 56rpx;
		height: 24rpx;
		bottom: 0;
		border-radius: 12rpx;
		background-color: #ff6562;
		font-size: 16rpx;
		left: 0;
		right: 0;
		margin: auto;
		text-align: center;
		line-height: 24rpx;
	}

	.btn {
		width: 144rpx;
		height: 56rpx;
		background: #F6A704;
		border-radius: 8rpx;
		font-size: 26rpx;
	}

	.bg-cancel {
		background-color: #2E3045;
		color: #B3B3BB
	}

	.user_info_data {
		font-size: 22rpx;
		color: #B3B3BB;
		margin-top: 20rpx;
	}

	.topic_c {
		font-size: 24rpx;
		color: #B3B3BB
	}

	.topic_a {
		border-radius: 50%;
		background-color: #2E3045;
		width: 58rpx;
		height: 58rpx;
		font-size: 40rpx;
		color: #F6A704;
	}

	.coach_icon {
		position: absolute;
		width: 56rpx;
		height: 24rpx;
		bottom: 0;
		border-radius: 12rpx;
		background-color: #ff6562;
		font-size: 16rpx;
		left: 0;
		right: 0;
		margin: auto;
		text-align: center;
		line-height: 24rpx;
	}

	.student_icon {
		position: absolute;
		width: 56rpx;
		height: 24rpx;
		bottom: 0;
		border-radius: 12rpx;
		background-color: #6982fa;
		font-size: 16rpx;
		left: 0;
		right: 0;
		margin: auto;
		text-align: center;
		line-height: 24rpx;
	}

	.dynamic_box {
		margin: 18rpx 0 26rpx 0;
	}

	.dynamic_box video,
	image {
		width: 466rpx;
		height: 643rpx;
	}

	.mgr84 {
		margin-right:84rpx;
	}
    
    
    .empty-view{width:280rpx; height:280rpx; margin-top:300rpx;}
    .empty-img{width:320rpx; height:300rpx;}
</style>
