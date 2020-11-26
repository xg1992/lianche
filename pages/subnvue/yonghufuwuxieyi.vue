<template>
	<view>
        <web-view src="https://lianche.haoshuninfo.com/html/UserAgreement.html"></web-view>
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
			url:"https://lianche.haoshuninfo.com/html/UserAgreement.html",
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