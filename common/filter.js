// 过滤器
import speedList from '@/config/speedList.js'

function isIos() {
	// #ifdef H5
	let u = navigator.userAgent
	return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
	// #endif
	// #ifndef H5
	return uni.getSystemInfoSync().platform == 'ios'
	// #endif
}

function speed(speed_num) {
	return speedList[speed_num]
}

function getWeek(date, text = "星期") {
	// 标准时间 Wed Jul 31 2019 00:00:00 GMT+0800 (中国标准时间)
	var _date = new Date(date);
	// getDay() 返回表示星期的某一天
	var num = _date.getDay(_date),
		week;
	switch (num) {
		case 0:
			week = text + "日";
			break;
		case 1:
			week = text + "一";
			break;
		case 2:
			week = text + "二"
			break;
		case 3:
			week = text + "三"
			break;
		case 4:
			week = text + "四"
			break;
		case 5:
			week = text + "五"
			break;
		case 6:
			week = text + "六"
			break;
		default:
			break;
	};
	return week;

};
// 格式化时间
function formatTime(time, option) {
	time = +time * 1000
	const d = new Date(time)
	const now = Date.now()

	const diff = (now - d) / 1000

	if (diff < 30) {
		return '刚刚'
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + '分钟前'
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + '小时前'
	} else if (diff < 3600 * 24 * 2) {
		return '1天前'
	}
	if (option) {
		return parseTime(time, option)
	} else {
		return (
			d.getMonth() +
			1 +
			'月' +
			d.getDate() +
			'日' +
			d.getHours() +
			'时' +
			d.getMinutes() +
			'分'
		)
	}
}
// 格式化时间
function parseTime(time, cFormat) {
	if (arguments.length === 0) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if (typeof time === 'string' && isIos()) {
			time = time.replace(/\-/g, '/')
		}
		if (('' + time).length === 10) time = parseInt(time) * 1000
		date = new Date(time)
	}
	if (date.getTime() === 0) {
		return '-'
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		if (result.length > 0 && value < 10 && key === 'd') {
			value = '0' + value
		}
		return value.toString().padStart(2, '0')
	})
	return time_str
}

module.exports = {
	speed,
	getWeek,
	formatTime,
	parseTime,
}
