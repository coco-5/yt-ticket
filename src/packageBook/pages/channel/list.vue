<template>
    <view class="page">
        <view class="dates">
            <date
                :options="options"
                @chooseDate="chooseDate"
            ></date>
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import date from '@/packageBook/components/date'
import { getPortLineApi } from '@/api/ticket'
export default {
    components:{
        date,
    },
    data(){
        return{
            options:{},
        }
    },
    onLoad(e){
        this.options = e

        this.gtPortLine()
    },
    methods:{
        gtPortLine(){
            return new Promise((resolve)=>{
                getPortLineApi({}).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data || []
                        console.log(999,'data',data)
                    }
                    resolve()   
                })
            })
        },
        chooseDate(date){
            //this.getDetail(date)
        },
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:#F8F8F8;
}

.dates {
    margin:0 0 32rpx;
    padding-top:32rpx;
}
</style>