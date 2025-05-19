<template>
    <view 
        class="c-banner"
        :style="style"
    >
        <template v-if="list.length > 0">
            <swiper 
                :style="style"
                :indicator-dots="false"
                :autoplay="autoplay"
                :current="current"
                :interval="interval"
                :circular="true"
                @animationfinish="change"
            >
                <swiper-item 
                    class="swiper-item"
                    :style="style"
                    v-for="(item,index) in list" 
                    v-if="item.display == 1"
                    :key="index"
                >
                    <image 
                        :src="item.img" 
                        @click="handleClick(item)"
                    ></image>
                </swiper-item>
            </swiper>
            <view 
                class="dots"
                v-if="indicatorDots"
            >
                <view 
                    class="item"
                    :class="{'active':index == current}"
                    v-for="(item,index) in list"
                    v-if="item.display == 1"
                    :key="index"
                ></view>
            </view>
        </template>
        
        <template v-else>
            <image 
                mode="widthFix"
                :src="list[0].img" 
                @click="handleClick(list[0])"
                v-if="list[0].display == 1"
            ></image>
        </template>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    props:{
        list:{
            type:Array,
            default:[]
        },
        style:{
            type:String,
            default:''
        },
        indicatorDots:{
            type:Boolean,
            default:true
        },
        indicatorColor:{
            type:String,
            default:'#fff'
        },
        indicatorActiveColor:{
            type:String,
            default:'#000'
        },
        autoplay:{
            type:Boolean,
            default:false
        },
        current:{
            type:Number,
            default:0
        },
        interval:{
            type:Number,
            default:3000
        }
    },
    data(){
        return {
            options:{}
        }
    },
    mounted(e){
        this.options = e
    },
    methods:{
        change(e){
            let current = e.detail.current
            this.$emit('change',current)
        },
        handleClick(item){
            let query = {}
            let url = {}

            if(item.linkType == 1){
                query = {
                    url:item.link
                }  
                url = `/pages/notice/notice?${utils.paramsStringify(query)}`
            }else if(item.linkType == 2){
                url = item.link
            }

            this.go(url)
        },
        go(url){
            uni.navigateTo({
                url,
            })

        }
    }
}
</script>

<style lang="scss" scoped>
.c-banner {
    position:relative;
    .swiper-item {
        text-align:center;
    }
    image {
        width:100%;
        height:100%;
    }
    .dots {
        position:absolute;
        bottom:10rpx;
        left:50%;
        transform:translateX(-50%);
        .item {
            display:inline-block;
            margin-right:8rpx;
            width:8rpx;
            height:8rpx;
            border-radius:4rpx;
            background:rgba(#F6F6F6,.6);
            vertical-align:middle;
            &.active {
                width:24rpx;
                height:8rpx;
                background:rgba(#F6F6F6,1);
            }
        }
    }
}
</style>