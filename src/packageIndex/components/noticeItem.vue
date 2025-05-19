<template>
    <view 
        class="notice"
        @click="handleClick"
    >
        <view class="mic"></view> 
        <view class="text">【重要提示】{{msg.title}}</view>
        <view class="ico"></view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    props:{
        msg:{
            type:Object,
            default:{}
        }
    },
    mounted(){

    },
    methods:{
        handleClick(){
            let item = this.msg
            let query = {}
            let url = {}

            //这个接口为首页船票通知  linkType链接类型 1-第三方链接 2-原生链接 3-无链接

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
.notice {
    .mic {
        display:inline-block;
        width:24rpx;
        height:21rpx;
        background:url('http://8.138.130.153:6003/vue/upload/static/index/volume.png') no-repeat;
        background-size:contain;
        vertical-align:middle;
    }
    .text {
        display:inline-block;
        width:90%;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        vertical-align:middle;
    }
    .ico {
        position:absolute;
        top:50%;
        right:24rpx;
        transform:translateY(-50%);
        width:9rpx;
        height:14rpx;
        background:url('http://8.138.130.153:6003/vue/upload/static/index/arrows.png') no-repeat;
        background-size:contain;
    }
}
</style>