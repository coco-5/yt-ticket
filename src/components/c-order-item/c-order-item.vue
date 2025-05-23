<template>
    <view class="c-order">
        <view class="item">
            <view class="label">
                <text class="name">订单编号</text>
            </view>
            <view class="right">
                <text>{{detail.orderSn}}</text>
            </view>
        </view>
        <view class="item">
            <view class="label">
                <text class="name">下单时间</text>
            </view>
            <view class="right">
                <text>{{detail.createTime}}</text>
            </view>
        </view>
        <view class="item">
            <view class="label">
                <text class="name">票价总额</text>
            </view>
            <view class="right">
                <view class="price">
                    <template v-if="detail.currencyType == 1">
                        <text>MOP</text>{{detail.price}}
                    </template>
                    <template v-else>
                        <text>RMB</text>{{detail.rmbPrice}}
                    </template>
                    <view class="ico"></view>
                </view>
            </view>
        </view>
        <view class="detail">
            <view class="d-item">
                <view class="label">
                    船票总价
                </view>
                <view class="price">
                    <template v-if="detail.currencyType == 1">
                        <text>MOP</text>{{detail.ticketPrice}}
                    </template>
                    <template v-else>
                        <text>RMB</text>{{detail.rmbTicketPrice}}
                    </template>
                </view>
            </view>
            <template v-if="detail.addedValueList && detail.addedValueList.length">
                <view 
                    class="d-item"
                    v-for="(item,index) in detail.addedValueList"
                    :key="index"
                >
                    <view class="label">
                        {{item.addedValueName}}
                    </view>
                    <view class="price">
                        <template v-if="detail.currencyType == 1">
                            <text>MOP</text>{{item.price}}
                        </template>
                        <template v-else>
                            <text>RMB</text>{{item.rmbPrice}}
                        </template>
                    </view>
                </view>
            </template>
            <template v-if="detail.orderDiscountList && detail.orderDiscountList.length">
                <view 
                    class="d-item"
                    v-for="(item,index) in detail.orderDiscountList"
                    :key="index"
                >
                    <view class="label">
                        {{item.name}}
                    </view>
                    <view class="price">
                        <template v-if="detail.currencyType == 1">
                            <text>MOP</text>{{item.discountPrice}}
                        </template>
                        <template v-else>
                            <text>RMB</text>{{item.rmbDiscountPrice}}
                        </template>
                    </view>
                </view>
            </template>
        </view>

        <template v-if="detail && detail.addedValueList && detail.addedValueList.length">
            <c-goods-card
                :item="item"
                v-for="(item,index) in detail.addedValueList"
                :key="index"
                @cbOpen="cbOpen"
            ></c-goods-card>
        </template>
    </view>
</template>

<script>
export default {
    props:{
        detail:{
            type:Object,
            default:{}
        }
    },
    data(){
        return{

        }
    },
    mounted(){

    },
    methods:{
        cbOpen(item){
            this.$emit('cbOpen',item)    
        }
    }
}
</script>

<style lang="scss" scoped>
.c-order {
    .item {
        position:relative;
        margin-bottom:32rpx;
        .label {
            display:inline-block;
            height:32rpx;
            line-height:32rpx;
            color:#484848;
            vertical-align:middle;
        }
        .right {
            position:absolute;
            top:0;
            right:0;
            height:32rpx;
            color:#737373;
            .price {
                position:relative;
                color:#FF480E;
                font-size:28rpx;
                font-weight:500;
                text {
                    margin-right:8rpx;
                    font-size:22rpx;
                }
                .ico {
                    position:absolute;
                    top:50%;
                    right:-24rpx;
                    transform:translateY(-50%);
                    width:12rpx;
                    height:6rpx;
                    background:url('https://newxcx.soofound.cn/vue/upload/static/order/icon.png') no-repeat;
                    background-size:contain;
                }
            }
        }
    }
    .detail {
        margin-bottom:32rpx;
        padding:16rpx 24rpx;
        background:#F7F7F7;
        border-radius:4rpx;
        .d-item {
            position:relative;
            margin-bottom:24rpx;
            height:40rpx;
            line-height:40rpx;
            color:#555;
            font-size:24rpx;
            .label {
                display:inline-block;
                height:40rpx;
                line-height:40rpx;
                vertical-align:middle;
            }
            .price {
                position:absolute;
                top:0;
                right:0;
                height:40rpx;
                font-size:24rpx;
                text {
                    margin-right:8rpx;
                    font-size:18rpx;
                }
            }
            &:last-child {
                margin-bottom:0;
            }
        }
    }
}
</style>