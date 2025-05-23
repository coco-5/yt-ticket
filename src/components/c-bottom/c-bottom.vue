<template>
    <view 
        class="bottom-nav"
        :style="bottomStyle + style"
    >
        <view 
            class="list"
            :style="bottomStyle + style"
            v-if="isShowNav"
        >
            <slot name="content">
                <view 
                    class="item"
                    :class="index == current ? 'on' : '' "
                    @click="go(item)"
                    v-for="(item,index) in bottomList"
                    :key="index"
                >       
                    <view 
                        class="ico"
                        :class="item.type"
                    ></view>
                    <view class="name">{{item.name}}</view>
                </view> 
            </slot>
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    props:{
        current:{
            type:[String,Number],
            default:0
        },
        isShowNav:{
            type:Boolean,
            default:false
        },
        style:{
            type:String,
            default:''
        }
    },
    watch:{

    },
    data(){
        return {
            bottomList:[
                {
                    type:'home',
                    name:'首页',
                    url:'/pages/index/index'
                },
                {
                    type:'order',
                    name:'订单',
                    url:'/packageUser/pages/order/list'    
                },
                {
                    type:'my',
                    name:'我的',
                    url:'/packageUser/pages/user/user'
                }
            ],
            bottomStyle:''
        }
    },
    mounted(){
        this.bottomStyle = `padding-bottom:${utils.fixIPhoneX() ? 48 : 0}rpx;`
    },
    methods:{
        go(item){
            uni.reLaunch({
                url:item.url
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.bottom-nav {
    height:120rpx;
    text-align:center
}
.list {
    display:flex;
    position:fixed;
    bottom:0;
    left:0;
    width:100%;
    height:120rpx;
    background:#FFF;
    .item {
        flex:1;
        color:#CACACA;
        font-size:18rpx;
        text-align:center;
        .ico {
            margin:24rpx auto 0;
            width:45rpx;
            height:45rpx;
            background-repeat:no-repeat;
            background-size:contain;
            &.home {
                background-image:url("https://newxcx.soofound.cn/vue/upload/static/bottom/home.png");
            }
            &.order {
                background-image:url("https://newxcx.soofound.cn/vue/upload/static/bottom/order.png");
            }
            &.my {
                background-image:url("https://newxcx.soofound.cn/vue/upload/static/bottom/my.png");
            }
        }
        &.on {
            color:#ED602B;
            .home {
                background-image:url("https://newxcx.soofound.cn/vue/upload/static/bottom/home-active.png");
            }
            .order {
                background-image:url("https://newxcx.soofound.cn/vue/upload/static/bottom/order-active.png");
            }
            .my {
                background-image:url("https://newxcx.soofound.cn/vue/upload/static/bottom/my-active.png");
            }
        }
    }
}
</style>