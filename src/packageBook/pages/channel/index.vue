<template>
    <view class="page">
        <telemplate v-if="grayLevel">
            <view class="sidebar">
                <view class="header">出发城市</view>
                <view 
                    class="item"
                    :class="cityIndex == index ? 'active' : ''"
                    v-for="(item,index) in city"
                    :key="index"
                    @click="change(index)"
                >
                    {{item.cityName}}
                </view>
            </view>
            <view class="content">
                <view class="header">
                    {{city[cityIndex].cityName}}有 <text>{{city[cityIndex].portCount}}</text>码头
                </view>
                <template
                    v-if="city[cityIndex].tickPaths.length"   
                >
                    <view 
                        class="item"
                        v-for="(path,i) in city[cityIndex].tickPaths"
                        :key="i"
                    >
                        <view class="path">
                            <view class="ico"></view>{{path.portLocalVo.portName}}
                        </view>
                        <template
                            v-if="path.toPortList && path.toPortList.length"
                        >
                            <view 
                                class="item-path"
                                v-for="(port,portIndex) in path.toPortList"
                                :key="portIndex"
                                @click="go(path.fromPort, port)"
                            >
                                {{path.fromPort.portName}} <view class="ico"></view> {{port.portName}}
                            </view>
                        </template>
                    </view>
                </template>
            </view>
        </telemplate>

        <template v-else>功能升级中，敬请期待</template>
    </view>
</template>

<script>
import baseConfig from '@/configs/baseConfig'
import utils from '@/utils/utils'
import { getCityListApi } from '@/api/ticket'
import {getGrayVersionApi } from '@/api/common'
export default {
    data(){
        return{
            city:[],
            cityIndex:0,
            grayLevel:1,
        }
    },
    onLoad(e){
        this.options = e

        this.initTodayDate()

        this.getList()
    },
    methods:{
        initTodayDate(){
            let today = new Date()
            const year = today.getFullYear()
            const month = today.getMonth()
            const date = today.getDate()

            this.sailDate = `${year}-${utils.formatNumber(month + 1)}-${utils.formatNumber(date)}`
        },
        getList(){
            let list = [
                this.getCityList(),
                this.getGrayLevel(),
            ]

            Promise.all(list)
        },
        getCityList(){
            return new Promise((resolve)=>{
                getCityListApi({}).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || []

                        this.city = data

                        resolve()
                    }
                })
            })
        },
        getGrayLevel(){
            let params = {
                id:1,
                version:baseConfig.graryVersion,
            } 

            getGrayVersionApi(params).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data

                    this.grayLevel = data.grayLevel
                }
            })
        },
        change(index){
            this.cityIndex = index
        },
        go(from,to){
            let item = this.city[this.cityIndex]
            //cityCode
            let query = {
                formCityCode:item.cityCode,
                toCityCode:item.cityCode,
                fromPortCode:from.portCode,
                toPortCode:to.portCode,
                sailDate:this.sailDate,
                sailDateReturn:this.sailDate,
                isRoundTrip:0,
            }

            let url = `/packageBook/pages/channel/list?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url,
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    position:relative;
    height:100vh;
    background:#F9F9F9;
    .header {
        padding-top:16rpx;
        height:100rpx;
        line-height:100rpx;
        background:#FFF;
        font-weight:500;
        text {
            display:inline-block;
            margin:0 8rpx;
        }
    }
    .sidebar {
        position:absolute;
        left:0;
        top:0;
        bottom:0;
        width:200rpx;
        text-align:center;
        .item {
            height:100rpx;
            line-height:100rpx;
            background:#F5F5F5;
            border-bottom:1px solid #FFF;
            font-size:32rpx;
            &.active {
                background:#FFF;
                color:#FF5E00;
            }
        }
    }
    .content {
        position:absolute;
        left:200rpx;
        top:0;
        right:0;
        bottom:0;
        padding-bottom:24rpx;
        overflow-y:auto;
        .item {
            padding:0 24rpx;   
            line-height:100rpx; 
            .path {
                height:100rpx;
                font-weight:500;
                .ico {
                    display:inline-block;
                    margin-right:8rpx;
                    width:40rpx;
                    height:40rpx;
                    background:url('https://newxcx.soofound.cn/vue/upload/static/common/WechatIMG4101.png') no-repeat;
                    background-size:contain;
                    vertical-align:middle;
                }
            }
            .item-path {
                height:100rpx;
                border-bottom:1px solid #F9F9F9;
                .ico {
                    display:inline-block;
                    margin:0 8rpx;
                    width:40rpx;
                    height:40rpx;
                    background:url('https://newxcx.soofound.cn/vue/upload/static/common/WechatIMG4100.png') no-repeat;
                    background-size:contain;
                    vertical-align:sub;
                }
            }
        }
    }
}
</style>