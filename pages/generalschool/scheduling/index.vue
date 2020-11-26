<template>
	<view class="main" v-if="ready">
		<!-- 日期 -->
		<view class="h_center jc_sa" style="padding: 32rpx 0;background-color: #24263A;">
			<view class="date_item" v-for="(i,idx) in date.dates" :key='idx'>
				<view class="week_box">
					{{i.week}}
				</view>
				<view class="day_box" :class="i.cur?'day_cur':''" @click="clickday(idx)">
					{{i.day}}
				</view>
			</view>
		</view>
		<!-- 选择地址 -->
		<view class="list_box address" @tap="addressTap">
			<text>{{selectAddress&&selectAddress.name||'选择教练以前绑定的训练场'}}</text>
			<text class="iconfont icon-lc-21" style="color: #647ee6;"></text>
		</view>
		<!-- 排班时段 -->
		<view class="list_box" v-for="(i,idx) in list" :key='idx'>
			<!-- 时段开关 -->
			<view class="mc_box center" v-if="i.isEdit==0">不可操作</view>
			<view class="pd20 h_center jc_sb">
				<text>{{i.periodName}}（{{i.startTime + '-' + i.endTime}}）</text>
				<switch @change="checkoff($event,idx)" color='#F6A704' :checked="i.isOpen" />
			</view>
			<view class="" v-show="i.isOpen==1">
				<!-- 科目 -->
				<!-- <view class="pd20 h_center jc_sb">
					<text>科目</text>
					<view class="h_center"> -->
						<!-- <view class="sku_btn" :class="i.subject==1?'cu_cur':''" @click="subject(idx,1)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.subject==1"></text>
							科目二
						</view>
						<view class="sku_btn" :class="i.subject==2?'cu_cur':''" @click="subject(idx,2)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.subject==2"></text>
							科目三
						</view> -->
						<!-- <view class="sku_btn" :class="i.subject==j.value?'cu_cur':''" v-for="j in subject" @click="onSubject(i,j)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.subject==j.value"></text>
							{{j.name}}
						</view>
					</view>
				</view> -->
				<!-- 车型 -->
				<!-- <view class="pd20 h_center jc_sb">
					<text>车型</text>
					<view class="h_center"> -->
						<!-- <view class="sku_btn" :class="i.driving_type==1?'cu_cur':''" @click="driving(idx,1)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.driving_type==1"></text>
							C1
						</view>
						<view class="sku_btn" :class="i.driving_type==2?'cu_cur':''" @click="driving(idx,2)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.driving_type==2"></text>
							C2
						</view> -->
						<!-- <view class="sku_btn" :class="i.driving_type==j.value?'cu_cur':''" v-for="j in train_car_type" @click="onDriving(i,j)">
							<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="i.driving_type==j.value"></text>
							{{j.name}}
						</view>
					</view>
				</view> -->
				<!-- 预约人数 -->
				<view class="pd20 h_center jc_sb" v-if="type==1">
					<text>预约人数</text>
					<view class="h_center num_box">
						<view class="num_item" @click="sum(idx)">-</view>
						<input type="text" class="num_item" :value="i.setQuota" @input="numinput($event,idx)" maxlength="2" />
						<view class="num_item" @click="plus(idx)">+</view>
					</view>
				</view>
				<!-- 教练名单 -->
				<block v-else-if="type==2">
					<view class="pd20 h_center jc_sb">
						<text>添加教练名单</text>
						<view class="h_center" @click="selectCoach(idx)">
							<text class="iconfont icon-lc-62"></text>添加
						</view>
					</view>
					<view class="pd20 btop" v-for="n in i.coachList">
						<view class="coach t_center jc_fs">
							<text class="coach-name">{{n.person_name}}:</text>
							<!-- 选择科目、车型 -->
							<view>
								<view class="select h_center jc_sb">
									<view class="sku_btn mb20" :class="n.driving_type==j.value?'cu_cur':''" v-for="j in train_car_type" @click="onDriving(n,j)">
										<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="n.driving_type==j.value"></text>
										{{j.name}}
									</view>
								</view>
								<view class="select h_center jc_sb">
									<view class="sku_btn mb20" :class="n.subject==j.value?'cu_cur':''" v-for="j in subject" @click="onSubject(n,j)">
										<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="n.subject==j.value"></text>
										{{j.name}}
									</view>
								</view>
							</view>
							
						</view>
						<!-- 学员列表 -->
						<view class="student t_center jc_fs">
							<view class="h_center f_wrap">
								<view class="sku_btn stu-item mb20" v-if="n.students" v-for="j in n.students">
									{{j.person_name}}
								</view>
								<!-- 添加学员按钮 -->
								<view class="sku_btn stu-item mb20" @click="selectStudents(idx,n.uid)">
									<text class="iconfont icon-lc-53"></text>
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				type:0,// 排班方式
				date: {},// 日期
				list: [],// 排班数据
				config:[],// 排班配置
				subject:[],
				train_car_type:[],
				ready: false
			}
		},
		computed: {
			...mapGetters(['userInfo', 'selectAddress', 'schedulingInfo']),
			platform() {
				return this.$api.platform
			}
		},
		onLoad() {
			let that = this
			let month = new Date().getMonth() + 1
			let year_month = new Date().getFullYear() + '-' + (month < 10 ? '0' + month : month)
			let list = []
			for (let i = 0; i < 7; i++) {
				let item = {
					week: that.GetDateStr(i)[1],
					day: that.GetDateStr(i)[0],
					cur: false,
					timestamp: year_month + '-' + that.GetDateStr(i)[0]
				};
				list.push(item)
			}
			list[0].day = '今'
			list[0].cur = true
			let date = {
				dates: [],
				days: ''
			};
			date.days = new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'
			date.dates = list
			this.date = date
			console.log(date)
			this.getConfig()
		},
		onShow() {
			console.log(this.schedulingInfo)
			if (this.schedulingInfo) {
				// 教练
				let {
					userlist,
					ids,
					index,
					coachId,
					type
				} = this.schedulingInfo
				index = Number(index)
				if (type == 1) {
					let coachList = userlist.map(item => {
						return {
							subject:0,
							driving_type:0,
							students: [],
							...item
						}
					})
					this.list[index].coachList = coachList
				} else if (type == 2) {
					// 学员
					let coach = this.list[index].coachList.find(i => i.uid == coachId)
					this.$set(coach, 'students', userlist)
				}
				// this.$store.commit('schedulingInfo', null)
			}else if(this.ready&&this.type==2){
				this.loadData()
			}
		},
		onNavigationBarButtonTap(e) {
			this.Submission()
		},
		methods: {
			addressTap() {
				uni.navigateTo({
					url: '/pages/my/coach/address/list?isSelect=true'
				})
			},
			clickday(idx) {
				if(this.type==1){
					this.date.dates[idx].cur = !this.date.dates[idx].cur
				}else{
					this.date.dates.forEach(i => i.cur = false)
					this.date.dates[idx].cur = true
					this.loadData()
				}
			},
			// 加载排班配置
			getConfig() {
				let date = this.date.dates.find(i => i.cur)
				console.log(date.timestamp);
				this.$api.request('User/User/configByQiyeShow', {
					timestamp: date.timestamp
				}).then(res => {
					console.log(res)
					try{
						this.type = res.data.train_type
						let config = Object.values(JSON.parse(res.data.date.schedule_config))
						if (res.data.train_type==2) {//2
							let subject = JSON.parse(res.data.date.subject)
							let train_car_type = JSON.parse(res.data.date.train_car_type)
							this.subject = subject.filter(i=>i.select)
							this.train_car_type = train_car_type.filter(i=>i.select)
							for (let i = 0; i < config.length; i++) {
								let item = {
									// driving_type: this.train_car_type[0].value,
									// subject: this.subject[0].value,
									setQuota: 4,
									isOpen: true,
									coachList:[]
								}
								config[i] = Object.assign(config[i], item)
							}
							console.log(this.train_car_type);
							console.log(config)
							this.config = config
							this.loadData()
						} else {
							// this.subject = [{value:1,name:'科目二'},{value:2,name:'科目三'}]
							// this.train_car_type = [{value:1,name:'C1'},{value:2,name:'C2'}]
							// for (let i = 0; i < config.length; i++) {
							// 	let item = {
							// 		driving_type: 1,
							// 		subject: 1,
							// 		setQuota: 4,
							// 		isOpen: true,
							// 		coachList:[]
							// 	}
							// 	config[i] = Object.assign(config[i], item)
							// }
							// this.list = config
							// this.ready = true
							uni.redirectTo({
								url:'/pages/my/coach/Scheduling'
							})
						}
					}catch(e){
						console.log(e);
					}
				})
			},
			// 加载排班数据
			loadData() {
				let date = this.date.dates.find(i => i.cur)
				let trainAddressId = this.selectAddress ? this.selectAddress.trainAddressId : 0
				let params = {
					date: date.timestamp,
					train_address_id: trainAddressId
				}
				this.$api.request('Train/QiyeScheduling/getTrainAutonomyClass', params).then(res => {
					if(res.data.length==0){
						this.list = JSON.parse(JSON.stringify(this.config))
					}else{
						let list = Object.values(res.data)
						list.forEach(i=>{
							i.isOpen=true
							i.driving_type = i.drivingType || i.driving_type
						})
						this.list = list
					}
					this.ready = true
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
			onSubject(i, j) {
				this.$set(i,'subject',j.value)
			},
			onDriving(i, j) {
				this.$set(i,'driving_type',j.value)
			},
			checkoff(e, idx) {
				// console.log(e.target.value,idx)
				this.list[idx].isOpen = e.target.value
			},
			Submission() {
				let that = this
				let date = this.date
				let day = []
				for (let i = 0; i < date.dates.length; i++) {
					if (date.dates[i].cur == true) {
						day.push(date.dates[i].timestamp)
					}
				}
				if (day == '') {
					this.$api.Toast('请选择日期');
					return false
				}
				if (!this.selectAddress) {
					this.$api.Toast('请选择训练场');
					return false
				}
				console.log(this.userInfo)
				let list = JSON.parse(JSON.stringify(this.list))
				let classInfo = {}
				let error = ''
				list.forEach((item, index) => {
					let coach = {}
					console.log(item);
					if(this.type==2){
						if(item.isOpen){
							if(item.coachList.length==0){
								return error = '请添加教练'
							}
						}
						item.coachList.forEach(i => {
							console.log(i);
							if(i.driving_type==0&&item.isOpen){
								return error = `请为教练【${i.person_name}】选择培训车型`
							}
							if(i.subject==0&&item.isOpen){
								return error = `请为教练【${i.person_name}】选择培训科目`
							}
							if (i.students&&i.students.length>0) {
								coach[i.uid] = {}
								coach[i.uid]['students'] = i.students.map(j => j.uid)
								coach[i.uid]['subject'] = i.subject
								coach[i.uid]['driving_type'] = i.driving_type
							}else if(item.isOpen){
								return error = '请添加学员'
							}
						})
					}
					let train_car_type = this.train_car_type.map(i=>i.value)
					let subject = this.subject.map(i=>i.value)
					// item['driving_type'] = item.drivingType || item.driving_type
					// item['subject'] = item.subject
					item['coachs'] = coach
					item['period'] = item.key
					if(item.isOpen){
						classInfo[item.key] = item
					}
					delete item.coachList
				})
				console.log(classInfo);
				if(error!=='') {
					return that.$api.Toast(error)
				}
				that.$api.request('Train/QiyeScheduling/addTrainAutonomyClass', {
					date: day.join(),
					bodys: JSON.stringify(classInfo),
					train_address_id: this.selectAddress.trainAddressId
				}).then(res => {
					console.log(res)
					that.$api.Toast('保存成功')
					this.$store.commit('schedulingInfo', null)
				})
			},
			GetDateStr(AddDayCount) {
				let dd = new Date();
				dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
				let d = /^\d$/.test(dd.getDate()) ? dd.getDate() : dd.getDate();
				d = d < 10 ? '0' + d : d
				let a = new Array("日", "一", "二", "三", "四", "五", "六", "日", "一", "二", "三", "四", "五", "六", "日");
				let week = new Date().getDay() + AddDayCount;
				let w = a[week];
				return [d, w];
			},
			selectCoach(index) {
				if (!this.selectAddress) {
					this.$api.Toast('请先选择训练场');
					return false
				}
				let ids = []
				for (let i = 0; i < this.list[index].coachList.length; i++) {
					ids.push(this.list[index].coachList[i].uid)
				}
				console.log(this.list[index].coachList)
				uni.navigateTo({
					url: 'select?type=1&ids=' + ids.join() + '&index=' + index
				});
			},
			selectStudents(index, coachId) {
				let ids = []
				let coach = this.list[index].coachList.find(i => i.uid == coachId)
				if (coach && coach.students) {
					for (let i = 0; i < coach.students.length; i++) {
						ids.push(coach.students[i].uid)
					}
				}
				uni.navigateTo({
					url: 'select?type=2&ids=' + ids.join() + '&index=' + index + '&coachId=' + coachId
				});
			}
		}
	}
</script>

<style lang="scss">
	.main {
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
	}

	.address {
		padding: 42rpx 45rpx;
		@include fr(b, c);
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
	
	.small{
		width: 110rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.cu_cur {
		border: 2rpx solid #F6A704;
	}

	.num_box {
		border-radius: 8rpx;
		background-color: #3A3C55;
		border: 1rpx solid #3A3C55;
		overflow: hidden;
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
		right: -3rpx;
		color: #F6A704;
		font-size: 50rpx;
		z-index: 999;
	}

	.icon-sel-ios {
		bottom: -8rpx;
	}

	.icon-sel-android {
		bottom: -10rpx;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN */
	.icon-sel {
		position: absolute;
		bottom: -7rpx;
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

	.icon-lc-62 {
		color: #494C6A;
		transform: rotate(45deg);
		margin-right: 10rpx;
	}

	.warp {
		flex-wrap: wrap;
	}

	.mb20 {
		margin-bottom: 20rpx;
	}
	
	.btop{
		border-top: 1px solid #24263A;
	}
	
	.coach{
		// height: 80rpx;
		.select{
			
		}
		.coach-name{
			flex-shrink: 0;
			width: 110rpx;
		}
	}
	
	
	.student{
		// margin-top: 20rpx;
		padding-left: 110rpx;
	}
	
	.stu-item{
		// margin-left: 0;
		// margin-right: 20rpx;
	}
</style>
