'use strict'
import Constants from '~/modules/Constants'

const mediaDevices =
  navigator.mediaDevices ||
  (navigator.mozGetUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.msGetUserMedia
    ? {
        getUserMedia(c) {
          return new Promise((resolve, reject) => {
            ;(navigator.mozGetUserMedia || navigator.webkitGetUserMedia).call(
              navigator,
              c,
              resolve,
              reject
            )
          })
        }
      }
    : null)

const WebRtcUtil = {
  mediaDevices: mediaDevices,

  constraints: {
    audio: false,
    video: { width: Constants.VIDEO_WIDTH, height: Constants.VIDEO_HEIGHT }
  },

  getDeviceId() {
    //浏览器调用本地电脑媒体设别==》先暂时支持谷歌和火狐，其他浏览器不兼容 -Tiny
    return mediaDevices.enumerateDevices().then(devices => {
      for (let i = 0; i < devices.length; i++) {
        if (devices[i].kind === 'videoinput') {
          return devices[i].deviceId
        }
      }
      return null
    })
  }
}

export default WebRtcUtil
