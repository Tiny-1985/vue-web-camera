<template>
  <section class="container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="handle_div">
        <el-form-item label-width="150px" label="相片保存地址" prop="newFolderPath">
          <el-input class="handle_ipnut" v-model="newFolderPath" disabled placeholder="没有合适的储存地址"></el-input>
        </el-form-item>
        <el-form-item label-width="150px" label="图片前缀名" prop="plateName">
          <el-input class="handle_ipnut" v-model="ruleForm.plateName" @blur="conversionSymbols" :disabled="!isPhotograph" placeholder="请输入一个图片前缀名"></el-input>
        </el-form-item>
        <el-form-item label-width="150px" label="次名" prop="trayColor">
          <el-input class="handle_ipnut" v-model="ruleForm.trayColor" :disabled="!isPhotograph" placeholder="请再输入一个名称"></el-input>
        </el-form-item>
        <el-form-item label-width="150px" label="顺序" prop="imgCount">
          <el-input type="imgCount" class="handle_ipnut" :disabled="!isPhotograph" v-model.number="ruleForm.imgCount" placeholder="请输入一个数字"></el-input>
        </el-form-item>
        <el-form-item label-width="150px" label="照片像素" prop="selectImgDistinguishability">
          <el-select class="handle_ipnut" :disabled="!isPhotograph" v-model="selectImgDistinguishability">
            <el-option
              v-for="item in imgDistinguishability"
              :key="item.value"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="handle_but" @click="photograph" :type="isPhotograph ? 'primary' : 'danger'" round>
            <span v-if="isPhotograph">拍照</span>
            <span v-else>继续</span>
          </el-button>
        </el-form-item>
      </el-form>
    <div class="handle_videmo">
      <camer-area v-if="isPhotograph" />
      <img v-else :src="recognitionImage" />
      <div v-text="folderImgName"></div>
    </div>
      
  </section>
</template>

<script>           

import { mapGetters } from 'vuex'
import CamerArea from '~/components/CamerArea.vue'

export default {
  data() {
    return {
      ruleForm: {
        plateName: '',
        imgCount: '0',
        trayColor: '',
        selectImgDistinguishability: null,
      },
      selectImgDistinguishability: null,
      folderImgName: '',
      rules: {
        plateName: [
          { required: true, message: '请输入一个图片前缀名', trigger: 'change' }
        ],
        imgCount: [
          { required: true, message: '请输入一个数字' },
          { type: 'number', message: '请按顺序输入数字类型' }
        ],
        trayColor: [
          { required: true, message: '请再输入一个名称', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    CamerArea
  },
  computed: {
    ...mapGetters({
      imgDistinguishability: 'imgDistinguishability',
      imgW_H: 'imgW_H',
      recognitionImage: 'recognitionImage',
      isPhotograph: 'isPhotograph',
      pathDis: 'pathDis',
      saveImgFolder: 'saveImgFolder'
    }),
    newPlateName() {
      return this.ruleForm.plateName
    },
    newTrayColor() {
      return this.ruleForm.trayColor
    },    
    newFolderPath() {
      return this.pathDis + this.saveImgFolder
    }
  },
  watch: {
    selectImgDistinguishability(newImgDistinguishability, oldImgDistinguishability) {
      this.$store.commit('setImgW_H',newImgDistinguishability.split('×').map(Number))
      this.ruleForm.selectImgDistinguishability = this.selectImgDistinguishability
      this.ruleForm.imgCount = 0
    },
    newPlateName(nowPlateName, oldPlateName) {
      this.ruleForm.imgCount = 0
    },
    newTrayColor(nowTrayColor, oldTaryColor) {
      this.ruleForm.imgCount = 0
    }
  },
  mounted() {
    this.selectImgDistinguishability = this.imgDistinguishability[0]
    this.$store.dispatch('getDirPath')
  },
  methods: {
    photograph() {
      if(this.isPhotograph) {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            const video = document.getElementById('video')
            const canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')      
            //let w = video.offsetWidth
            //let h = video.offsetHeight
            let w = this.imgW_H[0]
            let h = this.imgW_H[1]
            canvas.setAttribute('width', w)
            canvas.setAttribute('height', h)
            ctx.drawImage(video, 0, 0, w, h)
            await this.$store.commit('setIsPhotograph', false)
            await this.$store.commit('setRecognitionImage', canvas.toDataURL('image/jpeg'))
            this.folderImgName = this.ruleForm.plateName + "_" + this.ruleForm.imgCount + "_" + this.ruleForm.trayColor + "_Re" + this.ruleForm.selectImgDistinguishability
            this.$store.dispatch('recognition', {
              imgName: this.folderImgName,
              folderName: this.ruleForm.plateName,
              recognitionImage: this.recognitionImage
            })
            this.ruleForm.imgCount++
          } else {
            console.log('error submit!!');
            return false;
          }
        })        
      } else {
        this.folderImgName = ""
        this.$store.commit('setIsPhotograph', true)
      }
      
    },
    conversionSymbols() {
      if(this.ruleForm.plateName) {
        let reg = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\，|\<|\.|\>|\/|\?]/g
        this.ruleForm.plateName = this.ruleForm.plateName.replace(reg, "_")
      }
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;  
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
}
.handle_div {
  margin-top: 1rem;
  margin-right: 3rem;
}
.handle_ipnut {
  display: block;
}
.handle_but {  
  text-align: center;
  display: block;
  width: 100%;
}
.handle_videmo {
  margin-top: 1rem;
}
.handel_count {
  width: 5rem;
}
</style>
