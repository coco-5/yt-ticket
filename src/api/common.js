import Vue from 'vue'
let _this = Vue.prototype

export function getAdvertiseListApi(params){
    params = Object.assign({}, params)
    return new Promise((resolve, reject)=>{
        _this.$http.get(`/advertise/list`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getBannerListApi(params){
    params = Object.assign({}, params)
    return new Promise((resolve, reject)=>{
        _this.$http.get(`/banner/list`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getNoticeListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/notice/list`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getPartnerListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/partner/list`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function uploadApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/api/common/upload`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getMyOrderListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/addedValue/myOrderList`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getMaterialApi(id,params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/material/${id}`,params).then((res)=>{
            resolve(res)
        })
    })
}
export function getGrayLevelApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/grayLevel/selectCurrentVersion`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function updateSetGrayLevelApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/grayLevel/updateGrayLevelVersion`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getGrayVersionApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/grayLevel/selectGrayLevelVersion`,params).then((res)=>{
            resolve(res)
        })
    })
}