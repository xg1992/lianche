import wx from 'weixin-js-sdk'
import {
	request
} from './api'
const weixinOpenTagList = ['wx-open-launch-app']
// h5判断是否ios系统，返回true或false
let u = navigator.userAgent
const isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

// 微信js-sdk签名配置
export const wxConfig = async (callback, ispay) => {
	let url = '';
	if (isIos) {
		url = window.initUrl || window.location.href
	} else {
		url = window.location.href
	};
	url = url.split('#')[0]
	let params = {
		url: encodeURIComponent(url)
	};
	
	let times = 0;
	let {data} = await request('User/Confirm/shareInfo',params)
	console.log(data)
	wx.config({
		debug: false, // 开启调试模式
		appId: data.appId, // 必填，公众号的唯一标识
		timestamp: data.timestamp + '', // 必填，生成签名的时间戳
		nonceStr: data.nonceStr + '', // 必填，生成签名的随机串
		signature: data.signature, // 必填，签名，见附录1
		jsApiList: ['onMenuShareAppMessage'], // 必填，需要使用的JS接口列表，因为是必填，所以随便写一个吧
		openTagList: weixinOpenTagList, // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
	});
	wx.ready(() => {
		callback && callback(wx)
	})
	wx.error(async (err) => {
		console.log(err)
		// config信息验证失败会执行error函数
		times++
		if (times < 3) {
			// 更新签名
			if (url == window.initUrl) {
				url = window.location.href
			} else {
				url = window.initUrl
			}
			params = {
				url: encodeURIComponent(url)
			}
			let data = await request('User/Confirm/shareInfo',params)
			wx.config({
				debug: false, // 开启调试模式
				appId: data.appId, // 必填，公众号的唯一标识
				timestamp: data.timestamp.toString(), // 必填，生成签名的时间戳
				nonceStr: data.nonceStr.toString(), // 必填，生成签名的随机串
				signature: data.signature, // 必填，签名，见附录1
				openTagList: weixinOpenTagList
			});
		}
	});
};

