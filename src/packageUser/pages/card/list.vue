<template>
    <view class="page">
        <view class="tabs">
            <view 
                class="item"
                :class="tabIndex == index ? 'on' : ''"
                v-for="(item,index) in tabs"
                :key="index"
                @click="change(index)"
            >
                <text>{{item.name}}</text>
            </view>
        </view>

        <view v-show="tabIndex == 0">
            <view 
                class="list"
                v-if="list.length"
            >
                <c-ticket-card
                    class="item"
                    type="buy"
                    :item="item"
                    v-for="(item,index) in list"
                    :key="index"
                    @showMore="showMore"
                    @goBuy="goBuy"
                    @showPortMore="showPortMore"
                ></c-ticket-card>
            </view>
    
            <view 
                class="no-content"
                v-else
            >
                <c-no-content
                    type="file"
                    title="暂无可用票卡"
                ></c-no-content>    
            </view>
        </view>

        <view v-show="tabIndex == 1">
            
            <view 
                class="list"
                v-if="list.length"
            >
                <c-ticket-card
                    class="item"
                    type="buy"
                    :item="item"
                    v-for="(item,index) in listExpire"
                    :key="index"
                ></c-ticket-card>
            </view>
    
            <view 
                class="no-content"
                v-else
            >
                <c-no-content
                    type="file"
                    title="暂无历史票卡"
                ></c-no-content> 
            </view>
        </view>

        <c-ticket-pop
            ref="cTicketPop"
        ></c-ticket-pop>

        <c-ticket-list-pop
            ref="cTicketListPop"
        ></c-ticket-list-pop>

        <view 
            class="actions"
            :style="bottomStyle"
        >
            <view 
                class="btn"
                @click="go"
            >
                购买票卡
            </view>
        </view>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getTicketCardMyListApi } from '@/api/ticket'
export default {
    data(){
        return{
            tabs:[
                {
                    name:'未使用/生效中',
                    value:0
                },
                {
                    name:'历史票卡',
                    value:1
                }
            ],
            tabIndex:0, 
            list:[],
            listExpire:[],
            bottomStyle:''    
        }
    },
    onLoad(e){
        this.options = e

        this.bottomStyle = `padding-bottom:${utils.fixIPhoneX() ? 48 : 0}rpx;`

        this.getList()
    },
    methods:{
        getList(){
            let list = [
                this.getTicketCardMyList()
            ]

            Promise.all(list)
        },
        getTicketCardMyList(){
            let params = {}

            return new Promise((resolve)=>{
                getTicketCardMyListApi(params).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || []
                        let list = []
                        let listExpire = []

                        data.forEach((item)=>{
                            item.ticketCardProtList = item.ticketProtList
                            if(item.type == 1){
                                item.class = 'times'
                            }else if(item.type == 2){
                                item.class = 'cash'
                            }else if(item.type == 3){
                                item.class = 'discount'
                            }else if(item.type == 4){
                                item.class = 'cash'
                            }

                            item.st = item.validateStartTime.split(' ')[0]
                            item.st = item.st.replace(/\-/g,'.')
                            item.et = item.validateEndTime.split(' ')[0]
                            item.et = item.et.replace(/\-/g,'.')
                            item.showMore = false

                            if(item.isExpire){
                                listExpire.push(item)
                            }else{
                                list.push(item)
                            }
                        })

                        this.list = list

                        this.listExpire = listExpire
                    }
                })
            })
        },
        showMore(item){
            let list = this.list

            for(let i=0;i<list.length;i++){
                if(list[i].id == item.id){
                    list[i].showMore = !list[i].showMore
                    break
                }
            }
        },
        showPortMore(item){
            let list = item.ticketProtList

            if(list && list.length){
                this.$refs.cTicketListPop.show(list)     
            }
        },
        goBuy(item){
            this.$refs.cTicketPop.show(item)
        },
        go(){
            let query = {}
            let url = `/packageUser/pages/card/buy`

            uni.navigateTo({
                url
            })
        },
        change(index){
            this.tabIndex = index
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:#F8F8F8;  
}

.tabs {
    padding:40rpx 100rpx;
    height:77rpx;
    line-height:77rpx;
    text-align:center;
    .item {
        position:relative;
        display:inline-block;
        margin:0 40rpx;
        color:#555;
        font-size:34rpx;
        vertical-align:middle;
        &.on {
            color:#333;
            font-weight:500;
            &::before {
                content:' ';
                position:absolute;
                bottom:17rpx;
                left:50%;
                transform:translateX(-50%);
                width:47rpx;
                height:12rpx;
                background:linear-gradient(205deg, #FA7358, #FE6630);
                border-radius:6rpx;
            }
        }
        text {
            position:relative;
            z-index:2;
        }
    }
}

.list {
    box-sizing:border-box;
    margin:0 auto;
    padding:32rpx;
    width:710rpx;
    background:#FFF;
    border-radius:20rpx;
}

.no-content {
    margin:300rpx auto 0;
}

.actions {
    position:fixed;
    z-index:2;
    bottom:0;
    left:0;
    width:100%;
    height:128rpx;
    background:#FFF;
    text-align:center;
    overflow:hidden;
    .btn {
        margin:16rpx auto;
        width:664rpx;
        height:100rx;
        line-height:100rpx;
        border-radius:50rpx;
        background:linear-gradient(87deg, #FFA63F, #EB5628);
        color:#FFF;
        font-size:34rpx;
        font-weight:500;
        text-align:center;
    }
}
</style>