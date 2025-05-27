<template>
    <view class="page">
        <view class="title">
            航班信息
        </view>
        <view class="date">
            2025-05-15 09:25:10
        </view>
        <view class="content">
            <view class="p">航班信息仅供参考，如遇天气状况影响可能减少航班，节日及周末会增开不定期航班，请以系统可售票时间为准。</view>
            <view class="h6">澳门氹仔往来深圳蛇口航班时刻表如下：</view>
            <view class="table">
                <view class="tr">
                    <view class="th">澳门氹仔至深圳蛇口</view>
                    <view class="th">深圳蛇口至澳门氹仔</view>
                </view>
                <view class="tr">
                    <view class="td">08:30</view>
                    <view class="td">08:00</view>
                </view>
                <view class="tr">
                    <view class="td">09:30</view>
                    <view class="td">
                        08:30<text class="t1">*</text>
                    </view>
                </view>
                <view class="tr">
                    <view class="td">10:00<text class="t1">*</text></view>
                    <view class="td">09:30</view>
                </view>
                <view class="tr">
                    <view class="td">11:00</view>
                    <view class="td">10:00</view>
                </view>
                <view class="tr">
                    <view class="td">11:30</view>
                    <view class="td">10:30</view>
                </view>
                <view class="tr">
                    <view class="td">12:00</view>
                    <view class="td">11:30<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">13:00<text class="t1">*</text></view>
                    <view class="td">12:00</view>
                </view>
                <view class="tr">
                    <view class="td">13:30</view>
                    <view class="td">12:30<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">14:00<text class="t1">*</text><text class="t2">#</text></view>
                    <view class="td">13:30</view>
                </view>
                <view class="tr">
                    <view class="td">15:00</view>
                    <view class="td">14:00</view>
                </view>
                <view class="tr">
                    <view class="td">15:30</view>
                    <view class="td">15:00</view>
                </view>
                <view class="tr">
                    <view class="td">16:30</view>
                    <view class="td">15:30<text class="t1">*</text><text class="t2">#</text></view>
                </view>
                <view class="tr">
                    <view class="td">17:00<text class="t1">*</text><text class="t2">#</text></view>
                    <view class="td">16:00</view>
                </view>
                <view class="tr">
                    <view class="td">17:30</view>
                    <view class="td">17:00</view>
                </view>
                <view class="tr">
                    <view class="td">18:30</view>
                    <view class="td">17:30<text class="t2">#</text></view>
                </view>
                <view class="tr">
                    <view class="td">19:00<text class="t2">#</text></view>
                    <view class="td">18:00</view>
                </view>
                <view class="tr">
                    <view class="td">19:30</view>
                    <view class="td">19:00</view>
                </view>
                <view class="tr">
                    <view class="td">20:30</view>
                    <view class="td">19:30</view>
                </view>
                <view class="tr">
                    <view class="td">21:00</view>
                    <view class="td">21:00</view>
                </view>
            </view>
            <view class="p p1">备注：带*号航班仅周六开</view>
            <view class="p p1">带#号航班仅周日开</view>
            <view class="p">2025年4月23日起按上述航班执行。</view>

            <view class="h6">澳门内港往来珠海湾仔航班时刻表如下：</view>
            <view class="table">
                <view class="tr">
                    <view class="th">澳门内港至珠海湾仔</view>
                    <vewi class="th">珠海湾仔至澳门内港</vewi>
                </view>
                <view class="tr">
                    <view class="td">07:10</view>
                    <view class="td">07:40</view>
                    <view class="td">07:20</view>
                    <view class="td">07:35</view>
                </view>
                <view class="tr">
                    <view class="td">08:20</view>
                    <view class="td">08:40</view>
                    <view class="td">07:50</view>
                    <view class="td">08:10</view>
                </view>
                <view class="tr">
                    <view class="td">09:10</view>
                    <view class="td">09:40</view>
                    <view class="td">08:30</view>
                    <view class="td">08:50</view>
                </view>
                <view class="tr">
                    <view class="td">10:10</view>
                    <view class="td">10:40</view>
                    <view class="td">09:20</view>
                    <view class="td">09:50</view>
                </view>
                <view class="tr">
                    <view class="td">11:10</view>
                    <view class="td">11:40</view>
                    <view class="td">10:20</view>
                    <view class="td">10:50</view>
                </view>
                <view class="tr">
                    <view class="td">12:40</view>
                    <view class="td">13:10</view>
                    <view class="td">11:20</view>
                    <view class="td">11:50</view>
                </view>
                <view class="tr">
                    <view class="td">13:40</view>
                    <view class="td">14:10</view>
                    <view class="td">12:50</view>
                    <view class="td">13:20</view>
                </view>
                <view class="tr">
                    <view class="td">14:40</view>
                    <view class="td">15:10</view>
                    <view class="td">13:50</view>
                    <view class="td">14:20</view>
                </view>
                <view class="tr">
                    <view class="td">15:40</view>
                    <view class="td">16:10</view>
                    <view class="td">14:50</view>
                    <view class="td">15:20</view>
                </view>
                <view class="tr">
                    <view class="td">16:40</view>
                    <view class="td">17:00</view>
                    <view class="td">15:50</view>
                    <view class="td">16:20</view>
                </view>
                <view class="tr">
                    <view class="td">17:50</view>
                    <view class="td">18:10</view>
                    <view class="td">16:50</view>
                    <view class="td">17:10</view>
                </view>
                <view class="tr">
                    <view class="td">18:30</view>
                    <view class="td">18:50</view>
                    <view class="td">18:00</view>
                    <view class="td">18:20</view>
                </view>
                <view class="tr">
                    <view class="td">19:20</view>
                    <view class="td">19:50</view>
                    <view class="td">18:40</view>
                    <view class="td">19:10</view>
                </view>
                <view class="tr">
                    <view class="td">20:20</view>
                    <view class="td">20:40</view>
                    <view class="td">19:40</view>
                    <view class="td">20:10</view>
                </view>
                <view class="tr">
                    <view class="td">21:10</view>
                    <view class="td">21:45</view>
                    <view class="td">20:30</view>
                    <view class="td">20:50</view>
                </view>
                <view class="tr">
                    <view class="td"></view>
                    <view class="td"></view>
                    <view class="td">21:20</view>
                    <view class="td">22:00</view>
                </view>
            </view>
            <view class="p">2024年1月6日开始执行上述航班。</view>

            <view class="h6">澳门氹仔往来深圳机场码头航班时刻表如下：</view>
            <view class="table">
                <view class="tr">
                    <view class="th">澳门氹仔至深圳机场码头</view>
                    <view class="th">深圳机场码头至澳门氹仔</view>
                </view>
                <view class="tr">
                    <view class="td">11:45</view>
                    <view class="td">10:00</view>
                </view>
                <view class="tr">
                    <view class="td">16:00</view>
                    <view class="td">14:15</view>
                </view>
            </view>
            <view class="p">2024年4月1日开始执行上述航班。</view>
            <view class="h6">澳门氹仔往来中山港航班时刻表如下：</view>
            <view class="table">
                <view class="tr">
                    <view class="th">澳门氹仔至中山港</view>
                    <view class="th">中山港至澳门氹仔</view>
                </view>
                <view class="tr">
                    <view class="td">10:30</view>
                    <view class="td">09:15</view>
                </view>
                <view class="tr">
                    <view class="td">18:30</view>
                    <view class="td">17:00</view>
                </view>
            </view>
            <view class="p">2025年5月15日起至6月30日逢周四至周六开航。</view>

            <view class="h5">澳门氹仔往来珠海桂山岛航班时刻表如下：</view>
            <view class="p p2">（暂时停航）</view>
            <view class="table">
                <view class="tr">
                    <view class="th">澳门氹仔至珠海桂山岛</view>
                    <view class="th">珠海桂山岛至澳门氹仔</view>
                </view>
                <view class="tr">
                    <view class="td">11:00<text class="t1">*</text></view>
                    <view class="td">10:05<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">16:00<text class="t2">#</text></view>
                    <view class="td">15:00<text class="t2">#</text></view>
                </view>
            </view>
            <view class="p p1">备注：带*号航班仅周六开。</view>
            <view class="p p1">带#号航班仅周日开</view>
            <view class="p p1">2023年10月21日开始执行上述航班。</view>
            <view class="p">2025年3月21日起暂时停航。</view>

            <view class="h5">澳门氹仔往来东莞虎门航班时刻表如下：</view>
            <view class="p p2">（暂时停航）</view>
            <view class="table">
                <view class="tr">
                    <view class="th">澳门氹仔至东莞虎门</view>
                    <view class="th">东莞虎门至澳门氹仔</view>
                </view>
                <view class="tr">
                    <view class="td">15:00<text class="t1">*</text></view>
                    <view class="td">10:00<text class="t1">*</text></view>
                </view>
            </view>
            <view class="p">*暂时停航</view>

            <view class="h6">澳门氹仔往来珠海九洲港航班时刻表如下：</view>
            <view class="p">（暂时停航）</view>
            <view class="table">
                <view class="tr">
                    <view class="th">澳门氹仔至珠海九洲港</view>
                    <view class="th">珠海九洲港至澳门氹仔</view>
                </view>
                <view class="tr">
                    <view class="td">09:10<text class="t1">*</text></view>
                    <view class="td">08:30<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">10:10<text class="t1">*</text></view>
                    <view class="td">09:30<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">11:10<text class="t1">*</text></view>
                    <view class="td">10:30<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">12:10<text class="t1">*</text></view>
                    <view class="td">11:30<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">14:10<text class="t1">*</text></view>
                    <view class="td">13:30<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">15:10<text class="t1">*</text></view>
                    <view class="td">14:30<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">16:10<text class="t1">*</text></view>
                    <view class="td">15:30<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">17:10<text class="t1">*</text></view>
                    <view class="td">16:30<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">18:10<text class="t1">*</text></view>
                    <view class="td">17:30<text class="t1">*</text></view>
                </view>
                <view class="tr">
                    <view class="td">20:10<text class="t1">*</text></view>
                    <view class="td">18:30<text class="t1">*</text></view>
                </view>
            </view>
            <view class="p">*暂时停航</view>
        </view>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
export default{
    data(){
        return{
            content:''
        }
    },
    onLoad(e){
        this.options = e
    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.page {
    padding:0 40rpx;
    .title {
        padding:40 0rpx;
        font-size:48rpx;
        color:#000;
        font-weight:500;
    }
    .date {
        margin-bottom:40rpx;
        color:#999;
        font-size:24rpx;
    }
}

.content {
    color:#333;
    line-height:1.5;
    font-size:36rpx;
    .p {
        margin-bottom:40rpx;    
    }
    .p1 {
        margin-bottom:0;
    }
    .p2 {
        margin-bottom:0;
        text-align:center;
    }
    .h6 {
        margin-bottom:40rpx;  
        font-weight:500;
        text-align:center;
    }
    .h5 {
        font-weight:500;
        text-align:center;
    }
}

.table {
    width:100%;
    border:1px solid #AAA;
    .tr {
        display:flex;
        border-bottom:1px solid #AAA;
        &:last-child {
            border-bottom:none;
        }
    }
    .th,
    .td {
        flex:1;
        border-right:1px solid #AAA;
        &:last-child {
            border-right:none;
        }
    }
    .th {
        padding:24rpx 8rpx;
        text-align:center;
    }
    .td {
        padding:24rpx;
    }
}
</style>