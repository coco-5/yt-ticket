<template>
    <view class="c-code">
        <canvas 
            id="qrcode" 
            canvas-id="qrcode" 
            :style="style"
            size="178"
        ></canvas>
    </view>
</template>

<script>
import UQRCode from 'uqrcodejs'
export default {
    props:{
        style:{
            type:String,
            default:'width:178px;height:178px;'
        }
    },
    data(){
        return {}
    },
    methods:{
        setCode(url){
            let qr = new UQRCode()
            qr.setOptions({
                data:url,
                size:178,
                margin:0
            })
            qr.make()
            let canvasContext = uni.createCanvasContext('qrcode',this)
            qr.canvasContext = canvasContext
            qr.drawCanvas()
        }
    }
}
</script>

<style lang="scss" scoped>
.c-code {
    margin:0 auto;
    width:356rpx;
    height:356rpx;
}
</style>