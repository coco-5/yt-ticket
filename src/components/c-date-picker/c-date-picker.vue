<template>
    <view class="a">
        <picker
            class="picker"
            mode="date"
            :value="date"
            :start="start"
            :end="end"
            @change="change"
        >
            <text>
                <template>{{date}}</template>
            </text> 
        </picker>
    </view>
</template>

<script>
export default {
    props:{
        date:{
            type:String,
            default:'1980-01-01'
        },
        start:{
            type:String,
            default:'1924-01-01'
        },
        end:{
            type:String,
            default:'2018-01-01'
        }
    },
    watch:{
        date:{
            immediate:true,
            deep:true,
            handler(n){
            }   
        }
    },
    data(){
        return {    
        }
    },
    mounted(){
    },
    methods:{
        change(e){
            console.log(e.detail.value)
            this.$emit('change',e.detail.value)
        }
    }
}
</script>

<style lang="scss" scoped>
.none {
    color:#999!important;
}

text {
    //color:#747491;
    //font-weight:500;
}

.a {
    display:inline-block;
    width:60%;
    font-size:28rpx;
    vertical-align:middle;
    .picker {
        width:100%;
    }
}
</style>