<template>
    <view class="page">
        <!-- <view class="tips">你可以通过以下三种方式，成为会员，享受会员优惠价格购票:</view> -->

        <view class="list">
            <view 
                class="item"
                @click="goBinding(item)"
                v-for="(item,index) in list"
                :key="index"
            >
                <view class="name">
                    <view class="ico"></view>
                    <view class="type">{{item.name}}</view>
                </view>
                <view class="desc">
                    {{item.desc}}
                </view>
                <view class="btn">立即绑定</view>
            </view>
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    data(){
        return{
            list:[/* 
                {type:'zhuaoka',name:'珠澳卡',desc:'已有珠澳卡，绑定珠澳卡，即可享受珠澳卡优惠政策'},
                {type:'zhuaojumen',name:'珠澳居民',desc:'若您为珠海、澳门居民，线上提交申请，线下验证后，即可享受珠澳居民优惠购票'}, */
                {type:'zhuaojumen',name:'珠澳居民',desc:'若您为珠澳居民，可线上提交申请，审核通过后，即可享受珠澳居民优惠购票。'}
            ]
        }
    },
    onLoad(e){

    },
    methods:{
        goBinding(item){
            let query = {
                type:item.type
            }
            let url = `/packageUser/pages/member/binding?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url,
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

.tips {
    padding:0 30rpx;
    height:72rpx;
    line-height:72rpx;
    background:#FFF6EA;
    color:#FF7937;
    font-size:24rpx;
}

.list {
    margin:24rpx auto;
    width:710rpx;
    .item {
        position:relative;
        height:210rpx;
        background:#FFF;
        margin-bottom:16rpx;
        overflow:hidden;
        .name {
            margin:40rpx 0 24rpx 40rpx;
            height:40rpx;
            line-height:40rpx;
            font-size:34rpx;
            .ico,
            .type {
                display:inline-block;
            }
            .ico {
                margin-right:12rpx;
                width:35rpx;
                height:27rpx;
                background-image:url('https://newxcx.soofound.cn/vue/upload/static/vip/id.png');    
                background-repeat:no-repeat;
                background-position:top center;
                background-size:contain;
            }
            .type {
                font-size:34rpx;
                font-weight:500;
            }
        }
        .desc {
            padding-left:40rpx;
            width:420rpx;
            line-height:36rpx;
            color:rgba(0,0,0,.7);
            font-size:24rpx;
            text-align:justify;
        }
        .btn {
            position:absolute;
            top:50%;
            right:30rpx;
            transform:translateY(-50%);
            width:164rpx;
            height:60rpx;
            border-radius:30rpx;
            border:1px solid #FF480E;
            line-height:60rpx;
            color:#FF480E;
            font-size:26rpx;
            text-align:center;
        }
    }
}
</style>