<template>
    <view class="page">
        <destination
            :dest="dest"
            v-if="dest"
        ></destination>

        <div class="list">
            <div class="item-list">
                <view 
                    class="hd"
                    @click="showDatetPop('departureDate')"
                >
                    <view class="text">去程 {{departureDate}}</view>
                    <view class="ico"></view>
                </view>
                <view 
                    class="bd"
                    :style="listStyle"
                    v-if="listDeparture.length"
                >
                    <card
                        :item="item"
                        type="departure"
                        v-for="(item,index) in listDeparture"
                        @cbChoose="choose"
                        :key="index"
                    ></card>
                </view>
                <view 
                    class="no-content"
                    v-else
                >
                    <c-no-content
                        type="box"
                        title="当前没有符合条件的航班"
                    ></c-no-content>  
                </view>
            </div>
            <div class="item-list arrival">
                <view 
                    class="hd"
                    @click="showDatetPop('arrivalDate')"
                >
                    <view class="text">返程 {{arrivalDate}}</view>
                    <view class="ico"></view>
                </view>
                <view 
                    class="bd"
                    :style="listStyle"
                    v-if="listArrival.length"
                >
                    <card
                        :item="item"
                        type="arrival"
                        v-for="(item,index) in listArrival"
                        @cbChoose="choose"
                        :key="index"
                    ></card>
                </view>
                <view 
                    class="no-content"
                    v-else
                >
                    <c-no-content
                        type="box"
                        title="当前没有符合条件的航班"
                    ></c-no-content>  
                </view>
            </div>
        </div>

        <view class="actions">
            <view 
                class="btn"
                @click="go"
            >
                下一步
            </view>
        </view>

        <c-pop-date
            height="70vh"
            :isShow="isShowDatePop"
            :onDate="showDatePopType == 'departureDate' ? departureDate : arrivalDate"
            @cbClosePop="cbCloseDatePop"
            @cbConfirm="cbConfirmDate"
            v-if="departureDate"
        >
        </c-pop-date>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import destination from '@/packageBook/components/destination'
import card from '@/packageBook/components/card'
import { getRoundTicketListApi } from '@/api/ticket'
export default {
    components:{
        destination,
        card
    },
    data(){
        return{
            options:{},
            dest:{},
            listDeparture:[],
            listArrival:[],
            listStyle:'',
            isShowDatePop:false,
            showDatePopType:'arrivalDate',
            arrivalDate:'',
            departureDate:'',
        }
    },
    onLoad(e){
        this.options = e

        this.initDate()

        this.fixedListStyle()

        this.getList()
    },
    methods:{
        initDate(){
            this.arrivalDate = this.options.sailDateReturn
            this.departureDate = this.options.sailDate
        },
        fixedListStyle(){
            let a = utils.fixIPhoneX() ? 48 : 0

            this.listStyle = `height:calc(100vh - 124rpx - 100rpx - 83rpx - ${a}px);`
        },
        getList(){
            uni.showLoading()

            let list = [
                this.getRoundTicketList()
            ]

            Promise.all(list).then(()=>{
                uni.hideLoading()
            })
        },
        getRoundTicketList(){
            let options = this.options
            let params = {
                sailDate:this.departureDate,
                sailDateReturn:this.arrivalDate,
                fromPortCode:options.fromPortCode,
                toPortCode:options.toPortCode,
                isRoundTrip:1,
                returnVoyageId:'',
                voyageId:'',
            }

            return new Promise((resolve)=>{
                getRoundTicketListApi(params).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data

                        this.dest = {
                            fromPort:data.fromPort,
                            toPort:data.toPort
                        }

                        data.voyage && data.voyage.length && data.voyage.forEach((item)=>{
                            item.isChoose = false
                        })

                        data.voyageReturn && data.voyageReturn.length && data.voyageReturn.forEach((item)=>{
                            item.isChoose = false
                        })                 

                        this.listDeparture = data.voyage || []
                        this.listArrival = data.voyageReturn || []
                    }
                    resolve()
                })
            })
        },
        choose(item,type){
            let list = type == 'departure' ? this.listDeparture : this.listArrival
            let id = ''

            list.forEach((val)=>{
                if(val.voyageRouteId == item.voyageRouteId){
                    val.isChoose = true
                    id = item.voyageRouteId
                }else{
                    val.isChoose = false
                }
            })

            if(type == 'departure'){
                this.voyageId = id
            }else{
                this.returnVoyageId = id
            }
        },
        go(){
            let options = this.options
            let query = {
                sailDate:options.sailDate,
                sailDateReturn:options.sailDateReturn,
                fromPortCode:options.fromPortCode,
                toPortCode:options.toPortCode,
                isRoundTrip:1,
                returnVoyageId:this.returnVoyageId || '',
                voyageId:this.voyageId || '',
            }

            if(!this.voyageId){
                uni.showToast({
                    title:'请选择去程航班',
                    icon:'none'
                })
                return
            }

            if(!this.returnVoyageId){
                uni.showToast({
                    title:'请选择返程航班',
                    icon:'none'
                })
                return
            }

            let url = `/packageTicket/pages/seatType/seatType?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url
            })
        },
        showDatetPop(type){
            this.isShowDatePop = true

            this.showDatePopType = type
        },
        cbCloseDatePop(){
            this.isShowDatePop = false
        },
        cbConfirmDate(date){
            if(this.showDatePopType == 'arrivalDate'){
                this.arrivalDate = date
            }else{
                this.departureDate = date
            }  

            this.getList()
            
            this.cbCloseDatePop()
        },
    }
}

</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:#F8F8F8;
}

.list {
    margin:0 17rpx;
    .item-list {
        display:inline-block;
        width:354rpx;
        vertical-align:top;
        .hd {
            height:83rpx;
            line-height:83rpx;
            background:url('http://8.138.130.153:6003/vue/upload/static/round/tab1.png') no-repeat;
            background-size:contain;
            color:#FFF;
            font-size:30rpx;
            font-weight:500;
            text-align:center;
            .text,
            .ico {
                display:inline-block;
                vertical-align:middle;
            }
            .ico {
                margin-left:8rpx;
                width:11rpx;
                height:19rpx;
                background:url('http://8.138.130.153:6003/vue/upload/static/round/ico-arrow.png') no-repeat;
                background-size:contain;
            }
        }
        &.arrival {
            margin-left:10rpx;
            .hd {
                background-image:url('http://8.138.130.153:6003/vue/upload/static/round/tab2.png');
            }
        }
        .bd {
            background:#FFF;
            border-radius:0 0 20rpx 20rpx;
            overflow:auto;
        }
    }
}

.actions {
    position:fixed;
    padding-bottom:48rpx;
    bottom:0;
    left:0;
    width:100%;
    height:100rpx;
    .btn {
        margin:0 auto;
        width:664rpx;
        height:100rpx;
        line-height:100rpx;
        background:linear-gradient(87deg, #FFA63F, #EB5628);
        border-radius:50rpx;
        color:#FFF;
        font-size:34rpx;
        text-align:center;
    }
}

.no-content {
    padding:300rpx 0;
    background:#FFF;
}

::v-deep .no-content .icon {
    width:240rpx!important;
    height:240rpx!important;
}

::v-deep .no-content .title {
    font-size:20rpx!important;
}
</style>