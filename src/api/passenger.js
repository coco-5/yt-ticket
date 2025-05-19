import Vue from 'vue'
let _this = Vue.prototype
export function getPassengerListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/passenger/getPassengerList`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getPassengerUpdateApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.put(`/passenger/update`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getPassengerAddApi(id, params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/passenger/add`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getPassengerDeleteApi(id, params){
    return new Promise((resolve, reject)=>{
        _this.$http.delete(`/passenger/delete/${id}`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getPassengerDetailApi(id){
    return new Promise((resolve, reject)=>{
        _this.$http.get(`/passenger/${id}`,{}).then((res)=>{
            resolve(res)
        })
    })
}

export function memberUpdateApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/passenger/update/merchant`,params).then((res)=>{
            resolve(res)
        })
    })
}