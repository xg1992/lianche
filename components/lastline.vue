<template>
	<view class="last-line">
		<text class="last-line-text" :style="{'background-color': bgcolor,color: textcolor}">{{text ? text : '已经到底了~'}}</text>
	</view>
</template>

<script>
export default {
	props: ['bgcolor','textcolor','text']
}
</script>

<style>
.last-line {
	border-top: 1px solid #dfdfdf;
	margin-top: 15px 15px 0;
	padding-bottom: 15px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.last-line-text {
	background-color: #f1f1f1;
	color: #999;
	padding: 0 10px;
	margin-top: -10px;
}
</style>
