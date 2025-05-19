<template>
    <view class="page">
        <view 
            class="result"
            :class="options.type"
        >
            <view class="icon"></view>
            <view class="title">{{result[options.type].title}}</view>
            <view class="desc">
                <rich-text :nodes="result[options.type].desc"></rich-text>
            </view>
            <view class="actions">
                <view 
                    class="btn"
                    :class="item.class"
                    v-for="(item,index) in result[options.type].btn"
                    :key="index"
                    @click="handleClick(item)"
                    >
                    {{item.title}}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data(){
        return{
            options:{},
            result:{
                successBinding:{
                    icon:'success',
                    title:'绑定成功',
                    desc:'<p>请携带澳门或珠海身份证前往人工柜台进行线下认证，方</p><p>可享受线上优惠购票。</p><p>人工柜台：</p><p>1、00853-28939944（澳门内港11A码头一楼售票处）</p><p>2、0756-8822088（湾仔口岸售票处）</p>',
                    btn:[
                        {title:'查看会员卡',class:'orange','link':'/pages/member/member'}
                    ]
                },
                errorBinding:{
                    icon:'error',
                    title:'绑定失败',
                    desc:'<p>请携带原珠澳卡实体卡前往人工柜台进行线下认证，(原</p><p>珠澳卡实体卡必须经由船务公司回收，然后进行线上认</p><p>证) 方可享受线上优惠购票。</p><p>人工柜台：</p><p>1、00853-28939944（澳门内港11A码头一楼售票处）</p><p>2、0756-8822088（湾仔口岸售票处）</p>',
                    btn:[
                        {title:'重新绑定',class:'orange','link':'/pages/member/member'},
                        {title:'返回首页',class:'default','link':'/pages/index/index'},
                    ]
                },
                successApply:{
                    icon:'success',
                    title:'申请已提交',
                    desc:'<p> 如三日内优惠仍未生效请联系内港客运码头售票处，电话00853-28939944，或前往内港售票处人工柜台线下认证 </p>',
                    btn:[
                        {title:'返回首页',class:'default','link':'/pages/index/index'},
                    ]
                }
            }
        }
    },
    onLoad(e){
        this.options = e
    },
    methods:{
        handleClick(item){
            uni.reLaunch({
                url:item.link
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
}

.result {
    padding-top:244rpx;
    .icon {
        display:block;
        margin:0 auto 24rpx;
        width:200rpx;
        height:200rpx;
        background-repeat:no-repeat;
        background-size:contain;
    }
    .title {
        height:40rpx;
        line-height:40rpx;
        color:#000;
        font-size:34rpx;
        font-weight:500;
        text-align:center;
    }
    .desc {
        margin:58rpx 50rpx 0;
        color:rgba(0,0,0,.7);
        font-size:26rpx;
    }
    .actions {
        position:fixed;
        bottom:40rpx;
        left:50%;
        transform:translateX(-50%);
        .btn {
            margin-top:32rpx;
            width:665rpx;
            height:100rpx;
            line-height:100rpx;
            border-radius:50rpx;
            border:1px solid #FF7937;
            color:#FF7937;
            font-size:34rpx;
            text-align:center;
            &.orange {
                background:linear-gradient(87deg, #FFA63F, #EB5628);
                color:#FFF;
            }
        }
    }
    &.successBinding {
        .icon {
            background-image:url('http://8.138.130.153:6003/vue/upload/static/vip/succes.png');
        }
    }
    &.errorBinding {
        .icon {
            background-image:url('http://8.138.130.153:6003/vue/upload/static/vip/close.png');
        }
    }
    &.successApply {
        .icon {
            background-image:url('http://8.138.130.153:6003/vue/upload/static/vip/succes.png');
        }
    }
}
</style>