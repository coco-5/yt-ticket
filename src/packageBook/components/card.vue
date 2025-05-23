<template>
    <view 
        class="c-card"
        :class="item.isChoose ? 'on' : ''"
        @click="choose(item)"
    >
        <view class="date">
            <view class="date-item">
                <view class="d">{{item.setoffTime}}</view>
                <view class="t">{{item.fromPort}}</view>
            </view>
            <view class="long">
                <view class="t">{{item.duration}}</view>
                <view class="ico"></view>
            </view>
            <view class="date-item">
                <view class="d">{{item.arriveTime}}</view>
                <view class="t">{{item.toPort}}</view>
            </view>
        </view>
        <view 
            class="grade"
            v-if="item.dtseatrankPrice && item.dtseatrankPrice.length"
        >
            <view 
                class="i"
                v-for="(d,i) in item.dtseatrankPrice"
                :key="i"
            >
                {{d.seatRank}}<text>（{{d.seatNum}}张）</text>
            </view>
        </view>
        <div class="price">
            <view 
                class="price-item mop"
                v-if="item.minPrice"
            >
                <text class="t">MOP</text>
                <text class="p">{{item.minPrice}}</text>
                <text 
                    class="q"
                    v-if="item.dtseatrankPrice.length > 1"
                >
                    起
                </text>
            </view>
            <view 
                class="price-item"
                v-if="item.fportCode === 'MAO' || item.tportCode === 'MAO'"
            >
                <text class="t">RMB</text>
                <text class="p">{{item.minPrice5 || 0 }}</text>
                <text 
                    class="q"
                    v-if="item.dtseatrankPrice.length > 1"
                >
                    起
                </text>
            </view>
        </div>
    </view>
</template>

<script>
export default {
    props:{
        item:{
            type:Object,
            default:{}
        },
        type:{
            type:String,
            default:''
        }
    },
    data(){
        return{
        }
    },
    methods:{
        choose(item){
            this.$emit('cbChoose',item, this.type)
        }
    }
}
</script>

<style lang="scss" scoped>
.c-card {
    position:relative;
    margin-top:-1px;
    padding:0 24rpx;
    min-height:200rpx;
    border-top:1px solid #E5E5E5;
    overflow:hidden;
    .date {
        margin:20rpx 0 8rpx 0;
        //white-space:nowrap;
        text-align:center;
        .date-item,
        .long {
            display:inline-block;
            text-align:center;
        }
        .date-item {
            width:80rpx;
            vertical-align:middle;
            .d {
                height:36rpx;
                line-height:36rpx;
                color:#000;
                font-size:30rpx;
                font-weight:500;
            }
            .t {
                color:#8D8D8D;
                font-size:20rpx;
            }
        }
        .long {
            margin:0 24rpx 0;
            vertical-align:16rpx;
            .t {
                margin-bottom:2rpx;
                height:24rpx;
                line-height:24rpx;
                color:#A3A3A3;
                font-size:18rpx;
            }
            .ico {
                width:91rpx;
                height:9rpx;
                background:url('https://newxcx.soofound.cn/vue/upload/static/round/ico-arrow2.png') no-repeat;
                background-size:contain;
            }
        }
    }
    .grade {
        .i {
            display:inline-block;
            color:#A3A3A3;
            font-size:20rpx;
            vertical-align:middle;
            text {
                color:#EC702E;
            }
        }
    }
    .price {
        padding-bottom:24rpx;
        height:36rpx;
        text-align:right;
        .price-item {
            display:inline-block;
            margin-left:18rpx;
            height:45rpx;
            line-height:45rpx;
            color:#000;
            font-size:20rpx;
            vertical-align:middle;
            text {
                display:inline-block;
            }
            .p {
                margin:0 4rpx;
                font-size:30rpx;
                font-weight:500;
            }
            .t {
                font-weight:500;
            }
            .q {
                color:#A3A3A3;
            }
            &.mop {
                color:#FE6630;
            }
        }
    }
    &.on {
        background:#FFF4EF;
    }
}
</style>