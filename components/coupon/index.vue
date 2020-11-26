<template>
	<view class="c-coupon" :class="[`type-${type}`,`status-${status}`]">
		<view :class="[`coupon-tag-${tagType}`]" v-if="tagType">
			<text class="tag-text">{{tagType == 1 ? '自营' : '代发'}}</text>
		</view>
		<view class="c-left" @click.stop="onInfo">
			<view class="c-title">{{info.title}}</view>
			<view class="c-discount">
				<view :class="`c-discount-${type}`">{{info.price}}</view>
				<view class="c-discount-desc">{{info.discountDesc||''}}</view>
			</view>
			<view class="c-desc">{{info.desc}}</view>
			<view class="c-time">{{info.time}}</view>
		</view>
		<view class="c-right">
			<view :class="`c-btn-${btnType}`" @click.stop="onBtn">{{btnText}}</view>
			<view class="overdue"></view>
		</view>
		<view class="top-right">
			<text @click.stop="onTopRightText">{{topRightText}}</text>
			<text v-if="closable" class="close" @click.stop="onClose"></text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			type:{
				type:[Number,String],
				default:1
			},
			status:{
				type:[Number,String],
				default:1
			},
			closable:{
				type:Boolean,
				default:false
			},
			topRightText:{
				type:String,
				default:""
			},
			info:{
				type:Object,
				default:()=>{
					return{
						title:"悦顺模拟考试5折券悦顺模拟考试悦顺模拟考试",
						price:"50",
						discountDesc:"满5000可用",
						desc:"模拟考试使用；不可转让",
						time:"有效期：2020.11.01 - 2020.12.30"
					}
				}
			},
			btnText:{
				type:String,
				default:"领取"
			},
			btnType:{
				type:String,
				default:"default"
			},
			tagType: {
				default: 0
			}
		},
		data(){
			return{
				
			}
		},
		methods:{
			onInfo(){
				this.$emit('onInfo',this.info)
			},
			onTopRightText(){
				this.$emit('onTopRightText',this.info)
			},
			onBtn(){
				console.log('brn');
				this.$emit('onBtn',this.info)
			},
			onClose(){
				this.$emit('onClose',this.info)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-coupon{
		position: relative;
		@include fr(b,c);
		@include size(662rpx,309rpx);
		.c-left{
			padding-left: 40rpx;
			width: 460rpx;
			.c-title{
				@include font(30rpx,#F0F0F0);
				line-height: 30rpx;
				padding-left: 10rpx;
				@include ell();
			}
			.c-discount{
				margin-top: 39rpx;
				line-height: 60rpx;
				@include fr(s,b);
				.c-discount-desc{
					margin-left: 20rpx;
					@include font(28rpx,#F0F0F0);
					line-height: 40rpx;
				}
				.c-discount-2,.c-discount-1{
					@include fr(s,b);
					@include font(90rpx,#F0F0F0,bold);
				}
				.c-discount-2::after{
					content: "折";
				}
				.c-discount-1::after{
					content: "元";
					@include font(48rpx,#F0F0F0);
				}
			}
			.c-desc{
				margin-top: 20rpx;
				line-height: 24rpx;
				height: 48rpx;
				@include ell(2);
			}
			.c-time{
				margin-top: 17rpx;
				line-height: 24rpx;
			}
		}
		.c-right{
			width: 201rpx;
			@include fr(c,c);
			.c-btn-default,.c-btn-plain{
				@include size(152rpx,68rpx);
				border-radius: 34rpx;
				@include fr(c,c);
			}
			.c-btn-default{
				box-shadow: 0px 4px 3px 0px rgba(255, 97, 98, 0.24);
			}
			.c-btn-plain{
				border: 2rpx solid;
			}
			.overdue{
				display: none;
			}
		}
		.top-right{
			position: absolute;
			top: 20rpx;
			right: 27rpx;
			@include font(24rpx,#F0F0F0);
			@include fr(s,c);
			.close{
				display: inline-block;
				margin-left: 10rpx;
				background-image: url(static/close.png);
				background-size: cover;
				@include size(35rpx);
			}
		}
	}
	.type-2{
		background-image: url(static/coupon-bg-1.png);
		background-size: cover;
		.c-left{
			.c-desc,.c-time{
				@include font(24rpx,#B2B4FA);
			}
		}
		.c-right{
			.c-btn-default{
				background: linear-gradient(180deg, #FFFFFF, #D0CCFB);
				@include font(30rpx,#325EF9);
			}
		}
	}
	.type-1{
		background-image: url(static/coupon-bg-2.png);
		background-size: cover;
		.c-left{
			.c-desc,.c-time{
				@include font(24rpx,#F3D6D6);
			}
		}
		.c-right{
			.c-btn-default{
				background: linear-gradient(180deg, #FFFFFF, #FBD2BE);
				@include font(30rpx,#FF5F5F);
			}
		}
	}
	.status-2,.status-3{
		background-image: url(static/coupon-bg-3.png);
		background-size: cover;
		.c-left{
			.c-desc,.c-time{
				@include font(24rpx,#DFDFDF);
			}
		}
		.c-right{
			.c-btn-default{
				display: none;
			}
			.overdue{
				display: block;
				@include size(178rpx,140rpx);
				background-size: cover;
			}
		}
	}
	.status-2{
		.c-right{
			.overdue{
				background-image: url(static/overtime.png);
			}
		}
	}
	.status-3{
		.c-right{
			.overdue{
				background-image: url(static/overdue.png);
			}
		}
	}
	.coupon-tag-1,.coupon-tag-2 {
		box-sizing: border-box;
		position: absolute;
		top: -20rpx;
		left: -20rpx;
		width: 0;
		height: 0;
		border-top: 90rpx solid #FFCC00;
		border-right: 30rpx solid #FFCC00;
		border-left: 30rpx solid #FFCC00;
		border-bottom: 16rpx solid transparent;
		&::before {
			content: '';
			position: absolute;
			top: -90rpx;
			left: 30rpx;
			border-top: 10rpx solid transparent;
			border-right: 10rpx solid transparent;
			border-left: 10rpx solid #F6A704;
			border-bottom: 12rpx solid #F6A704;
		}
		.tag-text {
			position: absolute;
			top: -80rpx;
			left: 0rpx;
			width: 100%;
			height: 100%;
			line-height: 36rpx;
			display: flex;
			justify-content: center;
			color: #FF6562;
			box-sizing: border-box;
		}
	}
	.coupon-tag-2 {
		border-top-color:  #EA68A2;
		border-right-color: #EA68A2;
		border-left-color: #EA68A2;
		&::before {
			border-left-color: #A53266;
			border-bottom-color: #A53266;
		}
		.tag-text {
			color: #fff;
		}
	}
</style>
