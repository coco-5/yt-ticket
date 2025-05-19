<template>
    <view 
        class="destination"
    >
        <view class="text">{{dest.fromPort}}</view>
        <view class="ico"></view>
        <view class="text">{{dest.toPort}}</view>
    </view>
</template>

<script>
export default {
    props:{
        dest:{
            type:Object,
            default:{}
        }
    },
    watch:{
        immediate:true,
        dest:{
            deep:true,
            handler(n){
                
            }
        }
    },
    mounted(){
    },
    data(){
        return{
        }
    },
    methods:{
    }
}
</script>

<style lang="scss" scoped>
.destination {
    padding:32rpx 0;
    color:#000;
    font-size:34rpx;
    font-weight:500;
    text-align:center;
    .text,
    .ico {
        display:inline-block;
        vertical-align:middle;
    }
    .ico {
        margin:0 16rpx;
        width:40rpx;
        height:5rpx;
        background:url('http://8.138.130.153:6003/vue/upload/static/ticket/car2.png') no-repeat;
        background-size:contain;
    }
}
</style>