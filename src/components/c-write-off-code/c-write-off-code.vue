<template>
    <view 
        class="c"
        v-show="isShow"
    >
        <view 
            class="bg"
            @click="handlerClose"
        ></view>
        <view class="win-main">
            <c-qrcode
                ref="qrcode"
            ></c-qrcode>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        isShow:{
            type:Boolean,
            default:false
        },
        item:{
            type:Object,
            default:{}
        }    
    },
    watch:{
        isShow:{
            deep:true,
            handler(n){}
        },
        item:{
            deep:true,
            handler(n){
                if(n){
                    this.$nextTick(()=>{
                        this.$refs.qrcode.setCode(n.code)
                    })
                }
            }
        }  
    },
    mounted(){
    },
    methods:{
        handlerClose(){
            this.$emit('cbClose')
        }
    }
}
</script>

<style lang="scss" scoped>
.c {
    position:fixed;
    top:0;
    left:0;
    z-index:10;
    width:100%;
    height:100%;
    .bg {
        width:100%;
        height:100%;
        background:rgba(0,0,0,.5);
    }
    .win-main {
        position:fixed;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        padding:24rpx;
        background:#FFF;
    }
}
</style>