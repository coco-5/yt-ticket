<template>
    <view class="page">
        <view class="sidebar">
111
        </view>
        <view class="content">
            111
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    data(){
        return{
        }
    },
    onLoad(e){
        this.options = e
    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.page {
    position:relative;
    height:100vh;
    background:#F5F5F5;
    .sidebar {
        position:absolute;
        left:0;
        top:0;
        bottom:0;
        width:200rpx;
        .item {
            padding:0 24rpx;
            height:100rpx;
            line-height:100rpx;
            font-size:32rpx;
            &.active {
                background:#FFF;
                color:#FF5E00;
            }
        }
    }
    .content {
        position:absolute;
        left:200rpx;
        top:0;
        right:0;
        bottom:0;
        background:#F00;
        overflow-y:auto;
    }
}
</style>