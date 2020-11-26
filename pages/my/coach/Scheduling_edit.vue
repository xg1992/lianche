<template>
	<view class="main">
		<!-- <view class="pd15 h_center">
			<text class="pdy20">{{all.person_name}}</text>
			<text>{{all.mobile}}</text>
		</view> -->
		<view class="list_box address" @tap="addressTap">
			<text>{{selectAddress&&selectAddress.name||'选择教练以前绑定的训练场'}}</text>
			<text class="iconfont icon-lc-21" style="color: #647ee6;"></text>
		</view>
		<view class="list_box" v-for="(i,idx) in list" :key='idx'>
			<view class="mc_box center" v-if="i.isEdit==0">不可操作</view>
			<view class="pd15 h_center jc_sb botom">
				<text>{{i.periodName}} （{{i.startTime + '-' + i.endTime}})</text>
				<switch @change="checkoff($event,idx)" color='#F6A704' :checked="i.isOpen==1" />
			</view>
			<view class="">
				<view class="pd15 h_center jc_sb botom">
					<text>科目</text>
					<view class="h_center">
						<view class="sku_btn" :class="i.subject==1?'cu_cur':''" @click="subject(idx,1)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.subject==1"></text>
							科目二
						</view>
						<view class="sku_btn" :class="i.subject==2?'cu_cur':''" @click="subject(idx,2)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.subject==2"></text>
							科目三
						</view>
					</view>
				</view>
				<view class="pd15 h_center jc_sb botom">
					<text>车型</text>
					<view class="h_center">
						<view class="sku_btn" :class="i.drivingType==1?'cu_cur':''" @click="driving(idx,1)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.drivingType==1"></text>
							C1
						</view>
						<view class="sku_btn" :class="i.drivingType==2?'cu_cur':''" @click="driving(idx,2)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.drivingType==2"></text>
							C2
						</view>
					</view>
				</view>
				<view class="pd15 h_center jc_sb">
					<text>预约人数</text>
					<view class="h_center num_box">
						<view class="num_item" @click="sum(idx)">-</view>
						<input type="text" class="num_item" :value="i.setQuota" @input="numinput($event,idx)" maxlength="2" />
						<view class="num_item" @click="plus(idx)">+</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list_box pepole">
			<view class="h_center jc_sb botom" style="padding-bottom: 30rpx;">
				<text>指定人员名单</text>
				<view class="h_center colorb3" @click="gotolist">
					<image src="/static/+.png" mode="" style="width: 36rpx;height: 36rpx;margin-right: 17rpx;"></image>
					<text>添加</text>
				</view>
			</view>
			<view class="h_center f_wrap" style="margin-top: 30rpx;">
				<view class="stu_btn" v-for="(i,idx) in topUser" :key='idx'>
					<image src="/static/lc-35.png" class="del_icon" @click="deluser(idx,i.uid)"></image>
					{{i.person_name}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				list: [],
				id: '',
				info: '',
				topUser: [],
				ids:[]
			}
		},
		computed:{
			...mapGetters(['userInfo','selectAddress','schedulingInfo']),
			platform(){
				return this.$api.platform
			}
		},
		onLoad(options) {
			this.id = options.id
			this.load()
		},
		onShow() {
			let schedulingInfo = this.schedulingInfo
			if(schedulingInfo){
				this.topUser = schedulingInfo.userlist
				this.ids = schedulingInfo.ids
			}
			console.log(schedulingInfo)
		},
		onNavigationBarButtonTap(e) {
			console.log(e)
			this.Submission()
		},
		methods: {
			addressTap(){
				uni.navigateTo({
					url:'./address/list?isSelect=true'
				})
			},
			load() {
				let that = this
				that.$api.request('Train/TrainClass/getTrainClassInfo', {
					classId: this.id
				}).then(res => {
					// console.log(res)
					this.info = res.data
					this.info.period_schedule = Object.values(JSON.parse(this.info.period_schedule))
					if(this.info.special_student&&this.info.special_student.length>0){
						this.topUser = this.info.special_student
						let ids = []
						this.info.special_student.forEach(item=>{
							ids.push(item.uid)
						})
						this.ids = ids
					}
					let list = this.info.period_schedule
					for (let i = 0; i < list.length; i++) {
						let isOpen = !(list[i].drivingType == 0 && list[i].subject == 0 && list[i].setQuota == 0)
						let item = {
							drivingType: isOpen ? list[i].drivingType : 1,
							subject: isOpen ? list[i].subject : 1,
							setQuota: isOpen ? list[i].setQuota : 4,
							isOpen: isOpen ? 1 : 0
						}
						list[i] = Object.assign(list[i], item)
					}
					this.list = list
					if(this.info.trainAddress){
						let trainAddress = JSON.parse(JSON.stringify(this.info.trainAddress))
						trainAddress['trainAddressId'] = trainAddress.trainAddressId || trainAddress.id
						this.$store.commit('setSelectAddress',trainAddress)
					}
					console.log(this.list)
				})
			},
			sum(idx) {
				let setQuota = this.list[idx].setQuota
				setQuota = setQuota > 0 ? --setQuota : 0
				this.list[idx].setQuota = setQuota
			},
			plus(idx) {
				let setQuota = this.list[idx].setQuota
				setQuota = ++setQuota
				this.list[idx].setQuota = setQuota
			},
			numinput(e, idx) {
				// console.log(e.detail.value,idx)
				this.list[idx].setQuota = e.detail.value

			},
			subject(idx, stu) {
				this.list[idx].subject = stu
			},
			driving(idx, stu) {
				this.list[idx].drivingType = stu
			},
			checkoff(e, idx) {
				if (e.target.value) {
					// this.list[idx].isOpen=2
					this.$set(this.list[idx], 'isOpen', 1)
				} else {
					// this.list[idx].isOpen=1
					this.$set(this.list[idx], 'isOpen', 0)
				}
			},
			deluser(idx, id) {
				this.topUser.splice(idx, 1)
				this.ids.splice(idx, 1)
				console.log(this.ids)
			},
			gotolist() {
				let ids = []
				for (let i = 0; i < this.topUser.length; i++) {
					ids.push(this.topUser[i].uid)
				}
				console.log(this.info.coach_id)
				uni.navigateTo({
					url: 'list?type=2&day=' + this.day + '&ids=' + ids.join() + '&classId=' + this.info.id + '&coachId=' + this.info.coach_id,
				});
			},
			Submission() {
				console.log(this.ids)
				if(!this.selectAddress){
					this.$api.Toast('请选择地址');
					return false
				}
				let list = JSON.parse(JSON.stringify(this.list))
				let classInfo = {}
				list.forEach((item,index) => {
					if (item.isOpen == 0) {
						item.setQuota = 0
						item.subject = 0
						item.drivingType = 0
					}
					classInfo[index+1] = item
				})
				this.$api.request('Train/TrainClass/editTrainClass', {
					classId: this.id,
					classInfo: JSON.stringify(classInfo),
					specialStudent: this.ids.join(','),
					trainAddressId:this.selectAddress.trainAddressId
				}).then(res => {
					// console.log(res)
					this.$api.Toast(res.msg)
					if (res.res == 1) {
						setTimeout(function() {
							wx.navigateBack({
								delta: 1
							})
						}, 1000)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.main{
		padding-bottom: 30rpx;
	}
	.date_item {
		text-align: center;
		width: 106rpx;
	}

	.week_box {
		padding: 22rpx 0;
		font-size: 32rpx;
	}

	.day_box {
		height: 72rpx;
		width: 72rpx;
		font-size: 32rpx;
		position: relative;
		line-height: 72rpx;
		border: 1rpx solid #3A3C55;
		border-radius: 50%;
		margin: auto;
		background-color: #3A3C55;
	}

	.day_cur {
		border: 1rpx solid #F6A704;
		color: #F7F6F5;
		background-color: #F6A704;
	}

	.list_box {
		margin: 30rpx;
		border-radius: 16rpx;
		background-color: #2E3045;
		position: relative;
	}
	
	.address{
		padding: 42rpx 45rpx;
		@include fr(b,c);
	}

	.mc_box {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 999;
	}

	.stu_btn {
		width: 144rpx;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		background: #3A3C55;
		border-radius: 8rpx;
		margin-right: 8rpx;
		font-size: 26rpx;
		position: relative;
		margin-bottom: 14rpx;
	}

	.del_icon {
		position: absolute;
		right: 0;
		top: 0;
		height: 36rpx;
		width: 36rpx;
	}

	.sku_btn {
		width: 144rpx;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		background: #494C6A;
		border: 2rpx solid #494C6A;
		border-radius: 8rpx;
		margin-left: 20rpx;
		position: relative;
		overflow: hidden;
	}

	.cu_cur {
		border: 2rpx solid #F6A704;
	}

	.num_box {
		border-radius: 8rpx;
		background-color: #F7F6F5;
		border: 1rpx solid #3A3C55;
	}

	.num_item {
		width: 100rpx;
		height: 64rpx;
		font-size: 28rpx;
		color: #B3B3BB;
		text-align: center;
		line-height: 68rpx;
		background-color: #3A3C55;
	}

	.num_item:nth-child(2) {
		border-right: 1rpx solid #494C6A;
		border-left: 1rpx solid #494C6A;
		background-color: #494C6A;
		color: #FFFFFF
	}

	.qrbtn {
		height: 88rpx;
		background: #F6A704;
		border-radius: 16rpx;
		color: #FFFFFF;
		font-size: 34rpx;
	}

	/* #ifdef APP-PLUS */
	.icon-sel {
		position: absolute;
		bottom: -8rpx;
		right: -3rpx;
		color: #F6A704;
		font-size: 50rpx;
	}
	.icon-sel-ios{
		bottom: -8rpx;
	}
	.icon-sel-android{
		bottom: -10rpx;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN */
	.icon-sel {
		position: absolute;
		bottom: -8rpx;
		right: 0;
		color: #F6A704;
		font-size: 50rpx;
	}

	/* #endif */
	.btn {
		width: 95%;
		height: 88rpx;
		border-radius: 40rpx;
		background-color: #F6A704;
		color: white;
		margin: 30rpx auto;
	}

	.pepole {
		padding: 38rpx 43rpx 52rpx 43rpx;
	}
</style>
