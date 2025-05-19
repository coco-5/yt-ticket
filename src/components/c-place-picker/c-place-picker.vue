<template>
    <view 
        class="c-picker-box" 
        :style="{height:height}"
    >
        <view class="hd">
            <view class="title">
                {{title}}
            </view>        
            <view 
                class="close" 
                @click="closePop"
            >
            </view> 
        </view>
        <view 
            class="bd"
            v-if="list.length > 0"
        >
            <view 
                class="item"
                :class="{'active':index == current}"
                @click="choose(item,index)"
                v-for="(item,index) in list"
                :key="index"
            >
                {{item.portName}}
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        isShow:{
            type:Boolean,
            default:false
        },
        height:{
            type:String,
            default:'50%'
        },
        list:{
            type:Array,
            default:[]
        },
        title:{
            type:String,
            default:'请选择'
        },
        current:{
            type:Number,
            default:0
        }
    },
    watch:{
        current:{
            deep:true,
            handler(n){}
        }
    },
    methods:{
        closePop(){
            this.$emit('cbClosePop')
        },
        choose(item,index){
            this.$emit('cbChoose',item,index)
            this.closePop()
        }
    }
}
</script>

<style lang="scss" scoped>
.c-picker-box {
    .hd {
        position:relative;
        padding:60rpx 0;
        height:42rpx;
        line-height:42rpx;
        color:#000;
        font-size:40rp;
        font-weight:500;
        text-align:center;
        .close {
            position:absolute;
            top:30rpx;
            right:24rpx;
            width:42rpx;
            height:43rpx;
            background:url('http://8.138.130.153:6003/vue/upload/static/common/icon-colse.png') no-repeat;
            background-size:contain;
        }
    }
    .bd {
        padding:0 24rpx;
        height:calc(100% - 42rpx);
        overflow-y:auto;
        .item {
            height:100rpx;
            line-height:100rpx;
            border-bottom:1px solid #E5E5E5;
            color:#000;
            font-size:30rpx;
            &:last-child {
                border-bottom:none;
            }
            &.active {
                position:relative;
                color:#FF7937;
                font-weight:500;
                &::after {
                    content:' ';
                    position:absolute;
                    top:50%;
                    right:0;
                    transform:translateY(-50%);
                    width:34rpx;
                    height:34rpx;
                    background:url('http://8.138.130.153:6003/vue/upload/static/common/icon-select.png') no-repeat;
                    background-size:contain;
                }
            }
        }
    }
}
</style>