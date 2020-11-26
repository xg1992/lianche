<template>
	<view class="lc-tab">
		<view class="tab-item" @click="tabClick(index)" v-for="(item,index) in list">
			<text class="tab-item-content" :class="{'tab-active': active == index}">
				{{item}}
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				default: ()=>{
					return ['tab1','tab2','tab3']
				}
			},
			active: {
				default: 0
			}
		},
		data(){
			return {
			}
		},
		created() {
		},
		methods: {
			tabClick(index){
				if(this.active == index) return false; // 重复点击同一个标签，阻止继续执行
				this.$emit('update:active',index)
				this.$emit('tab',{index})
			}
		}
	}
</script>

<style lang="scss" scoped>
$color: '#F6A704';
.lc-tab {
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	padding: 20rpx;
	box-sizing: border-box;
}
.tab-item {
	flex: 1;
	height: 76rpx;
	line-height: 70rpx;
	overflow: hidden;
	box-sizing: border-box;
}
.tab-item-content {
	display: inline-block;
	max-width: 100%;
	padding: 0 30rpx;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.tab-item-content.tab-active {
	color: #{$color};
	border-bottom: 2px solid #{$color};
}
</style>
