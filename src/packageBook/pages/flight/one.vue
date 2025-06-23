<template>
    <view class="page"> 
        <destination
            :dest="dest"
            v-if="dest"
        ></destination>

        <view class="dates">
            <date
                :options="options"
                @chooseDate="chooseDate"
            ></date>
        </view>

        <view 
            class="list"
            v-if="list.length"
        >
            <view 
                class="item"
                v-for="(item,index) in list"
                @click="go(item)"
                :key="index"
            >
                <view class="date">
                    <view class="date-item">
                        <view class="d">{{item.setoffTime}}</view>
                        <view class="t">{{item.fromPort}}</view>
                    </view>
                    <view class="long">
                        <view class="t">{{item.duration}}</view>
                        <view class="ico"></view>
                    </view>
                    <view class="date-item">
                        <view class="d">{{item.arriveTime}}</view>
                        <view class="t">{{item.toPort}}</view>
                    </view>
                </view>
                <view 
                    class="grade"
                    v-if="item.dtseatrankPrice && item.dtseatrankPrice.length"
                >
                    <view 
                        class="i"
                        v-for="(d,i) in item.dtseatrankPrice"
                        :key="i"
                    >
                        {{d.seatRank}}<text>（{{d.seatNum}}张）</text>
                    </view>
                </view>
                <div class="price">
                    <view 
                        class="price-item mop"
                        v-if="item.minPrice"
                        style="display:none;"
                    >
                        <text>MOP</text>
                        <text class="p">{{item.minPrice}}</text>
                        <text 
                            class="t"
                            v-if="item.dtseatrankPrice.length > 1"
                        >
                            起
                        </text>
                    </view>
                    <view 
                        class="price-item"
                        v-if="item.fportCode === 'MAO' || item.tportCode === 'MAO'"
                    >
                        <text>RMB</text>
                        <text class="p">{{item.minPrice5 || 0 }}</text>
                        <text 
                            class="t"
                            v-if="item.dtseatrankPrice.length > 1"
                        >
                            起
                        </text>
                    </view>
                </div>
            </view>
        </view>

        <view 
            class="no-content"
            v-else
        >
            <c-no-content
                type="file"
                :title="msg"
            ></c-no-content>   

            <view 
                class="btn"
                @click="goHome"
                v-if="!isRequest"
            >
                去首页看看吧
            </view> 
        </view>

        <c-bottom></c-bottom>
    </view>
</template>

<script> 
import utils from '@/utils/utils'
import date from '@/packageBook/components/date'
import destination from '@/packageBook/components/destination'
import { getOneWayTicketListApi } from '@/api/ticket'
export default {
    components:{
        date,
        destination
    },
    data(){
        return{
            options:{},
            list:[],
            dest:{},
            isRequest:false,
            msg:'数据加载中'
        }
    },
    onLoad(e){
        this.options = e

        this.getDetail(this.options.sailDate)
    },
    methods:{
        getDetail(sailDate){
            let options = this.options
            let params = {
                fromPortCode:options.fromPortCode,
                toPortCode:options.toPortCode,
                sailDate:sailDate,
                sailDateReturn:options.sailDateReturn,
                isRoundTrip:0
            }

            this.msg = '数据加载中'

            if(this.isRequest) return

            uni.showLoading({
                title:'加载中'
            })

            this.isRequest = true

            this.list = []

            getOneWayTicketListApi(params).then((res)=>{
                this.isRequest = false
                uni.hideLoading()
                if(res.data.code == 200){
                    let data = res.data.data || []

                    this.dest = {
                        fromPort:data.fromPort,
                        toPort:data.toPort
                    }

                    this.list = data.voyage || []
                }
                this.msg = '抱歉～当前没有符合条件的航班'
            })
        },
        chooseDate(date){
            this.getDetail(date)
        },
        go(item){
            let query = {
                fromPortCode:item.fportCode,
                toPortCode:item.tportCode,  
                sailDate:item.setoffDate, 
                voyageId:item.voyageRouteId,
                isRoundTrip:0
            }

            let url = `/packageTicket/pages/seatType/seatType?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url
            })
        },
        goHome(){
            uni.redirectTo({
                url:`/pages/index/index`
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:#F8F8F8;
}
.dates {
    margin:0 0 32rpx;
}

.list {
    margin:16rpx;
    .item {
        position:relative;
        margin-bottom:16rpx;
        padding-left:24rpx;
        padding-right:200rpx;
        height:176rpx;
        background:#FFF;
        border-radius:20rpx;
        overflow:hidden;
        .date {
            margin:40rpx 0 0 0;
            white-space:nowrap;
            .date-item,
            .long {
                display:inline-block;
                text-align:center;
            }
            .date-item {
                width:80rpx;
                vertical-align:middle;
                .d {
                    height:40rpx;
                    line-height:40rpx;
                    color:#000;
                    font-size:36rpx;
                }
                .t {
                    margin-top:8rpx;
                    color:#9D9D9D;
                    font-size:20rpx;
                }
            }
            .long {
                margin:0 24rpx 0;
                vertical-align:16rpx;
                .t {
                    margin-bottom:8rpx;
                    height:24rpx;
                    line-height:24rpx;
                    color:#A3A3A3;
                    font-size:18rpx;
                }
                .ico {
                    width:129rpx;
                    height:9rpx;
                    background:url('https://newxcx.soofound.cn/vue/upload/static/ticket/car.png') no-repeat;
                    background-size:contain;
                }
            }
        }
        .grade {
            .i {
                display:inline-block;
                margin-right:28rpx;
                color:#8D8D8D;
                font-size:20rpx;
                vertical-align:middle;
                text {
                    color:#EC702E;
                }
            }
        }
    }
    .price {
        position:absolute;
        top:50%;
        right:50rpx;
        transform:translateY(-50%);
        text-align:center;
        .price-item {
            margin-bottom:8rpx;
            height:45rpx;
            line-height:45rpx;
            color:#000;
            font-size:22rpx;
            text {
                display:inline-block;
            }
            .p {
                margin:0 4rpx;
                font-size:40rpx;
            }
            .t {
                color:#A3A3A3;
                font-size:20rpx;
                font-weight:500;
            }
            &.mop {
                color:#FE6630;
            }
        }
    }
}

.no-content {
    margin:300rpx auto 0;
    .btn {
        margin:50rpx auto 0;
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
}
</style>