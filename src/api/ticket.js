import Vue from 'vue'

let _this = Vue.prototype
export function getTicketCardListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/ticketCard/sale/page`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getTicketPopupApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/ticketPopup/list`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getPortRouteApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/ticketPort/getPortRoute`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getTicketCardMyListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/ticketCard/my/list`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getCreateOrderApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/ticketCard/createOrder`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getOneWayTicketListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/ticket/oneWayTicketList`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getOneWayTicketDetailApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/ticket/oneWayTicketDetail`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getRoundTicketListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/ticket/roundTripTicketList`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getRoundTicketDetailApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/ticket/roundTripTicketDetail`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getRuleApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/ticket/getRule`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getVipListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/addedValue/vipList`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getAddedValuePageApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/addedValue/page`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getPortLineApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/ticketPort/port/line`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getCityListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/ticketPort/cityList`,params).then((res)=>{
            resolve(res)
        })
    })
}