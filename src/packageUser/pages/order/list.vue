<template>
    <view class="page">
        <view class="tabs">
            <view 
                class="item"
                :class="tabIndex == index ? 'on' : ''"
                @click="changeTab(index)"
                v-for="(item,index) in tabList"
                :key="index"
            >
                {{item.name}}
            </view>
        </view>

        <view 
            class="banner"
            v-if="bannerList.length > 0"
        >
            <c-banner
                style="height:190rpx;"
                :list="bannerList"
            ></c-banner>
        </view>

        <view 
            class="list"
            v-if="allList[`type-`+tabIndex].list.length"
        >
            <view 
                class="item"
                :data-item="item"
                @click="goDetail"
                v-for="(item,index) in allList[`type-`+tabIndex].list"
                :key="index"
            >
                <view class="state">{{item.statusDesc}}</view>
                <view class="name">
                    <text class="t">{{item.fromPort}}</text>
                    <text class="i"></text>
                    <text class="t">{{item.toPort}} （{{item.isRoundTrip ? '双程' : '单程'}}）</text>
                </view>
                <view class="desc"><text>{{item.seatRank}}</text>{{item.passengerCount}}位</view>
                <view class="date">去程时间：{{item.departDate}} {{item.departTime}}</view>
                <view 
                    class="date"
                    v-if="item.isRoundTrip == 1"
                >
                    去程时间：{{item.returnDate}} {{item.returnDepartTime}}
                </view>
                <view class="price">
                    <text class="t">{{item.currencyType == 1 ? 'MOP' : 'RMB'}}</text>
                    <text class="p">{{item.currencyType === 1 ? item.price : item.rmbPrice}}</text>
                </view>
                <view class="actions">
                    <template v-if="item.status == 0">
                        <view 
                            class="btn" 
                            :data-item="item"
                            @click.stop="handlerCancel"
                        >
                            取消订单
                        </view>
                        <view 
                            class="btn orange" 
                            :data-item="item"
                            @click.stop="payOrder"
                        >
                            去支付

                            <!-- {{userStroe.user?.merchantAcitve ? '付款二维码' : '去支付' }} -->
                        </view>
                    </template>
                    <template v-if="item.status == 1">
                        <view 
                            class="btn" 
                            :data-item="item"
                            @click.stop="refundOrder"
                            >
                            退票
                        </view>
                        <view 
                            class="btn orange" 
                            :data-item="item"
                            @click.stop="handleCode"
                        >
                            验票二维码
                        </view>
                    </template>
                    <template v-if="item.status == -1">
                        <view 
                            class="btn" 
                            :data-item="item"
                            @click.stop="handlerDelOrder"
                        >
                            删除
                        </view>
                    </template>
                </view>
            </view>
        </view>

        <view 
            class="no-content"
            v-else
        >
            <c-no-content
                type="note"
                title="当前没有相关订单"
            ></c-no-content>
        </view>

        <c-bottom
            current="1"
            :isShowNav="true"
        ></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import order from '@/types/order'
import { getAdvertiseListApi } from '@/api/common'
import { getOrderListApi, getOrderDeleteApi, getOrderCancelApi } from '@/api/order'
export default{
    data(){
        return{
            options:'',
            tabList:[
                {
                    name:'全部',
                    status:99
                },
                {
                    name:'待支付',
                    status:0
                },
                {
                    name:'已支付',
                    status:1
                },
                {
                    name:'已登船',
                    status:4
                }
            ],
            allList:{
                'type-0':{
                    status:99,
                    isRequest:false,
                    done:false,
                    pageNum:1,
                    list:[],
                },
                'type-1':{
                    status:0,
                    isRequest:false,
                    done:false,
                    pageNum:1,
                    list:[],
                },
                'type-2':{
                    status:1,
                    isRequest:false,
                    done:false,
                    pageNum:1,
                    list:[],
                },
                'type-3':{
                    status:4,
                    isRequest:false,
                    done:false,
                    pageNum:1,
                    list:[],
                }      
            },
            pageSize:20,
            tabIndex:0,
            advertiseList:[],
            advertiseIndex:0,
            order,
        }
    },
    onLoad(e){
        this.options = e
    },
    onShow(){
        this.getList()
    },
    methods:{
        getValue:utils.getValue,
        getList(){
            uni.showLoading()

            let list = [
                this.getAdvertiseList(),
                this.getOrderList()
            ]

            Promise.all(list).then(()=>{
                uni.hideLoading()
            })
        },
        getOrderList(){
            let listObj = this.allList[`type-`+this.tabIndex]
            let params = {
                channel:4,
            }

            if(listObj.isRequest) return

            if(listObj.done) return

            listObj.isRequest = true

            Object.assign(params, {
                pageNum:listObj.pageNum,
                pageSize:this.pageSize      
            })

            if(listObj.status != 99){
                params.status = listObj.status
            }

            /*FULL_DEDUCT(0, "全额抵扣"),
                UE_PAY(1, "极易付"),
                WECHAT_PAY(2, "微信支付(人民币)"),
                M_PAY(3, "澳门通支付"),
                LUSO_PAY(4, "澳门国际银行"),
                JETCO_PAY(5, "JETCO信用卡"); */

            return new Promise((resolve)=>{
                getOrderListApi(params).then((res)=>{
                    listObj.isRequest = false

                    if(res.data.code == 200){
                        let data = res.data

                        if(data.rows.length == 0){
                            listObj.done = true
                        }

                        if(data.rows.length < this.pageSize){
                            listObj.done = true
                        }else{
                            listObj.pageNum++
                        }

                        listObj.list = listObj.list.concat(data.rows)
                    }

                    resolve()
                })
            })
        },
        getAdvertiseList(){
            let params = {
                position:2
            }

            return new Promise((resolve)=>{
                getAdvertiseListApi(params).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || []
                        this.advertiseList = data
                    }
                    resolve()
                })
            })
        },
        changeTab(index){
            this.tabIndex = index

            this.getOrderList()
        },
        goDetail(e){
            let item = e.currentTarget.dataset.item
            let query = {
                orderId:item.id
            }

            let url = `/packageUser/pages/order/detail?${utils.paramsStringify(query)}`

            if(item.status == 1){
                url = `/packageUser/pages/order/code?${utils.paramsStringify(query)}`
            }

            uni.navigateTo({
                url
            })

        },
        handlerCancel(e){
            let item = e.currentTarget.dataset.item
            uni.showModal({
                title:'温馨提示',
                content:'确认取消订单吗？',
                success:(res)=>{
                    if(res.confirm){
                        this.orderDelete(item)
                    }
                }
            })
        },
        cancelOrder(item){
            getOrderCancelApi(item.id,{}).then((res)=>{
                if(res.data.code == 200){
                    uni.showToast({
                        title:'取消成功',
                        icon:'none'
                    })
                    this.reloadList()
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        },
        payOrder(item){
            let query = {}

            let url = `/packageUser/pages/order/code?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url
            })
        },
        refundOrder(e){

        },
        handleCode(e){
            let item = e.currentTarget.dataset.item
            let query = {
                orderId:item.id,
                orderSn:item.orderSn
            }
            let url = `/packageUser/pages/order/code?${utils.paramsStringify(query)}`
            
            uni.navigateTo({
                url,
            })
        },
        handlerDelOrder(e){
            let item = e.currentTarget.dataset.item
            uni.showModal({
                title:'温馨提示',
                content:'确定删除订单吗？',
                success:(res)=>{
                    if(res.confirm){
                        this.orderDelete(item)
                    }
                }
            })
        },
        orderDelete(item){
            getOrderDeleteApi(item.id,{}).then((res)=>{
                if(res.data.code == 200){
                    uni.showToast({
                        title:'删除成功',
                        icon:'none'
                    })
                    this.reloadList()
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        },
        reloadList(){
            let listObj = this.allList[`type-`+this.tabIndex]

            listObj.pageNum = 1
            listObj.isRequest = false
            listObj.list = []
            listObj.done = false

            this.getOrderList()
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
    display:flex;
    height:108rpx;
    line-height:108rpx;
    .item {
        position:relative;
        flex:1;
        color:#000;
        font-size:30rpx;
        text-align:center;
        &.on {
            &::before {
                content:' ';
                position:absolute;
                bottom:25rpx;
                left:50%;
                transform:translateX(-50%);
                width:36rpx;
                height:8rpx;
                background:#EF672D;
                border-radius:4rpx;
                overflow:hidden;
            }
        }
    }
}

.banner {
    margin:0 auto;
    width:710rpx;
    height:190rpx;
    background:#CCC;
}

.list {
    margin:0 auto;
    width:710rpx;
    .item {
        position:relative;
        margin-bottom:24rpx;
        padding:30rpx;
        background:#FFF;
        border-radius:20rpx;
        overflow:hidden;
        .name {
            margin-bottom:32rpx;
            height:32rpx;
            line-height:32rpx;
            color:#000;
            font-size:28rpx;
            font-weight:500;
            text {
                display:inline-block;
                vertical-align:middle;
            }
            .i {
                margin:0 8rpx;
                width:24rpx;
                height:19rpx;
                background:url('https://newxcx.soofound.cn/vue/upload/static/order/icon-wf.png') no-repeat;
                background-size:contain;
            }
        }
        .desc {
            margin-bottom:24rpx;
            height:32rpx;
            line-height:32rpx;
            color:#555;
            font-size:24rpx;  
            text {
                display:inline-block;
                margin-right:8rpx;
            }  
        }
        .date {
            margin-bottom:24rpx;
            height:32rpx;
            line-height:32rpx;
            color:#555;
            font-size:24rpx;  
        }
        .price {
            margin-bottom:24rpx;
            font-weight:500;
            text-align:right;
            text {
                display:inline-block;
                color:#000;
                &.t {
                    font-size:22rpx;
                    margin-right:8rpx;
                }
                &.p {
                    margin-left:8rpx;
                    font-size:32rpx;
                    font-weight:500;
                }
            }
        }
        .actions {
            text-align:right;
            .btn {
                display:inline-block;
                width:164rpx;
                height:60rpx;
                line-height:60rpx;
                border-radius:30rpx;
                border:1px solid rgba(0,0,0,.2);
                color:rgba(0,0,0,.75);
                font-size:26rpx;
                text-align:center;
                vertical-align:middle;
                &.orange {
                    margin-left:40rpx;
                    border-color:#FF480E;
                    color:#FF480E;
                }
            }
        }
        .state {
            position:absolute;
            top:32rpx;
            right:32rpx;
            color:#FB6217;
            font-size:26rpx;
        }
    }
}

.no-content {
    margin:300rpx auto 0;
}
</style>