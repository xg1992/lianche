<template>
	<view class="main">
		<view>
			<view class="h_center time">
				<view style="width: 100%;">
					<!-- 时段控制 -->
					<view class="h_center jc_fs mb40" v-for="(item,k) in schedule_config">
						<text class="t-left">{{ item.periodName }}</text>
						<view class="h_center">
							<picker class="input" :value="item.startTime" mode="time" start="09:01" end="21:01" @change="timeChange($event,item,1)">
								{{ item.startTime }}
							</picker>
							<text>-</text>
							<picker class="input" :value="item.endTime" mode="time" start="09:01" end="21:01" @change="timeChange($event,item,2)">
								{{ item.endTime }}
							</picker>
						</view>
						<switch class="switch" @change="checkoff($event,item)" color='#F6A704' :checked="item.isOpen" />
					</view>
					
					<!-- 车型、科目 -->
					<view class="h_center jc_fs mb40">
						<text class="t-left">车型</text>
						<view class="h_center">
							<view class="input input2" v-for="(item,index) in train_car_type" :class="item.select?'cu_cur':''" @click="item.select=!item.select">
								<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="item.select"></text>
								{{item.name}}
							</view>
						</view>
					</view>
					<view class="h_center jc_fs mb40">
						<text class="t-left">科目</text>
						<view class="h_center">
							<view class="input input2" v-for="(item,index) in subject" :class="item.select?'cu_cur':''" @click="item.select=!item.select">
								<text class="iconfont icon-lianchexiangmutubiao- icon-sel" :class="'icon-sel-'+platform" v-show="item.select"></text>
								{{item.name}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				train_type:1, // 排班方式
				train_car_type:[
					{
						select:false,
						value:1,
						name:'C1'
					},
					{
						select:false,
						value:2,
						name:'C2'
					}
				],
				subject:[
					{
						select:false,
						value:1,
						name:'科目二'
					},
					{
						select:false,
						value:2,
						name:'科目三'
					}
				],
				schedule_config:[ // 排班时段
					{
						key:1,
						isOpen:false,
						periodName:"上午",
						startTime:"08:00",
						endTime:"11:59"
					},
					{
						key:2,
						isOpen:false,
						periodName:"下午",
						startTime:"12:00",
						endTime:"17:59"
					},
					{
						key:3,
						isOpen:false,
						periodName:"晚上",
						startTime:"18:00",
						endTime:"21:59"
					}
				],
				apply_batch_config:[ 
					{
						key:1,
						is_start:1,
						periodName:"第一",
						startTime:"08:00",
						endTime:"09:59",
						speedIds:""
					},
					{
						key:2,
						is_start:1,
						periodName:"第二",
						startTime:"10:00",
						endTime:"14:59",
						speedIds:""
					}
				],
			}
		},
		computed:{
			platform(){
				return this.$api.platform
			}
		},
		onLoad(options) {
			this.train_type = options.type
			if(options.isEdit==1){
				this.getConfig()
			}
		},
		onNavigationBarButtonTap() {
			this.save()
		},
		methods:{
			getConfig(){
				this.$api.request('User/User/configByQiyeShow',{train_type:this.train_type}).then(res=>{
					try{
						console.log(res);
						// this.train_type = res.data.train_type
						let obj = JSON.parse(res.data.date.schedule_config)
						console.log(obj);
						let newData = Object.values(obj)
						for(let i=0;i<newData.length;i++){
							if(!newData[i].key){
								newData[i]['key'] = (i+1)
							}
						}
						let oldData = this.schedule_config.map(i=>{
							i.isOpen = false
							return i
						})
						console.log(oldData);
						for(let i of oldData){
							if(!newData.some(j=>j.key==i.key)){
								newData.push(i)
							}
						}
						newData.sort((i,j)=>i.key-j.key)
						console.log(newData);
						this.schedule_config = newData
						this.train_car_type = JSON.parse(res.data.date.train_car_type)
						this.subject = JSON.parse(res.data.date.subject)
						let apply_batch_config = JSON.parse(res.data.date.apply_batch_config)
						if(Object.keys(apply_batch_config).length!=0){
							this.apply_batch_config = apply_batch_config
						}
					}catch(e){
						console.log(e);
					}
				})
			},
			timeChange(e,item,type){
				if(type==1){
					this.$set(item,'startTime',e.detail.value)
				}else{
					this.$set(item,'endTime',e.detail.value)
				}
			},
			checkoff(e,item){
				this.$set(item,'isOpen',e.detail.value)
			},
			arrToObj(arr=[]){
				let obj = {}
				for(let i=0;i<arr.length;i++){
					obj[arr[i].key] = arr[i]
				}
				return obj
			},
			save(){
				// 时段配置
				let arr = this.schedule_config.filter(i=>i.isOpen)
				if(arr.length==0){
					return this.$api.Toast('请至少选择一个时段')
				}
				let obj = this.arrToObj(arr)
				let schedule_config = JSON.stringify(obj)
				// 车型
				let t_s_arr = this.train_car_type.filter(i=>i.select)
				if(t_s_arr.length==0){
					return this.$api.Toast('请至少选择一个车型')
				}
				let train_car_type = JSON.stringify(this.train_car_type)
				// 科目
				let s_s_arr = this.subject.filter(i=>i.select)
				if(s_s_arr.length==0){
					return this.$api.Toast('请至少选择一个科目')
				}
				let subject = JSON.stringify(this.subject)
				// 批次
				let apply = this.arrToObj(this.apply_batch_config)
				let apply_batch_config = JSON.stringify(apply)
				console.log(apply_batch_config);
				// 规则类型
				let train_type = this.train_type
				let params = {
					train_type,
					schedule_config,
					train_car_type,
					subject,
					apply_batch_config
				}
				this.$api.request('User/User/configByQiye',params).then(res=>{
					uni.showToast({
						title:'保存成功',
						icon:'none',
						mask:true
					})
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
				})
			}
		}
	}
</script>

<style lang="scss">
	.line{
		@include size(750rpx,20rpx);
		background-color: #2E3045;
	}
	.list {
		padding: 0 30rpx;
		height: 112rpx;
		border-top: 1rpx solid #2E3045;
	}
	
	.time{
		padding: 30rpx;
		margin-top: 40rpx;
	}
	
	.t-left{
		display: inline-block;
		min-width: 130rpx;
	}
	
	.input{
		width: 160rpx;
		height: 64rpx;
		background-color: #2E3045;
		border-radius: 8rpx;
		margin: 0 20rpx;
		text-align: center;
		line-height: 64rpx;
		position: relative;
		overflow: hidden;
	}
	
	.input2{
		margin-right: 36rpx;
	}
	
	.switch{
		transform: scale(.8);
		margin-left: 40rpx;
	}
	
	.sleimg {
		width: 48rpx;
		height: 48rpx;
		margin-right: 25rpx;
	}
	
	.name {
		
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
	
	.icon-sel {
		position: absolute;
		right: -3rpx;
		color: #F6A704;
		font-size: 50rpx;
		z-index: 999;
	}
	.icon-sel-ios{
		bottom: -8rpx;
	}
	.icon-sel-android{
		bottom: -10rpx;
	}
	.mb40{
		margin-bottom: 40rpx;
	}
</style>
