import config from '../config'
import store from "@/store";
import filter from './filter.js'
//Storage   storage("token")  storage("token","sdfsdf")    storage("","","")  清除所有缓存
function storage() {
	var num = arguments.length;
	//列出KEY
	if (num == 0) {
		var res
		try {
			res = uni.getStorageInfoSync()
		} catch (e) {}
		return res.keys
	}

	//读
	if (num == 1) {
		let value = '';
		try {
			value = uni.getStorageSync(arguments[0])
		} catch (e) {}
		return value;
	}

	//写
	if (num == 2) {
		try {
			uni.setStorageSync(arguments[0], arguments[1]);
			return true;
		} catch (e) {
			return false;
		}
	}

	//清理所有缓存
	if (num == 3) {
		try {
			uni.clearStorageSync();
			return true;
		} catch (e) {
			return false;
		}
	}

} //end S

//预览的图片
const previewImage = (urls, index = 0) => {
	uni.previewImage({
		current: urls[index], // 当前显示图片的http链接
		urls: urls // 需要预览的图片http链接列表
	})
}
// #ifdef APP-PLUS
let platform = uni.getSystemInfoSync().platform; // 获取客户端信息，platform为ios/android
const isIos = (plus.os.name == "iOS")
const getVersion = () => new Promise((resolve, reject) => {
	plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
		console.log('当前版本：' + widgetInfo.version);
		resolve(widgetInfo.version)
	})
})
// #endif
//同步网络请求 $api.request('xxxx/xxx/xxxapi路径',{data参数},请求方式,默认post,默认显示loading加载框,不用传false).then(res => {})
const request = (url, data, method = 'POST', loading = true) => new Promise(async(resolve, reject) => {
	if (loading) {
		uni.showLoading({
			title: 'loading...'
		})
	}
	let _pl = 0;
	let appVersion = null;
	// #ifdef APP-PLUS
	platform === 'ios' ? _pl = 2 : _pl = 1; // 获取客户端信息，platform为ios/android
	appVersion = await getVersion()
	// #endif
	// #ifdef APP-WEIXIN
	_pl = 3
	// #endif
	if (config.debug) {
		try {
			let str = '?'
			if (data && typeof data == 'object') {
				Object.keys(data).forEach(key => {
					str += `${key}=${data[key]}&`
				})
			}
			console.log('请求链接:' + config.baseUrl + url + str + 
				"\_uuid=" + storage('uuid') +
				"\&_token=" + storage('token') +
				"\&_time=" + new Date().getTime() +
				"\&_pf=" + _pl +
				"\&_version=" + appVersion)
		} catch (e) {
			console.log(e)
		}
	}
	console.log({
		...data,
		_uuid: storage('uuid'),
		_token: storage('token'),
		_time: new Date().getTime(),
		_pf: _pl,
		_version: appVersion
	})
	uni.request({
		url: config.baseUrl + url,
		data: {
			...data,
			_uuid: storage('uuid'),
			_token: storage('token'),
			_time: new Date().getTime(),
			_pf: _pl,
			_version: appVersion
		},
		method: method,
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		success: function(res) {
			try {
				if (loading) {
					uni.hideLoading()
				}
				console.log(url);
				console.log(res.data)
				if (res.statusCode == 200) {
					let code = parseInt(res.data.res) || 1
					switch (code) {
						case 1:
							resolve(res.data)
							break;

						case 5:
							resolve(res.data)
							break;

						case 13:
							// 用户未登录
							store.commit('logout')
							uni.navigateTo({
								url: '/pages/public/error?code=13'
							});
							reject(res.data)
							break;

						default:
							Toast(res.data.msg);
							reject(res.data)
							break;
					}
				} else {
					if (config.debug) {
						Toast('接口错误：' + res.statusCode);
						console.log('接口错误：' + res.statusCode, '接口地址：' + url)
					} else {
						switch (res.statusCode) {
							case 404:
								Toast('接口不存在');
								break;

							case 500:
								uni.redirectTo({
									url: '/pages/public/error?code=0'
								})
								break;
						}
					}
				}
			} catch (e) {
				console.log(e)
			}

		},
		fail: function(res) {
			console.log(res)
			console.log('出错接口：' + url)
			if (loading) {
				uni.hideLoading()
			}
			uni.getNetworkType({
				success: function(res) {
					if (res.networkType == 'none') {
						// Toast('网络错误');
						uni.navigateTo({
							url: '/pages/public/error?code=-1',
							animationType: 'none',
							animationDuration: 10
						})
					} else {
						Toast('请求出错');
					}
					reject(res.data)
				}
			});
		},
		complete: function(res) {
			if (loading) {
				uni.hideLoading()
			}
		}
	});
});

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}

//showToast
const Toast = (title, icon = "none", duration = 2000) => {
	uni.showToast({
		title: title,
		icon: icon, //有效值 "success", "loading", "none"
		duration: duration
	})
}


//页面跳转 to('sdfsdf?id=1')  to('','back')
const to = (url, option) => {
	let data = {
		url: url
	}
	if (option === undefined) {
		uni.navigateTo(data)
	} else if (option == 'redirectTo') {
		uni.redirectTo(data)
	} else if (option == 'switchTab') {
		uni.switchTab(data)
	} else if (option == 'reLaunch') {
		uni.reLaunch(data)
	} else if (option == 'back') {
		if (url == '') url = 1
		uni.navigateBack({
			delta: url
		})
	}
}

//showModal
const showModal = (title, text, showCancel = true) => new Promise((resolve, reject) => {
	if (typeof(text) != 'string') text = JSON.stringify(text)
	uni.showModal({
		title: title,
		content: text,
		showCancel: showCancel,
		success: function(res) {
			if (res.confirm)
				resolve(0); //用户点击确定
			else if (res.cancel)
				reject(1); //用户点击取消
		},
		// fail: function(res) {
		// 	reject(false)
		// }
	})
})
//取得经纬度，坐标   getgpstorage('wgs84')
const getgps = (type = 'gcj02') => new Promise((resolve, reject) => {
	uni.getLocation({
		type: type,
		success: function(res) {
			resolve(res);
		},
		fail: function(res) {
			reject(false)
		}
	})
})


//从地图选取坐标      getmgpstorage('wgs84')
const getmgps = (type = 'gcj02') => new Promise((resolve, reject) => {
	uni.getLocation({
		type: type, //返回可以用于uni.openLocation的经纬度
		success: function(res) {
			log(res)
			openLocation(res.longitude, res.latitude)
		}
	})
})

//打地图
const openLocation = (longitude, latitude, name = '当前位置', scale = 18) => {
	uni.openLocation({
		latitude: parseFloat(latitude),
		longitude: parseFloat(longitude),
		name,
		name,
		scale: scale
	})
}

//扫码  scanCode(false) 可以从相册选取图片
const scanCode = (onlyFromCamera) => new Promise((resolve, reject) => {
	if (onlyFromCamera === undefined) onlyFromCamera = true
	uni.scanCode({
		onlyFromCamera: onlyFromCamera, // true 时只允许从相机扫码
		success: (res) => {
			resolve(res)
		}
	})
})

//选取上传图片
const chooseUpfile = () => new Promise((resolve, reject) => {
	chooseImage().then(res => {
		toUpfile(res).then(r => {
			resolve(r)
		})
	})

})


//选取图片
const chooseImage = (num = 9,sizeType = ['original', 'compressed']) => new Promise((resolve, reject) => {
	uni.chooseImage({
		count: num, // 默认9
		sizeType: sizeType, // 可以指定是原图还是压缩图，默认二者都有
		sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		success: function(res) {
			// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
			var tempFilePaths = res.tempFilePaths
			resolve(tempFilePaths)
		}
	})
})


//上传图片文件
const toUpfile = (filePath) => new Promise(async(resolve, reject) => {
	uni.showLoading({
		title:'图片上传中...',
		mask:true
	})
	var filpist = [];
	var index = 0;
	var length = filePath.length;
	let appVersion = null;
	let systemVersion = null;
	// #ifdef APP-PLUS
	appVersion = await getVersion()
	systemVersion = uni.getSystemInfoSync().system
	// #endif
	function upload() {
		uni.uploadFile({
			url: config.baseUrl + 'Appointment/Uploads/opinionUploaded',
			filePath: filePath[index],
			name: 'image',
			header: {
				'content-type': 'multipart/form-data'
			},
			formData: {
				_uuid: storage('uuid'),
				_token: storage('token'),
				_time: new Date().getTime(),
				//#ifdef APP-PLUS
				_pf: platform,
				// #endif
				_version: appVersion,
				_system: systemVersion
			},
			success: function(res) {
				console.log('上传成功',res);
				var data = JSON.parse(res.data)
				filpist.push(data.data)
				// console.log(filpist)
			},
			fail:function(err){
				console.log('上传失败',err);
			},
			complete: function() {
				index++;
				if (index < length) {
					upload()
				}
				if(index==length){
					uni.hideLoading()
					resolve(filpist);
				}
			}
		})
	}
	upload();
})
// 用户角色值(可多身份可组合，使用与运算),,1024:总部员工,512:分部员工,256:平台巡逻员, 128:商家,64:总部负责人,32:分部负责人,16:教练, 8:学员,4:老司机,2:未报名,1:游客
function qx(allow_role, roleVal = store.getters.userInfo.roleVal) {
	// console.log(allow_role,roleVal)
	for (let i = 0; i < allow_role.length; i++) {
		if (roleVal & allow_role[i]) {
			// console.log(true)
			return true
		}
	}
	// console.log(false)
	return false
}

//定义一些常量
let x_PI = 3.14159265358979324 * 3000.0 / 180.0;
let PI = 3.1415926535897932384626;
let a = 6378245.0;
let ee = 0.00669342162296594323;

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
export function bd09togcj02(bd_lon, bd_lat) {
	let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
	let x = bd_lon - 0.0065;
	let y = bd_lat - 0.006;
	let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	let gg_lng = z * Math.cos(theta);
	let gg_lat = z * Math.sin(theta);
	return [gg_lng, gg_lat]
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function gcj02tobd09(lng, lat) {
	let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
	let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
	let bd_lng = z * Math.cos(theta) + 0.0065;
	let bd_lat = z * Math.sin(theta) + 0.006;
	return [bd_lng, bd_lat]
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function wgs84togcj02(lng, lat) {
	if (out_of_china(lng, lat)) {
		return [lng, lat]
	} else {
		let dlat = transformlat(lng - 105.0, lat - 35.0);
		let dlng = transformlng(lng - 105.0, lat - 35.0);
		let radlat = lat / 180.0 * PI;
		let magic = Math.sin(radlat);
		magic = 1 - ee * magic * magic;
		let sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
		dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
		let mglat = lat + dlat;
		let mglng = lng + dlng;
		return [mglng, mglat]
	}
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function gcj02towgs84(lng, lat) {
	if (out_of_china(lng, lat)) {
		return [lng, lat]
	} else {
		let dlat = transformlat(lng - 105.0, lat - 35.0);
		let dlng = transformlng(lng - 105.0, lat - 35.0);
		let radlat = lat / 180.0 * PI;
		let magic = Math.sin(radlat);
		magic = 1 - ee * magic * magic;
		let sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
		dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
		mglat = lat + dlat;
		mglng = lng + dlng;
		return [lng * 2 - mglng, lat * 2 - mglat]
	}
}

export function transformlat(lng, lat) {
	let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
	ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
	ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
	return ret
}

export function transformlng(lng, lat) {
	let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
	ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
	ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
	return ret
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
export function out_of_china(lng, lat) {
	return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
}

module.exports = {
	...filter,
	config,
	to,
	Toast,
	showModal,
	previewImage,
	chooseUpfile,
	storage,
	toUpfile,
	chooseImage,
	request,
	getmgps,
	openLocation,
	getgps,
	scanCode,
	getNowFormatDate,
	qx,
	//#ifdef APP-PLUS
	platform,
	isIos
	//#endif	
}
