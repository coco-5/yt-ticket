// 网络请求封装
import baseConfig from '@/configs/baseConfig'
import utils from '@/utils/utils'

function request(){
    let _this = this;

    // 基础配置
    this.config = { 
        // 请求的根域名
        baseData : {
        },
        //超时时间，单位 ms
        timeout:90 * 1000,
        //期望返回的数据格式，默认 json
        dataType:'json',
        // 设置响应的数据类型。合法值：text、arraybuffer,App和支付宝小程序不支持
        responseType:'text',
        // 默认请求头
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
    }

    // 请求拦截器   
    this.interceptors = {
        // 请求前的拦截
        request: null,
        // 请求后的拦截
        response: null
    }

    // 设置基础配置
    this.setConfig = (options)=>{
        if(!options) return console.error('参数不能为空')

        if(Object.prototype.toString.call(options) != "[object Object]") return console.error("参数必须为对象类型")

        for(let k in options){
            k in this.config && (this.config[k] = options[k])
        }
    }

    // get请求
    this.get = (url,data = {} ,config = {})=>{
        return _request('GET',url,data,config)
    }

    // post请求
    this.post = (url,data = {} ,config = {})=>{
        return _request('POST',url,data,config)
    }

    // put请求
    this.put = (url,data = {} ,config = {})=>{
        return _request('PUT',url,data,config)
    }

    // delete请求
    this.delete = (url,data = {} ,config = {})=>{
        return _request('DELETE',url,data,config)
    }

    //application/json;charset=UTF-8
    //application/x-www-form-urlencoded;charset=UTF-8


    function _request(method,url,data,config){
        let options = {}
        let headerData = {}

        url = `${baseConfig.proxyApi.main}${url}`

        let token = uni.getStorageSync('token') || ''

        headerData = {
            'Authorization': 'Bearer ' + token
        }

        if(method === 'PUT' || method === 'POST'){
            Object.assign(headerData, {
                'content-type': 'application/json'
            })
        }
 
        options.method = method
        options.header = Object.assign({},_this.config.header, headerData, config.header)
        options.data = Object.assign({},_this.config.baseData,data)
        options.dataType = config.dataType || _this.config.dataType
        options.timeout = config.timeout || _this.config.timeout
        options.url = url

        // 开发者自定义扩展字段，透传返回到响应拦截器
        options.extend = config.extend || {}

        // 请求拦截器
        if(_this.interceptors.request && typeof _this.interceptors.request == 'function'){
            let intercepConfig = _this.interceptors.request(options)
            if(!intercepConfig){
                console.warn('该请求已被拦截,请求地址:' + options.url)
                return new Promise(()=>{})
            }
            options = intercepConfig
        }
        
        return new Promise((resolve,reject)=>{
            options.complete = response => {
                resolve({response})
            }
        
            uni.request(options);
        })
        .then( ({response,isUpdateToken}) => {
            // 判断token是否过期，再调用自身
            return isUpdateToken ? _request(method,url,data,config) : Promise.resolve(response)
        })
        .catch( res => {
            // 统一捕获catch错误
            return Promise.reject(res);
        })
       
    }

}

export default new request