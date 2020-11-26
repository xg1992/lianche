import config from "../config/index.js"
//防抖 延迟执行
exports.debounce = (fn, delay = 500) => {
	let timer
	return function() {
		let args = arguments
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			timer = null
			fn.apply(this, args)
		}, delay)
	}
}

//节流 每delay毫秒仅执行一次fn
exports.throttle = (fn, delay = 1000) => {
	let last = 0
	return function() {
		let now = new Date()
		if (now - last > delay) {
			fn.apply(this, arguments)
			last = now
		}
	}
}
// 清除视频缓存，param.clearTimeout-是否为清除过期的缓存文件,true为仅清除过期缓存
exports.clearAllVideoCache = (param) => {
	uni.getStorageInfo({
		success: function(storage) {
			console.log('缓存的keys：', storage.keys);
			const nowTime = new Date();
			let count = 0;
			for (let key of storage.keys) {
				count++;
				if (key.includes('local_video_')) {
					// 视频缓存数据
					const videoStorage = uni.getStorageSync(key);
					if (videoStorage) {
						const videoData = JSON.parse(videoStorage)
						if (param && param.clearTimeout && nowTime < videoData.expirationTime) {
							continue;
						}
						let len = count; // 重新保存长度，这里不能直接使用count当做长度，否则回调里提示长度判断会拿到最大长度
						uni.getSavedFileInfo({
							filePath: videoData.localPath,
							success: (res) => {
								uni.removeSavedFile({
									filePath: videoData.localPath,
									complete: function(res) {
										uni.removeStorageSync(key);
										if (len === storage.keys.length) {
											uni.showToast({
												title: "清除成功"
											})
										}
									}
								});
							}
						});
					}
				} else {
					if (param && param.clearTimeout) {
						continue;
					}
					if (count === storage.keys.length) {
						uni.showToast({
							title: "清除成功"
						})
					}
				}
			}
		}
	});
}

// 双击事件，双击返回true，单击返回false。连续快速多次点击算一次双击
let dblTimeStamp = 0;
let dblTimeout;
const limitTime = 200;
exports.dblclick = () => {
	return new Promise((res, rej) => {
		let now = new Date().getTime();
		console.log(now - dblTimeStamp)
		if (now - dblTimeStamp < limitTime) {
			// console.log('这是双击')
			dblTimeStamp = now; // 记录最新的点击时间，限定时间内每次点击跟上一次点击时间比较。
			clearTimeout(dblTimeout); // 双击清除定时器
			dblTimeout = setTimeout(() => { // 等到后面的点击事件，限定时间内没有继续点击，则本次事件结束
				dblTimeStamp = 0;
				res({
					dblclick: true
				})
			}, limitTime)
		} else {
			dblTimeStamp = new Date().getTime();
			dblTimeout = setTimeout(() => { // 单击事件
				dblTimeStamp = 0;
				// console.log('这是单击')
				res({
					dblclick: false
				})
			}, limitTime)
		}
	})
}

exports.realSrc = (src) => {
	if (!src || typeof src != "string") {
		return src
	}
	if (new RegExp("[a-zA-z]+://[^\s]*").test(src)) {
		return src
	} else if (new RegExp("^/.*$").test(src)) {
		return config.resourcesHost + src
	}else if(new RegExp("^_.*$").test(src)){
		return src
	}else {
		return config.resourcesHost + "/" + src
	}
}


exports.confirm = (opt = {}) => {
	let pageWidth = uni.getSystemInfoSync().screenWidth; // 屏幕宽度
	let pageHeight = uni.getSystemInfoSync().screenHeight; // 屏幕高度
	let contentWidth = pageWidth * 0.7; // 弹窗宽度
	let contentHeight = opt.height || 180; // 弹窗高度
	let btnHeight = 50; // 按钮高度
	let title = opt.title || '提示';
	let content = opt.content || '确定继续当前操作吗？';
	let cancelBtnText = opt.cancelBtnText || '取消';
	let confirmBtnText = opt.confirmBtnText || '确定';
	
	// 创建蒙版层
	let maskView = new plus.nativeObj.View('maskView');
	maskView.drawRect({color: "rgba(2, 15, 10, .3)"});
	// 创建内容区域
	let contentView = new plus.nativeObj.View('contentView',{
		top:`${(pageHeight - contentHeight) / 2}px`,
		left:`${(pageWidth - contentWidth) / 2}px`,
		width:`${contentWidth}px`,
		height:`${contentHeight}px`,
	});
	let tagList = []; // 所有节点集合
	// 填充颜色，设置圆角
	tagList.push({
		id: 'xgContent',
		tag: 'rect',
		rectStyles: {color: "#fff",radius: '10px'}
	})
	// 创建弹窗标题
	tagList.push({
		id: 'xgTitle',
		tag: 'font',
		text: title,
		position: {top:'10px',left:'10px',width:'100%',height:'20px'}, // 控件区域位置的起点和宽高
		textStyles: {align:'left',size:'16px',color:'#333'}, // 文本样式
	})
	// 创建显示的文本内容
	tagList.push({
		id: 'xgContentBody',
		tag: 'font',
		text: content,
		position: {top: '30px',left: '10px',width: `${contentWidth - 20}px`,height:`${(contentHeight - btnHeight - 40)}px`},
		textStyles: {align:'center',size:'16px',color:'#333',whiteSpace: "normal",overflow:'ellipsis'},
	})
	// 创建按钮，弹窗左下的按钮
	let cancelBtnPosition = {bottom:'0',left:'0',width:'50%',height:`${btnHeight}px`};
	tagList.push({
		id: 'xgCancel',
		tag: 'rect',
		rectStyles: {radius: '10px'},
		position: cancelBtnPosition,
	})
	tagList.push({
		id: 'xgCancelBtnText',
		tag: 'font',
		text: cancelBtnText,
		position: cancelBtnPosition,
		textStyles: {align:'center',size:'16px',color:'#aaa'},
	})
	// 弹窗右下的按钮
	let confirmBtnPosition = {bottom:'0',left:'50%',width:'50%',height:`${btnHeight}px`};
	tagList.push({
		id: 'xgConfirm',
		tag: 'rect',
		rectStyles: {radius: '10px'},
		position: confirmBtnPosition,
	})
	tagList.push({
		id: 'xgConfirmBtnText',
		tag: 'font',
		text: confirmBtnText,
		position: confirmBtnPosition,
		textStyles: {align:'center',size:'16px',color:'#ffa515'},
	})
	
	// 弹窗上面和中间的线条
	// contentView.drawRect({color: "#ddd"}, {bottom:'0',left:'50%',width:'1px',height:`${btnHeight}px`});
	// contentView.drawRect({color: "#ddd"}, {bottom:`${btnHeight}px`,left:'0',width:'100%',height:'1px'});
	tagList.push({
		tag: 'rect',
		color: "#ddd",
		position: {bottom:`${btnHeight}px`,left:'0',width:'100%',height:'1px'},
	})
	tagList.push({
		tag: 'rect',
		color: "#ddd",
		position: {bottom:'0',left:'50%',width:'1px',height:`${btnHeight}px`},
	})
	contentView.draw(tagList)
	// 确定或取消的按钮事件
	contentView.addEventListener('click',(e)=>{
		// 需要计算点击的位置来判断是确定还是取消事件
		if(e.clientY > contentHeight - btnHeight){
			if(e.clientX < contentWidth / 2){ // 取消事件
				if(opt.cancel && typeof opt.cancel === 'function') opt.cancel()
			}else{ // 确定事件
				if(opt.confirm && typeof opt.confirm === 'function') opt.confirm()
			}
			// 不管是确定还是取消，都关闭弹窗
			maskView.hide();
			contentView.hide();
		}
	})
	maskView.addEventListener('click',(e)=>{
		if(opt.maskClose){
			maskView.hide();
			contentView.hide();
		}
	})
	maskView.show();
	contentView.show();
}

/*
 * 版本号比较方法
 * 传入两个字符串，服务器版本号：curV；本地版本号：reqV
 * 调用方法举例：compare("1.1","1.2")，将返回false
 */
exports.compare = function(curV,reqV){
   if(curV && reqV){
      //将两个版本号拆成数字
      var arr1 = curV.split('.'),
          arr2 = reqV.split('.');
      var minLength=Math.min(arr1.length,arr2.length),
          position=0,
          diff=0;
      //依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
      while(position<minLength && ((diff=parseInt(arr1[position])-parseInt(arr2[position]))==0)){
          position++;
      }
      diff=(diff!=0)?diff:(arr1.length-arr2.length);
      //若curV大于reqV，则返回true
      return diff>0;
   }else{
      //输入为空
      console.log("版本号不能为空");
      return false;
   }
}