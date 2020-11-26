<template>
	<view class="grace-dialog-shade" @tap.stop="closeDialogByShade" @touchmove.stop.prevent="stopFun" 
	:style="{backgroundColor:background, zIndex:zIndex, height:showIn ?'100%':'0px'}" v-show="showIn">
		<view class="grace-dialog"  :class="[showIn ? 'grace-shade-in' : 'grace-shade-out']" @tap.stop="stopFun" 
		:style="{width:width, borderRadius:borderRadius}">
			<view class="grace-dialog-title" v-if="isTitle" 
			:style="{
				fontSize:titleSize, color:titleColor, fontWeight:titleWeight?'bold':'', 
				background:titleBg, lineHeight:titleHeight}">{{title}}</view>
			<view class="grace-dialog-content" @tap.stop="stopFun"><slot name="content"></slot></view>
			<view class="grace-dialog-close-btn" 
			:style="{color:closeBtnColor, zIndex:zIndex+1}" v-if="isCloseBtn" @tap.stop="closeDialog"></view>
			<view class="bottom-btn" v-if="isBtns">
				<text class="cancel-btn" @click="closeDialog">{{cancelBtnText}}</text>
				<text class="confirm-btn" @click="confirm">{{confirmBtnText}}</text>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	name: "graceDialog",
	props: {
		show : {
			type : Boolean,
			default : false
		},
		width : {
			type : String,
			default : '580rpx'
		},
		isCloseBtn: {
			type : Boolean,
			default : true
		},
		closeBtnColor : {
			type : String,
			default : '#FF0036'
		},
		isTitle : {
			type : Boolean,
			default : true
		},
		title : {
			type : String,
			default : ''
		},
		titleBg : {
			type : String,
			default : ''
		},
		titleHeight : {
			type : String,
			default : '100rpx'
		},
		titleWeight : {
			type : Boolean,
			default : true
		},
		titleSize : {
			type : String,
			default : '28rpx'
		},
		titleColor : {
			type : String,
			default : '#333333'
		},
		isBtns : {
			type : Boolean,
			default : true
		},
		background:{
			type : String,
			default : 'rgba(0, 0, 0, 0.5)'
		},
		borderRadius : {
			type : String,
			default : '8rpx'
		},
		zIndex : {
			type : Number,
			default : 999
		},
		canCloseByShade:{
			type : Boolean,
			default : true
		},
		cancelBtnText: {
			default: '取消'
		},
		confirmBtnText: {
			default: '确定'
		},
		hasForm: {
			default: false
		}
	},
	data() {
		return {
			showIn : false
		}
	},
	created:function(){
		this.showIn = this.show;
	},
	watch:{
		show:function (val) {
			if(val){this.open();}else{this.hide();}
		}
	},
	methods:{
		closeDialogByShade:function(){
			if(this.canCloseByShade){this.closeDialog();}
		},
		closeDialog : function(){
			this.$emit('closeDialog');
			this.hide();
		},
		stopFun : function(){},
		open:function () {this.showIn = true;},
		hide:function () {this.showIn = false;},
		confirm(){
			this.$emit('confirm');
			if(!this.hasForm){ // 如果含有表单内容，需要外部调用hide关闭弹窗
				this.hide();
			}
		}
	}
}
</script>
<style scoped>
.grace-dialog-shade{position:fixed; width:100%; height:100%; overflow:hidden; left:0; top:0; bottom:0; z-index:9991; display:flex; justify-content:center; align-items:center;}
.grace-dialog{width:580rpx; background:#FFFFFF; position:relative; transition:all 200ms linear 0s;overflow: hidden;}
.grace-dialog-title{line-height:100rpx; font-size:30rpx; text-align:center;}
.grace-dialog-content{transition:all 200ms linear 0s;}
.grace-dialog-close-btn{position:absolute; z-index:9993; right:0px; top:0px; font-size:30rpx; width:80rpx; height:80rpx; line-height:80rpx; text-align:center; font-family:"grace-iconfont";}
.grace-dialog-close-btn:before{content:"\e632";}
.grace-shade-in{animation:grace-shade-in-a 200ms linear forwards;}
@keyframes grace-shade-in-a{0%{transform: scale(0.1); opacity:0;} 100%{transform: scale(1); opacity:1;}}
.grace-shade-out{animation:grace-shade-out-a 200ms ease-out forwards;}
@keyframes grace-shade-out-a{0%{transform: scale(1); opacity:1;} 100%{transform: scale(0.1); opacity:0;}}
.bottom-btn {display: flex; justify-content: space-between;border-top: 1px solid #f1f1f1;}
.confirm-btn,.cancel-btn {flex: 1;height: 100rpx; line-height: 100rpx; text-align: center;}
.confirm-btn {color: #fff;border-left: 1px solid #f1f1f1;background-color: #F6A704;}
.cancel-btn {color: #aaa;}
</style>