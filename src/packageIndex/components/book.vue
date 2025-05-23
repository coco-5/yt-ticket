<template>
    <view 
        class="book"
        :class="tabType"
    >
        <view class="tab">
            <view 
                class="item"
                @click="changeType(item)"
                v-for="(item,index) in tabList"
                :key="index"
            >
                {{ item.name }}
            </view>
        </view>

        <view class="notice">
            <notice></notice>
        </view>

        <view class="destination">
            <view 
                class="item"
                v-for="(item,index) in destinationList"
                :key="index"
            >
                <view class="t1">
                    {{item.name}}
                </view>
                <view 
                    class="t2"
                    @click="showDestPop(item)"
                >
                    <template v-if="item.type == 'departureDest'">
                        {{departureList[departureIndex].portName || ''}} 
                    </template>
                    <template v-else>
                        {{arrivalList[arrivalIndex].portName || ''}}
                    </template>
                </view>
            </view>
            <view 
                class="exchange"
                @click="exChangeDest"
            ></view>
        </view>

        <view class="date">
            <view 
                class="item"
                v-if="tabType == 'round' || (tabType == 'one' && item.type == 'departureDate')"
                v-for="(item,index) in dateList"
                :key="index"
            >
                <view 
                    class="t1"
                >
                    {{item.name}}
                </view>
                <view 
                    class="t2"
                    @click="showDatePop(item)"
                >
                    <template v-if="item.type == 'departureDate'">
                        {{departureDate}}
                    </template>
                    <template v-if="item.type == 'arrivalDate'">
                        {{arrivalDate}}
                    </template>
                </view>
            </view>  
        </view>

        <view 
            class="btn"
            @click="goBook"
        >
            立即购票
        </view>

        <view class="tips">
            无需选择返程时间，返程自动默认显示日期内有效
        </view>
        
        <c-pop
            height="65vh"
            :isShow="isShowDeparturePop"
            @cbClosePop="cbCloseDepartPop"
        >
            <template #content>
                <c-place-picker
                    :list="departureList"
                    :title="'出发港'"
                    :current="departureIndex"
                    @cbClosePop="cbCloseDepartPop"
                    @cbChoose="cbChooseDeparture"
                >
                </c-place-picker>
            </template>
        </c-pop>

        <c-pop
            height="65vh"
            :isShow="isShowArrivalPop"
            @cbClosePop="cbCloseArrivalPop"
        >
            <template #content>
                <c-place-picker
                    :list="arrivalList"
                    :title="'到达港'"
                    @cbClosePop="cbCloseArrivalPop"
                    @cbChoose="cbChooseArrival"
                >
                </c-place-picker>
            </template>
        </c-pop>

        <c-pop-date
            height="70vh"
            :isShow="isShowDatePop"
            :onDate="showDatePopType == 'arrivalDate' ? arrivalDate : departureDate"
            @cbClosePop="cbCloseDatePop"
            @cbConfirm="cbConfirmDate"
            v-if="departureDate"
        >
        </c-pop-date>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getPortRouteApi } from '@/api/ticket'
import notice from '@/packageIndex/components/notice'
export default {
    components:{
        notice,
    },
    data(){
        return{
            tabList:[
                {type:'one', name:'单程',active:true},
                {type:'round', name:'往返',active:false}
            ],
            destinationList:[
                {type:'departureDest', name:'出发港'},
                {type:'arrivalDest', name:'到达港'}
            ],
            dateList:[
                {type:'departureDate', name:'出发时间'},
                {type:'arrivalDate', name:'往返时间'}
            ],
            tabType:'one',
            isShowDeparturePop:false,
            departureList:[],
            departureIndex:0,
            isShowArrivalPop:false,
            arrivalList:[],
            arrivalIndex:0,
            isShowDatePop:false,
            showDatePopType:'',
            departureDate:'',
            arrivalDate:'',
        }
    },
    mounted(){
        this.getList()
        this.initTodayDate()
        this.initArrivalDate()
    },
    methods:{
        timeFormat:utils.timeFormat,
        getList(){
            let list = [
                this.getPortRoute()
            ]

            Promise.all(list)
        },
        getPortRoute(){
            let params = {
                isRoundTrip:this.tabType == 'round' ? true : false     
            }

            getPortRouteApi(params).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data
                    let portList = data.portList || []
                    let departureList = []

                    portList.forEach((item,index)=>{
                        if(item.fromPort){
                            departureList.push(item.fromPort)    
                            if(item.fromPort.portCode == data.defaultFromPort.portCode){
                                this.departureIndex = index
                            }
                        }
                    })

                    this.portList = portList

                    this.departureList = departureList

                    this.initArrival().then((arrivalList)=>{
                        for(let i=0; i<arrivalList.length; i++){
                            if(arrivalList[i].portCode == data.defaultToPort.portCode){
                                this.arrivalIndex = i
                                break
                            }
                        }
                    })
                }
            })
        },
        initArrival(){
            let portList = this.portList
            let arrivalList = []

            return new Promise((resolve)=>{
                for(let i=0; i<portList.length; i++){
                    if(i == this.departureIndex){
                        arrivalList = portList[i].toPortList
                        break
                    }
                }
                this.arrivalList = arrivalList

                resolve(arrivalList)
            })

        },
        initTodayDate(){
            let today = new Date()
            const year = today.getFullYear()
            const month = today.getMonth()
            const date = today.getDate()

            //this.departureDate = new Date(year, month, date).getTime()
            this.departureDate = `${year}-${utils.formatNumber(month + 1)}-${utils.formatNumber(date)}`
        },
        initArrivalDate(){
            let today = new Date(this.departureDate).getTime()
            let different = 6 * 24 * 60 * 60 * 1000
            let on = new Date(today + different)
            const year = on.getFullYear()
            const month = on.getMonth()
            const date = on.getDate()

            //this.arrivalDate = today.setDate(today.getDate() + different)
            this.arrivalDate = `${year}-${utils.formatNumber(month + 1)}-${utils.formatNumber(date)}`
        },
        cbCloseDepartPop(){
            this.isShowDeparturePop = false
        },
        cbChooseDeparture(item,index){
            this.departureIndex = index

            this.initArrival().then(()=>{
                this.arrivalIndex = 0
            })
        },
        cbCloseArrivalPop(){
            this.isShowArrivalPop = false
        },
        cbChooseArrival(item,index){
            this.arrivalIndex = index
        },
        cbCloseDatePop(){
            this.isShowDatePop = false
        },
        changeType(item){
            this.tabType = item.type
        },
        cbConfirmDate(date){
            if(this.showDatePopType == 'arrivalDate'){
                this.arrivalDate = date
            }else{
                this.departureDate = date
            }  
            
            this.cbCloseDatePop()
        },
        showDestPop(item){
            if(item.type == 'departureDest'){
                this.isShowDeparturePop = true
            }else{
                this.isShowArrivalPop = true
            }    
        },
        showDatePop(item){
            this.showDatePopType = item.type
            console.log(9999,'t',item.type)
            this.isShowDatePop = true
        },
        exChangeDest(){
            let arrival = this.arrivalList[this.arrivalIndex]
            let departureList = this.departureList

            for(let i=0; i<departureList.length; i++){
                if(arrival.portCode == departureList[i].portCode){
                    this.departureIndex = i
                    break
                }     
            }

            this.initArrival().then(()=>{
                this.arrivalIndex = 0
            })  
        },
        goBook(){
            let query = {
                fromPortCode:this.departureList[this.departureIndex].portCode || '',
                toPortCode:this.arrivalList[this.arrivalIndex].portCode || '',
                sailDate:this.departureDate || '',
                sailDateReturn:this.tabType == 'round' ? this.arrivalDate : this.departureDate,
                isRoundTrip:this.tabType == 'round' ? 1 : 0  
            }

            let url = this.tabType == 'one' ? `/packageBook/pages/flight/one` : `/packageBook/pages/flight/round`

            url += `?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.book {
    margin:0 15rpx 24rpx;
    padding-bottom:32rpx;
    background:#FFF;
    border-radius:30rpx;
    .tab {
        height:104rpx;
        line-height:104rpx;
        .item {
            display:inline-block;
            width:50%;
            border-radius:30rpx 30rpx 0 0;
            color:#000;
            font-weight:500; 
            text-align:center;
            vertical-align:top;
        }
    }
    .destination,
    .date {
        position:relative;
        display:flex;
        margin:0 44rpx;
        border-bottom:1px solid #EDEDED;
        .item {
            flex:1;
            .t1 {
                margin-top:40rpx;
                margin-bottom:22rpx;
                height:32rpx;
                line-height:32rpx;
                color:#999;
                font-size:28rpx;
            }
            .t2 {
                padding-bottom:24rpx;
                height:40rpx;
                line-height:40rpx;
                color:#000;
                font-size:32rpx;
                font-weight:500;
            }
            &:nth-child(2){
                text-align:right;
            }
        }
        .exchange {
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            width:54rpx;
            height:54rpx;
            background:url('https://newxcx.soofound.cn/vue/upload/static/index/qh2.png') no-repeat;
            background-size:contain;
        }
    }
    .date {
        border-bottom:0 none;
    }
    .btn {
        margin:0 auto 32rpx;
        width:664rpx;
        height:100rpx;
        line-height:100rpx;
        background:linear-gradient(87deg, #FFA63F, #EB5628);
        border-radius:50rpx;
        color:#FFF;
        font-size:34rpx;
        font-weight:500;
        text-align:center;
    }
    .tips {
        margin:0 44rpx;
        height:40rpx;
        line-height:40rpx;
        color:#F36A27;
        font-size:26rpx;
    }
    &.one {
        .tab {
            background:url('https://newxcx.soofound.cn/vue/upload/static/index/border2.png') no-repeat top right;
            background-size:contain;
            .item {
                &:last-child{
                    position:relative;
                    z-index:1;
                    color:rgba(0,0,0,.6);
                    font-weight:400;
                }
            }
        }
    }
    &.round {
        .tab {
            background:url('https://newxcx.soofound.cn/vue/upload/static/index/border1.png') no-repeat top left;
            background-size:contain;
            .item {
                &:nth-child(1){
                    color:rgba(0,0,0,.6);
                    font-weight:400;
                }
            }
        }
        .destination {
            .exchange {
                background-image:url('https://newxcx.soofound.cn/vue/upload/static/index/qh.png');    
            }
        }
    }
}
</style>