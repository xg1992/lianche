<template>
		<wx-open-launch-app
			:id="launchId"
			class="wh-launch"
		  :appid="appid"
		  :extinfo="extinfo"
		>
			<script type="text/wxtag-template">
				<style>
					.btn {
						display: block;
						width: 100%;
						height: 1000px;
						border: 0;
						background-color: transparent;
					}
				</style>
				<span class="btn"></span>
			</script>
		</wx-open-launch-app>
</template>

<script>
	import {appid} from './comm.js'
	export default {
		props: {
			extinfo: {
				default: {},
			},
			launchId: {
				default: 'launchApp'
			}
		},
		data(){
			return {
				appid,
			}
		},
		mounted(){
			this.$nextTick(()=>{
				this.onevent();
			})
		},
		methods:{
			onevent(){
				const _this = this;
				let btn = document.getElementById(this.launchId)
				btn.addEventListener('error', function (e) {
					if(!e.isTrusted){
						console.log(1)
						_this.$emit('error',e)
					}
				});
			}
		}
	}
</script>

<style scoped>
.wh-launch {
	position: absolute;
	top: 0;
	left: 0;
	display: block;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
</style>
