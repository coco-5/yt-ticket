<template>
    <view 
        class="c-pop"
        v-show="isShow"
    >
        <view class="win-bg"></view>
        <view class="win-main">
            <template v-if="step == 1">
                <view class="hd">购买票卡</view>
                <view class="bd">
                    <view class="title">
                        {{item.name}}
                        <text class="ico"></text>
                    </view>
                    <view 
                        class="item"
                        v-if="item.ticketCardProtList.length"
                    >
                        <view class="label">请选择航线</view>
                        <view class="info">
                            <view 
                                class="tag"
                                :class="portIndex == index ? 'on' : ''"
                                @click="changePort(index)"
                                v-for="(tag,index) in item.ticketCardProtList"
                                :key="index"
                            >
                                {{tag.fromPortName}}-{{tag.toPortName}} 
                            </view>
                        </view>
                    </view>
                   <!--  <view 
                        class="item"
                        v-if="item.ticketCardProtList[portIndex]"
                    >
                        <view class="label">请选择出发港{{fromPortIndex}}</view>
                        <view class="info">
                            <view 
                                class="tag"
                                :class="fromPortIndex == 0 ? 'on' : ''"
                                @click="fromPortIndex = 0"
                            >
                                {{item.ticketCardProtList[portIndex].fromPortName}}
                            </view>
                            <view 
                                class="tag"
                                :class="fromPortIndex == 1 ? 'on' : ''"
                                @click="fromPortIndex = 1"
                            >
                                {{item.ticketCardProtList[portIndex].toPortName}}
                            </view>
                        </view>
                    </view> -->
                    <view class="tips">使用票卡优惠购买当天生效的默认乘客船</view>
                </view>
                <view class="ft">
                    <view 
                        class="btn"
                        @click="close"
                    >
                        取消
                    </view>
                    <view 
                        class="btn"
                        @click="buy"
                    >
                        购票
                    </view>
                </view>
            </template>

            <view 
                class="step2"
                v-else-if="step == 2"
            >
                <view class="hd">确认信息</view>
                <view class="bd">
                    <view class="item2">
                        <view class="label">航线</view>
                        <view class="info">{{item.name}}</view>
                    </view>
                    <view class="item2">
                        <view class="label">出发港</view>
                        <view class="info">
                            <template v-if="fromPortIndex == 0">
                                {{item.ticketCardProtList[portIndex].fromPortName}}
                            </template>
                            <template v-if="fromPortIndex == 1">
                                {{item.ticketCardProtList[portIndex].toPortName}}
                            </template>
                        </view>
                    </view>
                    <view class="item2">
                        <view class="label">乘客</view>
                        <view class="info">{{passengerlist[0].passengerName}}</view>
                    </view>
                    <view class="item2">
                        <view class="label">护照</view>
                        <view class="info">{{passengerlist[0].certificateNumber}}</view>
                    </view>
                </view>
                <view 
                    class="ft"
                    v-if="calculateCode == 200 && item.ticketProtList[portIndex].fromPortCode == 'MAO' || item.ticketProtList[portIndex].toPortCode == 'MAO'"
                >
                    <template v-if="calculate">
                        <view 
                            class="btn"
                            @click="pay(2)"
                        >
                            <view class="price">
                                RMB<text>{{calculate.rmbPrice || 0}}</text>
                            </view>
                            <view class="text">提交订单</view>
                        </view>
                        <view 
                            class="btn"
                            @click="pay(1)"
                        >
                            <view class="price">
                                RMB<text>{{calculate.price || 0}}</text>
                            </view>
                            <view class="text">提交订单</view>
                        </view>
                    </template>
                </view>
                <view 
                    class="close"
                    @click="close"
                ></view>
            </view>
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getPassengerListApi } from '@/api/passenger'
import { getOrderCalculateApi, cardSubmitApi } from '@/api/order'
export default {
    props:{

    },
    data(){
        return{
            item:{},
            isShow:false,
            passengerlist:[],
            step:1,
            portIndex:0,
            fromPortIndex:0,
            calculateCode:0,
            calculate:'',
            isSubmiting:false,
        }
    },
    mounted(){

    },
    methods:{
        show(item){
            this.item = item
            this.isShow = true
        },
        close(){
            this.item = ''
            this.isShow = false
            this.step = 1
            this.passengerlist = []
            this.calculateCode = 0
            this.calculate = ''
        },
        buy(){
            if(this.step == 1){
                this.step = 2
                this.buyStep1()
            }
        },
        buyStep1(){
            getPassengerListApi({}).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data || []

                    this.passengerlist = data
                }
            })

            this.getOrderCalculate()
        },
        getOrderCalculate(){
            let item = this.item
            let index = this.portIndex
            
            let params = {
                cardCode:item.code || 0,
                cardSourceType:item.sourceType || 0,
                fromPortCode:item.ticketProtList[index].fromPortCode,
                fromPortName:item.ticketProtList[index].fromPortName,
                toPortCode:item.ticketProtList[index].toPortCode,
                toPortName:item.ticketProtList[index].toPortName
            }

            getOrderCalculateApi(params).then((res)=>{
                if(res.data.code == 200){
                    this.calculateCode = 200
                    this.calculate = res.data.data
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        },
        changePort(index){
            this.portIndex = index
            this.fromPortIndex = 0
        },
        pay(currencyType){
            if(this.isSubmiting) return

            this.isSubmiting = true

            uni.showLoading()

            let item = this.item
            let target = item.ticketCardProtList[this.portIndex]
            let params = {
                cardCode:item.code,
                cardSourceType:item.sourceType,
                fromPortCode:target.fromPortCode,
                fromPortName:target.fromPortName,
                toPortCode:target.toPortCode,
                toPortName:target.toPortName,
            }

            cardSubmitApi(params).then((res)=>{
                this.isSubmiting = false
                uni.hideLoading()
                if(res.data.code == 200){
                    let data = res.data.data || {}

                    this.goCode(data)
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        },
        goCode(data){
            let query = {
                orderId:data.orderId,
            }

            let url = `/packageUser/pages/order/code?${utils.paramsStringify(query)}`

            uni.redirectTo({
                url,
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.c-pop {
    position:fixed;
    z-index:11;
    top:0;
    left:0;
    width:100%;
    height:100vh;
    .win-bg {
        position:fixed;
        z-index:11;
        top:0;
        left:0;
        width:100%;
        height:100vh;
        background:rgba(0,0,0,.6);
    }
    .win-main {
        position:fixed;
        z-index:12;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        width:680rpx;
        min-height:500rpx;
        background:linear-gradient(205deg, #FDEEE9, #FFFFFF);
        border-radius:40rpx;
        .hd {
            padding:60rpx 0 50rpx;
            height:42rpx;
            line-height:40rpx;
            color:#000;
            font-size:40rpx;
            font-weight:500;
            text-align:center;
        }
        .bd {
            //padding:0 60rpx;
            .title {
                position:relative;
                margin:0 40rpx 40rpx;
                padding:0 20rpx;
                height:64rpx;
                line-height:64rpx;
                border:1px solid #B1ABA9;
                color:#333;
                font-size:30rpx;
                font-weight:500;
                .ico {
                    position:absolute;
                    top:50%;
                    right:32rpx;
                    transform:translateY(-50%);
                    width:17rpx;
                    height:10rpx;
                    background:url('http://8.138.130.153:6003/vue/upload/static/common/WechatIMG1020.png') no-repeat;
                    background-size:contain;
                }
            }
            .item {
                margin:0 20rpx 40rpx 40rpx;
                .label {
                    margin-bottom:28rpx;
                    height:34rpx;
                    line-height:34rpx;
                    color:#000;
                    font-size:30rpx;
                    font-weight:500;
                }
                .tag {
                    display:inline-block;
                    margin-right:8rpx;
                    margin-bottom:12rpx;
                    padding:0 16rpx;
                    height:64rpx;
                    line-height:64rpx;
                    border-radius:4rpx;
                    border:1px solid #EE622C;
                    color:#EE622C;
                    font-size:30rpx;
                    vertical-align:top;
                    &.on {
                        background:#EE622C;
                        color:#FFF;
                    }
                }
            }
            .tips {
                margin:0 40rpx;
                height:30rpx;
                line-height:30rpx;
                color:#737373;
                font-size:24rpx;
            }
        }
        .ft {
            padding:40rpx 0 40rpx 45rpx;
            .btn {
                display:inline-block;
                width:280rpx;
                height:100rpx;
                line-height:100rpx;
                border:1px solid #EE622C;
                color:#EE622C;
                border-radius:50rpx;
                font-size:34rpx;
                font-weight:500;
                vertical-align:top;
                text-align:center;
                &:last-child {
                    margin-left:40rpx;
                    background:linear-gradient(87deg, #FFA63F, #EB5628);;
                    color:#FFF;
                }
            }
        }
    }
}

.step2 {
    padding-bottom:60rpx;
    .bd {
        margin:0 60rpx;
    }
    .close {
        position:absolute;
        bottom:-150rpx;
        left:50%;
        transform:translateX(-50%);
        width:54rpx;
        height:54rpx;
        background:url("http://8.138.130.153:6003/vue/upload/static/common/WechatIMG1047.png") no-repeat;
        background-size:contain;
    }
    .ft {
        .btn {
            font-size:22rpx!important;
            font-weight:500!important;
            .text {
                height:30rpx!important;
                line-height:30rpx!important;
            }
            .price {
                margin-bottom:8rpx;
                padding-top:8rpx;
                height:40rpx!important;
                line-height:40rpx!important;
                text {
                    display:inline-block;
                    margin-left:8rpx;
                    font-size:38rpx;
                }
            }
        }
    }
}
.item2 {
    margin-bottom:16rpx;
    .label {
        margin-bottom:8rpx;
        color:rgba(0,0,0,.6);
        font-size:24rpx;
    }
    .info {
        color:#000;
        font-size:30rpx;
        font-weight:500;
    }
}
</style>