<template>
	<view class="empty" :style="{marginTop:`${top}rpx`}">
	    <image class="image" :style="{width:`${imgWidth}rpx`}" :src="img" mode="widthFix"></image>
	    <text class="empty-text">{{ msg }}</text>
		<view class="e-btn" v-if="button" @tap="btnTap"><text class="e-btn-text">{{btnText}}</text></view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		props:{
			msg:{
				type:String,
				default:'暂无数据'
			},
			img:{
				type:String,
				default:'/static/images/wsj.png'
			},
			top:{
				type:[String,Number],
				default:300
			},
			button:{
				type:Boolean,
				default:false
			},
			btnText:{
				type:String,
				default:''
			},
			imgWidth:{
				type:[String,Number],
				default:300
			}
		},
		methods:{
			btnTap(){
				console.log('btnTap')
				this.$emit('btnCallback')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.empty{
		// background-color: #007AFF;
		text-align: center;
		margin: 0 auto;
	}
	.image{
		// width: 300rpx;
		display: block;
		margin: 0 auto;
	}
	.empty-text{
		font-size: 30rpx;
		margin-top: 97rpx;
		color: #FFFFFF;
		display: block;
	}
	.e-btn{
		margin-top: 97rpx;
		text-align: center;
	}
	.e-btn-text{
		padding: 20rpx 50rpx;
		background-color: #F6A704;
		border-radius: 70rpx;
		color: #FFFFFF;
		font-size: 34rpx;
	}
</style>
