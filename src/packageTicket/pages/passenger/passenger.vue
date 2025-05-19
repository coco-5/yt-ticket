<template>
    <view class="page">
        passenger
        <view 
            class="btn"
            @click="handlerUpload"
        >
            上传图片
        </view>

        <image 
            :src="fileImg"
            v-if="fileImg"
        ></image>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    data(){
        return{
            fileImg:'',
        }
    },
    onLoad(e){
        this.options = e

        this.checkImg()
    },
    methods:{
        checkImg(){
            if(!this.options.img){
                return
            }

            this.fileImg = decodeURIComponent(this.options.img)
        },
        handlerUpload(){
            this.tempFiles = []

            uni.chooseImage({
                count:1,
                success:res=>{
                    this.goCut(res.tempFilePaths[0])
                }
            })
        },
        goCut(file){
            let query = {
                img:encodeURIComponent(file),
                from:encodeURIComponent(`/packageTicket/pages/passenger/passenger`)
            }
            let url = `/packageTicket/pages/cut/cut?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {

}
</style>