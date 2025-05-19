<template>
    <view class="page">
        <view class="tabs">
            <c-services-tab
                :tabIndex="tabIndex"
                @change="changeTab"
            ></c-services-tab>
        </view>

        <view 
            class="list"
            v-if="allList[tabIndex].list.length"
        >
            <c-added-card
                class="item"
                v-for="(item,index) in allList[tabIndex].list"
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

        <view 
            class="no-content"
            v-else
        >
            <c-no-content
                type="file"
                title="当前没有可选的增值服务"
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
                <view class="name"><text>已选</text>{{name}}</view>
                <view class="price">
                    总价
                    <text class="unit">MOP</text>
                    <text>{{mop}}</text>
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
import ticket from '@/types/ticket'
import { getOneWayTicketDetailApi, getRuleApi, getVipListApi, getAddedValuePageApi } from '@/api/ticket'
import { getPassengerListApi } from '@/api/passenger'
export default {
    data(){
        return{
            tabIndex:0,
            allList:[],
            addValueList:ticket.addValueList,
            actionsStyle:'',
            selectdData:'',
            name:'',
            mop:0
        }
    },
    onLoad(e){
        this.options = e

        this.storageName = 'addedValueList'

        this.fixActionsStyle()

        this.initList()
    },
    methods:{
        fixActionsStyle(){
            let height = 0
            this.actionsStyle = `padding-bottom:${utils.fixIPhoneX() ? 68 + height : height}rpx;`
        },
        initList(){
            let addValueList = this.addValueList
            let allList = []
            //存起来全部的数据，是为了在填写页面，返回来的时候，可以获取到
            let stroage = uni.getStorageSync(this.storageName) || []

            addValueList.forEach((item)=>{
                allList.push({
                    type:item.value,
                    pageNum:1,   
                    list:[],
                    isRequest:false,
                    done:false
                })
            })

            if(stroage.length){
                allList.forEach((item)=>{
                    stroage.forEach((v)=>{
                        if(v.type == item.type){
                            item.pageNum = v.pageNum
                            item.list = v.list
                            item.isRequest = v.isRequest
                            item.done = v.done
                        }
                    })
                })
            }

            this.allList = allList

            this.checkAddedData()

            this.getList()
        },
        getList(){
            let list = [
                //this.getOneWayTicketDetail(),
                //this.getRule(),
                //this.getPassengerList(),
                this.getAddedValuePage()
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

                        //this.getOrderDiscount()
                    }
                    resolve()
                })
            })
        },
        getRule(){
            //获取购票退票规则
            let options = this.options
            let params = {
                fromPortCode:options.fromPortCode,
                toPortCode:options.toPortCode,
                sailDate:options.sailDate,
                voyageId:options.voyageId,
                isRoundTrip:0,
            }

            return new Promise((resolve)=>{
                getRuleApi(params).then((res)=>{
                    resolve()
                })
            })
        },
        getVipList(){
            let options = this.options
            let params = {
                fromPortCode:options.fromPortCode,
                toPortCode:options.toPortCode,
            }

            getVipListApi(params).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data || []
                }
            })
        },
        getAddedValuePage(){
            let target = this.allList[this.tabIndex]
            let options = this.options
            let pageSize = 20

            if(target.isRequest) return

            if(target.done) return

            target.isRequest = true

            let params = {
                fromPortCode:options.fromPortCode,  
                toPortCode:options.toPortCode,
                type:target.type,
                pageNum:target.pageNum,
                pageSize,
            }

            return new Promise((resolve)=>{
                getAddedValuePageApi(params).then((res)=>{
                    target.isRequest = false

                    if(res.data.code == 200){
                        let rows = res.data.rows || []

                        if(rows.length == 0){
                            target.done = true
                        }

                        if(rows.length < pageSize){
                            target.done = true
                        }else{
                            target.pageNum++
                        }

                        rows.length && rows.forEach((item)=>{
                            item.value = 1
                            item.checked = false
                        })

                        target.list = target.list.concat(rows)
                    }

                    uni.setStorageSync(this.storageName,this.allList)

                    resolve()
                })    
            })
        },
        setAllListStorage(){
            uni.setStorageSync(this.storageName,this.allList)
        },
        checkAddedData(){
            let addedValue = utils.checkSerivces(this.options,'addedValue') || {}
            let allList = this.allList

            allList.forEach((item)=>{
                let list = item.list

                list.length && list.forEach((v)=>{
                    for(let p in addedValue){
                        if(p == v.id){
                            v.checked = true
                            v.value = addedValue[p].value
                        }
                    }    
                })
            })
            this.checkSelectdData()
        },
        handleDetail(item){

        },
        handleMinus(item){
            if(item.value == 1) return

            item.value--
            
            let list = this.allList[this.tabIndex].list

            for(let i=0; i<list.length; i++){
                if(list[i].id == item.id){
                    list[i].value = item.value
                    break
                }
            }
            this.checkSelectdData()
        },
        handleAdd(item){
            if(item.value == item.num) return

            item.value++
            
            let list = this.allList[this.tabIndex].list

            for(let i=0; i<list.length; i++){
                if(list[i].id == item.id){
                    list[i].value = item.value
                    break
                }
            }
            this.checkSelectdData()
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

            this.checkSelectdData()
        },
        hanlderChecked(item){
            let allList = this.allList
            let tabIndex = this.tabIndex
            let list = allList[tabIndex].list

            list.forEach((v)=>{
                if(v.id == item.id){
                    v.checked = !v.checked
                }
            })

            this.checkSelectdData()
        },
        checkSelectdData(){
            let allList = this.allList
            let name = []
            let mop = 0
            let selectdData = {}

            allList.forEach((item)=>{
                let list = item.list

                list.forEach((v)=>{
                    if(v.checked){
                        name.push(v.name)
                        mop += v.price * v.value
                        selectdData[v.id] = v
                    }
                })
            })

            this.selectdData = selectdData
            this.name = name.join(',')
            this.mop = mop
        },
        confirm(){
            utils.setServices(this.options,'addedValue',this.selectdData)

            uni.navigateBack({
                delta:1
            })
        },
        changeTab(index){
            this.tabIndex = index

            this.getAddedValuePage()
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:#f8f8f8;
}

.tabs {
    padding:40rpx 50rpx;
}

.list {
    margin:0 20rpx;
}

.no-content {
    margin:400rpx auto 0;
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
        text-align:right;
        overflow:hidden;
        vertical-align:middle;
        .name {
            display:inline-block;
            margin:34rpx 0 8rpx;
            max-width:400rpx;
            height:34rpx;
            line-height:34rpx;
            color:rgba(0,0,0,.8);
            font-size:30rpx;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
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