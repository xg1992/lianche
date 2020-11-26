<template>
	<view>
		<view class="pd15 h_center jc_sb">
			<text class="mgr10 colorb3">考试时间</text>
			<text class="f_grow" @click="showDate1">{{date}}</text>
			<text class="iconfont icon-lc-12 " style="font-size:50rpx;" @click="showDate1"></text>
		</view>
		<view class="pd15 h_center jc_sb">
			<text class="mgr10 colorb3">考试地址</text>
			<input type="text" :value="address" placeholder="输入地址" class="f_grow" @input="upaddress"/>
		</view>
		<view class="pd15 font24" style="color:#FF6562">报名成功才能填写！请勿乱填</view>
		<view class="upbtn" @click="update">提交</view>
		<graceDate :show="show1" :isTime="true" v-on:changeDate="changeDate1" v-on:closeDate="closeDate1"></graceDate>
	</view>
</template>


<script>
	import graceDate from '../../graceUI/components/graceDate.vue'
	export default {
		components: {
			graceDate
		},
		data() {
			return {
				date1: '点击选择',
				show1: false,
				item:'',
				date:'请选择时间',
				address:''
			}
		},
		onLoad(options) {
			// console.log(options.item)
			this.item=JSON.parse(options.item)
			if(this.item.info!=''){
				this.address=this.item.info.address
				this.date=this.item.info.exam_time
			}
			
		},
		load() {
			let that=this
			that.$api.request('My/LearnSpeed/stuSpeedList', {}).then(res => {
				// that.$api.Toast(res.msg)
				that.list=res.data
				// console.log(that.list)
			})
		},
		methods: {
			closeDate1() {
				this.show1 = false;
			},
			showDate1() {
				this.show1 = true;
			},
			changeDate1(e) {
				console.log(e)
				this.date = e;
				this.show1 = false;
			},
			upaddress(e){
				this.address=e.detail.value
			},
			update(){
				let that=this
				if(this.date=='请选择时间'){that.$api.Toast('请选择时间');}
				if(this.address==''){that.$api.Toast('请输入地址');}
				that.$api.request('My/LearnSpeed/setExamInfo', {lId:that.item.id,date:this.date,address:that.address}).then(res => {
					that.$api.Toast(res.msg)
					setTimeout(function () {
						if(res.res==1){uni.navigateBack({delta: 1});}
					}, 1300) 
				})
			},
		},
		
	}
</script>

<style>
.grace-date{background-color: #191C2F!important;color: #fff;}
.grace-date-days .items {background: #212438!important;}
.grace-date-days .current{background: #F6A704!important;}
.grace-date-close text:last-child {color: #F6A704!important;}
.upbtn{border-radius: 16rpx;background-color:#F6A704 ;color:white;margin: auto;height: 88rpx;line-height: 88rpx;text-align: center;width: 95%;margin: auto;}
</style>
