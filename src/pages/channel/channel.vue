<template>
    <view class="page">
        <view class="sidebar">
111
        </view>
        <view class="content">
            111
        </view>
    </view>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    onLoad(e){
        this.options = e
    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.page {
    position:relative;
    height:100vh;
    .sidebar {
        position:absolute;
        left:0;
        top:0;
        bottom:0;
        width:200px;
        background:#f00;
    }
    .content {
        position:absolute;
        left:200px;
        top:0;
        right:0;
        bottom:0;
        background:#fff;
        overflow-y:auto;
    }
}
</style>