<template>
    <view class="c-item">
        <view 
            class="left"
            @click="handleDetail(item)"
        >
            <image 
                class="img"
                :src="item.imageUrl" 
            ></image>
            <view 
                class="left-desc"
                v-if="item.detailsImg.length" 
            >查看详情</view>
        </view>
        <view class="content-box">
            <view class="name ellipsis">{{item.name || ''}}</view>
            <view class="desc ellipsis">{{item.remark || ''}}</view>
            <view class="stepper-box">
                <view class="group">
                    <view 
                        class="minus"
                        :class="item.value == 1 ? 'disabled' : ''"
                        @click="handleMinus(item)"
                    ></view>
                    <view class="input">
                        <input 
                            type="number" 
                            v-model="item.value"
                            @blur="handleBlur(item,$event)"
                        />
                    </view>
                    <view 
                        class="add"
                        :class="item.value == item.num ? 'disabled' : ''"
                        @click="handleAdd(item)"
                    ></view>
                </view>
            </view>
            <view class="price-box">
                <view class="price-item">
                    <text class="unit">MOP</text>
                    <text class="text">{{item.price}}</text>
                </view>
                <view class="price-item rmb">
                    <text class="unit">RMB</text>
                    <text class="text">{{item.rmbPrice}}</text>
                </view>
            </view>
        </view>
        <view class="checkbox">
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
        handleDetail(item){
            this.$emit('cbDetail',item)
        },
        handleMinus(item){
            this.$emit('cbeMinus',item)
        },
        handleAdd(item){
            this.$emit('cbAdd',item)
        },
        handleBlur(item,e){
            this.$emit('cbBlur',item,e)   
        },
        hanlderChecked(item){
            this.$emit('cbChecked',item)
        }
    }
}
</script>

<style lang="scss" scoped>
.c-item {
    position:relative;
    margin-bottom:20rpx;
    padding:25rpx 160rpx 0 260rpx;
    background:#FFF;
    border-radius:20rpx;
    .left {
        position:absolute;
        top:25rpx;
        left:25rpx;
        width:200rpx;
        .img {
            width:100%;
            height:200rpx;
            border-radius:20rpx;
            overflow:hidden;
        }
        .left-desc {
            margin-top:4rpx;
            color:#989595;
            font-size:24px;
            text-align:center;
        }
    }
    .content-box {
        overflow:hidden;
        .ellipsis {
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }
        .name {
            margin-bottom:16rpx;
            font-weight:500;
            font-size:24rpx;
            color:#222;
        }
        .desc {
            font-size:24rpx;
            color:rgba(0,0,0,.7);
        }
        .stepper-box {
            margin:32rpx 0 24rpx;
            .group {
                position:relative;
                display:inline-block;
                height:56rpx;
                .add,
                .minus,
                .input {
                    display:inline-block;
                    vertical-align:top;
                }
                .add,
                .minus {
                    position:relative;
                    width:56rpx;
                    height:56rpx;
                    line-height:56rpx;
                    border:1px solid #e6e6e6;
                    &::before {
                        content:' ';
                        position:absolute;
                        top:50%;
                        left:50%;
                        transform:translate(-50%,-50%);
                        width:50%;
                        height:2rpx;
                        background:rgba(0,0,0);
                    }
                    &::after {
                        content:' ';
                        position:absolute;
                        top:50%;
                        left:50%;
                        transform:translate(-50%,-50%);
                        width:2rpx;
                        height:50%;
                        background:rgba(0,0,0);
                    }
                    &.disabled {
                        &::before {
                            background:rgba(204,204,204);    
                        }
                        &::after {
                            background:rgba(204,204,204);        
                        }
                    }
                }
                .minus {
                    border-radius:8rpx 0 0 8rpx;
                    &::after {
                        display:none;
                    }
                }
                .add {
                    border-radius:0 8rpx 8rpx 0;
                }
                .input {
                    padding:0 8rpx;
                    width:50rpx;
                    height:56rpx;
                    border:1px solid #e6e6e6;
                    border-left:0;
                    border-right:0;
                    text-align:center;
                    input {
                        display:inline-block;
                        width:100%;
                        height:100%;   
                        vertical-align:top;
                    }
                }
            }
        }
        .price-box {
            padding-bottom:24rpx;
            display:flex;
            align-items:center;
            justify-content:flex-end;
            .price-item {
                display:flex;
                align-items:flex-end;
                margin-left:38rpx;
                color:#fd5a26;
                font-weight:500;
                &.rmb {
                    color:#000;
                }
                .unit {
                    font-size:22rpx;
                    margin-right:6rpx;
                }
            }
            .num {
                font-size:34rpx;
            }
        }
    }
    .checkbox {
        position:absolute;
        right:36rpx;
        top:184rpx;
        .icon {
            position:absolute;
            display:inline-block;
            bottom:24rpx;
            right:0;  
            width:34rpx;
            height:34rpx;
            border-radius:50%;
            border:1px solid rgba(0, 0, 0, 0.4);
            &.on {
                border:0 none;
                background:url('https://newxcx.soofound.cn/vue/upload/static/common/ico-checked.png') no-repeat;
                background-size:contain;
            }
        } 
    }
}
</style>