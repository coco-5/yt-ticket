<template>
    <view class="page">
        <view class="tabs">
            <view 
                class="item"
                :class="tabIndex == index ? 'on' : ''"
                @click="changeTab(index)"
                v-for="(item,index) in tabs"
                :key="index"
            >
                {{item.name}}
            </view>
        </view>

        <view v-if="tabIndex == 0">
            <view class="wrap-code">
                <view class="dest">
                    <text class="t">{{orderDetail.fromPort}}</text>
                    <text class="i"></text>
                    <text class="t">{{orderDetail.toPort}}</text>
                </view>
                <view class="tips-nodes">
                    <rich-text :nodes="nodes"></rich-text>
                </view>
                <view class="tips-code">凭二维码验票乘船</view>
                <view 
                    class="swpier-code"
                    v-if="ticketList.length"
                >
                    <view 
                        class="btn prev"
                        :class="ticketIndex == 0 ? 'disabled' : ''"
                        @click="prev"
                        v-if="ticketList.length > 1"
                    ></view>
                    <view 
                        class="btn next"
                        :class="ticketIndex == ticketList.length - 1 ? 'disabled' : ''"
                        @click="next"
                        v-if="ticketList.length > 1"
                    ></view>
                    <view class="list-code">
                        <c-qrcode
                            ref="qrcode"
                        ></c-qrcode>
                    </view>
                    <view 
                        class="dots"
                        v-if="ticketList.length > 1"
                    >
                        <view 
                            class="dot"
                            :class="index == ticketIndex ? 'on' : ''"
                            v-for="(item,index) in ticketList"
                            :key="index"
                        ></view>
                    </view>
                </view>
                <view class="btn-refresh">{{ticketList[ticketIndex].statusDesc}}</view>
                <view class="btn-line"></view>
                <view 
                    class="item-passenger"
                    v-if="ticketList.length"
                >
                    <view 
                        v-for="(item,index) in ticketList"
                        :key="index"
                        v-if="ticketIndex == index"
                    >
                        <view class="user">
                            <view class="name">
                                <text class="n">{{item.passengerName}}</text>
                                <text class="t">成人</text>
                            </view>
                            <view class="cheng">{{item.trip == 1 ? '去程' : '返程'}}</view>
                        </view>
                        <view class="item">
                            <text class="label">{{item.certificateTypeName}}</text>
                            <text class="right">{{item.certificateNumber}}</text>
                        </view>
                        <view class="item">
                            <text class="label">票号</text>
                            <text class="right">{{item.ticketCode}}</text>
                        </view>
                        <view class="item">
                            <text class="label">座位</text>
                            <text class="right">{{item.seatNumber}}号</text>
                            <view class="tips">*座位号以当天入闸后的实际座位号为准</view>
                        </view>
                        <view class="item">
                            <text class="label">出发时间</text>
                            <text class="right">{{item.trip === 1 ? orderDetail.departDate : orderDetail.returnDate}}</text>
                        </view>
                    </view>
                </view>
            </view>

            <view class="thanks">感谢您购买我司轮渡航班，祝您旅途愉快！</view>
        </view>

        <view v-if="tabIndex == 1">
            <view class="wrap-top">
                <c-trip-detail
                    v-for="(item,index) in tripList"
                    :key="index"
                    :item="item"
                    :isShowType="true"
                    :isShowLong="true"
                ></c-trip-detail>
            </view>

            <view class="wrap-passanger">
                <view class="hd">
                    乘客<view class="ico"></view>
                </view>
                <view class="bd">
                    <c-passenger-item
                        v-for="(item,index) in passengerList"
                        :key="index"
                        :item="item"
                    ></c-passenger-item>
                </view>
            </view>

            <view class="wrap-order">
                <view class="hd">
                    订单明细<view class="ico"></view>
                </view>
                <view class="bd">
                    <c-order-item
                        :detail="orderDetail"
                        @cbOpen="cbOpen"
                    ></c-order-item>
                </view>
            </view>
        </view>

        <view 
            class="banner"
            v-if="advertiseList.length > 0"
        >
            <c-banner
                style="height:189rpx;"
                :list="advertiseList"
            ></c-banner>
        </view>

        <view
            class="expense-btn"
            v-if="orderDetail.status == 4 || orderDetail.status == 1 || orderDetail.status == 6"
            @click="handleExpense"
        >
            报销凭证
        </view>

        <view class="actions">
            <template v-if="[0,1].includes(orderDetail.status)">
                <view 
                    class="btn btn1" 
                    @click="goHome"
                >
                    返回首页
                </view>
                <template v-if="orderDetail.status === 0">
                    <view 
                        class="btn btn1"
                        @click="handlerCancelOrder"
                    >
                        取消订单
                    </view>
                    <view 
                        class="btn btn1"
                        @click="handlerPay"
                    >
                        去支付
                    </view>
                </template>
                <template v-else>
                    <view 
                        class="btn btn1"
                        @click="checkOrder"
                    >
                        退票
                    </view>
                    <view 
                        class="btn btn2"
                        @click="changeTab(0)"
                        v-if="tabIndex == 1"
                    >
                        验票二维码
                    </view>
                </template>
            </template>
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
import order from '@/types/order'
import passenger from '@/types/passenger'
import { getAdvertiseListApi } from '@/api/common'
import { getOrderDetailApi,getOrderExpenselApi,checkRefundApi, refundOrderApi } from '@/api/order'

export default {
    data(){
        return{
            tabs:[
                {type:'code',name:'验票二维码'},
                {type:'detail',name:'详细信息'},
            ],
            tabIndex:0,
            nodes:'<p>请在发船当天提前半小时</p><p>携带所有乘船人的有效出境证件</p>',
            passengerList:[],
            passengerIndex:0,
            passenger,
            //
            orderDetail:{},
            advertiseList:[],
            advertiseIndex:0,
            tripList:[], 
            ticketList:[],
            ticketIndex:0,
            loading:false,
            isShowCode:false,
            codeItem:''
        }
    },
    onLoad(e){
        this.options = e

        this.getOrderDetail()
    },
    methods:{
        getList(){
            let list = [
                this.getAdvertiseList(),
                this.getOrderDetail(),
            ]

            Promise.all(list).then(()=>{
            })
        },
        getAdvertiseList(){
            let params = {
                position:4
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
        getOrderDetail(){
            let params = {
                orderId:this.options.orderId
            }

            return new Promise((resolve)=>{
                getOrderDetailApi(params).then((res)=>{
                    this.tripList = []
                    if(res.data.code == 200){
                        let data = res.data.data || {}
                        let orderStatus = order.orderStatus

                        for(let i=0; i<orderStatus.length; i++){
                            if(orderStatus[i].value == data.status){
                                data.statusText = orderStatus[i].label
                                data.statusIcon = orderStatus[i].icon
                            }
                        }
                    
                        let passengerTypeList = passenger.passengerTypeList
                        let certificateTypeList = passenger.certificateTypeList
                        let ticketList = data.ticketList || []

                        data.passengerList.length && data.passengerList.forEach((item)=>{
                            item.passengerTypeName = utils.getValue(passengerTypeList,item.passengerType, 'label')
                            item.certificateTypeName = utils.getValue(certificateTypeList,item.certificateType, 'label')
                        })

                        this.tripList.push(this.returnTripData(data,0))

                        this.passengerList = data.passengerList || []

                        this.ticketList = ticketList

                        this.orderDetail = data

                        this.setCode()
                    }
                    resolve()
                })
            })
        },
        returnTripData(data, trip = 0){
            return {
                formattedSetoffDate:data.departDate,
                setoffTime:data.departTime,
                fromPort:data.fromPort,
                arriveTime:data.arriveTime,
                toPort:data.toPort,
                seatRank:data.seatRank,
                duration:data.duration,
                trip,
            }
        },
        setCode(){
            let code = this.ticketList[this.ticketIndex].qrCode
            this.$nextTick(()=>{
                this.$refs.qrcode.setCode(code)
            })
        },
        changeTab(index){
            this.tabIndex = index

            if(index == 0){
                this.getOrderDetail()
            }
        },
        handleExpense(){
            uni.showLoading()

            getOrderExpenselApi(this.orderDetail.id,{}).then((res)=>{
                uni.hideLoading()
                if(res.data.code == 200){
                    let data = res.data.data

                    if(data){
                        uni.downloadFile({
                            url:data.replace('http://', 'https://'),
                            success:(res)=>{
                                if(res.statusCode == 200){
                                    const filePath = res.tempFilePath
                                    
                                    uni.openDocument({
                                        filePath,  
                                        fileType:'xlsx'   
                                    })
                                }
                            }
                        })
                    }
                }
            })
        },
        goHome(){
            uni.redirectTo({
                url:`/pages/index/index`
            })
        },
        checkOrder(){
            if(this.loading) return

            this.loading = true

            uni.showLoading()

            checkRefundApi(this.orderDetail.id,{}).then((res)=>{
                uni.hideLoading()
                this.loading = false

                if(res.data.code == 200){
                    let data = res.data.data

                    const unit = this.orderDetail.currencyType == 1 ? 'MOP' : 'RMB'

                    uni.showModal({
                        title:'退票提示',
                        content:`本次退票收取手续费${data.serviceFee}${unit}，退款金额为${data.refundMoney}${unit}，确定退票吗？ `,
                        success:(res)=>{
                            if(res.confirm){
                                this.refundOrder()
                            }
                        }
                    })
                }
            })
        },
        refundOrder(){
            if(this.loading) return

            this.loading = true

            uni.showLoading()

            refundOrderApi(this.orderDetail.id,{}).then((res)=>{
                uni.hideLoading()
                this.loading = false
                if(res.data.code == 200){
                    this.getOrderDetail()
                }
            })
        },
        handlerCancelOrder(){
            uni.showModal({
                title:'提示',
                content:'是否取消订单？',
                success:(res)=>{
                    if(res.confirm){
                    }
                }
            })
        },
        handlerPay(){

        },
        cbOpen(item){
            this.isShowCode = true
            this.codeItem = item
        },
        cbClose(){
            this.isShowCode = false
            this.codeItem = ''
        },
        prev(){
            if(this.ticketIndex == 0){
                return
            }
            this.ticketIndex--
            this.setCode()

        },
        next(){
            if(this.ticketIndex >= this.ticketList.length - 1){
                return
            }
            this.ticketIndex++
            this.setCode()
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:url('https://newxcx.soofound.cn/vue/upload/static/order/bg.png') #F8F8F8 no-repeat;
    background-size:contain;
}

.tabs {
    display:flex;
    padding:0 100rpx;
    height:130rpx;
    line-height:130rpx;
    color:#FFF;
    font-size:32rpx;
    text-align:center;
    .item {
        flex:1;
        height:130rpx;
        &.on {
            position:relative;
            font-size:36rpx;
            font-weight:500;
            &::before {
                content:' ';
                position:absolute;
                bottom:16rpx;
                left:50%;
                transform:translateX(-50%);
                width:17rpx;
                height:13rpx;
                background:url('https://newxcx.soofound.cn/vue/upload/static/common/active.png') no-repeat;
                background-size:contain;
            }
        }
    }
}

.wrap-code {
    margin:0 auto;
    width:710rpx;
    background:#FFF;
    border-radius:20rpx;
    overflow:hidden;
    .dest {
        height:132rpx;
        line-height:132rpx;
        color:rgba(0,0,0,.9);
        font-size:36rpx;
        text-align:center;
        text {
            display:inline-block;
            vertical-align:middle;
        }
        .i {
            margin:0 20rpx;
            width:103rpx;
            height:5rpx;
            background:url('https://newxcx.soofound.cn/vue/upload/static/order/car2.png') no-repeat;
            background-size:cover;
        }
    }
    .tips-nodes {
        line-height:48rpx;
        color:rgba(0,0,0,.7);
        font-size:26rpx;
        text-align:center;
    }
    .tips-code {
        margin:24rpx auto;
        width:285rpx;
        height:48rpx;
        line-height:48rpx;
        border-radius:24rpx;
        background:rgba(255, 72, 14, 0.08);
        color:#FF480E;
        font-size:26rpx;
        text-align:center;
    }
    .btn-refresh {
        margin:26rpx 0;
        height:32rpx;
        line-height:32rpx;
        color:rgba(0,0,0,.5);
        font-size:26rpx;
        text-align:center;
    }
}

.swpier-code {
    position:relative;
    height:400rpx;
    .btn {
        position:absolute;
        top:40%;
        transform:translateY(-50%);
        width:64rpx;
        height:64rpx;
        background-repeat:no-repeat;
        background-position:top center;
        background-size:contain;
        &.prev {
            left:80rpx;
            background-image:url('https://newxcx.soofound.cn/vue/upload/static/order/icon-right.png');
        }
        &.next {
            right:80rpx;
            background-image:url('https://newxcx.soofound.cn/vue/upload/static/order/icon-left.png');
        }
        &.disabled {
            opacity:.5;
        }
    }
    .list-code {
        margin:0 auto;
        width:356rpx;
        height:356rpx;
        background:#EEE;
    }
    .dots {
        margin:24rpx 0;
        text-align:center;
        .dot {
            display:inline-block;
            margin-right:20rpx;
            width:14rpx;
            height:14rpx;
            background:rgba(0, 0, 0, 0.1);
            border-radius:7rpx;
            vertical-align:middle;
            &.on {
                background:rgba(255, 72, 14,0.5);
            }
        }
    }
}

.btn-line {
    margin:40rpx auto;
    width:642rpx;
    height:2rpx;
    background:url('https://newxcx.soofound.cn/vue/upload/static/common/ewdsfdsfe.png') no-repeat;
    background-size:cover;
}

.item-passenger {
    margin:0 40rpx;
    .user {
        position:relative;
        margin-bottom:40rpx;
        height:40rpx;
        line-height:40rpx;
        color:rgba(0,0,0,.9);
        font-size:38rpx;
        .name {
            display:inline-block;
            vertical-align:middle;
            .n,
            .t {
                vertical-align:middle;
            }
            .t {
                margin-left:16rpx;
                padding:0 10rpx;
                height:30rpx;
                line-height:30rpx;
                border:1px solid rgba(0,0,0,.3);
                border-radius:5rpx;
                color:rgba(0,0,0,.3);
                font-size:18rpx;
                text-align:center;
            }
        }
        .cheng {
            position:absolute;
            top:0;
            width:81rpx;
            height:40rpx;
            right:0;
            font-size:34rpx;
            text-align:center;
            &::before {
                content:' ';
                position:absolute;
                bottom:-5rpx;
                left:59%;
                transform:translateX(-50%);
                width:81rpx;
                height:5rpx;
                background:url('https://newxcx.soofound.cn/vue/upload/static/order/car3.png') no-repeat;
                background-size:contain;
            }
        }
    }
    .item {
        position:relative;
        margin-bottom:32rpx;
        line-height:30rpx;
        font-size:28rpx;
        .label {
            display:inline-block;
            margin-right:16rpx;
            width:140rpx;
            color:#777;
            vertical-align:middle;
        }
        .right {
            display:inline-block;
            color:#000;
            vertical-align:middle;
        }
        .tips {
            margin-top:16rpx;
            color:rgba(255, 72, 14,0.7);
            font-size:22rpx;
        }
    }
}

.thanks {
    margin:40rpx 0;
    height:30rpx;
    line-height:30rpx;
    color:#898989;
    font-size:26rpx;
    text-align:center;
}

.banner {
    height:189rpx;
    background:#CCC;
}

.wrap-top {
    margin:24rpx 20rpx;
    position:relative;
    padding:0 40rpx;
    background:linear-gradient(205deg, #FFF7F4, #FFFFFF);
    border-radius:20rpx;
    overflow:hidden;
}

.wrap-passanger,
.wrap-order {
    margin:20rpx auto;
    padding-bottom:8rpx;
    width:710rpx;
    background:#FFF;
    border-radius:20rpx;
    .hd {
        position:relative;
        margin:0 40rpx;
        height:110rpx;
        line-height:110rpx;
        border-bottom:1px solid rgba(0,0,0,0.04);
        color:#000;
        font-size:32rpx;
        font-weight:500;
        .ico {
            position:absolute;
            top:50%;
            right:0;
            transform:translateY(-50%);
            width:21rpx;
            height:11rpx;
            background:url('https://newxcx.soofound.cn/vue/upload/static/order/icon.png') no-repeat;
            background-size:contain;
        }
    }
    .bd {
        padding:0 40rpx;
        font-size:28rpx;
        overflow:hidden;
    }
}

.wrap-order {
    .bd {
        padding-top:24rpx;
    }
}

.banner {
    height:189rpx;
}
.actions {
    box-sizing:border-box;
    position:fixed;
    bottom:0;
    left:0;
    padding:0 32rpx;
    width:100%;
    height:150rpx;
    background:#FFF;
    overflow:hidden;
    text-align:right;
    .btn {
        box-sizing:border-box;
        margin:14rpx auto 0;
        width:664rpx;
        height:80rpx;
        border-radius:40rpx;
        border:1px solid #B2B2B2;
        line-height:80rpx;
        color:#666;
        font-size:32rpx;
        text-align:center;
        &.btn1,
        &.btn2 {
            display:inline-block;
            width:200rpx;
            margin-left:24rpx;
            vertical-align:middle;
        }
        &.btn2 {
            background:linear-gradient(87deg, #ffa63f, #eb5628);
            color:#FFF;
            border:0 none;
        }
    }
}

.expense-btn {
    display:flex;
    align-items:center;
    justify-content:center;
    margin:48rpx auto 0;
    width:664rpx;
    height:100rpx;
    background:linear-gradient(87deg, #ffa63f, #eb5628);
    border-radius:50rpx;
    font-weight:500;
    font-size:34rpx;
    color:#FFF;
  }
</style>