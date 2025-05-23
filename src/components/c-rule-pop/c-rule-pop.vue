<template>
    <view class="c">
        <c-pop
            height="65vh"
            :isShow="isShoPop"
            @cbClosePop="cbClosePop"
        >
            <template #content>
                <view class="tabs">
                    <view 
                        class="item"
                        :class="{'active': ruleIndex == index}"
                        @click="changeIndex(index)"
                        v-for="(item,index) in ruleList"
                        :key="index"
                    >
                        <text>{{item.label}}</text>
                    </view>   
                    <view 
                        class="close" 
                        @click="cbClosePop"
                    >
                    </view> 
                </view>
                <scroll-view 
                    class="contents"
                    scroll-y
                >
                    <view 
                        class="item"
                        v-for="(item,index) in ruleList"
                        v-if="ruleIndex == index"
                        :key="index"
                    >
                        <rich-text :nodes="item.desc"></rich-text>
                    </view>
                </scroll-view>
            </template>
        </c-pop>
    </view>
</template>

<script>
import ticket from '@/types/ticket'
import { getRuleApi } from '@/api/ticket'
export default {
    props:{
        isShoPop:{
            type:Boolean,
            default:false
        },
        ruleIndex:{
            type:[Number,String],
            default:0
        },
        options:{
            type:Object,
            default:{}
        }
    },
    wathch:{
        ruleIndex:{
            deep:true,
            handler(n){

            }
        }
    },
    data(){
        return {
            ruleList:ticket.ruleList,
        }
    },
    mounted(){
        this.getRule()
    },
    methods:{
        getRule(){
            //获取购票退票规则
            let options = this.options
            let ruleList = this.ruleList
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

                        for(let p in data){

                            for(let i=0; i<ruleList.length; i++){
                                if(p == ruleList[i].name){
                                    ruleList[i].desc = data[p]
                                }
                            }
                        }   
                    }
                    resolve()
                })
            })
        },
        cbClosePop(){
            this.$emit('cbClosePop')
        },
        changeIndex(index){
            this.$emit('cbChangeIndex',index)
        }
    }
}
</script>

<style lang="scss" scoped>
.tabs {
    position:relative;
    padding:60rpx 50rpx;
    height:42rpx;
    line-height:42rpx;
    color:#000;
    font-size:32rp;
    font-weight:500;
    .close {
        position:absolute;
        top:30rpx;
        right:24rpx;
        width:42rpx;
        height:43rpx;
        background:url('https://newxcx.soofound.cn/vue/upload/static/common/icon-colse.png') no-repeat;
        background-size:contain;
    }
    .item {
        position:relative;
        display:inline-block;
        margin-right:84rpx;
        color:#888;
        vertical-align:middle;
        &:last-child {
            margin-right:0;
        }
        &.active {
            color:#000;
            font-weight:500;
            &::before {
                content:' ';
                position:absolute;
                bottom:0;
                left:50%;
                transform:translateX(-50%);
                width:130rpx;
                height:13rpx;
                background:rgba(#FF7937,0.5);
                text-align:center;
            }
            text {
                position:relative;
                z-index:1;
            }
        }
    }
}

.contents {
    height:calc(65vh - 120rpx - 42rpx - 68rpx);
    .item {
        padding:0 50rpx;   
    }
}

::v-deep .contents {
    margin:0;
    list-style:none;
    color:#000;
    font-size:24rpx;
    p {
        margin-bottom:32rpx;
    }
}
</style>