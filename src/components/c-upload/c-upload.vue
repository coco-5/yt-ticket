<template>
    <view class="">
        
    </view>
</template>

<script>
export default {
    props:{
        tempFiles:{
            type:Array,
            default:[]
        }
    },
    watch:{
        tempFiles:{
            deep:true,
            handler(n){
                if(n.length){
                    this.getFileList()
                }
            }
        }    
    },
    created(){
        if(this.tempFiles.length){
            this.getFileList()
        }
    },
    methods:{
        getFileList(){
            let list = []
            let tempFiles = this.tempFiles

            uni.showLoading()

            for(let i=0; i<tempFiles.length; i++){
                list.push(this.uploadFile(tempFiles[i]))
            }

            Promise.all(list).then((data)=>{
                let fileList = []

                uni.hideLoading()

                data.forEach((item)=>{
                    fileList.push(item[0])    
                })
                this.$emit('uploadFile', fileList)
            })
        },
        uploadFile(filePath){
            return new Promise((resolve)=>{
                uni.uploadFile({
                    url:`${this.baseConfig.proxyApi.japi}/api/upload/form/images`,
                    fileType:'image',
                    name:'pics',
                    filePath:filePath,
                    formData:{
                        passport:uni.getStorageSync('hq_token') || ''
                    },
                    success:(res)=>{
                        res = JSON.parse(res.data)

                        if(res.status.code == 0){
                            let imageUrls = res.data.imageUrls
                            resolve(imageUrls)
                        }
                    },
                    fail:(res)=>{
                        uni.hideLoading()
                    }
                })
            })
        }
    }
}
</script>