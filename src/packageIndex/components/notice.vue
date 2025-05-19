<template>
    <view 
        class="c-notice"
        v-if="noticeList.length"
    >
        <template v-if="noticeList.length == 1">
            <noticeItem
                :msg="noticeList[0]"
            ></noticeItem>
        </template>
        <swiper 
            class="swiper"
            :autoplay="true"
            v-else
        >
            <swiper-item
                class="swiper-item"
                v-for="(item,index) in noticeList"
                :key="index"
            >
                <noticeItem
                    :msg="item"
                ></noticeItem>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
import { getNoticeListApi } from '@/api/common'
import noticeItem from '@/packageIndex/components/noticeItem'
export default {
    components:{
        noticeItem,
    },
    data(){
        return {
            noticeList:[]
        }
    },
    mounted(){
        this.getNoticeList()
    },
    methods:{
        getNoticeList(){
            getNoticeListApi({}).then((res)=>{
                //这个接口为首页船票通知  linkType链接类型 1-第三方链接 2-原生链接 3-无链接
                if(res.data.code == 200){
                    let data = res.data.data || []

                    this.noticeList = data
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.c-notice {
    position:relative;
    margin:24rpx 44rpx 0;
    padding:0 16rpx;
    height:55rpx;
    line-height:55rpx;
    background:#FCF2EC;
    border-radius:4rpx;
    color:#EC702E;
    font-size:25rpx;
}

.swiper {
    height:55rpx;
    .swiper-item {
        height:55rpx;
    }
}
</style>