<template>
	<view class="brower-tip-view" v-if="showBrowerTip" @click="openTip">
		<image class="brower-tip-img" src="@/static/open-brower-tip.png" mode=""></image>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				showBrowerTip: false
			}
		},
		methods:{
			openTip(){
				this.showBrowerTip = !this.showBrowerTip;
			}
		}
	}
</script>

<style scoped>
	.brower-tip-view {
		position: fixed;
		top: 0;
		left: 0;
		padding: 15px;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.5);
		z-index: 99999;
		box-sizing: border-box;
		text-align: right;
	}
	.brower-tip-img {
		width: 256px;
		height: 60px;
	}
</style>
