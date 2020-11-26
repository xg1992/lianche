
exports.appid = 'wx9978f1b704181279'
//检查是否微信浏览器
exports.isWeixin = () => {
	var ua = navigator.userAgent.toLowerCase();
	var isWeixin = ua.indexOf('micromessenger') != -1;
	if (isWeixin) {
		return true;
	}else{
		return false;
	}
}
// 获取app下载链接
exports.getAppInfo = (v) => {
	let params = {
		platform: isIos() ? 2 : 1,
		version:v.$api.config.version,
	};
	v.$api.request('Main/Index/getApp',params).then(res => {
		v.appDownloadUrl = res.data.pkgUrl;
	});
}
// 判断设备为 ios
function isIos(){
		let u = navigator.userAgent;
		if (u.indexOf("iPhone") > -1 || u.indexOf("iOS") > -1) {
				return true;
		}
		return false;
}
exports.isIos = isIos