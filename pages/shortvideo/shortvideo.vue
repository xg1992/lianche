<template>
    <view class="content">
        <view class="video-swiper">
            <view class="search grace-absolute-lt grace-icons icon-search" @tap="goSearch"></view>
            <swiper class="swiper" :circular="circular" :vertical="true" @change="swiperChange">
                <swiper-item class="swiper-item" v-for="(item,index) in dataList" :key="index">
                    <!-- 轮播图 -->
                    <swiper class="swiper" :autoplay="true" :interval="3000" :duration="1000">
                        <swiper-item class="swiper-item" v-for="(objectItem, objectIndex) in item.srcs" :key="objectIndex">
                            <image :src="$realSrc(objectItem)" mode='aspectFit' class="video"/>
                        </swiper-item>
                    </swiper>
                    
                    <!-- 操作按钮 -->
                    <view class="video-tool">
                        <!-- 头像 -->
                        <view class="user-avatar">
                            <view @tap="goHomepage(100000)">
                                <image class="avatar" :src="item.avatar ? $realSrc(item.avatar) : '/static/fenxiang3.png'"></image>
                            </view>
                            <view @tap="follow(item.uid)">
                                <image class="follow_action" src="/static/attention@2x.png"></image>
                            </view>
                        </view>
                        
                        <!-- 赞 -->
                        <view class="right-icon-box" @tap='zan'>
                            <image class="right-icon" v-if="item.hadZan" src='/static/img/index/xinActive.png'></image>
                            <image class="right-icon" v-if="!item.hadZan" src='/static/img/index/xin.png'></image>
                            <text>{{item.zans}}</text>
                        </view>
                        
                        <!-- 评论 -->
                        <view class="right-icon-box" @tap='comment(1)'>
                            <image class="right-icon" src='/static/img/index/comment.png'></image>
                            <text @tap='comment'>{{item.comments}}</text>
                        </view>
                        
                        <!-- 分享 -->
                        <view class="right-icon-box">
                            <button class="right-icon" type="default" open-type="share" form-type="submit" size="mini" plain='true' style="padding: 0;border: 0;">
                                <image class="right-icon" src='/static/img/index/share.png'></image>
                            </button>
                            <text>{{item.shares}}</text>
                        </view>
                        
                        <!-- 玩同款 -->
                        <image class="play-same-game-avatar" src="/static/fenxiang3.png" @tap='playSame(item.playid)'></image>
                    </view>
                    
                    <!-- 视频信息昵称、标题、地址、距离 -->
                    <view class="video-info margin-left-xs text-white">
                        <view class="text-xl text-bold">@{{item.nickname}}</view>
                        <!-- 标题 -->
                        <view class="grace-ellipsis video-title">{{item.title}}</view>
                        
                        <!-- 地址 -->
                        <view class="cuIcon-location margin-top-xs text-cut video-address h_center"><text class="iconfont icon-lc-21"></text> {{item.addressName}}</view>
                    </view>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>
<script>
    var that, page = 0;
    var apiGetGameRecord = '/Game/Record/GetGameRecords'; //获取当前页数据
    var apiZanRecord = '/My/Zan/ZanRecord'; //点赞处理
    var apiShareRecord = '/My/Follow/ShareRecord'; //记录分享
    export default {
        data() {
            return {
                rsServer: this.rsServer,
                circular: false,
                udCurrent: 0, //上下滑动第几个项目
                lastTapTime: 0, //配合mixTap
                isTap: true,	//配合mixTap
                direction: 0, //0:未滑动;1:向左滑动;2:向右滑动;3:向上滑动;4:向下滑动
                subject: [],
                dataList: [
                            {
                                "id":144,
                                "uid":254,
                                "avatar":"https://wx.qlogo.cn/mmopen/vi_32/NVYQxgLDewTfZr55ZQ7b1u5QZ39vcHYyk8mSFJgEC2JGy9Y1V4j7ChVLpmOzzVuNo63XT9Ew4AwRiarnclZ7dTw/132",
                                "nickname":"yuan",
                                "title":"继承阴影原理是在指定view基础上模糊处理后产生一个基于指定view的阴影效果；使用 : 在指定 view 上添加 .grace-shadow 样式即可产生一个灰色的阴影；",
                                "type":"image",
                                "coverUrl":"https://img.100boot.cn/douyin/subject/image/6a34eb62ffa144fa8201736308ec12d5.png",
                                "srcs":[
                                    "https://img.100boot.cn/douyin/subject/image/6a34eb62ffa144fa8201736308ec12d5.png",
                                    "https://img.100boot.cn/douyin/subject/image/6d9d4ab3de9d49b398dc2e034c664cbc.jpg",
                                    "https://img.100boot.cn/douyin/subject/image/abf342aeda674a1faed2dd051c50267d.jpg"
                                ],
                                "like":false,
                                "comments":0,
                                "zans":0,
                                "shares":0,
                                "addressName":"东莞庄训练场"
                            },
                            {
                                "id":129,
                                "uid":188,
                                "avatar":"https://wx.qlogo.cn/mmopen/vi_32/fjcyS5riaSDWTWZ9A0eFgMjibEhic4icYd7HK3h2xaumsmbVtd2q0gKRRDAvpwtDWqrFs4DSrbdARuBicdJHczIFSRw/132",
                                "nickname":"你是我瞳孔中的太阳",
                                "title":"李佳豪🐖",
                                "type":"image",
                                "coverUrl":"https://img.100boot.cn/douyin/subject/image/6d9d4ab3de9d49b398dc2e034c664cbc.jpg",
                                "srcs":[
                                    "https://img.100boot.cn/douyin/subject/image/6d9d4ab3de9d49b398dc2e034c664cbc.jpg",
                                    "https://img.100boot.cn/douyin/subject/image/496f49bd31e544358b2dfa497977a46f.jpg",
                                    "https://img.100boot.cn/douyin/subject/image/6a34eb62ffa144fa8201736308ec12d5.png"
                                ],
                                "like":false,
                                "comments":22,
                                "zans":15,
                                "shares":10,
                                "addressName":"shanghai训练场"
                            },
                            {
                                "id":128,
                                "uid":195,
                                "avatar":"https://wx.qlogo.cn/mmopen/vi_32/RNgL1rpJh7a8GaEOnYb0pSEkmA0PIA46T92moqiaSu5rUbH5icucxKIm4WsFcEkq890AOR2wsy3sviaBvI1UMIvhQ/132",
                                "nickname":"just wanner run",
                                "title":"嗯",
                                "type":"image",
                                "coverUrl":"https://img.100boot.cn/douyin/subject/image/abf342aeda674a1faed2dd051c50267d.jpg",
                                "srcs":["https://img.100boot.cn/douyin/subject/image/abf342aeda674a1faed2dd051c50267d.jpg"],
                                "like":false,
                                "comments":1,
                                "zans":61,
                                "shares":14,
                                "addressName":"广州训练场"
                            },
                            {
                                "id":127,
                                "uid":198,
                                "avatar":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL03AJMic4TU86aIic37PicnGOt02T23ntPPwCffXCBWecOJBLaiaOsZvoWHVZGSzCojbmiaIE9geOljFA/132",
                                "nickname":"小夏",
                                "title":"1",
                                "type":"image",
                                "coverUrl":"https://img.100boot.cn/douyin/subject/image/d9c18922b60c4c419c0288cc803ca338.jpg",
                                "srcs":["https://img.100boot.cn/douyin/subject/image/d9c18922b60c4c419c0288cc803ca338.jpg"],
                                "like":false,
                                "comments":6,
                                "zans":33,
                                "shares":18,
                                "addressName":"beiji训练场"
                            }
                        ] //列表数据
            }
        },
        onLoad(params) {
            that = this;
            this.getData(-1);
            that.subject = that.dataList[0];
			that.load()
        },
		
        onReady() {
            this.init();
        },
        
        /**
         * 监听页面隐藏
         */
        onHide: function() {
        },
        
        /**
         * 监听页面隐藏
         */
        onShow: function() {
        },
        
        /**
         * 下拉加载上一个视频，如果已经被销毁或者是第一个，就从服务器获取更多
         * 如果服务器没有，就提示用户：已无更多视频，我也要发起游戏
         * （这个是按钮，让他一建进入发起页或者游戏模型页）
         */
        onPullDownRefresh : function(){
            that.getWonderfulList(1);
        },
        
        /**
         * 上拉加载下一视频，如果已经被销毁或者是第一个，就从服务器获取更多；
         * 如果服务器没有，就提示用户：已无更多视频，我也要发起游戏
         * （这个是按钮，让他一建进入发起页或者游戏模型页）
         */
        onReachBottom:function(){
            that.getWonderfulList(2);
        },
        
        methods:{
			load(){
				let that=this
				that.$api.request('Video/Video/recommendVideos', {page:1,pagesize:10}).then(res => {
					// console.log(res.data.list)
				})
			},
            init() {},
            /**
             * 兼容单击、双击来处理双击点赞
             */
            mixTap: function(e) {
                var currentTime = e.timeStamp
                var lastTapTime = that.lastTapTime
                that.lastTapTime = currentTime 
                
                //根据两次点击时间差判断是单击还是双击
                if (currentTime - lastTapTime < 300) { //双击触发
                    that.isTap=false
                } else { //单击触发
                    that.isTap=true
                }
            },
            
            /**
             * 获取精彩游戏记录
             * @param int node 记录从哪个节点触发的请求，需要显示加载中的设为大于0
             */
            getData: function(node) {
                //大于0的节点显示加载中提示
                if(node>0) {
                    uni.showLoading({title: '加载中:'+node,mask: false});
                }
                
                uni.request({
                    url: this.apiServer + apiGetGameRecord,
                    method: 'POST',
                    data: {
                        page: page
                    },
                    success: res => {
                        if(res.data.res == 5){
                            uni.showToast({
                                title:"没有更多了",
                                icon: "none"
                            });
                            that.isover = 1;
                        } else if(res.data.res == 1) {
                            that.dataList = that.dataList.concat(res.data.data);
                            page++;
                            uni.hideLoading();
                        } else {
                            uni.showToast({
                                title:"系统繁忙",
                                icon: "none"
                            });
                        }
                    },
                    complete:function() {
                        uni.stopPullDownRefresh();
                    }
                });
            },
            
            /**
             * 切换短视频截图
             */
            swiperChange: function(e) {
                that.udCurrent = e.detail.current;
                that.subject = that.dataList[that.udCurrent];
            },
            
            /**
             * 关注
             */
            follow: function(e) {
                uni.showToast({
                    title: '点此关注我'
                });
            },
            
            /**
             * 点赞
             */
            zan: function(e) {
                uni.showToast({
                    title: '给我点赞'
                });
                uni.request({
                    url: that.apiServer + apiZanRecord,
                    method: 'POST',
                    data: {
                        recordid : that.subject.id,
                        isAdd: that.subject.hadZan ? 0 : 1
                    },
                    success: res => {
                        if(that.subject.hadZan) {
                            that.subject.hadZan = false;
                            that.subject.zans -= 1;
                        } else {
                            that.subject.hadZan = true;
                            that.subject.zans += 1;
                        }
                    }
                });
            },
            
            /**
             * 评论
             */
            comment: function(e) {
                uni.showToast({
                    title: '这里是评论'
                });
				const that=this
				this.commentshow = true
				that.$api.request('Video/Video/zanVideo', {videoid:e,page:1,pagesize:10}).then(res => {
					// console.log(res)
					this.loading=true
				})
                uni.navigateTo({url: '/pages/shortvideo/comment?recordid='+this.subject.id});
            },
            
            /**
             * 分享
             */
            share: function(e) {
                uni.request({
                    url: that.apiServer + apiShareRecord,
                    method: 'POST',
                    data: {
                        recordid : that.subject.id,
                        channel: 1,
                        message: that.subject.title + ' \n不想孤独成长，就来Callme亲子约玩短视频吧！这有您附近同龄小伙伴可约玩',
                    },
                    success: res => {
                        if(res.data.res==1) {
                            that.subject.shares += 1;
                        }
                    }
                });
            },
            
            /**
             * 去搜搜页
             */
            goSearch: function(e) {
                uni.navigateTo({url: '/pages/search/index'});
            },
            
            /**
             * 去用户主页
             */
            goHomepage: function(uid){
                uni.navigateTo({url: '/pages/homepage/homepage?uid='+uid});
            },
            
            /**
             * 学同款
             */
            playSame: function(playid) {
                if(playid>0) {
                    uni.navigateTo({url: '/pages/game/playSame?playid'+playid});
                }
            },
        },
        
        onShareAppMessage(res) {
            if (res.from === 'button') {
                that.share()
            }
            return {
                title: that.subject.title + ' \n不想孤独成长，就来Callme亲子约玩短视频吧！这有您附近同龄小伙伴可约玩',
                path: '/pages/wonderful/wonderful?id=' + that.subject.id,
                imageUrl: '/static/image/call.png'
            }
        }
    }
</script>

<style>
    /* #ifndef APP-PLUS */
    page {
        width: 100%;
        min-height: 100%;
        display: flex;
    }
    /* #endif */
    
    .content {
        flex: 1;
        width: 750rpx;
    }
    
    .swiper {
        flex: 1;
        background-color: #2B2E3F;
        height: 100%;
    }
    
    .swiper-item {
        flex: 1;
        z-index: 1;
    }
    
    .video-swiper {
        flex: 1;
        /* #ifndef APP-PLUS */
        width: 750rpx;
        height: 100%;
        /* #endif */
    }
    
    .search{
        margin-top: 84rpx;
        margin-left: 58rpx;
        font-size: 44rpx;
        color: #F1F2F3;
    }
    
    .cover-swiper {
        position:absolute;
        top:0;
        width:750upx;
        height: 100%;
        color: rgba(0,0,0,0.7);
    }
    .video {
        flex: 1;
        width: 750rpx;
        height: 100%;
    }
    
    .video-tool {
        position: absolute;
        right: 8rpx;
        bottom: 120rpx;
        color: white;
        width: 108rpx;
        text-align: center;
        align-items:center;
        display: flex;
        flex-direction: column;
        z-index: 9999;
    }
    
    .user-avatar {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .user-avatar .avatar {
        width: 98rpx;
        height: 98rpx;
        border-radius: 50px;
    }
    .user-avatar .follow_action {
        width: 38rpx;
        height: 38rpx;
        margin-top: -22rpx;
        margin-bottom: 54rpx;
        z-index: 666;
    }
    .right-icon-box {
        width: 108rpx;
        height: 118rpx;
        font-size: 12px;
        margin: 18rpx 0 18rpx 0;
        display: flex;
        flex-flow: column;
        align-items: center;
    }
    
    .right-icon {
        width: 66rpx;
        height: 62rpx;
        margin-bottom: 4rpx;
    }
    .play-same-game-avatar{
        width:96rpx;
        height:96rpx;
        background:linear-gradient(0deg,rgba(41,41,41,1),rgba(68,67,67,1),rgba(41,41,41,1),rgba(68,67,67,1),rgba(41,41,41,1),rgba(68,67,67,1),rgba(41,41,41,1),rgba(68,67,67,1),rgba(41,41,41,1),rgba(68,67,67,1),rgba(41,41,41,1));
        border-radius:50%;
    }
    
    /* 视频层 */
    .icon-play {
        position: absolute;
        display: block;
        top: 0;bottom: 0;left: 0;right: 0;
        width: 100upx;
        height: 100upx;
        margin: auto;
    }
    
    .video-info {
        display: flex;
        flex-direction: column;
        position: absolute;
        left: 35rpx;
        bottom: 40rpx;
        width: 480rpx;
        height: 246rpx;
        white-space: pre-line;
        color: #FFFFFF;
    }
    
    .video-title {
        font-size:28rpx;
        font-weight:100;
        white-space: pre-line;
        margin-top: 56rpx;
        width:474rpx;
        max-height: 98rpx;
        line-height:40rpx;
    }
    
    .video-address {
        margin-top: 30rpx;
        font-size:24rpx;
        font-weight:100;
    }
    .game-location {
        width: 26rpx;
        height: 34rpx;
        margin-right: 8rpx;
    }
    
</style>
