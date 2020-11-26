<template>
	<view>
		<view class="input_box center">
			<view class="h_center f_grow" style="background-color: #24263A;height: 80rpx;border-radius: 16rpx;">
				<view class="iconfont icon-lc-25 colorb3"></view>
				<input type="text" :value="username" :placeholder="type==1?'请输入教练姓名':'请输入学员姓名'" class="f_grow" confirm-type="search"
				 @confirm='search' />
			</view>
		</view>
		<view>
			<view class="list h_center" v-for="(i,idx) in list" :key='idx' @click="Checklist(idx)">
				<image :src="i.chose?'/static/Selected.png':'/static/default.png'" class="sleimg"></image>
				<image :src="i.avatar?$realSrc(i.avatar):'/static/tx.png'" class="tximg"></image>
				<view class="name">{{i.person_name}}</view>
				<text>{{i.mobile}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	const requestUrl = {
		1: 'User/Coach/getListCoachsByMyFb',
		2: 'User/Coach/getListStudentsByMyCoach'
	}
	const pageTitle = {
		1: '添加教练',
		2: '添加学员'
	}
	export default {
		data() {
			return {
				api: this.$api,
				type: 2,
				username: '',
				list: '',
				classId: '',
				coachId: '',
				ids: [],
				index:0
			}
		},
		onLoad(options) {
			this.index = options.index
			this.type = Number(options.type) // 1教练，2学员
			this.ids = options.ids.split(',').map(Number)
			this.coachId = options.coachId
			this.load()
			let title = pageTitle[this.type]
			uni.setNavigationBarTitle({
				title
			});
		},
		onNavigationBarButtonTap(e) {
			console.log(e)
			this.add()
		},
		methods: {
			load() {
				let that = this
				let act = requestUrl[this.type]
				that.$api.request(act, {
					truename: this.username,
					coach_id: this.coachId,
					person_name: this.username
				}).then(res => {
					console.log(res);
					let list = res.data.list
					for (let i = 0; i < list.length; i++) {
						if(this.ids.includes(list[i].uid)){
							list[i].chose = true
						}else{
							list[i].chose = false
						}
					}
					that.list = list
				})
			},
			search(e) {
				this.username = e.detail.value
				this.load()
			},
			Checklist(idx) {
				this.list[idx].chose = !this.list[idx].chose
			},
			add() {
				let that = this
				let ids = []
				let list = that.list
				let userlist = []
				for (let i = 0; i < list.length; i++) {
					if (list[i].chose) {
						userlist.push(list[i])
						ids.push(list[i].uid)
					}
				}
				let data = {
					userlist: userlist,
					ids: ids,
					index: this.index,
					coachId: this.coachId,
					type: this.type
				}
				console.log(data);
				this.$store.commit('schedulingInfo', data)
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	.input_box {
		margin: 30rpx;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.input_box .iconfont {
		margin: 0 26rpx;
	}

	.list {
		padding: 0 30rpx;
		height: 112rpx;
		border-top: 1rpx solid #2E3045;
	}

	.sleimg {
		width: 48rpx;
		height: 48rpx;
		margin-right: 53rpx;
	}

	.tximg {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		margin-right: 34rpx;
	}

	.name {
		width: 30%;
	}

	.btn {
		width: 95%;
		height: 88rpx;
		border-radius: 40rpx;
		background-color: #F6A704;
		color: white;
		position: fixed;
		bottom: 5%;
		left: 0;
		right: 0;
		margin: auto;
	}

	.speed {
		margin-top: 35rpx;
	}
</style>
