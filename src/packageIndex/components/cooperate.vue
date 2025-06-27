<template>
    <view class="c-cooperate">
        <view 
            class="item"
            @click="go(item)"
            v-for="(item,index) in list"
            :key="index"
            v-if="item.display == 1"
        >
            <img :src="item.icon"/>
            <view class="text">{{item.title}}</view>
        </view>

        <card
            :isShow="isShowCard"
            @cbClosePop="cbCloseCard"
            @cbConfirm="cbConfirm"
            @cbShowPortMore="cbShowPortMore"
        ></card>

        <c-ticket-pop
            ref="cTicketPop"
        ></c-ticket-pop>

        <c-ticket-list-pop
            ref="cTicketListPop"
        ></c-ticket-list-pop>
    </view>
</template>

<script>
import { getPartnerListApi } from '@/api/common'
import card from '@/packageIndex/components/card'
export default {
    components:{
        card,
    },
    props:{
        grayLevel:{
            type:[Number,Boolean],
            default:1,
        }
    },
    watch:{
        grayLevel:{
            deep:true,
            handler(n){}
        }
    },
    data() {
        return {
            list:[],
            isShowCard:false, 
            timer:null,
            time:500,  
        }
    },
    mounted(){
        this.checkToken()
    },
    destroyed(){
        clearInterval(this.timer)
    },
    methods: {
        checkToken(){
            this.timer = setInterval(()=>{
                let token = uni.getStorageSync('token') 
                if(token){
                    this.getPartnerList()
                    clearInterval(this.timer)
                    return
                }
            },this.time)
        },
        getPartnerList(){
            getPartnerListApi().then(res=>{
                if(res.data.code == 200){
                    let data = res.data.data || []

                    data.forEach((item)=>{
                        item.display = true
                        if(!item.link && !this.grayLevel){
                            item.display = false
                        }
                    })

                    this.list = this.list.concat(data)

                    this.list.sort((a, b) => a.sort - b.sort)
                }
            })
        },
        go(item){
            if(item.type == 'card'){
                this.isShowCard = true
                return
            }else{
                let notice = ['航班信息','停航通知','购退票须知']

                let url = ``

                if(item.type == 1){
                    url = `/packageNotice/pages/index/index?id=${item.id}`
                    uni.navigateTo({
                        url,
                    })
                    return
                }
                
                if(item.link){
                    let url = `/pages/notice/notice?url=${item.link}`

                    uni.navigateTo({
                        url,
                    })

                    return
                }else{
                    uni.showToast({
                        title:'即将上线，敬请期待',
                        icon:'none'
                    })
                }
            }
        },
        cbCloseCard(){
            this.isShowCard = false
        } ,
        cbConfirm(item){
            this.isShowCard = false   

            this.$refs.cTicketPop.show(item)
        },
        cbShowPortMore(item){
            this.isShowCard = false   
            this.$refs.cTicketListPop.show(item)    
        } 
    }
}
</script>

<style lang="scss" scoped>
.c-cooperate {
    padding-bottom:46rpx;
    background:#FFF;
    border-radius:24rpx;
    .item {
        display:inline-block;
        width:25%;
        height:155rpx;
        vertical-align:top;
        text-align:center;
        img {
            display:block;
            margin:48rpx auto 20rpx;
            width:54rpx;
            height:54rpx;
        }
        .text {
            color:#000;
            font-size:22rpx;
        }
    }
}
</style>