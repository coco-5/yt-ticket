import Vue from 'vue'
let _this = Vue.prototype

export function smsLoginApi(params){
    params = Object.assign({
        unionCode:434343445
    }, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/login/wx/smsLogin`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function wxLoginApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/login/wx/smallProgram`,params).then((res)=>{
            resolve(res)
        })
    })
}
