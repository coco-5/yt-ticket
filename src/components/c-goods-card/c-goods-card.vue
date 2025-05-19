<template>
    <view class="a">
        <image 
            class="img" 
            :src="item.addedValueImageUrl" alt="" 
        />
        <view class="conent-box">
            <view class="name">
                {{item.addedValueName}}
            </view>
            <view class="desc">描述描述{{item.remark || ''}}</view>
            <view class="stepper-box">
                <text>数量</text> {{item.num}}
            </view>
            <view class="price-box">
                <view class="price-item">
                    <text class="u">MOP</text>
                    <text class="n">{{item.price}}</text>
                </view>
                <view class="price-item rmb">
                    <text class="u">RMB</text>
                    <text class="n">{{item.rmbPrice}}</text>
                </view>
            </view>
            <view class="status-box">
                <view 
                    class="status" 
                    :class="{active:item.status == 1}">
                        {{statusName()}}
                    </view>
                <view 
                    class="btn" 
                    v-if="item.status == 1 || item.status == 4" 
                    @click="handleOpen"
                >
                    核销二维码
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// 状态 0-未支付 1-已支付 2-退票中 3-已退票 4-已核销
export default {
    props:{
        item:{
            type:Object,
            default:{}
        }
    },
    data(){
        return {    
        }
    },
    mounted(){
    },
    methods:{
        statusName(){  
            if(this.item.status == 0){
                return '未支付'
            }else if(this.item.status == 1){
                return '已支付'
            }else if(this.item.status === 2){
                return '退票中'
            }else if(this.item.status === 3){
                return '已退票'
            }else if(this.item.status === 4){
                return '已核销'
            }else{
                return ''
            }
        },
        handleOpen(){
            this.$emit('cbOpen',this.item)
        }
    }
}
</script>

<style lang="scss" scoped>
.a {
    position:relative;
    display:flex;
    align-items:flex-start;
    margin-bottom:20rpx;
    background:#FFF;
    border-radius:20rpx;
    .img {
        width:200rpx;
        height:200rpx;
        border-radius:20rpx;
    }
    .conent-box {
        flex:1;
        margin-left:36rpx;
        padding-top:26rpx;
        overflow:hidden;
        .name {
            margin-bottom:8rpx;
            font-weight:500;
            font-size:24rpx;
            color:#222;
        }
        .desc {
            margin-bottom:8rpx;
            font-size:20rpx;
            color:#000;
            opacity:0.7;
        }
        .stepper-box {
            font-size:20rpx;
            color:#000;
            opacity:0.7;
        }
        .price-box {
            display:flex;
            align-items:center;
            .price-item {
                display:flex;
                align-items:flex-end;
                margin-right:38rpx;
                color:#000;
                opacity:0.7;
                font-size:20rpx;
                margin-top:8rpx;
                .u {
                    margin-right:6rpx;
                }
            }
        }
        .status-box {
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-top:16rpx;
            .status {
                font-size:20rpx;
                color:rgb(0, 81, 255);
                &.active {
                    color: rgb(40, 174, 3);
                }
            }
            .btn {
                display:flex;
                align-items:center;
                justify-content:center;
                padding:4rpx 8rpx;
                color:#e96404;
                border-radius:40rpx;
                border:1px solid #e96404;
                font-size:24rpx;
            }
        }
    }
}
</style>