<template>
	<view class="rule-detail">
		<view class="rule-detail-body">
			<view class="rule-top">
				<view class="rule-detail-h2">
					优惠券领取
				</view>
				<view class="rule-content">
					成为链车注册会员，并满足商家指定条件，在指定时间内均可领取优惠券。会员登陆进入“我的优惠券”，可查询优惠详情。
				</view>
			</view>
			<view class="circle-box">
				<view class="circle-left"></view>
				<view class="circle-center"></view>
				<view class="circle-right"></view>
			</view>
			<view class="rule-bottom">
				<view class="rule-detail-h2">
					优惠券类型
				</view>
				<view class="rule-content">
					1.商家自营：由商家直接发布或销售的优惠券；<br />
					2.合作商家代发：合作方作为宣传渠道，帮助商家对优惠券进行二次发放或销售；<br />
					3.优惠券的使用及核销事宜归发券主体商家负责，会员需注意券面上标示的主体信息及核销地点或门店，按要求使用。
				</view>
				<view class="rule-detail-h2 mgto40">
					优惠券使用说明
				</view>
				<view class="rule-content">
					1.优惠券仅限在有效期内使用，过期后自动作废；<br />
					2.商家标注的特殊商品不能使用优惠券；<br />
					3.一个订单只能使用一张优惠券，优惠券不可合并；<br />
					4.每张优惠券只能使用一次；<br />
					5.使用优惠券的订单被取消后（已核销券码），优惠券不退回给用户；<br />
					6.原则上优惠券不允许转让、二次销售，如发生任何违规情况，商家有权取消优惠券使用；<br />
					7.使用前，请确保了解本规则及券面说明信息，如发生任何违规情况，商家有权取消优惠券使用；<br />
					8.详细使用流程及商家信息，可联系客服人员咨询。<br />
					注意：优惠券发放及使用政策最终解释权归优惠券发放商家所有。
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style scoped>
.rule-detail {
	box-sizing: border-box;
	width: 100%;
	height: 100vh;
	padding: 30rpx;
}
.rule-detail-body {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	border-radius: 20rpx;
	overflow: auto;
}
.rule-top, .rule-bottom {
	background-color: #fff;
	padding: 30rpx;
}
.rule-bottom {
	flex: 1;
	overflow: auto;
}
.rule-detail-h2 {
	margin-bottom: 30rpx;
	font-size: 36rpx;
	color: #313131;
}
.rule-content {
	color: #707070;
	line-height: 20px;
}
.circle-box {
	width: 100%;
	display: flex;
	justify-content: space-between;
}
.circle-left {
	width: 20px;
	height: 20px;
	background-image: radial-gradient(circle farthest-side at 0 10px,transparent 10px,white 10px);
}
.circle-center {
	position: relative;
	flex: 1;
	height: 20px;
	background-color: #fff;
}
.circle-center::before {
	content: '';
	position: absolute;
	left: 0;
	top: 10px;
	display: inline-block;
	width: 100%;
	height: 0;
	border-top: 1px dashed #C9C9CA;
}
.circle-right {
	width: 20px;
	height: 20px;
	background-image: radial-gradient(circle farthest-side at 20px 10px,transparent 10px,white 10px);
}
</style>
