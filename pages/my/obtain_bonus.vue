<template>
	<view>
		<view class="pd15 font26 colorb3" style="background: #24263A;">
			获取的奖励金，在购买商品的时候最高抵扣30%现金！
		</view>
		<view class="pd15 h_center jc_sb botom" v-for="(n,idx) in list" :key='idx'>
			<text>{{n.title}}</text>
			<text><text class="colorzth">+{{n.num}}</text>奖励金</text>
			<navigator :url="n.url" hover-class="none" class="nowgo center" :open-type="n.opentype">立刻去</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{title:'每日签到',opentype:'switchTab',num:8,url:'/pages/my/my'},
					{title:'培训预约',opentype:'switchTab',num:15,url:'/pages/appointment/appointment'},
					{title:'发布视频',opentype:'switchTab',num:10,url:'/pages/release/release'},
					{title:'培训笔记',opentype:'navigate',num:20,url:'/pages/my/record'},
					{title:'邀请朋友',opentype:'navigate',num:150,url:'/pages/my/Invitation'},
					{title:'邀请分校',opentype:'navigate',num:1000,url:'/pages/my/Invitation'},
					{title:'培训驾校',opentype:'navigate',num:1500,url:'/pages/my/Invitation'}
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.nowgo{width:120rpx;height:48rpx;background:#F6A704;border-radius:8rpx;font-size:26rpx;}
</style>
