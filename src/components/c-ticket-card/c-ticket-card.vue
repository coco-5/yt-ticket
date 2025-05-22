<template>
    <view 
        class="c-card"
        :class="(type ? 'card-'+type : 'card') + (item.isExpire ? ' disabled' : '')"
    >
        <view 
            class="main"
            :class="item.class"
        >
            <view 
                class="left"
                v-if="['buy', 'checked'].includes(type)"
            >
                <template v-if="item.type == 1">
                    <view class="num">{{item.useNum}}</view>
                    <view class="imtes">可用（次）</view>
                </template>
                <template v-else-if="item.type == 3">
                    <view class="num">{{item.discountRate / 10}}折</view>
                    <view class="imtes">购买享受</view>
                </template>
                <template v-else>
                    <view class="num">{{item.usePrice}}</view>
                    <view class="imtes">可用（元）</view>
                </template>
            </view>
            <view class="info">
                <view class="name">{{item.name}}</view>
                <view 
                    class="tags"
                    v-if="item.ticketCardProtList && item.ticketCardProtList.length"
                >
                    <view 
                        class="tag"
                        v-for="(tag,i) in item.ticketCardProtList"
                        :key="i"
                        v-if="i < 2"
                    >
                        限{{tag.fromPortName}}-{{tag.toPortName}}   
                    </view>
                </view>
                <view 
                    class="tags-more"
                    v-if="item.ticketCardProtList && item.ticketCardProtList.length > 2"
                    @click="showPortMore"
                >
                    更多航线
                </view>
                <view class="date">有效期：{{item.st}}-{{item.et}}</view>
                <view 
                    class="shuoming"
                    @click="showMore"
                >
                    详细说明 <text class="ico"></text>
                </view>
                <view 
                    class="price"
                    v-if="!type"
                >
                    <view 
                        class="item del"
                        v-if="item.discountPrice"
                    >
                        <text class="t">MOP</text>{{item.originalPrice}}
                    </view>
                    <view class="item">
                        <text class="t">MOP</text>{{item.discountPrice || item.originalPrice}}
                    </view>
                </view>
                <view 
                    class="btn"
                    @click="goBuy"
                    v-if="!item.isExpire"
                >
                    购买
                </view>
            </view>
            <view 
                class="checkbox"
                v-if="type == 'checked'"
            >
                <view 
                    class="icon"
                    :class="item.checked ? 'on' : ''"
                    @click="hanlderChecked(item)"
                ></view>
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
            <rich-text :nodes="item.remark"></rich-text>
        </view>
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
        return{}
    },
    mounted(){
    },
    methods:{
        showMore(){
            this.$emit('showMore',this.item)
        },
        goBuy(){
            this.$emit('goBuy',this.item)

        },
        showPortMore(){
            this.$emit('showPortMore',this.item)
        },
        hanlderChecked(item){
            this.$emit('cbChecked',item)
        }
    }
}
</script>

<style lang="scss" scoped>
.c-card {
    position:relative;
    margin-bottom:16rpx;
    .main {
        .left {
            height:100%;
            font-size:24rpx;
        }
        .info {
            position:relative;
            height:100%;
            .name {
                margin:0 0 8rpx;
                color:#000;
                font-size:30rpx;
                font-weight:500;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            }
            .tags {
                margin-bottom:16rpx;
                height:32rpx;
                .tag {
                    display:inline-block;
                    margin-right:8rpx;
                    padding:0 12rpx;
                    height:30rpx;
                    line-height:30rpx;
                    border:1px solid #FE6630;
                    border-radius:5rpx;
                    color:#FE6630;
                    font-size:18rpx;
                    vertical-align:top;
                }
            }
            .tags-more {
                margin-bottom:16rpx;
                height:32rpx;
                font-size:20rpx;
                text-decoration:underline;
                color:rgba(0, 0, 0, 0.6);
            }
            .date {
                height:22rpx;
                line-height:22rpx;
                color:#000;
                opacity:0.6;
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
            .btn {
                position:absolute;
                bottom:16rpx;
                right:14rpx;
                width:90rpx;
                height:44rpx;
                line-height:44rpx;
                border-radius:22rpx;
                border:1px solid #EE622C;
                color:#EE622C;
                font-size:24rpx;
                text-align:center;
            }
        }
        &.discount {
            .tags {
                .tag {
                    border-color:#28BB89;
                    color:#28BB89;
                }
            }
            .btn {
                border-color:#28BB89;
                color:#28BB89;
            }
        }
        &.cash {
            .tags {
                .tag {
                    border-color:#368EF6;
                    color:#368EF6;
                }
            }
            .btn {
                border-color:#368EF6;
                color:#368EF6;
            }
        }
    }
    .more {
        margin-top:1px;
        padding:20rpx;
        background:#F5F5F5;
        border-radius:20rpx;
        color:#999;
        font-size:18rpx;
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
    &.disabled {
        filter:grayscale(100%);
        &::before {
            content:' ';
            position:absolute;
            top:0;
            right:0;
            z-index:2;
            width:99rpx;
            height:99rpx;
            background:url('http://8.138.130.153:6003/vue/upload/static/ticketCard/invalid.png') no-repeat;
            background-size:contain;
        }
    }
}

.card {
    .main {
        box-sizing:border-box;
        position:relative;
        padding:24rpx 28rpx;
        background:#FFF3EC;
        border-radius:20rpx;
        overflow:hidden;
        .left {
            display:none;
        }
        .price {
            position:absolute;
            top:0;
            right:0;
            height:44rpx;
            line-height:44rpx;
            color:#414141;
            font-size:28rpx;
            font-weight:500;
            text-align:right;
            .item {
                display:inline-block;
                vertical-align:middle;
            }
            .del {
                margin-right:24rpx;
                font-size:20rpx;
                color:#999;
                text-decoration:line-through;
            }
            .t {
                display:inline-block;
                margin-right:4rpx;
                font-size:20rpx;
            }
        }
        .btn {
            position:absolute;
            bottom:16rpx;
            right:14rpx;
            width:90rpx;
            height:44rpx;
            line-height:44rpx;
            border-radius:22rpx;
            border:1px solid #EE622C;
            color:#EE622C;
            font-size:24rpx;
            text-align:center;
        }
        &.discount {
            background:#E0EFEA;
        }
        &.cash {
            background:#E3F1FE;
        }
    }
}

.card-buy,
.card-checked {
    .main {
        position:relative;
        padding-left:194rpx;
        min-height:194rpx;
        .left {
            display:block;
            position:absolute;
            top:0;
            left:0;
            width:194rpx;
            background:linear-gradient(205deg, #ff7e50, #f74939);
            border-radius:20rpx;
            color:#FFF;
            text-align:center;
            .num {
                padding:50rpx 0 16rpx;
                height:62rpx;
                line-height:62rpx;
                font-weight:500;
                font-size:60rpx;
            }
            .times {
                font-size:24rpx;
            }
            &::before {
                content:' ';
                position:absolute;
                z-index:2;
                width:40rpx;
                height:40rpx;
                background:#FFF;
                border-radius:20rpx;
                top:-20rpx;
                right:-20rpx;
            }
            &::after {
                content:' ';
                position:absolute;
                z-index:2;
                width:40rpx;
                height:40rpx;
                background:#FFF;
                border-radius:20rpx;
                bottom:-20rpx;
                right:-20rpx;
            }
        }
        .info {
            box-sizing:border-box;
            padding:24rpx 8rpx 24rpx 24rpx;
            background:#fff3ec;
            border-radius:20rpx;
        }
        .checkbox {
            position:absolute;
            right:4rpx;
            top:50%;
            transform:translateY(-50%);
            width:34rpx;
            height:34rpx;
            .icon {
                display:inline-block;
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
        &.discount {
            .left {
                background:linear-gradient(205deg, #48d2a3, #28bb89);
            }
            .info {
                background:#e0efea;
                color:rgba(40, 187, 137, 1);
                border-radius:0 20rpx 20rpx 0;
            }
        }
        &.cash {
            .left {
                background:linear-gradient(205deg, #519ffa, #368ef6);  
            }
            .info {
                background:#e3f1fe;
                color:#e3f1fe;  
                border-radius:0 20rpx 20rpx 0;
            }
        }
    }
}

.card-checked {
    .main {
        padding-right:50rpx;
        .btn {
            display:none!important;
        }
    }
    .more {
        margin-right:50rpx;
    }
}
</style>