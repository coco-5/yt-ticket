<template>
    <view class="a">
        {{time}}
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    props:{
        date:{
            type:String,
            default:''
        }
    },
    data(){
        return{
            time:'',
            timer:null,
            isShow:false,     
        }
    },
    mounted(){
        this.countDown()
    },
    methods:{
        countDown(){
            if(!this.date) return
            
            let date = new Date(this.date).getTime() + 1000 * 60 * 5
            let hours = 0
            let minutes = 0
            let seconds = 0
            
            this.timer = setInterval(()=>{
                let now = new Date().getTime() + ''
                let difference = date - now

                if(difference <= 0){
                    this.time = ''
                    clearInterval(this.timer)
                    this.$emit('cbFinish')
                    return
                }
                hours = Math.floor(difference / (1000 * 60 * 60))
                minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
                seconds = Math.floor((difference % (1000 * 60)) / 1000)

                hours = utils.formatNumber(hours)
                minutes = utils.formatNumber(minutes)
                seconds = utils.formatNumber(seconds)

                this.time = `剩余${minutes}分${seconds}秒`
            }, 1000)
        }
    }
}
</script>

<style lang="scss" scoped>
.a {
    font-weight:500;
}
</style>