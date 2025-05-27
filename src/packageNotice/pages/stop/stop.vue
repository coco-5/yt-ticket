<template>
    <view class="page">
        11111
        <!-- 
        <view class="title">
            粤通船务航班状态
        </view>
        <view class="date">
            2025-05-14 20:50:22
        </view>

        <view class="content">
            <view class="tips">停/复航信息实时状态更新</view>
            <view class="p">
                <text class="b">澳门内港往返珠海湾仔口岸航线：</text>正常运营。
            </view>
            <view class="p">
                <text class="b">澳门氹仔往返深圳蛇口航线：</text>正常运营。
            </view>
            <view class="p">
                <text class="b">澳门氹仔往返深圳机场码头航线：</text>正常运营。
            </view>
            <view class="p">
                <text class="b">澳门氹仔往返珠海桂山岛航线：</text>因运力不足，将由3月21日起开始停航。
            </view>
            <view class="p">
                <text class="b">澳门氹仔往返中山航线：</text>由5月15日起至6月30日，中山往来澳门航线逢周四至周六开航，航班时间不变。
            </view>
            <view class="p" style="margin-top:80rpx;">
                客服咨询电话（8号风球期间除外）
            </view>
            <view class="p">
                内港客运码头：00853 28939944
            </view>
            <view class="p">
                氹仔客运码头：00853 28850272
            </view>
        </view> -->
    </view>
</template>

<script>
export default {
    data(){
        return{
            options:''
        }
    },
    onLoad(e){
        this.options = e
    }
}
</script>

<style lang="scss" scoped>
.page {
    padding:0 40rpx;
    .title {
        padding:40 0rpx;
        font-size:48rpx;
        color:#000;
        font-weight:500;
    }
    .date {
        margin-bottom:40rpx;
        color:#999;
        font-size:24rpx;
    }
}
.content {
    color:#333;
    line-height:1.5;
    font-size:36rpx;
    .tips {
        margin:60rpx 0;
        font-size:26rpx;
    }
    .p {
        margin-bottom:40rpx;   
        .b {
            font-weight:500;
        } 
    }
}
</style>