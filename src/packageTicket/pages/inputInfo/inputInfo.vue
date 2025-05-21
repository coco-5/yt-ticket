<template>
    <view class="page">
        <view class="wrap-top">
            <view class="top">
                <template v-if="tripList.length">
                    <c-trip-detail
                        v-for="(item,index) in tripList"
                        :key="index"
                        :item="item"
                        :isShowType="true"
                        :isShowLong="true"
                    ></c-trip-detail>
                </template>
                <view class="more">
                    <view class="item">
                        <view class="label">退票</view>
                        <view class="text">退票请参照退票规则处理</view>
                        <view class="notice">购票退票须知</view>
                    </view>
                    <view class="item">
                        <view class="label">入闸</view>
                        <view class="text">开航前5分钟停止入闸</view>
                    </view>
                    <view class="item">
                        <view class="label">票价</view>
                        <view class="text">
                            MOP{{tripList[0].price1}} / <text v-if="tripList[0].price5">RMB{{tripList[0].price5}}/</text>成人 
                            <text v-if="!(detail.tportCode == 'HKM' || detail.fportCode == 'HKM')">
                                MOP{{tripList[0].price2}}/儿童 免费/携童
                            </text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view class="list-passenger">
            <view class="hd">乘客信息</view>
            <view 
                class="bd"
                v-if="listPassenger.length"
            >
                <view
                    v-for="(item,index) in selectPassengerList"
                    :key="index"
                >
                    <c-passenger-item
                        :needAction="true"
                        :item="item"
                        @handler="cbDelPassenger"
                    ></c-passenger-item>
                </view>
            </view>
            <view class="ft">
                <view 
                    class="btn"
                    @click="showPassengerPop"
                >
                    添加/删减乘客
                </view>
            </view>
        </view>

        <view 
            class="wrap-coupon"
            @click="goCoupon"
        >
            <view class="name">优惠</view>
            <view 
                class="tag"
                v-if="couponData"
            >
                {{couponData.name}}
            </view>
            <view class="price">
                <text 
                    class="text"
                    v-if="couponData"
                >
                    -{{couponData.type == 4 ? '¥' : '$'}}{{couponData.type == 4 ? couponData.discountRmbPrice : couponData.discountPrice}}
                </text>
                <text class="ico"></text>
            </view>
        </view>

        <view 
            class="wrap-added"
            @click="goAddedValue"
        >
            <view class="name">增值服务</view>
            <text 
                class="more"
                v-if="addedData.name"
            >
                {{addedData.name}}
            </text>
            <view class="price">
                <template v-if="addedData.name">
                    <text class="type">$</text>
                    <text class="text">{{addedData.mop}}</text>
                </template>
                <text class="ico"></text>
            </view>
        </view>

        <view 
            class="wrap-vip"
            v-if="vipList.length"
        >
            <c-added-card
                v-for="(item,index) in vipList"
                :key="index"
                :item="item"
                @cbDetail="handleDetail"
                @cbeMinus="handleMinus"
                @cbAdd="handleAdd"
                @cbBlur="handleBlur"
                @cbChecked="hanlderChecked"
                v-if="item.display == 1"
            ></c-added-card>
        </view>

        <view class="wrap-tips">
            <view class="hd">儿童身高说明</view>
            <view class="bd">
                <rich-text :nodes="ruleInfo.children"></rich-text>    
            </view>
        </view>

        <view 
            class="wrap-actions"
            :style="actionsStyle"
        >
            <view class="notice">
                <text 
                    class="ico"
                    :class="agreementChecked ? 'on' : ''"
                    @click="agreementChecked = !agreementChecked"
                ></text>
                <text class="text">勾选表示已阅读并同意 购取票/退订须知</text>
            </view>
            <view class="actions">
                <view class="text">订单总金额</view>
                <view 
                    class="btn"
                    v-if="options.fromPortCode === 'MAO' || options.toPortCode === 'MAO'"
                >
                    <view 
                        class="item"
                        @click="submitPay(2)"
                        v-if="options.fromPortCode == 'MAO' || options.toPortCode == 'MAO'"
                    >
                        <view class="price">RMB<text>{{rmb}}</text></view>
                        <view class="t">提交订单</view>
                    </view>
                    <view 
                        class="item mop"
                        @click="submitPay(1)"
                    >
                        <view class="price">MOP<text>{{mop}}</text></view>
                        <view class="t">提交订单</view>
                    </view>
                </view>
                <view 
                    class="btn btn-mop"
                    v-else
                >
                    <view 
                        class="item mop"
                        @click="submitPay(1)"
                    >
                        <view class="price">MOP<text>{{mop}}</text></view>
                        <view class="t">提交订单</view>
                    </view>
                </view>
            </view>
        </view>

        <c-pop
            :height="popHeight + 'vh'"
            :isShow="isShowPassengerPop"
            @cbClosePop="cbClosePassengerPop"
        >
            <template #content>
                <popPassenger
                    :options="options"
                    :height="popHeight"
                    :list="listPassenger"
                    @cbChoose="cbChoose"
                    @cbConfirm="cbConfirm"
                    @cbClosePop="cbClosePassengerPop"
                    v-if="options"
                ></popPassenger>
            </template>
        </c-pop>

        <c-bottom
            :style="bottomStyle"
        ></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import ticket from '@/types/ticket'
import popPassenger from '@/packageTicket/components/pop-passenger'
import { getOneWayTicketDetailApi, getRuleApi, getRoundTicketDetailApi } from '@/api/ticket'
import { getPassengerListApi } from '@/api/passenger'
import { getOrderSubmitApi } from '@/api/order'
import { getVipListApi } from '@/api/vip'
export default {
    components:{
        popPassenger
    },
    data(){
        return{
            options:{},
            listPassenger:[],   
            bottomStyle:'',
            actionsStyle:'',
            isShowPassengerPop:false,
            popHeight:60,
            detail:'',
            tripList:[],
            selectPassengerList:[],
            couponData:'',
            addedData:'',
            vipData:'',
            rmb:0,
            mop:0,
            ruleInfo:{},
            vipList:[],
            agreementChecked:false
        }
    },
    onLoad(e){
        this.options = e

        this.getList()

        this.fixedBottom()
    },
    onShow(){
        this.checkData()
    },
    methods:{
        getList(){
            uni.showLoading()

            let list = []

            if(this.options.isRoundTrip == 1){
                list.push(this.getRoundTicketDetail())
            }else{
                this.getOneWayTicketDetail()
            }

            list.push(this.getRule())
            list.push(this.getPassengerList())
            list.push(this.getVipList())

            Promise.all(list).then((res)=>{
                setTimeout(()=>{
                    this.getPrice()
                },10)
                
                uni.hideLoading()
            })
        },
        getOneWayTicketDetail(){
            let options = this.options
            let params = {
                fromPortCode:options.fromPortCode,
                toPortCode:options.toPortCode,
                sailDate:options.sailDate,
                voyageId:options.voyageId,
                isRoundTrip:0,
                channel:1,//userStroe.user?.merchantAcitve ? 2 : 1,
            }

            return new Promise((resolve)=>{
                getOneWayTicketDetailApi(params).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || {}
                        let tripList = []

                        tripList.push(this.returnTripData(data,0))

                        this.detail = data

                        this.tripList = tripList

                        this.listSpace = data.dtseatrankPrice || []
                        //this.getPrice()
                    }
                    resolve()

                })
            })
        },
        getRoundTicketDetail(){
            let options = this.options
            let params = {
                sailDate:options.sailDate,
                sailDateReturn:options.sailDateReturn,
                fromPortCode:options.fromPortCode,
                toPortCode:options.toPortCode,
                isRoundTrip:1,
                returnVoyageId:options.returnVoyageId,
                voyageId:options.voyageId,
            }

            return new Promise((resolve)=>{
                getRoundTicketDetailApi(params).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || {}
                        let tripList = []
                        let voyage = data.voyage || {}
                        let voyageReturn = data.voyageReturn || {}

                        voyage.ticketType = data.ticketType || []

                        voyageReturn.ticketType = data.returnTicketType || []

                        tripList.push(this.returnTripData(voyage,0))

                        tripList.push(this.returnTripData(voyageReturn,1))

                        this.listSpace = voyage.dtseatrankPrice || []

                        this.detail = data

                        this.tripList = tripList

                        //this.getPrice()
                    }
                    resolve()
                })
            })
        },
        returnTripData(data, trip = 0){
            let dtseatrank = ''

            data.dtseatrankPrice && data.dtseatrankPrice.length && data.dtseatrankPrice.forEach((item)=>{
                if(item.seatRankId == this.options.seatRankId){
                    dtseatrank = item
                }
            })

            return {
                formattedSetoffDate:data.formattedSetoffDate,
                setoffTime:data.setoffTime,
                fromPort:data.fromPort,
                arriveTime:data.arriveTime,
                toPort:data.toPort,
                ticketType:data.ticketType,
                duration:data.duration,
                seatRank:dtseatrank.seatRank,
                price1:dtseatrank.price1,
                price5:dtseatrank.price5,
                price2:dtseatrank.price2,
                trip,
            }
        },
        getRule(){
            //获取购票退票规则
            let options = this.options
            let params = {
                fromPortCode:options.fromPortCode,
                toPortCode:options.toPortCode,
                sailDate:options.sailDate,
                voyageId:options.voyageId,
                isRoundTrip:options.isRoundTrip,
            }

            return new Promise((resolve)=>{
                getRuleApi(params).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || {}
                        this.ruleInfo = data
                    }
                    resolve()
                })
            })
        },
        getPassengerList(){
            return new Promise((resolve)=>{
                getPassengerListApi({}).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || []

                        data.forEach((item)=>{
                            item.class = 'check-box'
                            if(item.isDefault){
                                item.class = 'checked-box'
                            }
                        })

                        this.listPassenger = data

                        this.initSelectPassengerList(data, true)
                        resolve()
                    }
                })
            })
        },
        checkData(){
            let services = uni.getStorageSync('services')   
            this.couponData = ''
            this.addedData = ''

            if(services){
                this.couponData = utils.checkSerivces(this.options,'coupon')
                let addedData = utils.checkSerivces(this.options,'addedValue')

                if(addedData){
                    let name = []
                    let mop = 0
                    let rmb = 0

                    for(let p in addedData){
                        name.push(addedData[p].name)     
                        mop += addedData[p].price * addedData[p].value    
                        rmb += addedData[p].rmbPrice * addedData[p].value
                    }

                    this.addedData = {
                        name:name.join(','),
                        mop,
                        rmb
                    }
                }

                this.tripList.length && this.getPrice()
            }
        },
        initSelectPassengerList(data){
            //深拷贝
            let array = utils.deepCloneArray(data)
            let selectPassengerList = []

            array.forEach((item)=>{
                if(item.passengerType == 1 && item.isDefault == 1){ 
                    item.class = 'del'
                    selectPassengerList.push(item)
                }else{
                    item.class = ''
                }
            })
            this.selectPassengerList = selectPassengerList
        },
        cbChoose(item){
            let list = this.listPassenger

            if(item.passengerType == 2){
                uni.showToast({
                    title:'如需购买儿童票,请携带儿童证件到售票窗口购买',
                    icon:'none'
                })
                return
            }

            for(let i=0; i<list.length; i++){
                if(list[i].id == item.id){
                    if(list[i].class == 'check-box'){
                        list[i].class = 'checked-box'
                    }else if(list[i].class == 'checked-box'){
                        list[i].class = 'check-box'
                    }
                    break
                }
            }
        },
        cbConfirm(){
            let list = utils.deepCloneArray(this.listPassenger)
            let selectPassengerList = []

            list.forEach((item)=>{
                if(item.class == 'checked-box'){
                    item.class = 'del'
                    selectPassengerList.push(item)
                }
            })

            this.selectPassengerList = selectPassengerList

            this.getPrice()

            this.cbClosePassengerPop()
        },
        cbDelPassenger(item){
            uni.showModal({
                title:'提示',
                content:'确定删除该乘客吗？',
                success:(res)=>{
                    if(res.confirm){
                        this.delPassenger(item)
                    }
                }
            })
        },
        delPassenger(item){
            let list1 = this.selectPassengerList
            let list2 = this.listPassenger
            
            for(let i=0; i<list1.length; i++){
                if(item.id == list1[i].id){
                    list1.splice(i,1)
                    break
                }
            }

            for(let i=0; i<list2.length; i++){
                if(item.id == list2[i].id){
                    list2[i].class = 'check-box'
                    break
                }
            }
        },
        getVipList(){
            let options = this.options
            let params = {
                fromPortCode:options.fromPortCode,
                toPortCode:options.toPortCode,
            }

            return new Promise((resolve)=>{
                getVipListApi(params).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || []

                        data.forEach((item)=>{
                            item.value = 1
                            item.checked = false
                        })

                        this.vipList = data
                    }
                    resolve()
                })
            })
        },
        fixedBottom(){
            this.actionsStyle = `padding-bottom:${utils.fixIPhoneX() ? 48 : 0}rpx;`
            this.bottomStyle = `padding-bottom:${utils.fixIPhoneX() ? 48 : 0}rpx; height:200rpx;`
            this.popHeight = utils.fixIPhoneX() ? 60 : 55
        },  
        cbClosePassengerPop(){
            this.isShowPassengerPop = false
        },
        submitPay(currencyType){
            if(this.selectPassengerList.length == 0){
                uni.showToast({
                    title:'乘客信息不能为空',
                    icon:'none'
                })
                return
            }
            
            if(this.selectPassengerList.some((item) => item.passengerType == 2)){
                uni.showToast({
                    title:'如需购买儿童票,请携带儿童证件到售票窗口购买',
                    icon:'none'
                })
                return
            }

            if(!this.agreementChecked){
                uni.showToast({
                    title:'需要先勾选已阅读并同意购取票/退订须知',
                    icon:'none'
                })
                return
            }

            let options = this.options
            let addedValueList = []
            let addedValue = utils.checkSerivces(this.options,'addedValue')
            let coupon = uni.getStorageSync('coupon') || {}
            let cardCode = ''
            let cardSourceType = 0

            if(addedValue){
                for(let p in addedValue){
                    addedValueList.push({
                        addedValueId:addedValue[p].id,
                        num:addedValue[p].value,
                    })
                }
            }

            if(coupon){
                cardCode = coupon.code
                cardSourceType = coupon.sourceType
            }

            let params = {
                type:options.type,
                addedValueList,
                channel:1,//userStroe.user?.merchantAcitve ? 2 : 1,
                currencyType,
                fromPortCode:options.fromPortCode,
                isRoundTrip:options.isRoundTrip,
                orderVoyage:{
                    departDate:options.sailDate,
                    seatRankId:options.seatRankId,
                    voyageId:options.voyageId,
                },
                orderVoyageReturn:{
                    seatRankId:options.seatRankId    
                },
                passengerList:this.selectPassengerList,
                toPortCode:options.toPortCode,
            }

            if(cardCode){
                params.cardCode = cardCode
                params.cardSourceType = cardSourceType
            }

            getOrderSubmitApi(params).then((res)=>{
                if(res.data.code == 200){
                    this.clearStorage()
                    this.goPay(res.data.data,params)    
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })

            return
        },
        clearStorage(){
            utils.clearServices()

            uni.removeStorageSync('addedValueList')
        },
        goPay(data, params){
            let query = {
                orderId:data.orderId,
                orderSn:data.orderSn,
                currencyType:params.currencyType,
                price:data.price,
                rmbPrice:data.rmbPrice,
                ticketPrice:data.ticketPrice,
                rmbTicketPrice:data.rmbTicketPrice,
                discountPrice:data.discountPrice,
                discountRmbPrice:data.discountRmbPrice,
                addedValuePrice:data.addedValuePrice,
                addedValueRmbPrice:data.addedValueRmbPrice,
                orderType:'ticket',
            }
            let url = `/packageUser/pages/order/way?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url
            })
        },
        showPassengerPop(){
            this.isShowPassengerPop = true
        },
        goCoupon(){
            if(this.selectPassengerList.length == 0){
                uni.showToast({
                    title:'乘客信息不能为空',
                    icon:'none'
                })
                return
            }

            let query = {}

            query = Object.assign(query, this.options)

            let url = `/packageTicket/pages/coupon/coupon?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url:url
            })
        },
        goAddedValue(){
            let query = {}

            query = Object.assign(query, this.options)

            let url = `/packageTicket/pages/addedValue/addedValue?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url:url
            })
        },
        getPrice(){
            let num = this.selectPassengerList.length
            let double = Number(this.options.isRoundTrip) ? 2 : 1
            let tripList = this.tripList[0]
            let addedPrice = this.addedData ? this.addedData.mop : 0
            let addedRmbPrice = this.addedData ? this.addedData.rmb : 0
            let discountPrice = this.couponData ? this.couponData.discountPrice : 0
            let discountRmbPrice = this.couponData ? this.couponData.discountRmbPrice : 0
            let vipPrice = this.vipData ? this.vipData.mop : 0
            let vipRmbPrice = this.vipData ? this.vipData.rmb : 0
            let price1 = (tripList && tripList.price1) ? Number(tripList.price1) : 0
            let price5 = (tripList && tripList.price5) ? Number(tripList.price5) : 0

            this.mop = price1 * double * num + addedPrice + vipPrice - discountPrice

            this.rmb = price5 * double * num + addedRmbPrice + vipRmbPrice - discountRmbPrice
        },
        handleDetail(item){

        },
        handleMinus(item){
            if(item.value == 1) return

            item.value--
            
            let list = this.vipList

            for(let i=0; i<list.length; i++){
                if(list[i].id == item.id){
                    list[i].value = item.value
                    break
                }
            }
            this.checkVipPrice()
        },
        handleAdd(item){
            if(item.value == item.num) return

            item.value++
            
            let list = this.vipList

            for(let i=0; i<list.length; i++){
                if(list[i].id == item.id){
                    list[i].value = item.value
                    break
                }
            }

            this.checkVipPrice()
        },
        handleBlur(item,e){
            let value = e.detail.value
            let v = 1

            if(value < 1){
                v = 1
            }else if(value > item.num){
                v = item.num
            }else{
                v = value
            }

            item.value = Number(v)

            this.checkVipPrice()
        },
        hanlderChecked(item){
            let list = this.vipList

            for(let i=0; i<list.length; i++){
                if(list[i].id == item.id){
                    list[i].checked = !list[i].checked
                    break
                }
            }
            this.checkVipPrice()
        },
        checkVipPrice(){
            let list = this.vipList
            let mop = 0
            let rmb = 0

            list.forEach((item)=>{
                if(item.checked){
                    console.log(1111,'item',item.value)
                    mop += Number(item.value) * Number(item.price)
                    rmb += Number(item.value) * Number(item.rmbPrice)
                }
            })

            this.vipData = {
                mop,
                rmb
            }

            this.getPrice()
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:url('http://8.138.130.153:6003/vue/upload/static/order/bg.png') #F8F8F8 no-repeat;
    background-size:contain;
}

.wrap-top {
    padding:24rpx 20rpx;
    .top {
        position:relative;
        padding:0 40rpx;
        background:linear-gradient(205deg, #FFF7F4, #FFFFFF);
        border-radius:20rpx;
        overflow:hidden;
        .more {
            padding:28rpx 0;
            .item {
                position:relative;
                margin-bottom:8rpx;
                height:30rpx;
                line-height:30rpx;
                color:rgba(#000,.6);
                font-size:22rpx;
                .label,
                .text,
                .notice {
                    display:inline-block;
                    vertical-align:middle;
                }
                .text {
                    margin-left:24rpx;
                    color:rgba(#000,.9);
                }
                .notice {
                    margin-left:40rpx;
                    color:#FE5B28;
                    text-decoration:underline;
                }
            }
        }
    }
}

.list-passenger {
    margin:20rpx;
    padding:0 30rpx;
    background:#FFF;
    border-radius:20rpx;
    .hd {
        padding:30rpx 0 0;
        height:80rpx;
        line-height:80rpx;
        color:#000;
        font-size:36rpx;
        font-weight:500;
    }
    .item {
        position:relative;
        margin-left:72rpx;
        padding:28rpx 0;
        border-bottom:1px solid rgba(0,0,0,0.06);
        height:80rpx;
        .ico {
            position:absolute;
            top:32rpx;
            left:-72rpx;
            width:38rpx;
            height:38rpx;
            background:#000;
            border-radius:50%;
        }
        .name {
            margin-bottom:16rpx;
            height:32rpx;
            line-height:32rpx;
            .t,
            .n {
                display:inline-block;
                vertical-align:middle;
            }
            .n {
                color:#000;
                font-size:30rpx;
            }
            .t {
                margin-left:12rpx;
                padding:0 10rpx;
                height:30rpx;
                line-height:30rpx;
                border:1px solid rgba(0,0,0,.5);
                border-radius:5rpx;
                color:rgba(0,0,0,.5);  
                font-size:18rpx;  
            }
        }
        .passport {
            height:30rpx;
            line-height:30rpx;
            color:rgba(0,0,0,.5);
            font-size:24rpx;
            .t,
            .n {
                display:inline-block;
                vertical-align:middle;
            }
            .n {
                margin-right:12rpx;
            }
        }
    }
    .ft {
        height:109rpx;
        line-height:109rpx;
        font-size:30rpx;
        color:#FD5925;
        text-align:center;
    }
}

.wrap-coupon,
.wrap-added {
    position:relative;
    margin:24rpx 20rpx;
    padding-left:24rpx;
    height:90rpx;
    line-height:90rpx;
    background:#FFF;
    border-radius:20rpx;
    .name,
    .tag,
    .more {
        display:inline-block;
    }
    .name {
        margin-right:12rpx;
        color:#000;
        font-size:30rpx;
    }
    .tag {
        padding:0 12rpx;
        height:42rpx;
        line-height:42rpx;
        background:#FFF5F2;
        border:1px solid #FD5A26;
        border-radius:10rpx;
        font-size:22rpx;
        color:#FD5A26;
    }
    .more {
        width:360rpx;
        color:rgba(#000,.6);
        font-size:28rpx;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        vertical-align:middle;
    }
    .price {
        position:absolute;
        top:50%;
        right:44rpx;
        transform:translateY(-50%);
        color:#FD5A26;
        font-size:30rpx;
        text {
            display:inline-block;
        }
        .type {
            font-size:22rpx;
        }
        .text {
            font-size:30rpx;
        }
        .ico {
            margin-left:16rpx;
            width:14rpx;
            height:25rpx;
            background:url('http://8.138.130.153:6003/vue/upload/static/my/icon-arrow.png') no-repeat;
            background-size:contain;
        }
    }
}

.wrap-coupon {
    .tag {
        padding:0 12rpx;
        height:42rpx;
        line-height:42rpx;
        background:#FFF5F2;
        border:1px solid #FD5A26;
        border-radius:10rpx;
        font-size:22rpx;
        color:#FD5A26;
    }
}

.wrap-added {
    position:relative;
    margin:24rpx 20rpx;
    padding-left:24rpx;
    height:90rpx;
    line-height:90rpx;
    background:#FFF;
    border-radius:20rpx;
    .name {
        margin-right:24rpx;
    }
}

.wrap-tips {
    margin:40rpx 32rpx 24rpx;
    .hd {
        margin-bottom:24rpx;
        height:40rpx;
        line-height:40rpx;
        color:#333;
        font-size:30rpx;
    }
    .bd {
        color:#939292;
        font-size:24rpx;
    }
}

.wrap-vip {
    margin:0 20rpx;
}

.wrap-actions {
    position:fixed;
    bottom:0;
    left:0;
    z-index:2;
    width:100%;
    height:180rpx;
    background:#FFF;
    .notice {
        padding:0 44rpx;
        height:50rpx;
        line-height:50rpx;
        background:#FFF2D7;
        color:#FF7143;
        font-size:24rpx;
        text {
            display:inline-block;
            vertical-align:middle;
        }
        .ico {
            position:relative;
            margin-right:12rpx;
            width:24rpx;
            height:24rpx;
            border-radius:50%;
            border:1px solid rgba(0, 0, 0, 0.4);
            &.on {
                border-color:#FF7143;
                background:url('http://8.138.130.153:6003/vue/upload/static/common/ico-checked.png') no-repeat;
                background-size:contain;
            }
        }
    } 
    .actions {
        position:relative;
        height:128rpx;;
        .text {
            display:inline-block;
            padding-left:28rpx;
            line-height:128rpx;
            color:rgba(0,0,0,.3);
            font-size:30rpx;
            vertical-align:middle;
        }
        .btn {
            position:absolute;
            top:50%;
            right:20rpx;
            transform:translateY(-50%);
            width:500rpx;
            height:90rpx;
            background:#FFF4F1;
            border-radius:45rpx;
            border:1px solid #FD5A26;
            color:#FD5A26;
            font-size:22rpx;
            .item {
                display:inline-block;
                width:50%;
                height:90rpx;
                font-size:22rpx;
                text-align:center;
                vertical-align:middle;
                overflow:hidden;
                .price {
                    margin:8rpx 0 0;
                    height:40rpx;
                    line-height:40rpx;
                    font-size:22rpx;
                    text {
                        display:inline-block;
                        margin-left:4rpx;
                        font-size:38rpx;
                    }
                }
                .t {
                    margin-top:-4rpx;
                }
                &.mop {
                    background:linear-gradient(87deg, #FFA63F, #EB5628);
                    border-radius:0 45rpx 45rpx 0;
                    color:#FFF;
                }
            }
            &.btn-mop {
                width:auto;
                border-color:transparent;
                .item {
                    width:250rpx;
                    border-radius:45rpx;
                }
            }
        }
    }
}
</style>