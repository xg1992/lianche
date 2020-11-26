<template>
	<view>
		<view class="grace-form-item">
			<graceSelectTags :items="itemlist" selectedColor="#F6A704" type="radio" bgColor="#3A3C55" fontColor="#ffffff"  @change="changeItem"></graceSelectTags>
		</view>
	
		<view class="pd15 posre">
			<textarea placeholder="请填写8字以上的问题描述，以便我们提供更好的帮助"  class="textarea" placeholder-style='color:#494C6A' maxlength="200" @input='textarea' :value='value'/>
			<view class="maxtext">{{textlen}}/200</view>
		</view>
		
		<view class="btn center" :class="textlen>7?'btn_ok':''" @click="sub">提交</view>
	</view>
</template>

<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceSelectTags from '../../graceUI/components/graceSelectTags.vue';
	export default {
		data() {
			return {
				video_id:0,
				textlen:0,
				imgurls:[],
				value:'',
				itemVal : 0, // 用于保存选中值、参与表单提交
				itemlist: [
								{ name: '色情低俗', value: '0', checked: true },
								{ name: '政治敏感', value: '1', checked: false },
								{ name: '违法犯罪', value: '2', checked: false },
								{ name: '垃圾广告等', value: '3', checked: false },
								{ name: '造谣传谣等', value: '4', checked: false },
								{ name: '侮辱谩骂', value: '5', checked: false },
								{ name: '侵犯权益', value: '6', checked: false },
								{ name: '不当行为', value: '7', checked: false },
								{ name: '不适合未成年', value: '8', checked: false },
								{ name: '引人不适', value: '9', checked: false },
								{ name: '疑似自我伤害', value: '10', checked: false },
								{ name: '诱导点赞关注', value: '11', checked: false },
								{ name: '其他', value: '12', checked: false }
								
							],
			}
		},
		onLoad: function(options) {
			this.video_id = options.video_id;
			
		},
		methods: {
			textarea(e){
				let value=e.detail.value
				this.textlen=value.length
				this.value=e.detail.value
			},
			changeItem : function(val,datas){
						this.itemVal = val;
					},
			sub(){
				let that=this
				if(this.textlen<8){that.$api.Toast('不能少于8字');return false;}
				
				that.$api.request('User/Opinion/setReport', {itemVal:this.itemVal,content:this.value,video_id:that.video_id}).then(res => {
					// console.log(res)
					
					if(res.res==1){
							that.$api.Toast("举报成功");
					}else{
						that.$api.Toast("举报失败"+res.msg);
					}
					setTimeout(function () {uni.navigateBack({delta: 1});}, 1000)
					
				})
			}
			
			
		},
		
		components:{
				gracePage, graceSelectTags
			}
	}
</script>

<style lang="scss">
.textarea{padding:51rpx 37rpx ;border-radius:8rpx;font-size: 30rpx;width: 100%;height: 452rpx;box-sizing: border-box;background-color: #24263A;}
.upimgbox{display: flex;align-items: center;justify-content: center;width: 160rpx;height: 160rpx;background:#24263A;border-radius:8rpx;}
.btn{width: 90%;height: 88rpx;background-color: #3A3C55;border-radius: 16rpx;font-size: 34rpx;color: #F7F6F5;margin: 20rpx auto;}
.btn_ok{background-color:#F6A704;color:white}
.maxtext{position: absolute;bottom:50rpx;right:50rpx;color: #B3B3BB;}
.grace-form-item{padding: 20rpx;}

</style>
