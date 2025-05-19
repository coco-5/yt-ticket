<template>
    <view 
        class="c"
        v-show="show"
    >
        <view class="bg"></view>
        <view 
            class="win"
            v-for="(item,index) in list"
            :key="index"
            v-show="index == current"
        >
            <view class="win-main">
                <view class="title">
                    <text>{{item.title}}</text>
                </view>
                <view 
                    class="content"
                    v-if="item.contentType == 1"
                >
                    {{item.content}}
                </view>
                <view 
                    class="img"
                    v-else
                >
                    <image :src="item.img"></image>
                </view>
                <view 
                    class="btn"
                    @click="go(item)"
                >
                    {{item.link ? '查看详情' : '知道了'}} 
                </view>
            </view>   
            <view 
                class="close"
                @click="close"
            ></view>
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getTicketPopupApi } from '@/api/ticket'
export default {
    data(){
        return{
            list:[],
            current:0,
            show:false,
        }
    },
    mounted(){
        if(!uni.getStorageSync('ticketPopup')){
            this.getTicketPopup()
        }
    },
    methods:{
        getTicketPopup(){
            getTicketPopupApi({}).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data || []

                    this.list = data

                    this.current = this.list.length - 1

                    this.show = this.list.length > 0 ? true : false
                }
            })
        },
        go(item){
            if(item.link){
                let query = {
                    url:item.link
                }  
                let url = `/pages/notice/notice?${utils.paramsStringify(query)}`

                uni.navigateTo({
                    url,
                })
            }
            this.close()  
        },
        close(){
            if(this.current == 0){
                this.show = false
                uni.setStorageSync('ticketPopup',true)
                return
            }

            this.current-- 
        },
    }
}
</script>

<style lang="scss" scoped>
.c {
    position:absolute;
    top:0;
    left:0;
    z-index:10;
    width:100%;
    height:100vh;
    .bg {
        position:fixed;
        top:0;
        left:0;
        z-index:11;
        width:100%;
        height:100vh;
        background:rgba(0,0,0,.5);
    }
}

.win {
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    z-index:12;
    text-align:center;
    .win-main {
        margin:0 auto 60rpx;
        box-sizing:border-box;
        width:680rpx;
        padding:34rpx 30rpx 28rpx;
        background:linear-gradient(205deg, #fdeee9, #ffffff);
        border-radius:20rpx;   
        .title {
            position:relative;
            margin-bottom:24rpx;
            color:#000;
            font-size:34rpx;
            font-weight:500;
            text-align:center;
            text {
                position:relative;
                &:before {
                    content:' ';
                    position:absolute;
                    bottom:0;
                    left:50%;
                    transform:translateX(-50%);
                    width:110%;
                    height:10rpx;
                    background:rgba(255, 72, 14, 0.2);
                }
            }
        }
        .content {
            max-height:400rpx; 
            min-height:200rpx;
            line-height:44rpx; 
            font-size:24rpx;
            color:rgba(0, 0, 0, 0.9);
            overflow-y:auto;
            image {
              width:100%;
            }
        }
        .btn {
          margin:24rpx auto 0;
          width:334rpx; 
          height:100rpx; 
          line-height:100rpx;
          background:linear-gradient(87deg, #ffa63f, #eb5628);
          border-radius:50rpx; 
          font-weight:500;
          font-size:34rpx; 
          color:#FFF;
        }
    }
    .close {
        margin:0 auto;
        width:52rpx;
        height:52rpx;
        background:url('http://8.138.130.153:6003/vue/upload/static/index/close2.png') no-repeat;
        background-size:contain;
    }
}
</style>