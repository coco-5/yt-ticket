import Vue from 'vue'
let _this = Vue.prototype

export function getOrderListApi(params){
    params = Object.assign({}, params)
    return new Promise((resolve, reject)=>{
        _this.$http.get(`/order/list`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getOrderDetailApi(params){
    params = Object.assign({}, params)
    return new Promise((resolve, reject)=>{
        _this.$http.get(`/order/detail`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getOrderDiscountApi(params){
    params = Object.assign({}, params)
    return new Promise((resolve, reject)=>{
        _this.$http.post(`/order/discount/calculate`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getOrderCalculateApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/order/card/discount/calculate`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getOrderSubmitApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/order/submit`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getOrderDeleteApi(id, params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.delete(`/order/delete/${id}`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getOrderCancelApi(id,params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/order/cancel/${id}`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getOrderExpenselApi(id,params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/order/create/expense/${id}`,params).then((res)=>{
            resolve(res)
        })
    })
}
export function checkRefundApi(id,params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/order/checkRefund/${id}`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function refundOrderApi(id,params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/order/refund/${id}`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function cardSubmitApi(params){
    params = Object.assign({}, params)
    return new Promise((resolve, reject)=>{
        _this.$http.post(`/order/card/submit`,params).then((res)=>{
            resolve(res)
        })
    })
}
