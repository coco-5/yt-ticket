<template>
    <view class="page">
        <!-- <c-cropper
            ref="cropper"
        ></c-cropper> -->
     imageSrc   {{imageSrc}}
        <qf-image-cropper 
            :src="imageSrc"
            :width="500" 
            :height="500" 
            :radius="30" 
            :fileType="fileType"
            :navigation="false"
            :choosable="false"
            @crop="handleCrop"
        ></qf-image-cropper>

        <c-upload
            :tempFiles="tempFiles"
            @uploadFile="uploadFile"
        ></c-upload>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import QfImageCropper from '@/components/qf-image-cropper/qf-image-cropper.vue'
export default {
    components:{
        QfImageCropper,
    },
    data(){
        return{
            imageSrc:'',
            tempFiles:[],
            //fileType:'jpg'
        }
    },
    onLoad(e){
        this.options = e

        this.drawImage()
    },
    methods:{
        drawImage(){
            if(!this.options.img){
                return
            }

            const img = decodeURIComponent(this.options.img)

            this.imageSrc = img
        },
        handleCrop(e){
            let tempFilePath = e.tempFilePath

            this.tempFiles.push(tempFilePath)
        },
        uploadFile(file){
            this.goPassenger(file)
        },
        goPassenger(file){
            let query = {
                img:encodeURIComponent(file)
            }

            let url = `${decodeURIComponent(this.options.from)}?${utils.paramsStringify(query)}`

            uni.redirectTo({
                url
            })

        }
    }
}
</script>