<template>
    <view 
        class="win"
        v-show="isShow"
    >
        <view 
            class="win-bg"
            @click="closePop"
        >
        </view>
        <view 
            class="win-main"
            :class="className"
            :style="'height:'+height"
        >
            <slot name="content"></slot>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        isShow:{
            type:Boolean,
            default:false
        },
        height:{
            type:String,
            default:'50%'
        }
    },
    watch:{
        isShow:{
            deep:true,
            handler(nv){
                if(nv){
                    this.className = 'bottom-enter'
                }else{
                    this.className = 'bottom-leave'
                }
            }
        },
        height:{
            deep:true,
            handler(nv){}
        }
    },
    data(){
        return{
            className:''     
        }
    },
    methods:{
        closePop(){
            this.$emit('cbClosePop')
        }
    }
}
</script>

<style lang="scss" scoped>
.win {
    position:fixed;
    top:0;
    left:0;
    z-index:11;
    width:100%;
    height:100vh;
    .win-bg {
        position:absolute;
        top:0;
        left:0;
        z-index:12;
        width:100%;
        height:100vh;
        background:rgba(#000,.5);
    }
    .win-main {
        box-sizing:border-box;
        position:absolute;
        z-index:13;
        bottom:0;
        left:0;
        width:100%;
        height:80%;
        background:#FFF;
        border-radius:30rpx 30rpx 0 0;
    }
}

.bottom-enter {
    animation:bottom 0.6s;
}

.bottom-leave {
    animation:bottom 0.6s reverse;
}

@keyframes bottom {
    from {
        bottom:-100vh;
    }
    to {
        bottom:0;
    }
}
</style>