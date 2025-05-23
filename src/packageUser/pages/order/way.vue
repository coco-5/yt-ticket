<template> 
    <view class="page">
        <view class="block"></view>
        <view class="order">
            <view class="label">订单编号</view>
            <view class="right">{{options.orderSn}}</view>
        </view>
        <view class="price">
            <view class="label">订单金额</view>
            <view class="right">
                <view 
                    class="t m"
                    v-if="options.currencyType == 1"
                >
                    MOP {{Number(options.price).toFixed(2)}}
                </view>
                <view 
                    class="t"
                    v-else-if="options.currencyType == 2"
                >
                    RMB {{Number(options.rmbPrice).toFixed(2)}}
                </view>
            </view>
        </view>

        <view class="list">
            <c-pay-way
                :options="options"
                @pay="pay"
                v-if="options"
            ></c-pay-way>
        </view>
    </view>
</template>

<script>
import { getWechatPayApi, payWechatPayApi, upayWechatPayApi } from '@/api/pay'
export default {
    data(){
        return{
            options:{},
            isPaying:false,
        }
    },
    onLoad(e){
        this.options = e
    },
    methods:{
        pay(item){
            let options = this.options
            let params = {
                orderType:options.orderType,
                orderSn:options.orderSn,
            }

            if(this.isPaying) return

            this.isPaying = true

            uni.showLoading()

            if(item.currencyType == 1){
                this.mopPay(params)
            }else if(item.currencyType == 2){
                this.rmbPay(params)
            }
        },
        mopPay(params){
            upayWechatPayApi(params).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data

                    data && this.requestPayment(data)
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        },
        rmbPay(params){
            payWechatPayApi(params).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data

                    data && this.requestPayment(data).then(()=>{
                        uni.showToast({
                            title:'支付成功',
                            icon:'none'
                        })

                        setTimeout(()=>{
                            this.go()
                        },2000)
                    })
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        },
        requestPayment(params){
            return new Promise((resolve,reject)=>{
                uni.requestPayment({
                    timeStamp:params.timeStamp,
                    nonceStr:params.nonceStr,
                    package:params.package,
                    signType:params.signType,
                    paySign:params.paySign,
                    success:(res)=>{
                        resolve()
                    },
                    fail:(res)=>{
                        reject()
                    },
                    complete:()=>{
                        uni.hideLoading()
                        this.isPaying = false
                    }
                })

            })
        },
        go(){
            let url = `/packageUser/pages/order/list`

            uni.redirectTo({
                url,
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:#F8F8F8;  
}

.block {
    height:30rpx;
}

.order, 
.price {
    position:relative;
    box-sizing:border-box;
    margin:0 auto;
    padding:0 30rpx;
    width:710rpx;
    height:90rpx;
    line-height:90rpx;
    background:#FFF;
    border-radius:20rpx;
    font-size:30rpx;
    .label {
        display:inline-block;
        color:#000;
        vertical-align:middle;
    }
    .right {
        position:absolute;
        top:0;
        right:30rpx;
        height:90rpx;
        color:#000;
        vertical-align:middle;
    }
}

.price {
    margin:20rpx auto 0;
    .right {
        font-size:24rpx;
        .t {
        }
        .m {
            color:#FE6630;
        }
    }
}

.list {
    margin:40rpx auto 0;
    padding:20rpx 0;
    width:710rpx;
    background:#FFF;
    border-radius:20rpx;
}
</style>