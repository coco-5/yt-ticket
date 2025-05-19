import utils from '@/utils/utils'
import Vue from 'vue'

let _this = Vue.prototype

export function getOpenidApi(callback){
    uni.login({
        success:(res)=>{
            let params = {
                jscode : res.code
            }
            return new Promise((resolve, reject)=>{
                _this.$http.post(`/tiku/question/user/wxLogin`,params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))
                        uni.setStorageSync('openid',data.openid)
                        resolve()
                        callback()
                    }
                })
            })
        }
    })
}
