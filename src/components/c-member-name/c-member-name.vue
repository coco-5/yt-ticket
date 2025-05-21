<template>
    <view>
        <c-pop
            height="50vh"
            :isShow="isShoPop"
            @cbClosePop="cbClosePop"
        >
            <template #content>
                <view 
                    class="c"
                    :style="bottomStyle"
                >
                    <view class="hd">编辑用户名</view>
                    <form @submit="submit">
                        <view class="bd">
                            <view class="name-wrap">
                                <view 
                                    class="clear" 
                                    @click="name = ''" 
                                    v-if="name"
                                ></view>
                                <input 
                                    id="name" 
                                    name="nickname" 
                                    type="nickname" 
                                    v-model="name" 
                                    placeholder="请输入昵称" 
                                    maxlength="16" 
                                />
                            </view>
                            <view class="tips">4-16个字符，支持中英文和数字</view>
                        </view>
                        <view class="ft">
                            <button 
                                class="btn" 
                                form-type="submit"
                            >
                                确定
                            </button>
                        </view>
                    </form>
                </view>
            </template>
        </c-pop>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    props:{
        isShoPop:{
            type:Boolean,
            default:false
        }
    },
    watch:{
        isShoPop:{
            deep:true,
            handler(n){}
        }
    },
    data(){
        return{
            bottomStyle:'',
            isCompare:true,
            name:'',
        }
    },
    mounted(){
        this.fixBottom()

        this.query = uni.createSelectorQuery()
    },
    methods:{
        fixBottom(){
            let height = utils.fixIPhoneX() ? 68 : 0

            this.bottomStyle = `padding-bottom:${height}rpx; height:calc(50vh - ${height}rpx);`
        },
        cbClosePop(){
            this.$emit('cbClosePop')
        },
        submit(e){
            console.log(9999,'name')
            if(this.timer){
                this.timer = null
                clearTimeout(this.timer)
            }

            if(!this.name){
                uni.showToast({title:'请输入昵称',icon:'none'})
                return
            }

            uni.showLoading()

            // 延迟等待是否昵称验证通过
            this.timer = setTimeout(()=>{
                this.query.select('#name').fields({
                    properties:['value']
                },(res)=>{
                    console.log(9999,res.name)
                    uni.hideLoading()
                    //this.name = res.value
                    let name = this.name.replace(/\s/g,'')  //去除空格
                    let len = utils.getByteLen(name)
                    let reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
                    if(!name) return uni.showToast({title:'请输入昵称',icon:'none'})


                    if(!reg.test(name)){
                        uni.showToast({title:'昵称不支持特殊字符',icon:'none'}) 
                        return     
                    } 

                    if(len > 16){
                        uni.showToast({title:'最大字符数超过16，一个汉字有两个字符哦～',icon:'none'}) 
                        return
                    }

                    if(len < 4){
                        uni.showToast({title:'最少字符数超过4，一个汉字有两个字符哦～',icon:'none'}) 
                        return
                    }

                    console.log(9999,name)
                    return
                    this.updateUserInfo({
                        nickName: name
                    })
                }).exec()
            },1000)
        },
    }

}
</script>

<style lang="scss" scoped>
.c {
    box-sizing:border-box;
    position:relative;
}
.hd {
    position:relative;
    height:148rpx;
    line-height:148rpx;
    color:#000;
    font-size:40rpx;
    font-weight:500;
    text-align:center;
}

.bd {
    margin:0 60rpx;
    .name-wrap{ 
        border-bottom: #eee 1rpx solid; 
        color: #1D1E18; 
        overflow: hidden; 
        padding-top: 32rpx; 
        padding-bottom:16rpx;
        position: relative; 
        .clear { 
            position: absolute; 
            width: 30rpx; 
            height: 30rpx; 
            background: url(https://oss-hqwx-edu24ol.hqwx.com/miniapp/hq_live/tiku-active-close.png) no-repeat; 
            background-size: 100%; 
            right: 0; 
            top: 55rpx; 
        }
    }
	#name{ 
        width: 600rpx; 
        height: 80rpx; 
        font-size: 28rpx; 
        line-height: 80rpx;
    }
    .tips{ 
        color: #9C9C9C; 
        font-size: 24rpx; 
        margin-top: 24rpx; 
    }
}
.ft {
    position:absolute;
    bottom:0;
    left:50%;
    transform:translateX(-50%);
    width:664rpx;
    .btn {

        width:100%;
        height:100rpx;
        line-height:100rpx;
        background:linear-gradient(87deg, #FFA63F, #EB5628);
        border-radius:50rpx;
        color:#FFF;
        font-size:34rpx;
        text-align:center;
    }
}
</style>