<template>
    <view class="page">
        <view class="title">
            {{content.title}}
        </view>
        <view class="date">
            {{content.updateTime}}
        </view>
        <rich-text :nodes="content.content"></rich-text>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getMaterialApi } from '@/api/common'
export default {
    data(){
        return{
            options:'',
            content:''
        }
    },
    onLoad(e){
        this.options = e

        this.getDetail()
    },
    methods:{
        getDetail(){
            let id = this.options.id || ''

            getMaterialApi(id,{}).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data

                    data.content = utils.replaceHTMLChar(data.content)
                    data.content = this.formatImg(data.content)

                    console.log(9999,'data',data.content)
                    this.content = data || {}
                    
                }
            })
        },
        formatImg(html){
            var newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
                var match = match.replace(/style=\"(.*)\"/gi, 'style="width:100%;height:auto" ');
                match = match.replace(/\<img /gi, '<img style="width:100%;height:auto" ');
                return match;
            });
            return newContent;
        },
    }
}
</script>

<style lang="scss" scoped>
.page {
    padding:0 40rpx;
    .title {
        padding:40 0rpx;
        font-size:48rpx;
        color:#000;
        font-weight:500;
    }
    .date {
        margin-bottom:40rpx;
        color:#999;
        font-size:24rpx;
    }
}
</style>