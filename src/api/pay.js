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