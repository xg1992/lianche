<template>
	<view>
		<view class="h_center jc_sa nav_box">
			<view class="center font34 colorb3 " :class="type==1?'nav_active':''" @click="nav(1)">关注</view>
			<view class="center font34 colorb3 " :class="type==2?'nav_active':''" @click="nav(2)">粉丝</view>
		</view>
		<view class="cu-list menu-avatar">
            <block v-if="list.length>0">
                <navigator class="pd15 h_center jc_sb" v-for="(item,index) in list" :key="index" :url="'/pages/homepage/homepage?uid='+item.uid" hover-class="none">
                    <view class="f_grow t_center">
                    	<image :src="item.avatar?$realSrc(item.avatar):'/static/logo.png'" class="cu-avatar"></image>
                    	<view class="content" style="width: 410rpx; margin-left: 12rpx;">
                    	    <view class="text-cmwhite line">{{item.nickname}}</view>
                    	    <view class="text-lines-2 font24 colorb3 line2 intro">
                    	        {{item.intro?item.intro:'暂无介绍'}}
                    	    </view>
                    	</view>
                    </view>
                        <!-- 关注 -->
                        <view class="gzbtn center qxgzbtn" v-if="type==1&&item.is_fans_it==2" @click.stop="follow(index,0)">
                            互相关注
                        </view>
                        <view class="gzbtn center qxgzbtn" v-if="type==1&&item.is_fans_it==1" @click.stop="follow(index,0)">
                            已关注
                        </view>
                        
                        <!-- 粉丝 -->
                        <view class="gzbtn center qxgzbtn" v-if="type==2&&item.is_fans_it==2" @click.stop="follow(index,0)">
                             互相关注
                        </view>
                        <view class="gzbtn center" v-if="type==2&&item.is_fans_it==3" @click.stop="follow(index,1)">
                            关注
                        </view>
                </navigator>
            </block>
            <block v-else>
				<list-empty v-if="!list || list.length==0" :msg="msg"></list-empty>
            </block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
                page:1,
				type:1,
				list: [],
				msg:''
			}
		},
        onShow() {
			//this.load()
			
        },
		onLoad(options) {
			this.type=options.type
			if(this.type==1){uni.setNavigationBarTitle({title: '关注'});}
			if(this.type==2){uni.setNavigationBarTitle({title: '粉丝'});}
            this.load()
		},
        methods: {
            load(){
				let that=this
				let act;
				if (that.type == 1) {act = 'Video/Follow/follows'} //关注
				if (that.type == 2) {act = 'Video/Follow/fans'} //粉丝
				that.$api.request(act, {uid:this.$api.storage('uid')}).then(res => {
					// console.log(res)
					that.list=res.data
					that.msg = res.msg
				})
			},
			nav(e){
				this.type=e
				this.page=1
				this.list=[]
				if(this.type==1){uni.setNavigationBarTitle({title: '关注'});}
				if(this.type==2){uni.setNavigationBarTitle({title: '粉丝'});}
				let that=this
				let act;
				if (that.type == 1) {act = 'Video/Follow/follows'} //关注
				if (that.type == 2) {act = 'Video/Follow/fans'} //粉丝
				that.$api.request(act, {uid: this.$api.storage('uid')}).then(res => {
					that.list=res.data
					that.msg = res.msg
					// console.log(res)
				})
			},
			follow(idx,stu){
				let that=this
				if(!that.$api.storage('token')){uni.navigateTo({url: '/pages/login/login',});return false};
				that.$api.request('Video/Follow/doFollow', {followedUid:that.list[idx].uid,fanIt:stu}).then(res => {
					if (res.res==13) {uni.navigateTo({url: '/pages/login/login'});return false}
					uni.showToast({title:res.msg,icon:'none'})
					if(res.res==1){that.load()}
				})
				
			},
		},
		onReachBottom() {
			let that=this
			let act;
			if (that.type == 1) {act = 'Video/Follow/follows'} //关注
			if (that.type == 2) {act = 'Video/Follow/fans'} //粉丝
			that.$api.request(act, {uid:this.$api.storage('uid'),page:this.page+1}).then(res => {
				that.list=that.list.concat(res.data)
				if(res.data){that.page=that.page+1}
			})
		},
		onPullDownRefresh() {
			this.page=1
			this.load()
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
    .intro{margin-top: 10rpx;}
    .cu-avatar {width: 96rpx;height: 96rpx;margin-right: 8rpx;border-radius: 50%;}
	.gzbtn{width:144rpx;height:56rpx;background:#F6A704;border-radius:8rpx;font-size: 26rpx;}
	.qxgzbtn{background-color: #2E3045;color: #B3B3BB}
	.nav_box{height: 96rpx;color:#8D8D8D}
	.nav_box>view{height: 100%;flex-grow: 1;}
	.nav_active{color: #F6A704;position: relative;}
	.nav_active:after{content:'';display: block;width:80rpx;height:6rpx;background:#F6A704;
	border-radius:2rpx;position: absolute;bottom: 10rpx;left:0;right:0;margin:auto}
</style>
