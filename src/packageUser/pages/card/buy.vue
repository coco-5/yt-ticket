<template>
    <view class="page">
        <view class="block"></view>
        <view 
            class="list"
            v-if="list.length"
        >
            <view 
                class="a"
                v-for="(item,index) in list"
                :key="index"
            >
                <c-ticket-card
                    class="item"
                    :item="item"
                    @showMore="showMore"
                    @showPortMore="showPortMore"
                    @goBuy="goBuy"
                ></c-ticket-card>
            </view>
        </view>

        <view 
            class="no-content"
            v-else
        >
            <c-no-content
                type="file"
                title="暂无可用票卡"
            ></c-no-content>    
        </view>

        <c-ticket-list-pop
            ref="cTicketListPop"
        ></c-ticket-list-pop>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getTicketCardListApi, getCreateOrderApi } from '@/api/ticket'
import { getWechatPayApi } from '@/api/pay'
export default {
    data(){
        return{
            tabs:[
                {
                    name:'未使用/生效中',
                    value:0
                },
                {
                    name:'历史票卡',
                    value:1
                }
            ],
            tabIndex:0, 
            list:[],    
            isSubmit:false,
        }
    },
    onLoad(e){
        this.options = e

        this.getTicketCardList()
    },
    methods:{
        getTicketCardList(){
            getTicketCardListApi({}).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.rows 
                    //type 类型 1-次卡；2-现金卡（澳门币）；3-折扣卡；4 - 现金卡(人民币)

                    data.length > 0 && data.forEach((item)=>{
                        if(item.type == 1){
                            item.class = 'times'
                        }else if(item.type == 2){
                            item.class = 'cash'
                        }else if(item.type == 3){
                            item.class = 'discount'
                        }else if(item.type == 4){
                            item.class = 'cash'
                        }

                        item.st = item.validateStartTime.split(' ')[0]
                        item.st = item.st.replace(/\-/g,'.')
                        item.et = item.validateEndTime.split(' ')[0]
                        item.et = item.et.replace(/\-/g,'.')
                        item.showMore = false
                    })

                    this.list = data
                }
            })
        },
        showMore(item){
            let list = this.list

            for(let i=0;i<list.length;i++){
                if(list[i].id == item.id){
                    list[i].showMore = !list[i].showMore
                    break
                }
            }
        },
        showPortMore(item){
            let list = item.ticketCardProtList

            if(list && list.length){
                this.$refs.cTicketListPop.show(list)     
            }
        },
        goBuy(item){
            if(this.isSubmit) return

            this.isSubmit = true

            uni.showLoading({
                title:'支付中...'
            })

            let params = {
                batchCode:item.batchCode
            }   
            
            getCreateOrderApi(params).then((res)=>{
                this.isSubmit = false
                uni.hideLoading()
                if(res.data.code == 200){
                    let data = res.data.data || {}

                    this.goPay(item,data)
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        },
        goPay(item,data){
            //orderSn=PK202504181895799&price=100&orderType=card&currencyType=1
            let query = {
                orderSn:data.orderSn,
                price:data.price,
                orderType:data.orderType,
                currencyType:1
            }

            let url = `/packageUser/pages/order/way?${utils.paramsStringify(query)}`

            uni.redirectTo({
                url
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

.block {
    height:24rpx;
}

.list {
    box-sizing:border-box;
    margin:0 auto;
    padding:32rpx;
    width:710rpx;
    background:#FFF;
    border-radius:20rpx;
}

.no-content {
    margin:300rpx auto 0;
}
</style>