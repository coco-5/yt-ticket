<template>
    <view 
        class="c-passenger"
        :class="needAction ? 'action' : 'no-action'"
    >
        <view 
            class="ico"
            :class="item.class"
            @click="handler"
        ></view>
        <view class="name">
            <text class="n">{{item.passengerName}}</text>
            <text class="t">{{item.passengerTypeName}}</text>
        </view>
        <view class="passport">
            <text class="n">{{item.certificateTypeName}}</text>
            <text class="t">{{item.certificateNumber}}</text>
        </view>
        <view 
            class="edit"
            @click="edit"
            v-if="isShowEdit"
        ></view>
    </view>
</template>

<script>
export default {
    props:{
        needAction:{
            type:Boolean,
            default:false
        },
        isShowEdit:{
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
        handler(){
            this.$emit('handler',this.item)
        },
        edit(){
            this.$emit('edit',this.item)
        }
    }
}
</script>

<style lang="scss" scoped>
.c-passenger {
    .name {
        .n,
        .t {
            display:inline-block;
            vertical-align:middle;
        }
        .n {
            margin-right:12rpx;
            color:#000;
            font-size:30rpx;
        }
        .t {
            padding:0 10rpx;
            height:30rpx;
            line-height:30rpx;
            border:1px solid #B2B2B2;
            border-radius:5rpx;
            color:#A3A3A3;
            font-size:18rpx;
        }
    }
    .passport {
        .t,
        .n {
            display:inline-block;
            vertical-align:middle;
        }
        .n {
            margin-right:12rpx;
        }
    }
}

.c-passenger {
    &.no {
        position:relative;
        margin-bottom:24rpx;
        .ico {
            display:inline-block;
            margin-right:32rpx;
            width:38rpx;
            height:38rpx;
            background:#EEE;
            vertical-align:middle;
        }
        .name {
            display:inline-block;
            height:32rpx;
            line-height:32rpx;
            color:rgba(0,0,0,.9);
            vertical-align:middle;
        }
        .right {
            position:absolute;
            top:0;
            right:0;
            height:32rpx;
            color:rgba(0,0,0,.7);
        }
    }
}

.c-passenger {
    position:relative;
    &.action {
        position:relative;
        margin-left:72rpx;
        padding:28rpx 0;
        border-bottom:1px solid rgba(0,0,0,0.06);
        height:80rpx;
        .ico {
            position:absolute;
            top:32rpx;
            left:-72rpx;
            width:38rpx;
            height:38rpx;
            border:1px solid #FD5A26;
            border-radius:50%;
            &.add {
                &::before {
                    content:' ';
                    position:absolute;
                    top:50%;
                    left:50%;
                    transform:translate(-50%,-50%);
                    width:4rpx;
                    height:70%;
                    background:#FD5A26;
                    overflow:hidden;
                }
                &::after {
                    content:' ';
                    position:absolute;
                    top:49%;
                    left:50%;
                    transform:translate(-50%,-50%);
                    width:70%;
                    height:4rpx;
                    background:#FD5A26;
                    overflow:hidden;
                }
            }
            &.del {
                &::after {
                    content:' ';
                    position:absolute;
                    top:49%;
                    left:50%;
                    transform:translate(-50%,-50%);
                    width:70%;
                    height:4rpx;
                    background:#FD5A26;
                    overflow:hidden;
                }
            }
            &.check-box {
                width:30rpx;
                height:30rpx;
            }
            &.checked-box {
                width:30rpx;
                height:30rpx;
                background:url('http://8.138.130.153:6003/vue/upload/static/common/ico-checked.png') no-repeat;
                background-size:contain;
            }
        }
        .name {
            margin-bottom:16rpx;
            height:32rpx;
            line-height:32rpx;
        }
        .passport {
            height:30rpx;
            line-height:30rpx;
            color:#8D8D8D;
            font-size:24rpx;
        }
        .edit {
            position:absolute;
            top:50%;
            right:0;
            transform:translate(-50%,-50%);
            width:28rpx;
            height:28rpx;
            background:url('http://8.138.130.153:6003/vue/upload/static/passenger/icon-edit.png') no-repeat;
            background-size:contain;
            //icon-edit
        }
    }
    &.no-action {
        position:relative;
        padding:8rpx 0;
        border-bottom:1px solid rgba(0,0,0,0.06);
        height:80rpx;
        line-height:80rpx;
        .passport {
            position:absolute;
            top:50%;
            right:0;
            transform:translateY(-50%);
            .n {
                color:#8D8D8D;   
            }
        }
        &:last-child {
            border-bottom:none;
        }
    }
}
</style>