<template>
    <view class="page">
        <view 
            class="banner"
        >
            <c-banner
                style="height:437rpx;"
                :list="bannerList"
                :current="bannerIndex"
                @change="changeBanner"
            ></c-banner>
        </view>

        <view class="book">
            <book></book>
        </view>

        <view class="cooperate">
            <cooperate></cooperate>
        </view>

        <view 
            class="bottom-banner"
            v-if="advertiseList.length > 0"
        >
            <c-banner
                style="width:720rpx;height:147rpx;"
                :list="advertiseList"
                :current="advertiseIndex"
                @change="changeAdvertise"
            ></c-banner>
        </view>

        <!-- 弹窗 -->
        <ticketPop></ticketPop>

        <c-bottom
            current="0"
            :isShowNav="true"
        ></c-bottom>
    </view>
</template>
 
<script>
import book from '@/packageIndex/components/book'
import cooperate from '@/packageIndex/components/cooperate'
import ticketPop from '@/packageIndex/components/ticketPop'
import { getBannerListApi, getAdvertiseListApi } from '@/api/common'
export default {
    components:{
        book,
        cooperate,
        ticketPop,
    },
    data(){
        return{
            options:{},
            bannerList:[],
            bannerIndex:0,
            advertiseList:[],
            advertiseIndex:0,
        }
    },
    onLoad(e){
        this.options = e

        this.getList()
    },
    methods:{
        getList(){
            let list = [
                this.getBannerList(),
                this.getAdvertiseList(),
            ]

            Promise.all(list).then(()=>{
            })
        },
        getBannerList(){
            let params = {}

            return new Promise((resolve)=>{
                getBannerListApi(params).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || []
                        this.bannerList = data
                    }
                })
            })
        },
        getAdvertiseList(){
            let params = {
                position:1
            }

            getAdvertiseListApi(params).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data || []
                    this.advertiseList = data
                }
            })
        },
        changeBanner(index){
            this.bannerIndex = index
        },
        changeAdvertise(index){
            this.advertiseIndex = index
        },
        clearStorage(){
            utils.clearServices()

            uni.removeStorageSync('addedValueList')
        },
    },
    onShareAppMessage(e){
        return {
            title: ``,
            path: ``
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:#FF7937;
}

.banner {
    height:437rpx;
}

.cooperate {
    margin:24rpx 15rpx;
}

.bottom-banner {
    margin:0 auto 60rpx;
    width:720rpx;
}
</style>