<template>
	<div>
			<view class="example-title"  id="video" @tap="playVideo" @pause="closeMask">开</view>
			<view class="example-title"  id="video" @tap="closeMask" @pause="closeMask">关</view>
			<view id="video_mask" style="width: 500rpx;height: 700rpx;background-color: #00B26A;"></view>
	</div>
</template>

<script>
	export default { 
		data() {
			return {  
			};
		},
		onLoad() {
			this.closeMask();
/* 
			// 接收 popup 的消息
			uni.$on('popup-page', (data) => {
				switch(data.type){
					case 'interactive':
						uni.showModal({
							title: '来自Popup的消息',
							content: data.info
						})
						break;
					default:
						uni.showToast({
							title: data.title,
						})
						break;
				}
			})
			// 监听 drawer 消息
			uni.$on('drawer-page', (data) => {
				uni.showToast({
					title: '点击了第' + data + '项',
					icon:"none"
				});
			}) */
		},
		onUnload() {
			/* uni.$off('popup-page')
			uni.$off('drawer-page') */
		},
		onReady() { 
		},
		methods: {
			playVideo() {
                uni.showToast({
                    title: '发顺丰'
                });
				let subNVue = uni.getSubNVueById('video_mask')
				subNVue.show('fade-in', 200, () => {
					uni.$emit('play-video', {
						status: 'open',
					})
				})
			},
			closeMask() {
				let subNVue = uni.getSubNVueById('video_mask')
				uni.$emit('close-video', {
					status: 'close',
				})
				subNVue.hide('fade-out', 200)
			},
		}
	}
</script>

<style>
	.content {
		align-content: center;
	    height: 800rpx;
        width: 750rpx;
		background-color: #f6b03e;
	}
	.example {
		padding: 0 10px 10px
	}
	.example-title {
		font-size: 14px;
		line-height: 14px;
		color: #181818;
        background-color: #00CE47;
		margin: 40px 2rpx;
		position: relative;
        height: 200rpx;
	}
	video {
		position: absolute;
		bottom: 30px;
		left: 0;
		width: 100%;
		height: 200px;
	}
	.example .example-title {
		margin: 40rpx 0
	}
	button {
		background-color: #f8f8f8;
	}
	.title {
	    font-size: 20px;
		text-align: center;
	    color: #8f8f94;
	}
</style>
