<template>
    <view class="c-card">
        <c-pop
            height="65vh"
            :isShow="isShow"
            @cbClosePop="cbClosePop"
        >
            <template #content>
                <view 
                    class="a"
                    :style="{
                        height:'calc(65vh - ' + bottom + 'rpx)'}
                    "
                >
                    <view class="hd">
                        票卡
                        <view 
                            class="close"
                            @click="cbClosePop"
                        ></view>
                    </view>
                    <view 
                        class="bd"
                        v-if="list.length > 0"
                    >
                        <c-ticket-card
                            class="item"
                            type="checked"
                            :item="item"
                            v-for="(item,index) in list"
                            :key="index"
                            @showMore="showMore"
                            @cbChecked="cbChecked"
                            @showPortMore="showPortMore"
                        ></c-ticket-card>
                    </view>
                    <view 
                        class="c-no-content"
                        v-else
                    >
                        <c-no-content
                            type="file"
                            title="暂无可用票卡"
                        ></c-no-content>    
                    </view>

                    <view class="ft">
                        <view 
                            class="btn" 
                            @click="confirm"
                            v-if="list.length > 0"
                        >
                            确定
                        </view>
                        <view 
                            class="btn" 
                            @click="goCard"
                            v-else
                        >
                            购买票卡
                        </view>
                    </view>
                </view>
            </template>
        </c-pop>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getTicketCardListApi, getTicketCardMyListApi } from '@/api/ticket'
export default {
    props:{
        isShow:{
            type:Boolean,
            default:false
        }
    },
    watch:{
        isShow:{
            deep:true,
            handler(n){
                if(n && this.list.length == 0){
                    this.getList()     
                }
            }
        } 
    },
    data() {
        return {
            list:[],
            bottom:0,
            card:''
        }
    },
    mounted(){
        this.bottom = utils.fixIPhoneX() ? 48 : 0
    },
    methods:{
        getList(){
            let list = [
                this.getTicket()
            ]

            Promise.all(list)
        },
        getTicket1(){
            return new Promise((resolve)=>{
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
                        })

                        this.list = data

                        resolve(data)
                    }
                })

            })
        },
        getTicket(){
            getTicketCardMyListApi({}).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || []

                        data.forEach((item)=>{
                            item.ticketCardProtList = item.ticketProtList
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
                            item.checked = false
                        })

                        this.list = data
                    }
            })
        },
        cbClosePop(){
            this.$emit('cbClosePop')
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
        cbChecked(item){
            let list = this.list

            list.forEach((v)=>{
                if(v.code == item.code){
                    v.checked = true
                }else{
                    v.checked = false
                }
            })
            this.card = item
        },
        confirm(){
            if(!this.card){
                uni.showToast({
                    title:'请勾选票卡',
                    icon:'none'
                })
                return
            }

            this.$emit('cbConfirm',this.card)
        },
        showPortMore(item){
            let list = item.ticketProtList

            if(list && list.length){
                this.$emit('cbShowPortMore',list)   
            }
        },
        goCard(){
            let url = `/packageUser/pages/card/buy`

            uni.navigateTo({
                url,
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.c-card {
    .a {
        position:relative;
    }
    .hd {
        position:relative;
        height:148rpx;
        line-height:148rpx;
        color:#000;
        font-size:40rpx;
        font-weight:500;
        text-align:center;
        .close {
            position:absolute;
            top:50%;
            right:24rpx;
            transform:translateY(-50%);
            width:42rpx;
            height:43rpx;
            background:url('http://8.138.130.153:6003/vue/upload/static/common/icon-colse.png') no-repeat;
            background-size:contain;
        }
    }
    .bd {
        margin:0 24rpx;
        height:620rpx;
        overflow-y:auto;
        .item {
            position:relative;
            .b {
                position:relative;
                margin:0 0 12rpx;
                padding:0 48rpx 0 194rpx;
            }
            .info {
                box-sizing:border-box;
                padding:0 24rpx;
                height:100%;
                background:#FFF3EC;
                border-radius:12rpx;
                overflow:hidden;
                .title {
                    margin:24rpx 0 12rpx;
                    height:32rpx;
                    line-height:32rpx;
                    color:#000;
                    font-size:30rpx;
                }
                .tags {
                    .tag {
                        display:inline-block;
                        margin:0 8rpx 8rpx 0;
                        padding:0 14rpx;
                        height:30rpx;
                        line-height:30rpx;
                        border:1px solid #FE6630;
                        border-radius:5rpx;
                        color:#FE6630;
                        font-size:18rpx;
                        vertical-align:top;
                    }
                }
                .date {
                    color:rgba(#000,0.6);
                    font-size:20rpx;
                    white-space:nowrap;
                }
                .detail {
                    margin-top:12rpx;
                    color:rgba(#000,0.8);
                    font-size:20rpx;
                    .ico {
                        display:inline-block;
                        margin-left:8rpx;
                        width:22rpx;
                        height:12rpx;
                        transform:rotate(180deg);
                        background:url('http://8.138.130.153:6003/vue/upload/static/common/icon.png') no-repeat;
                        background-size:contain;
                    }
                }
            }
            .left {
                position:absolute;
                top:0;
                left:0;
                width:194rpx;
                height:194rpx;
                background:#EEE;
                color:#FFF;
                text-align:center;
                overflow:hidden;
                .num {
                    margin:50rpx 0 8rpx;
                    height:62rpx;
                    line-height:62rpx;
                    font-weight:500;
                    font-size:60rpx;
                }
                .times {
                    font-size:24rpx;
                }
            }
            .actions {
                position:absolute;
                top:50%;
                right:0;
                transform:translateY(-50%);
                width:34rpx;
                height:34rpx;
                background:#EEE;
            }
            &.discount {
                .info {
                    background:#E0EFEA;
                    .tags {
                        .tag {
                            border-color:#28BB89;
                            color:#28BB89;
                        }
                    }
                }
            }
            &.cash {
                .info {
                    background:#E3F1FE;
                    .tags {
                        .tag {
                            border-color:#368EF6;
                            color:#368EF6;
                        }
                    }
                }
            }
            .remark {
                padding:24rpx;
            }
        }
    }
    .ft {
        position:absolute;
        bottom:0;
        left:50%;
        transform:translateX(-50%);
        width:664rpx;
        .btn {
            width:100%;
            height:100rpx;
            line-height:100rpx;
            background:linear-gradient(87deg, #FFA63F, #EB5628);
            border-radius:50rpx;
            color:#FFF;
            font-size:34rpx;
            text-align:center;
        }
    }
}

.c-no-content {
    margin-top:100rpx;
}
</style>