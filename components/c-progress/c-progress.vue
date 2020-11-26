<template>
	<view class="c-progress" :style="outStyle">
		<view class="c-progress-content" :style="inStyle"></view>
	</view>
</template>

<script>
	export default{
		props:{
			percent:{
				type:[Number,String],
				default:0
			},
			borderRadius:{
				type:[Number,String],
				default:8
			},
			strokeWidth:{
				type:[Number,String],
				default:16
			},
			activeColor:{
				type:String,
				default:"#F6A704"
			},
			backgroundColor:{
				type:String,
				default:"#FFFFFF"
			},
		},
		data(){
			return{
				
			}
		},
		computed:{
			outStyle(){
				return {
					height:`${this.strokeWidth}rpx`,
					backgroundColor:this.backgroundColor,
					borderRadius:`${this.borderRadius}rpx`
				}
			},
			inStyle(){
				return {
					backgroundColor:this.activeColor,
					borderRadius:`${this.borderRadius}rpx`,
					width:`${this.percent}%`
				}
			}
		}
	}
</script>

<style lang="scss">
	.c-progress{
		position: relative;
		width: 100%;
		border: 1rpx solid #e9e9f1;
		box-sizing: border-box;
		overflow: hidden;
	}
	.c-progress-content{
		height: 100%;
	}
</style>
