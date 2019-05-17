import { apiClient, apiDirPath } from '~/modules/apiClient'
export const state = () => ({
	recognitionImage: null,
	imgDistinguishability: ["800×600", "1280×720"],
	imgW_H: [800, 600],
	isPhotograph: true,
	pathDis: '',
	saveImgFolder: 'images'
})

export const getters = {
	recognitionImage: state => state.recognitionImage,
	imgDistinguishability: state => state.imgDistinguishability,
	imgW_H: state => state.imgW_H,
	isPhotograph: state => state.isPhotograph,
	pathDis: state => state.pathDis,
	saveImgFolder: state => state.saveImgFolder
}

export const mutations = {
	setRecognitionImage(state, data) {
		state.recognitionImage = data
	},
	setImgDistinguishability(state, data) {
		state.imgDistinguishability = data
	},
	setImgW_H(state, data) {
		state.imgW_H = data
	},
	setIsPhotograph(state, data) {
		state.isPhotograph = data
	},
	setPathDis(state, data) {
		state.pathDis = data
	},
	setSaveImgFolder(state, data) {
		state.saveImgFolder = data
	}
}

export const actions = {
	async recognition({ commit, state }, reqData) {
		let res = await apiClient.recognition(reqData)
	},
	async getDirPath({commit, state}) {
		let dirPath = await apiDirPath.getDirPath()
		if(dirPath.data) {
			commit('setPathDis', dirPath.data)
		}		
	}
}