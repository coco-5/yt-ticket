<template>
    <view class="page">
        <view class="block"></view>

        <view class="search">
            <view class="input">
                <input type="text">
                <view class="btn">兑换</view>
            </view>
        </view>
        
        <view 
            class="list"
            v-if="list.length"
        >
            <c-coupon-card
                :item="item"
                v-for="(item,index) in list"
                :key="index"
                @showMore="showMore"
                @cbChecked="hanlderChecked"
            ></c-coupon-card>
        </view>

        <view 
            class="no-content"
            v-else
        >
            <c-no-content
                type="file"
                title="当前没有可选的票卡"
            ></c-no-content>    
        </view>

        <view 
            class="bottom-actions"
            :style="actionsStyle"
        >
            <view 
                class="desc"
                v-if="selectdData"
            >
                <view class="name"><text>已选</text>{{selectdData.name || ''}}</view>
                <view class="price">
                    总价 
                    <text class="unit">{{selectdData.type == 4 ? 'RMB' : 'MOP' }}</text>
                    <text>{{selectdData.type == 4 ? (selectdData.discountRmbPrice || 0) : (selectdData.discountPrice || 0)}}</text>
                </view>
            </view>
            <view 
                class="btn"
                @click="confirm"
            >
                确定
            </view>
        </view>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getOneWayTicketDetailApi } from '@/api/ticket'
import { getPassengerListApi } from '@/api/passenger'
import { getOrderDiscountApi } from '@/api/order'
export default {
    data(){
        return{
            actionsStyle:'',
            list:[],
            selectdData:'',//选中的票卡
        }
    },
    onLoad(e){
        this.options = e

        this.fixActionsStyle()

        this.getList()
    },
    methods:{
        fixActionsStyle(){
            let height = 0
            this.actionsStyle = `padding-bottom:${utils.fixIPhoneX() ? 48 + height : height}rpx;`
        },
        getList(){
            let list = [
                this.getOneWayTicketDetail(),
                this.getPassengerList(),
            ]

            Promise.all(list)
        },
        getOneWayTicketDetail(){
            let options = this.options
            let params = {
                fromPortCode:options.fromPortCode,
                toPortCode:options.toPortCode,
                sailDate:options.sailDate,
                voyageId:options.voyageId,
                isRoundTrip:0,
                seatRankId:options.seatRankId,
                type:options.type,
                channel:1,//userStroe.user?.merchantAcitve ? 2 : 1,
            }

            return new Promise((resolve)=>{
                getOneWayTicketDetailApi(params).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || {}
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
                        this.passengerlist = data

                        this.getOrderDiscount()
                    }
                    resolve()
                })
            })
        },
        getOrderDiscount(){
            let options = this.options
            let orderVoyage = {
                departDate:options.sailDate,
                seatRankId:options.seatRankId,
                voyageId:options.voyageId
            }
            let orderVoyageReturn = {
                seatRankId:options.seatRankId    
            }
            let passengerList = this.passengerlist.filter(item=>item.isDefault)
            let params = {
                addedValueList:[],
                channel:1,//userStroe.user?.merchantAcitve ? 2 : 1,
                fromPortCode:options.fromPortCode,
                isRoundTrip:Number(options.isRoundTrip),
                orderVoyage,
                orderVoyageReturn,
                passengerList,
                toPortCode:options.toPortCode,
                type:options.type
            }

            getOrderDiscountApi(params).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data || []

                    data.forEach((item)=>{
                        item.st = item.validateStartTime.split(' ')[0]
                        item.st = item.st.replace(/\-/g,'.')
                        item.et = item.validateEndTime.split(' ')[0]
                        item.et = item.et.replace(/\-/g,'.')
                        item.showMore = false
                        item.checked = false
                    }) 

                    this.list = data
                }
            })
        },
        showMore(item){
            item.showMore = !item.showMore
        },
        hanlderChecked(item){
            let list = this.list

            this.selectdData = {}

            list.forEach((v)=>{
                if(v.code == item.code){
                    v.checked = true
                    this.selectdData = v
                }else{
                    v.checked = false
                }
            })

        },
        confirm(){
            /* if(!this.selectdData.code){
                uni.showToast({
                    title:'请选择优惠券',
                    icon:'none'
                })
                return
            } */

            utils.setServices(this.options,'coupon',this.selectdData)

            uni.navigateBack({
                delta:1
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {

}

.block {
    height:44rpx;
}

.search {
    position:relative;
    margin:0 22rpx 48rpx;
    height:78rpx;
    border:1px solid #FF7143;
    border-radius:39rpx;
    .input {
        box-sizing:border-box;
        display:inline-block;
        padding:20rpx;
        width:80%;
        height:100%;
        vertical-align:middle;
        input {
            display:block;
            width:100%;
            height:100%;
        }
    }
    .btn {
        position:absolute;
        top:50%;
        right:10rpx;
        transform:translateY(-50%);
        width:128rpx;
        height:62rpx;
        line-height:62rpx;
        background:#FF7143;
        border-radius:31rpx;
        color:#FFF;
        font-size:24rpx;
        text-align:center;
    }
}

.list {
    margin:0 22rpx;
}

.no-content {
    margin:300rpx auto 0;
}

.bottom-actions {
    position:fixed;
    z-index:2;
    bottom:0;
    left:0;
    padding-top:20rpx;
    width:100%;
    height:108rpx;
    border-top:1px solid rgba(0, 0, 0, 0.08);
    background:#FFF;
    text-align:right;
    .btn {
        display:inline-block;
        margin-right:24rpx;
        width:280rpx;
        height:90rpx;
        line-height:90rpx;
        border-radius:45rpx;
        background:linear-gradient(87deg, #FFA63F, #EB5628);
        color:#FFF;
        font-size:32rpx;
        text-align:center;
        vertical-align:middle;
    }
    .desc {
        display:inline-block;
        margin-right:24rpx;
        width:55%;
        text-align:right;
        overflow:hidden;
        vertical-align:middle;
        .name {
            display:inline-block;
            margin:34rpx 0 8rpx;
            max-width:90%;
            height:34rpx;
            line-height:34rpx;
            color:rgba(0,0,0,.8);
            font-size:30rpx;
            white-space:nowrap;
            text-overflow:ellipsis;
            overflow:hidden;
            vertical-align:top;
            text {
                margin-right:16rpx;
                color:rgba(0,0,0,.55);
            }
        }
        .price {
            color:#FE6630;
            font-weight:500;
            font-size:28rpx;
            .unit {
                margin:0 8rpx;
                font-size:22rpx;
            }
        }
    }
}
</style>