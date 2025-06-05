import Vue from 'vue'
let _this = Vue.prototype

export function getMemberCardInfoApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/member/memberCardInfo`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function bindCitizenApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/member/bindCitizen`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getBaseInfoApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/member/baseInfo`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function mobileApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/member/mobile`,params).then((res)=>{
            resolve(res)
        })
    })
}
//