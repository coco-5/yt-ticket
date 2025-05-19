<template>
    <view class="page">
        <view 
            class="btn-add"
            @click="goAdd"
        >
            <view class="ico"></view>
            <view class="text">添加乘客</view>
        </view>
        <view 
            class="list"
            v-if="list.length > 0"
        >
            <view 
                class="item"
                v-for="(item,index) in list"
                :key="index"
            >
                <view class="name">{{item.passengerName}}</view>
                <view 
                    class="tag tag1"
                    v-if="item.passengerType == 1"
                >
                    成人票
                </view>
                <view 
                    class="tag tag2"
                    v-else-if="item.passengerType == 2"
                >
                    儿童
                </view>
                <view 
                    class="default"
                    v-if="item.isDefault == 1"
                >
                    默认
                </view>
                <view class="passport">{{item.certificateTypeName}} {{item.certificateNumber}}</view>
                <view 
                    class="ico"
                    @click="edit(item)"
                ></view>
            </view>
        </view>

        <view 
            class="no-content"
            v-else
        >
            <c-no-content
                type="note"
                title="当前没有相关乘客"
            ></c-no-content>
        </view>

        <view 
            class="btn"
            @click="goHome"
        >
            返回购票
        </view>

    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getPassengerListApi } from '@/api/passenger'
export default {
    data(){
        return{
            options:{},
            list:[]      
        }
    },
    onLoad(e){
        this.options = e
    },
    onShow(){
        this.getList()
    },
    methods:{
        getList(){
            let list = [
                this.getPassengerList(),
            ]

            Promise.all(list).then(()=>{

            })
        },
        getPassengerList(){
            return new Promise((resolve)=>{
                getPassengerListApi({}).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || []

                        this.list = data
                    }
                })
            })
        },
        goAdd(){
            this.go('add')
        },
        edit(item){
            this.go('edit',item)
        },
        go(type,item){
            let query = {
                type,
                id:(item && item.id) || 0
            }
            let url = `/packageUser/pages/passenger/add?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url
            })
        },
        goHome(){
            uni.navigateTo({
                url:`/pages/index/index`
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    padding-top:36rpx;
    min-height:calc(100vh - 36rpx);
    background:#F8F8F8;   
}

.btn-add {
    margin:0 20rpx;
    width:710rpx;
    height:86rpx;
    line-height:86rpx;
    background:#FFF;
    border-radius:20rpx;
    text-align:center;
    .ico,
    .text {
        display:inline-block;
        vertical-align:middle;
    }
    .text {
        color:#000;
        font-size:30rpx;
        font-weight:500;
    }
    .ico {
        margin-right:12rpx;
        width:26rpx;
        height:26rpx;
        background:url('http://8.138.130.153:6003/vue/upload/static/passenger/icon-add.png') no-repeat;
        background-size:contain;
    }
}

.list {
    margin:22rpx auto 0;
    width:710rpx;
    .item {
        box-sizing:border-box;
        position:relative;
        margin-bottom:24rpx;
        padding:44rpx 44rpx 60rpx;
        height:150rpx;
        background:#FFF;
        border-radius:20rpx;
        .name,
        .tag,
        .default {
            display:inline-block;
            vertical-align:middle;
        }
        .name {
            margin-right:16rpx;
            height:44rpx;
            line-height:44rpx;
            color:#000;
            font-size:28rpx;
            font-weight:500;
        }
        .tag,
        .default {
            margin-right:8rpx;
            padding:0 8rpx;
            height:30rpx;
            line-height:30rpx;
            border-radius:5rpx;
            font-size:18rpx;
            &.tag1 {
                border:1px solid #F47B33;
                color:#F47B33;
            }
            &.tag2 {
                border:1px solid #3C98FF;
                color:#3C98FF;
            }
        }
        .default {
            border:1px solid #8D8D8D;
            color:#8D8D8D;
        }
        .passport {
            color:#A3A3A3;
            font-size:22rpx;
        }
    }
    .ico {
        position:absolute;
        right:20rpx;
        top:50%;
        transform:translateY(-50%);
        width:28rpx;
        height:28rpx;
        background:url('http://8.138.130.153:6003/vue/upload/static/passenger/icon-edit.png') no-repeat;
        background-size:contain;
    }
}

.btn {
    margin:24rpx auto;
    width:710rpx;
    height:100rpx;
    line-height:100rpx;
    background:linear-gradient(87deg, #FFA63F, #EB5628);
    border-radius:50rpx;
    color:#FFF;
    font-size:34rpx;
    font-weight:500;
    text-align:center;
}

.no-content {
    margin:100rpx 0;
}
</style>