const CONFIG = {
	//开发环境配置
	development: {
		resourcesHost:'http://lianche-transfer.haoshuninfo.com',// 资源所在域名
		baseUrl: 'https://lianche.haoshuninfo.com/',
		//#ifdef H5
		baseUrl: '/api',
		//#endif
		version:'1.2.2',
		debug: true
	},

	//生产环境配置
	production: {
		resourcesHost:'http://lianche-transfer.haoshuninfo.com',// 资源所在域名
		baseUrl: 'https://lianche.haoshuninfo.com/',
		version:'1.2.2',
		debug: false
	}

}
export default CONFIG[process.env.NODE_ENV];
