<template>
    <view class="c-date">
        <scroll-view 
            class="wrap"
            scroll-x
            :scroll-into-view="fixed ? 'item' + current : ''"
        >
            <view 
                class="item"
                :class="item.setoffDate == onDate ? 'on' : ''"
                :id="'item'+index"
                @click="choose(item)"
                v-for="(item,index) in daysList"
                :key="index"
            >
                <view class="date">{{item.month}}-{{item.date}}</view>    
                <view class="week">
                    <template v-if="item.isToday">今天</template>
                    <template v-else>
                        周{{item.weekDayText}}
                    </template>
                </view>
            </view>
        </scroll-view>

        <view 
            class="ico"
            @click="isShowDatePop = true"
        >
            <view class="calc"></view>
            <view class="text">日历</view>
        </view>

        <c-pop-date
            height="70vh"
            :isShow="isShowDatePop"
            :onDate="onDate"
            @cbClosePop="cbCloseDatePop"
            @cbConfirm="cbConfirmDate"
            @cbChoose="cbChooseDate"
            v-if="onDate"
        >
        </c-pop-date>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default{
    props:{
        options:{
            type:Object,
            default:{}
        }
    },
    data(){
        return{
            today:new Date(),
            daysList:[],
            current:0,
            onDate:0,
            isShowDatePop:false,
            fixed:true
        }
    },
    mounted(){
        this.initDate()

        if(this.options.sailDate){
            this.initOndate(this.options.sailDate)
        }
    },
    methods:{
        initOndate(date){
            this.onDate = date
            this.checkIndex()
        },
        initDate(){
            let today = this.today
            let nextMonth = new Date(today)
            let daysList = []
            let weekDayText = ['日', '一', '二', '三', '四', '五', '六']

            nextMonth.setMonth(today.getMonth() + 1)

            let timeDifference = nextMonth.getTime() - today.getTime()
            let daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
            let current = 0
            let sailDate = new Date(this.options.sailDate)

            for(let i=0; i<=daysDifference; i++){
                let day = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)

                let isToday = 
                    day.getFullYear() === today.getFullYear() &&
                    day.getMonth() === today.getMonth() &&
                    day.getDate() === today.getDate()
                
                
                //定位在哪一天
                if(this.options.sailDate){
                    let isSameDate =
                        sailDate.getFullYear() === day.getFullYear() &&
                        sailDate.getMonth() === day.getMonth() &&
                        sailDate.getDate() === day.getDate()
                    if(isSameDate){
                        current = i
                    }
                }

                daysList.push({
                    year:utils.formatNumber(day.getFullYear()),
                    month:utils.formatNumber(day.getMonth()+1),
                    date:utils.formatNumber(day.getDate()),
                    weekDayText:weekDayText[day.getDay()],
                    time:new Date(day.getFullYear(),day.getMonth(),day.getDate()).getTime(),
                    isToday:isToday,
                    setoffDate:`${utils.formatNumber(day.getFullYear())}-${utils.formatNumber(day.getMonth()+1)}-${utils.formatNumber(day.getDate())}`
                })
            }

            this.daysList = daysList

            this.current = current

            this.onDate = this.daysList[this.current].setoffDate
        },
        checkIndex(){
            let daysList = this.daysList

            for(let i=0; i<daysList.length; i++){
                if(daysList[i].setoffDate == this.onDate){
                    this.current = i
                    break
                }
            }
        },
        choose(item){
            this.fixed = false
            this.initOndate(item.setoffDate)

            this.$emit('chooseDate', item.setoffDate)
        },
        cbCloseDatePop(){
            this.isShowDatePop = false
        },
        cbChooseDate(date){
            return
            this.fixed = true
            this.initOndate(date)
            this.cbCloseDatePop()   
        },
        cbConfirmDate(date){
            this.fixed = true
            this.initOndate(date)
            this.cbCloseDatePop()   
        }
    }
}
</script>

<style lang="scss" scoped>
.c-date {
    position:relative;
    padding-right:168rpx;
    height:80rpx;
    .wrap {
        width:100%;
        height:80rpx;
        white-space:nowrap;
        overflow-x:auto;
        .item {
            display:inline-block;
            margin-left:36rpx;
            width:85rpx;
            height:80rpx;
            color:#8A8A8A;
            font-size:18rpx;
            text-align:center;
            vertical-align:top;
            overflow:hidden;
            .date,
            .week {
                height:22rpx;
                line-height:22rpx;
            }
            .date {
                margin:20rpx 0 0;
            }
            &.on {
                background:linear-gradient(123deg, #FFA63F, #EB5628);
                border-radius:20rpx;
                color:#FFF;
            }
        }
    }
    .ico {
        position:absolute;
        top:0;
        right:0;
        padding-left:26rpx;
        width:94rpx;
        height:80rpx;
        &::before {
            content:' ';
            position:absolute;
            top:50%;
            left:-26rpx;
            transform:translateY(-50%);
            width:26rpx;
            height:74rpx;
            background:url('https://newxcx.soofound.cn/vue/upload/static/ticket/icon-time-left.png') no-repeat;
            background-size:contain;
        }
        .calc {
            margin:5rpx auto;
            width:30rpx;
            height:30rpx;
            background:url('https://newxcx.soofound.cn/vue/upload/static/ticket/icon-time.png') no-repeat;
            background-size:contain;
        }
        .text {
            height:24rpx;
            line-height:24rpx;
            color:#000;
            font-size:18rpx;
            text-align:center;
        }
    }
}
</style>