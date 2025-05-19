<template>
    <view 
        class="win"
        v-if="isShow"
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
            <c-date
                :height="'70vh'"
                :onDate="onDate"
                @cbClose="closePop"
                @cbConfirm="cbConfirm"
                @cbChoose="cbChoose"
                v-if="onDate"
            ></c-date>
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
        },
        onDate:{
            type:[String,Number],
            default:0
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
        },
        onDate:{
            deep:true,
            handler(n){
                this.on = n
            }
        }
    },
    data(){
        return{
            className:''     
        }
    },
    mounted(){
    },
    methods:{
        closePop(){
            this.$emit('cbClosePop')
        },
        cbConfirm(data){
            this.$emit('cbConfirm',data)    
        },
        cbChoose(data){
            //this.$emit('cbChoose',data)
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