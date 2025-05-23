<template>
    <view
        class="c-date"
    >
        
        <view class="top">
            <view class="title">
                日期选择
            </view>        
            <view 
                class="close" 
                @click="closePop"
            >
            </view> 
        </view>

        <view class="on-month">{{months[monthIndex].timeStr}}</view>

        <view class="hd">
            <view 
                class="item"
                v-for="(item,index) in weekList"
                :key="index"
            >
                {{item}}
            </view>
        </view>

        <scroll-view
            class="bd"
            scroll-y
            :style="bdStyle"
            :scrollTop="scrollTop"
            @scroll="scroll"
        >
            <view 
                class="month"
                v-for="(month,index) in months"
                :key="index"
            >
                <view 
                    class="month-hd"
                    :class="'month-hd-'+index"
                    v-if="index == 1"
                >
                    {{month.timeStr}} 
                </view>
                <view class="month-bd">
                    <view 
                        class="item"
                        :class="{
                            'disabled':date.disabled, 
                            'today':date.showDate && date.today, 
                            'current':date.showDate && date.dateStr == on
                        }"
                        @click="choose(date)"
                        v-for="(date,i) in month.dates"
                        :key="i"
                    >
                        <block v-if="date.showDate">
                            {{date.date.getDate()}}
                        </block>
                    </view>
                </view>
            </view>
        </scroll-view>

        <view 
            class="ft"
            :style="bottomStyle"
            @click="confirm"
        >
            确定
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    props:{
        onDate:{
            type:[String,Number],
            default:0
        },
        height:{
            type:String,
            default:'100%'
        }
    },
    watch:{
        onDate:{
            deep:true,
            handler(n){
                this.on = n
            }
        }  
    },
    data(){
        return {
            currentDate:new Date(),
            weekList:['日','一','二','三','四','五','六'],
            months:[],
            bottomStyle:'',
            bdStyle:'',
            current:'',
            on:'',//当前选中日期,
            scrollTop:2,
            monthIndex:0,
        }
    },
    mounted(){
        this.initBottom()

        this.on = this.onDate

        this.ininDate()
    },
    methods:{
        initBottom(){
            let bottom = utils.fixIPhoneX() ? 48 : 0

            this.bottomStyle = `margin-bottom:${bottom}rpx;`

            this.bdStyle = `height:calc(100% - 60rpx - 58rpx - 142rpx - 100rpx - ${bottom}rpx - 12rpx);`
        },
        ininDate(){
            const year = this.currentDate.getFullYear()
            const month = this.currentDate.getMonth()
            const nextYear = year
            const nextMonth = month + 1

            this.nowYear = year
            this.nowMonth = month
            this.nowDate = this.currentDate.getDate()

            if(month == 11){
                nextMonth = 1
                nextYear = year + 1
            }

            this.months = []

            this.months.push(this.initMonth(year, month))

            this.months.push(this.initMonth(nextYear, nextMonth))

            this.checkScrollTop()
        },
        initMonth(year, month){
            const firstDay = new Date(year, month, 1)
            const lastDay = new Date(year, month + 1, 0)
            const daysInMonth = lastDay.getDate()
            const startDayOfWeek = firstDay.getDay()
            const dates = []
            const today = new Date(this.nowYear, this.nowMonth, this.nowDate)
            const last = new Date(this.nowYear, this.nowMonth, this.nowDate+30)
            let current = false
            //const last = new Date(year, month, daysInMonth)

            for(let i = 0; i < startDayOfWeek; i++){
                let date = new Date(year, month, 1 - startDayOfWeek + i)
                dates.push({
                    time:date.getTime(),
                    date,
                    disabled:date < today || date > last,
                    showDate:false
                })
            }

            for(let i = 1; i <= daysInMonth; i++){
                let date = new Date(year, month, i)
                let dateStr = `${year}-${utils.formatNumber(month+1)}-${utils.formatNumber(i)}`

                current = false

                if(dateStr == this.on){
                    current = true
                }

                dates.push({
                    current,
                    dateStr,
                    time:date.getTime(),
                    date,
                    disabled:date < today || date > last,
                    showDate:true,
                    today:date.getTime() == today.getTime()
                })
            }

            //补齐最后几天
            if(dates.length % 7 !== 0){
                let j = 1
                while(dates.length % 7 !== 0){
                    let date = new Date(year, month + 1, j)
                    dates.push({
                        time:date.getTime(),
                        date,
                        disabled:date < today || date > last,
                        showDate:false,
                    })
                    j++
                }
            }

            return {
                timeStr:`${year}年${month + 1}月`,
                dates,
            }

            return [dates]
        },
        checkScrollTop(){
            let months = this.months
            let grid = 0
            let gridIndex = 0

            months.forEach((month,index)=>{
                if(month.dates && month.dates.length > 0){
                    month.dates.forEach((item,i)=>{
                        if(item.current == true){
                            gridIndex = index
                            grid = Math.floor(i / 7)
                        }
                    })
                }    
            })

            setTimeout(()=>{
                this.scrollTop = (grid * 55 + gridIndex * 50) || 0
            },10)
        },
        choose(item){
            this.on = item.dateStr
        },
        confirm(){
            this.$emit('cbConfirm',this.on)
        },
        closePop(){
            this.$emit('cbClose')
        },
        scroll(e){
            let scrollTop = e.detail.scrollTop

            if(scrollTop > 275){
                this.monthIndex = 1
            }else{
                this.monthIndex = 0
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.c-date {
    position:relative;
    height:100%;
    .top {
        position:relative;
        padding:60rpx 0 40rpx;
        height:42rpx;
        line-height:42rpx;
        color:#000;
        font-size:40rp;
        font-weight:500;
        text-align:center;
        .close {
            position:absolute;
            top:30rpx;
            right:24rpx;
            width:42rpx;
            height:43rpx;
            background:url('https://newxcx.soofound.cn/vue/upload/static/common/icon-colse.png') no-repeat;
            background-size:contain;
        }
    }
    .on-month {
        margin-bottom:8px;
        height:50rpx;
        line-height:50rpx;
        font-size:30rpx;
        font-weight:500;
        text-align:center;    
    }
    .hd {
        display:flex;
        height:60rpx;
        line-height:60rpx;
        border-bottom:1px solid #eee;
        .item {
            flex:1;
            text-align:center;
        }
    }
    .bd {
        height:calc(100% - 60rpx - 58rpx - 142rpx);
        //overflow-y:auto;
        .month-hd {
            height:100rpx;
            line-height:100rpx;
            font-size:30rpx;
            font-weight:500;
            text-align:center;    
        }
        .month-bd {
            .item {
                display:inline-block;
                width:calc(100% / 7);  
                height:110rpx;
                line-height:110rpx;
                text-align:center;
                vertical-align:top; 
                &.disabled {
                    color:#999;
                }
                &.current {
                    color:#FFF;
                    background:linear-gradient(87deg, rgb(255, 166, 63), rgb(235, 86, 40));
                    border-radius:8rpx;
                }
            }
        }
    }
    .ft {
        position:fixed;
        bottom:0;
        left:50%;
        transform:translate(-50%,0);
        width:664rpx;
        line-height:100rpx;
        background:linear-gradient(87deg, #FFA63F, #EB5628);
        border-radius:50rpx;
        color:#FFF;
        font-size:34rpx;
        font-weight:500;
        text-align:center;
    }
}
</style>