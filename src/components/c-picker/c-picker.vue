<template>
    <view class="a">
        <picker
            class="picker"
            :range="range"
            :value="index" 
            @change="change"
        >
            <text>
                <template>{{range[index]}}</template>
            </text> 
        </picker>
    </view>
</template>

<script>
export default {
    props:{
        range:{
            type:Array,
            default:[]
        },
        index:{
            type:[Number,String],
            default:0
        }
    },
    watch:{
        index:{
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
    methods:{
        change(e){
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