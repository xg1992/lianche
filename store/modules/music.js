const video = {
	state: {
		musicPath: '', // 本地歌曲文件路径
	},
	mutations: {
		setMusicPath: (state, param) => {
			state.musicPath = param;
		}
	}
}

export default video
