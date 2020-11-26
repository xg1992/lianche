import $api from "@/common/api.js"
import { compare } from "@/common/common.js"
export function getDeviceInfo() {
	return new Promise((resolve, reject) => {
		plus.device.getInfo({
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject()
			}
		})
	})
}
export function checkUpdate() {
	return new Promise(async (resolve, reject) => {
		console.log('检查更新');
		const deviceInfo = await getDeviceInfo()
		const SystemInfo = uni.getSystemInfoSync()
		const platform = SystemInfo.platform == 'android' ? 1 : SystemInfo.platform == 'ios' ? 2 : 3; // 1:android, 2:ios, 3:其他
		$api.request(
			'Main/Index/appStart', {
				platform: platform,
				deviceBrand: SystemInfo.brand,
				deviceModel: SystemInfo.model,
				systemVersion: SystemInfo.system,
				appVersion: plus.runtime.version,
				deviceInfo: JSON.stringify(SystemInfo),
				uuid: deviceInfo.uuid
			},
			'POST',
			false
		).then(res => {
			try {
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					const wgtVersion = widgetInfo.version;
					const appVersion = plus.runtime.version
					const serverVersion = res.data.appUpdate.version
					const wgtUrl = res.data.appUpdate.wgtUrl
					const apkUrl = res.data.appUpdate.pkgUrl
					console.log("当前资源版本：" + wgtVersion);
					console.log('当前APP版本：' + appVersion);
					console.log('服务器版本：' + serverVersion);
					console.log('资源更新包：' + wgtUrl);
					console.log('APK更新包：' + apkUrl);
					if (compare(serverVersion , wgtVersion)) {
						if (wgtUrl) {
							console.log('热更新');
							const downloader = uni.downloadFile({
								url: wgtUrl,
								success: (result) => {
									if (result.statusCode === 200) {
										console.log('下载成功');
										uni.saveFile({
											tempFilePath: result.tempFilePath,
											success: (resu) => {
												plus.runtime.install(resu.savedFilePath, {
													force: true
												}, () => {
													console.log('安装成功');
													uni.showModal({
														content: '新版本已经准备好了，是否立即重启？',
														confirmText: '立即重启',
														success: (r) => {
															if (r.confirm) {
																plus.runtime.restart();
															}
														}
													})
												})
											}
										})
									} else {
										resolve()
										console.log('下载失败：' + result.statusCode);
									}
								},
								fail: (err) => {
									resolve()
									console.log('下载失败');
								}
							})
							downloader.onProgressUpdate((res) => {
								// console.log('下载进度：' + res.progress);
							});
						} else if (apkUrl) {
							console.log('整包更新');
							uni.navigateTo({
								url: `/pages/update/popup`
							})
						} else {
							console.log('缺少安装包链接');
							resolve()
						}
					} else {
						console.log('无需更新');
						resolve()
					}
				}, (err) => {
					console.log('版本获取失败');
					resolve()
				});
			} catch (e) {
				console.log('更新失败');
				resolve()
			}
		})
	})
}
