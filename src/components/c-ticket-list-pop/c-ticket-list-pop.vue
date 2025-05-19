<template>
    <view 
        class="c-pop"
        v-show="isShow"
    >
        <view class="win-bg"></view>
        <view class="win-main">
            <view class="hd">可用航线</view>
            <view class="bd">
                <view class="list">
                    <view 
                        class="item"
                        v-for="(item,index) in list"
                        :key="index"
                    >
                        {{item.fromPortName}}-{{item.toPortName}}
                    </view>
                </view>
            </view>
            <view class="ft">
                <view 
                    class="btn"
                    @click="isShow = false"
                >
                    知道了
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data(){
        return{
            list:[],
            isShow:false
        }
    },
    mounted(){

    },
    methods:{
        show(list){
            this.list = list
            this.isShow = true
        }
    }
}
</script>

<style lang="scss" scoped>
.c-pop {
    position:fixed;
    z-index:2;
    top:0;
    left:0;
    width:100%;
    height:100vh;
    .win-bg {
        position:fixed;
        z-index:2;
        top:0;
        left:0;
        width:100%;
        height:100vh;
        background:rgba(0,0,0,.6);
    }
    .win-main {
        position:fixed;
        z-index:3;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        width:680rpx;
        min-height:500rpx;
        background:linear-gradient(205deg, #FDEEE9, #FFFFFF);
        border-radius:40rpx;
        .hd {
            padding:60rpx 0 50rpx;
            height:42rpx;
            line-height:40rpx;
            color:#000;
            font-size:40rpx;
            font-weight:500;
            text-align:center;
        }
        .bd {
            padding:60rpx;
            .list {
                .item {
                    display:inline-block;
                    margin:0 8rpx 8rpx 0;
                    padding:8rpx 12rpx;
                    border-radius:6rpx;
                    border:1px solid #fe6630;
                    font-size:28rpx;
                    color:#ee622c;
                    vertical-align:top;
                }
            }
        }
        .ft {
            padding:40rpx 0 40rpx 45rpx;
            text-align:center;
            .btn {
                display:inline-block;
                width:486rpx;
                height:100rpx;
                line-height:100rpx;
                background:linear-gradient(205deg, #FA7358, #FE6630);
                color:#FFF;
                border-radius:50rpx;
                font-size:34rpx;
                font-weight:500;
                vertical-align:top;
                text-align:center;
            }
        }
    }
}

</style>