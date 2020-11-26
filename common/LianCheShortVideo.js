! function(root, factory) {
	if (typeof exports == 'object' && typeof module != 'undefined') {
		module.exports = factory()
	} else if (typeof define == 'function' && define.amd) {
		define(factory)
	} else {
		// 5+ 兼容
		document.addEventListener('plusready', function(){
		// 修改此处为插件命名
		var moduleName = 'LianCheShortVideo';
		// 挂载在plus下
		root.plus[moduleName] = factory()
		},false);
	}
}(this, function() {
	//在此处定义自己的方法
	var _BARCODE = 'LianCheShortVideo';
	var LianCheShortVideo = {
		videoRecord: function(Argus, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			var callbackID = plus.bridge.callbackId(success, fail);
			return plus.bridge.exec(_BARCODE, "videoRecord", [callbackID, Argus]);
		},
		screenshot: function(Argus, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			var callbackID = plus.bridge.callbackId(success, fail);
			return plus.bridge.exec(_BARCODE, "screenshot", [callbackID, Argus]);
		}
	};
	return LianCheShortVideo;
});
