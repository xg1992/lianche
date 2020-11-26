<template>
	<view>
		<navigator hover-class="none" :url="'question_detail?idx='+idx" class="pd15 h_center jc_sb botom" v-for="(item,idx) in list" :key='idx'>
			<text>{{idx+1}}. {{item.title}}</text>
			<view class="right-arrow"></view>
		</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{title:'分部和驾校认证'},
					{title:'预约管理'},
					{title:'奖励金'},
					{title:'绑定教练'},
					{title:'新增驾校'},
					{title:'互动（关注、点赞、评论、个人主页）'},
					{title:'视频（播放、录制、上传、时长）'},
					{title:'功能故障（闪退、死机、升级）'},
					{title:'注销账号'}
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
