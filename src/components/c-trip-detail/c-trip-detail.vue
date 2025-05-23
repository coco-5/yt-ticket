<template>
    <view 
        class="c-desc"
        :class="{
            'border':needBorder
        }"
    >
        <view class="detail">
            <view 
                class="tag"
                :class="{
                    back:item.trip
                }"
            >
                {{item.trip ? '返程' : '去程'}}
            </view>
            <view class="date">{{item.formattedSetoffDate}}</view>
        </view>
        <view class="dates">
            <view class="date-item">
                <view class="d">{{item.setoffTime}}</view>
                <view class="t">{{item.fromPort}}</view>
            </view>
            <view 
                class="long"
                v-if="isShowLong"
            >
                <view class="time">耗时{{item.duration}}</view>
                <view class="ico"></view>
                <view 
                    class="type"
                    v-if="isShowType"
                >
                    {{item.seatRank}}
                </view>
            </view>
            <view class="date-item">
                <view class="d">{{item.arriveTime}}</view>
                <view class="t">{{item.toPort}}</view>
            </view>
        </view>
        <view 
            class="card-type"
            v-if="item.ticketType && item.ticketType.length"
        >
            <text class="t">票型</text>
            <text 
                class="tag"
                v-for="(item,index) in item.ticketType"
                :key="index"
            >
                {{item}}
            </text>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        isShowLong:{
            type:Boolean,
            default:false
        },
        isShowType:{
            type:Boolean,
            default:false
        },
        needBorder:{
            type:Boolean,
            default:false
        },
        item:{
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

    }
}
</script>

<style lang="scss" scoped>
.c-desc {
    border-bottom:1px solid #EBE9E9;
    .detail {
        margin:28rpx 0;
        height:32rpx;
        .tag,
        .date {
            display:inline-block;
            vertical-align:middle;
        }
        .tag {
            margin-right:8rpx;
            width:50rpx;
            height:30rpx;
            line-height:30rpx;
            border:1px solid #FE6630;
            border-radius:5rpx;
            color:#FE6630;
            font-size:18rpx;
            text-align:center;
            &.back {
                border-color:#368EF6;
                color:#368EF6;
            }
        }
        .date {
            color:#000;
            font-size:22rpx;
        }
    }
    .dates {
        position:relative;
        padding-bottom:32rpx;
        //border-bottom:1px solid rgba(0,0,0,0.08);
        .date-item {
            display:inline-block;
            width:48%;
            vertical-align:middle;
            text-align:left;
            &:last-child {
                text-align:right;
            }
            .d {
                margin-bottom:16rpx;
                height:50rpx;
                line-height:50rpx;
                color:#000;
                font-size:48rpx;
                font-weight:500;
            }
            .t {
                height:30rpx;
                line-height:30rpx;
                font-size:26rpx;
                color:#737272;
            }
        }
        .long {
            position:absolute;
            top:35%;
            left:50%;
            transform:translate(-50%,-50%);
            width:170rpx;
            color:rgba(0,0,0,.7);
            font-size:22rpx;
            text-align:center;
            .ico {
                margin:4rpx auto;
                width:83rpx;
                height:5rpx;
                background:url('https://newxcx.soofound.cn/vue/upload/static/order/car2.png') no-repeat;
                background-size:contain;
            }
        }
    }
    .card-type {
        padding-bottom:40rpx;
        height:24rpx;
        line-height:24rpx;
        text {
            display:inline-block;
            font-size:22rpx;
            vertical-align:middle;
        }
        .t {
            margin-right:24rpx;
            color:rgba(0,0,0,.6);
        }
        .tag {
            margin-right:8rpx;
            color:#000;
        }
    }
    &.border {
        border-bottom:1px solid rgba(0,0,0,0.08);
    }
}
</style>