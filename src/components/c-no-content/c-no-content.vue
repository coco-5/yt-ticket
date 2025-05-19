<template>
    <view 
        class="c-no-content"
        :class="type"
    >
        <view class="icon"></view>
        <view class="title">
            {{ title }}
        </view>
    </view>
</template>

<script>
export default {
    props: {
        type:{
            type:String,
            default:'file'
        },
        title:{
            type:String,
            default:'暂无数据'
        }
    },
    data(){
        return{
        }
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
.c-no-content{
    .icon {
        margin:0 auto;
        width:350rpx;
        height:300rpx;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .title {
        color:rgba(0,0,0,.5);
        font-size:28rpx;
        text-align:center;
    }
    &.file {
        .icon {
            background-image:url('http://8.138.130.153:6003/vue/upload/static/empty/empty3.png');
        }
    }
    &.note {
        .icon {
            background-image:url('http://8.138.130.153:6003/vue/upload/static/empty/empty1.png');
        }
    }
    &.box {
        .icon {
            background-image:url('http://8.138.130.153:6003/vue/upload/static/empty/empty2.png');
        }
    }
}

</style>