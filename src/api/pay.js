import Vue from 'vue'
let _this = Vue.prototype

export function getWechatPayApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/pay/uepay/wechatPay`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function payWechatPayApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/pay/wechatPay`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function upayWechatPayApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/pay/uepay/wechatPay`,params).then((res)=>{
            resolve(res)
        })
    })
}