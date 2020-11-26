<template>
	<view class="">
		<canvas canvas-id="qrcode" class="canvas-hide" ></canvas>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'
	export default {
		mounted() {
			this.makecode();
		},
		methods: {
			makecode(){
				// Promise
					uQRCode.make({
						canvasId: 'qrcode',
						componentInstance: this,
						text: 'uQRCode',
						size: 220,
						margin: 10,
						backgroundColor: '#ffffff',
						foregroundColor: '#000000',
						fileType: 'jpg',
						correctLevel: uQRCode.errorCorrectLevel.H
					}).then(res => {
							console.log(res)
					})
			}
		}
	}
</script>

<style scoped>
	.canvas-hide {
			// position: fixed;
			// right: 100vw;
			// bottom: 100vh;
			// z-index: -9999;
			// opacity: 0;
			width: 220px;
			height: 220px;
	}
</style>
