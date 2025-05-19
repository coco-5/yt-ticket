<template>
    <view 
        class="c-card"
        :class="'card-'+item.type"
    >
        <view class="coupon-conent">
            <view class="content">
                <view class="left">
                    <view class="num">
                        <text class="unit">{{item.type == 4 ? '-RMB' : '-MOP'}}</text>
                        <text class="desc">{{item.type == 4 ? item.discountRmbPrice : item.discountPrice}}</text>
                    </view>
                    <view class="times">
                        <template 
                            v-if="item.type == 1"
                        >
                            可用{{item.useNum}}次
                        </template>
                        <template 
                            v-else-if="item.type == 2 || item.type == 4">
                            可用{{item.usePrice}}{{item.type == 2 ? 'MOP' : 'RMB'}}
                        </template>
                        <template 
                            v-else-if="item.type == 3"
                        >
                            购买享受{{item.discountRate >= 100 ? 1 : item.discountRate / 10}}折
                        </template>
                    </view>
                </view>
                <view class="info">
                    <view class="name">{{item.name}}</view>
                    <view 
                        class="tags"
                        v-if="item.ticketProtList.length"
                    >
                        <view 
                            class="tag"
                            v-for="(tag,i) in item.ticketProtList"
                            :key="i"
                        >
                            限{{tag.fromPortName}}-{{tag.toPortName}}
                        </view>
                        <view 
                            class="last"
                            v-if="item.ticketProtList.length > 2"
                        >
                            更多航线
                        </view>
                    </view>
                    <view class="date">有效期：{{item.st}}-{{item.et}}</view>
                    <view 
                        class="shuoming"
                        @click="showMore(item)"
                    >
                        详细说明<text class="ico"></text>
                    </view>
                </view>
            </view>
            <view 
                class="more"
                v-show="item.showMore"
            >
                <view class="item">
                    <view class="left">票卡名称：</view>
                    <view class="ov">
                        <view class="p">{{item.name}}</view>
                    </view>
                </view>
                <rich-text :nodes="item.desc"></rich-text>
            </view>
        </view>
        <view class="coupon-right">
            <view 
                class="icon"
                :class="item.checked ? 'on' : ''"
                @click="hanlderChecked(item)"
            ></view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        item:{
            type:Object,
            default:{}
        }
    },
    methods:{
        showMore(){
            this.$emit('showMore',this.item)
        },
        hanlderChecked(){
            this.$emit('cbChecked',this.item)
        }
    }
}
</script>

<style lang="scss" scoped>
.c-card {
    position:relative;
    margin-bottom:16rpx;
    .coupon-conent {
        position:relative;
        width:652rpx;
        .content {
            position:relative;
            display:flex;
            border-radius:10rpx;
            overflow:hidden;
            .left {
                position:relative;
                flex-shrink:0;
                width:196rpx;
                min-height:196rpx;
                display:flex;
                align-items:center;
                justify-content:center;
                flex-direction:column;
                background:linear-gradient(205deg, #ff7e50, #f74939);
                color:#FFF;
                .num {
                    font-weight:500;
                    font-size:40rpx;
                    .unit {
                        font-size:24rpx;
                        margin-right:12rpx;
                    }
                }
                .times {
                    font-size:24rpx;
                }
            }
            .info {
                position:relative;
                flex:1;
                padding:20rpx 16rpx 24rpx 16rpx;
                background:#fff3ec;
                .name {
                    margin-bottom:8rpx;
                    font-weight:500;
                    font-size:30rpx;
                    color:#000;
                }
                .tags {
                    display:flex;
                    width:100%;
                    flex-wrap:wrap;
                    .tag {
                        padding:2rpx 8rpx;
                        border-radius:6rpx;
                        border:1px solid #fe6630;
                        font-size:18rpx;
                        color:#fe6630;
                        margin-right:8rpx;
                        margin-bottom:8rpx;
                    }
                    .last {
                        color:rgba(0, 0, 0, 0.6);
                        font-size:20rpx;
                        text-decoration:underline;
                    }
                }
                .date {
                    color:rgba(0,0,0,.6);
                    font-size:20rpx;
                }
                .shuoming {
                    margin-top:8rpx;
                    color:#585351;
                    font-size:20rpx;
                    .ico {
                        display:inline-block;
                        margin-left:8rpx;
                        width:11rpx;
                        height:6rpx;
                        margin-left:10rpx;
                        background:url('http://8.138.130.153:6003/vue/upload/static/common/WechatIMG1020.png') no-repeat;
                        background-size:contain;
                        vertical-align:4rpx;
                    }
                }
            }
        }
        .more {
            margin-top:1px;
            padding:20rpx;
            background:#F5F5F5;
            border-radius:20rpx;
            .item {
                position:relative;
                padding-left:96rpx;
                font-size:18rpx;
                .left {
                    position:absolute;
                    top:0;
                    left:0;
                    height:24rpx;
                    line-height:24rpx;
                    color:#333;
                }
                .ov {
                    color:#999;
                    .p {
    
                    }
                }
            }
        }
    }
    .coupon-right {
        position:absolute;    
        top:0;
        right:0;
        .icon {
            position:absolute;
            display:inline-block;
            top:80rpx;
            right:0;  
            width:34rpx;
            height:34rpx;
            border-radius:50%;
            border:1px solid rgba(0, 0, 0, 0.4);
            &.on {
                border:0 none;
                background:url('http://8.138.130.153:6003/vue/upload/static/common/ico-checked.png') no-repeat;
                background-size:contain;
            }
        } 
    }
    &.card-2 {
        .coupon-conent {
            .content {
                .left {
                    background:linear-gradient(205deg, #519ffa, #368ef6);
                }
                .info {
                    background:#e3f1fe;
                    .tags {
                        .tag {
                            border-color:rgba(54, 142, 246, 1);
                            color:rgba(54, 142, 246, 1);
                        }
                    }
                }
            }    
        }
    }
    &.card-3 {
        .coupon-conent {
            .content {
                .left {
                    background:linear-gradient(205deg, #48d2a3, #28bb89);
                }
                .info {
                    background:#e0efea;
                    .tags {
                        .tag {
                            border-color:rgba(40, 187, 137, 1);
                            color:rgba(40, 187, 137, 1);
                        }
                    }
                }
            }    
        }
    }
}
</style>