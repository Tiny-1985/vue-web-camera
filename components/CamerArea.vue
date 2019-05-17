<template>
  <div class="video_border" :style="{width: imgW_H[0] + 'px', height: imgW_H[1] +'px'}">
    <video id="video" width="100%" height="100%" style="object-fit: fill;" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
//import WebRtcUtil from '~/modules/WebRtcUtil'

export default {
  data() {
    return {
      intervalId: null       
    }
  },
  computed: {
    ...mapGetters({      
      imgW_H: 'imgW_H',
    })
  },
  async mounted() {
    let connectResult
    if(process.browser) {
      let WebRtcUtil = require('../modules/WebRtcUtil')
      this.deviceId = await WebRtcUtil.default.getDeviceId()
      //const _this = this
      //console.log("A1:" + this.deviceId)
      WebRtcUtil.default.mediaDevices.ondevicechange = async (event) => {
        this.deviceId = await WebRtcUtil.default.getDeviceId()
        //console.log("A2:" + this.deviceId)
        if(!this.deviceId) { 
          clearInterval(this.intervalId)         
          this.intervalId = setInterval(async () => {
            this.deviceId = await WebRtcUtil.default.getDeviceId()
            if(this.deviceId) {
              clearInterval(this.intervalId)
              connectResult = await this.connectCamera()
            }
          }, 1000)
        } else {
          clearInterval(this.intervalId)
          connectResult = await this.connectCamera()
        }
      }
      if(this.deviceId) {
        clearInterval(this.intervalId)
        connectResult = await this.connectCamera()
      } else {
        clearInterval(this.intervalId)
        this.intervalId = setInterval(async () => {
          this.deviceId = await WebRtcUtil.default.getDeviceId()
          if(this.deviceId) {
            clearInterval(this.intervalId)
            connectResult = await this.connectCamera()
          }
        }, 1000)
      }
    }
    
  },
  methods: {
    async connectCamera() {
      let WebRtcUtil = require('../modules/WebRtcUtil')
      const _this = this
      return await WebRtcUtil.default.mediaDevices
        .getUserMedia(WebRtcUtil.default.constraints)
        .then(function(stream) {
          const video = document.getElementById('video')
          video.srcObject = stream
          video.onloadedmetadata = function(e) {
            video.play()
          }
          return 'SUCCESS'
        })
        .catch(function(err) {
          console.error(err.name + ': ' + err.message)
          return 'ERROR'
        })
    },
  }
}
</script>

<style>
  .video_border {
    border: 1rem ridge #f9fafb;
  }
</style>