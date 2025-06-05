<template>
    <view class="c">
        <button
            plain="true"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
            v-if="needLogin"
        >
            <slot name="content"></slot>
        </button>
        <view 
            class="btn"
            @click="go"
            v-else
        >
            <slot name="content"></slot>
        </view>
    </view>
</template>

<script>
import { memberUpdateApi } from '@/api/passenger'
import { mobileApi } from '@/api/member'
export default {
    props:{
    },
    data(){
        return {
            isLoading:false,
            needLogin:true,
            ticketMember:uni.getStorageSync('ticketMember') || {}
        }
    },
    mounted(){
        this.checkLogin()
    },
    methods:{
        checkLogin(){
            let ticketMember = this.ticketMember
            let needLogin = true

            if(ticketMember && ticketMember.mobile){
                needLogin = false   
            }

            this.needLogin = needLogin
        },
        getPhoneNumber(e){
            if(this.isLoading) return

            this.isLoading = true

            uni.showLoading({
                title:'请先登录~'
            })
            
            if(!e.detail.iv){
                uni.hideLoading()

                uni.showToast({
                    title:'您已经取消登录~',
                    icon:'none'
                })

                return
            }

            let params = {
                //modEncryptedData: encodeURIComponent(e.detail.encryptedData),
                //电话号码的加密串
                //modIv: encodeURIComponent(e.detail.iv),
                code:e.detail.code,
            }

            mobileApi(params).then((res)=>{
                this.isLoading = false
                uni.hideLoading()
                if(res.data.code == 200){
                    uni.showToast({
                        title:'登录成功',
                        icon:'none'
                    })
                    setTimeout(()=>{
                        this.go()
                    },2000)
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        },
        go(){
            this.$emit('go')
        },
        update(params){
            params.id = this.ticketMember.id

            return new Promise((resolve,reject)=>{
                memberUpdateApi(params).then((res)=>{
                    if(res.data.code == 200){
                        resolve()
                    }else{
                        uni.showToast({
                            title:res.data.msg,
                            icon:'none'
                        })
                        reject()
                    }
                })
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.c {
    
}

button {
    margin:0;
    padding:0;
    border:0 none;
}
</style>