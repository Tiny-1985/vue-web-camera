'use strict'
import axios from 'axios'

let apiClient = {
  recognition(imageObje) {
    return axios.post('api/recognition', imageObje)
  }
}

let apiDirPath = {
	getDirPath() {
		return axios.post('api/getPath')
	}
}

export {
	apiClient,
	apiDirPath
}
