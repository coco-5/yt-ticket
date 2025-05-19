<template>
    <view class="page">
        <!-- <view class="tabs">
            <c-services-tab
                :tabIndex="tabIndex"
                @change="tabIndex = $event"
            ></c-services-tab>
        </view> -->

        <view 
            class="list"
            v-if="list.length"
        >
            <c-goods-card
                :item="item"
                v-for="(item,index) in list"
                :key="index"
                @cbOpen="cbOpen"
            ></c-goods-card>
        </view>

        <view 
            class="no-content"
            v-else
        >
            <c-no-content
                type="file"
                title="暂无增值服务"
            ></c-no-content>   
        </view>

        <c-write-off-code
            :isShow="isShowCode"
            :item="codeItem"
            @cbClose="cbClose"
        ></c-write-off-code>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getMyOrderListApi } from '@/api/common'
export default {
    data(){
        return{
            list:[],
            isShowCode:false,
            codeItem:''
        }
    },
    onLoad(e){
        this.options = e

        this.getList()
    },
    methods:{
        getList(){
            let list = [
                this.getOrderList()
            ]

            Promise.all(list).then()
        },
        getOrderList(){
            return new Promise((resolve)=>{
                getMyOrderListApi({}).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || []

                        this.list = data 
                    }
                })  
            })
        },
        cbOpen(item){
            this.isShowCode = true
            this.codeItem = item
        },
        cbClose(){
            this.isShowCode = false
            this.codeItem = ''
        },
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:#F8F8F8;  
}

.tabs {
    padding:40rpx 50rpx;
}

.list {
    padding:24rpx;
}

::v-deep .list .a {
    padding-bottom:24rpx;
}

::v-deep .list .a .status-box .btn {
    margin-right:24rpx;
}

.no-content {
    margin:300rpx auto 0;
}
</style>