<template>
    <view 
        class="c-pop"
        :style="popStyle"
    >
        <view class="hd">
            选择乘客1 
            <view 
                class="close"
                @click="closePop"
            ></view>
        </view>
        <view 
            class="bd"
            :style="bdStyle"
        >
            <view 
                class="list"
                v-if="list.length"
            >
                <view 
                    class="item"
                    v-for="(item,index) in list"
                    :key="index"
                >
                    <c-passenger-item
                        :needAction="true"
                        :item="item"
                        :isShowEdit="true"
                        @handler="choose"
                        @edit="edit"
                    ></c-passenger-item>
                </view>
            </view>
        </view>
        <view 
            class="ft"
            :style="ftStyle"
        >
            <view 
                class="actions"
                @click="add"
            >
                <text class="ico"></text>
                <text class="txt">添加乘客</text>
            </view>
            <view 
                class="btn"
                @click="confirm"
            >
                确定
            </view>
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    props:{
        height:{
            type:String,
            default:'50%'
        },
        list:{
            type:Array,
            default:[]
        }
    },
    watch:{
        height:{
            deep:true,
            handler(nv){}
        },
        list:{
            immdeiate:true,
            deep:true,
            handler(nv){
            }
        }
    },
    data(){
        return{
            popStyle:'',
            bdStyle:'',
            ftStyle:'',
        }
    },
    mounted(){
        this.inifPopStyle()
    },
    methods:{
        inifPopStyle(){
            let height = this.height
            let bottom = utils.fixIPhoneX() ? 32 : 0 
            this.popStyle = utils.fixIPhoneX() ? `height:${height}vh;` : `height:${height}vh;`
            this.bdStyle = `height:calc(100% - 120rpx - 42rpx - 30rpx - 100rpx - ${bottom});`
            this.ftStyle = `bottom:${bottom + 30}rpx;`
        },
        closePop(){
            this.$emit('cbClosePop')
        },
        confirm(){
            this.$emit('cbConfirm')
        },
        choose(item){
            this.$emit('cbChoose',item)
        },
        add(){
            let query = {
                type:'add'
            }

            let url = `/packageUser/pages/passenger/add?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url
            })
        },
        edit(item){
            let query = {
                type:'edit',
                id:item.id
            }

            let url = `/packageUser/pages/passenger/add?${utils.paramsStringify(query)}`

            uni.navigateTo({
                url
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.c-pop {
    position:relative;
    .hd {
        position:relative;
        padding:60rpx 0;
        height:42rpx;
        line-height:42rpx;
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
        height:calc(100% - 120rpx - 42rpx - 30rpx - 100rpx);
        overflow-y:auto;
        .item {
            position:relative;
            margin:0 45rpx;
            padding:12rpx 0 24rpx;
            overflow:hidden;
            &:last-child {
                border-bottom:none;
            }
        }
    }
    .ft {
        position:absolute;
        bottom:30rpx;
        left:50%;
        transform:translateX(-50%);
        width:664rpx;
        text-align:center;
        .actions {
            height:80rpx;
            line-height:80rpx;
            color:#FF7937;
            font-size:30rpx;
            .ico {
                display:inline-block;
                margin-right:12rpx;
                width:26rpx;
                height:26rpx;
                background:url('http://8.138.130.153:6003/vue/upload/static/passenger/icon-add.png') no-repeat;
                background-size:contain;

            }
        }
        .btn {
            width:100%;
            height:100rpx;
            line-height:100rpx;
            background:linear-gradient(87deg, #FFA63F, #EB5628);
            border-radius:50rpx;
            color:#FFF;
            font-size:34rpx;
            font-weight:500;
        }
    }
}

::v-deep .c-pop .list .item {
    height:auto;
    border-bottom:0 none;
}
</style>