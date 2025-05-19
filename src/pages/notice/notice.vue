<template>
    <view class="pages">
        <web-view :src="options.url"></web-view>
    </view>
</template>

<script>
export default{
    data(){
        return{
            options:''
        }
    },
    onLoad(e){
        this.options = e

        if(this.options.title){
            uni.setNavigationBarTitle({
                title:this.options.title
            })
        }
    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.pages {
    min-height:100vh;
}
</style>