import Vue from 'vue'
let _this = Vue.prototype
export function getVipListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/addedValue/vipList`,params).then((res)=>{
            resolve(res)
        })
    })
}