<template>
	<view>
        <web-view src="https://lianche.haoshuninfo.com/html/UserPrivacy.html"></web-view>
    </view>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceAnalysis from "../../graceUI/components/graceAnalysis.vue";
export default {
	data(){
		return {
			title : "编辑器内容解析",
			article : []
		}
	},
	components:{
		gracePage, graceAnalysis
	},
	onLoad : function(){
		/* uni.showLoading({title:"loading"});
		uni.request({
			url:"https://grace.hcoder.net/api/html2array",
			success: (res) => {
				console.log(res);
				this.article = res.data.data;
				uni.hideLoading();
			}
		}) */
	}
}
</script>
<style>
</style>