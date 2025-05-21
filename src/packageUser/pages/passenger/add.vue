<template>
    <view class="page">
        <view class="list">
            <view 
                class="item"
                :class="'item-' + item.type"
                v-for="(item,index) in list"
                :key="index"
            >
                <view 
                    class="star"
                    v-if="item.required"
                >*</view>
                <view class="label">{{item.title}}</view>
                <template v-if="item.type == 'passengerType'">
                    <c-picker
                        :range="passengerTypeRange"
                        :index="passengerTypeIndex"
                        @change="changePassengerType"
                    ></c-picker>
                </template>
                <template v-else-if="item.type == 'certificateType'">
                    <c-picker
                        :range="certificateTypeRange"
                        :index="certificateTypeIndex"
                        @change="changeCertificateType"
                    ></c-picker>
                </template>
                <template v-else-if="item.type == 'birthday'">
                    <c-date-picker
                        :date="item.value || '2018-01-01'"
                        :end="endDate"
                        @change="changeBirthday"
                    ></c-date-picker>
                </template>
                <template v-else-if="item.type == 'mobile'">
                    <view class="input">
                        <input 
                            type="number" 
                            placeholder-style="color:#999;"
                            :placeholder="item.placeholder"
                            :value="item.value"
                            :maxlength="item.maxLenght"
                            @input="input(item,$event)"
                        />
                    </view>
                </template>
                <template v-else-if="item.type == 'isDefault'">
                    <switch 
                        class="switch"
                        :checked="item.value" 
                        @change="defaultChange"
                    />
                </template>
                <template v-else>
                    <view class="input">
                        <input 
                            type="text" 
                            placeholder-style="color:#999;"
                            :placeholder="item.placeholder"
                            :value="item.value"
                            :maxlength="item.maxLenght"
                            @input="input(item,$event)"
                        />
                    </view>
                </template>
                <view 
                    class="ico"
                    v-if="item.arrow"
                ></view>
                <view 
                    class="item-tips"
                    v-if="item.type == 'certificateNumber'"
                >
                    {{certificateTypeTips[certificateTypeIndex]}}
                    <text 
                        class="span"
                        @click="showWinDialog = true"
                    >
                        点击查看图列
                    </text>
                </view>
            </view>
        </view>
        <view class="tips">
            <view class="hd">资料填写须知</view>
            <view class="bd">
                <view class="p">1.选择乘客类型为儿童票，必须填写儿童生日，如船票与实际乘船人不符，船务公司有权要求旅客更换船票补成人船票差价。</view>
                <view class="p">2.因应国家交通部要求内地始发所有交通工具必须填写乘客姓名、证件类型、证件号。</view>
                <view class="p">3.人脸信息采集后，用于过闸机时进行人脸检测，非必填项。</view>
                <view class="p">4.本司系统登记的证件信息，人脸信息等所有个人资料，仅供购票及检票使用。</view>
                <view class="p">5.关于收集个人资料声明。 </view>
                <view class="p">6.乘客本人须对填写上述资料之真实性负全部责任。</view> 
            </view>
        </view>

        <view 
            class="actions-wrap"
            :style="actionsStyle"
        >
            <view 
                class="actions"
                :style="actionsStyle"
            >
                <view 
                    class="btn"
                    @click="submit"
                >
                    保存
                </view>
                <view 
                    class="btn b1"
                    @click="confirmDelete"
                    v-if="options.type == 'edit'"
                >
                    删除
                </view>
            </view>
        </view>

        <view 
            class="win-dialog"
            v-show="showWinDialog"
        >
            <view class="win-bg"></view>
            <view class="win-main">
                <view class="hd">{{certificateTypeRange[certificateTypeIndex]}}</view>
                <view class="bd">
                    <image 
                        :src="certificateTypeImages[certificateTypeIndex]" 
                    ></image>
                    <view class="tips">证件号码如图所示填写</view>
                </view>
                <view 
                    class="ft"
                    @click="showWinDialog = false"
                >   
                    知道了
                </view>
            </view>
        </view>

        <c-birth></c-birth>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getPassengerDetailApi, getPassengerUpdateApi, getPassengerAddApi, getPassengerDeleteApi } from '@/api/passenger'
import map from '@/types/passenger'

export default {
    data(){
        return{
            options:{},
            list:[
                {
                    title:'乘客类型',
                    type:'passengerType',
                    placeholder:'请选择乘客类型',
                    required:true,
                    value:'',
                    link:'',
                    arrow:true
                },
                {
                    title:'姓名',
                    type:'passengerName',
                    placeholder:'请填写姓名',
                    required:true,
                    value:'',
                    link:'',
                    arrow:false,
                    maxLenght:11,
                },
                {
                    title:'手机号',
                    type:'mobile',
                    placeholder:'请填写手机号',
                    required:true,
                    value:'',
                    link:'',
                    arrow:false,
                    maxLenght:11,
                },
                {
                    title:'证件类型',
                    type:'certificateType',
                    placeholder:'请选择证件类型',
                    required:true,
                    value:'',
                    link:'',
                    arrow:true
                },
                {
                    title:'证件号码',
                    type:'certificateNumber',
                    placeholder:'请填写乘船人的证件号码',
                    required:true,
                    value:'',
                    link:'',
                    arrow:false,
                    maxLenght:20,
                },
                {
                    title:'出生日期',
                    type:'birthday',
                    placeholder:'请选择出生日期',
                    required:true,
                    value:'',
                    link:'',
                    arrow:true
                },
                /* {
                    title:'人脸信息',
                    type:'facePhoto',
                    placeholder:'点此采集',
                    required:false,
                    value:'',
                    link:'',
                    arrow:false
                }, */
                {
                    title:'设置默认乘客',
                    type:'isDefault',
                    placeholder:'',
                    required:false,
                    value:'',
                    link:'',
                    arrow:false
                }
            ],
            passengerTypeRange:[],
            passengerTypeIndex:0,
            certificateTypeRange:[],
            certificateTypeIndex:0,
            certificateTypeTips:map.certificateTypeTips,
            certificateTypeImages:map.certificateTypeImages,
            actionsStyle:'',
            showWinDialog:false,
            date:'1980-01-01',
            endDate:'',
        }
    },
    onLoad(e){
        this.options = e

        this.fixActionsStyle()

        this.initEnd()

        this.initPickerRange()

        this.getPassenger()
    },
    methods:{
        initPickerRange(){
            this.passengerTypeRange = map.passengerTypeRange
            this.passengerTypeList = map.passengerTypeList

            this.certificateTypeRange = map.certificateTypeRange
            this.certificateTypeList = map.certificateTypeList
        },
        getPassenger(){
            if(this.options.type == 'add'){
                this.initPassenger()
                return
            }

            return new Promise((resolve)=>{
                getPassengerDetailApi(this.options.id).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data
                        let list = this.list

                        for(let p in data){
                            list.forEach((item)=>{
                                if(p == item.type){
                                    item.value = data[p]
                                }
                            })
                            
                        }

                        this.passengerDetail = data
                    }
                })
            })
        },
        initPassenger(){
            let list = this.list

            list.forEach((item)=>{
                if(item.type == 'passengerType'){
                    item.value = this.passengerTypeList[this.passengerTypeIndex].value    
                }else if(item.type == 'certificateType'){
                    item.value = this.certificateTypeList[this.certificateTypeIndex].value 
                }else if(item.type == 'birthday'){
                    item.value = this.date
                }
            })
        },
        initEnd(){
            let now = new Date()
            const year = now.getFullYear()

            this.endDate = `${year}-12-31`
        },
        fixActionsStyle(){
            let height = 0
            this.actionsStyle = `padding-bottom:${utils.fixIPhoneX() ? 68 + height : height}rpx;`
        },
        defaultChange(e){
            let value = e.detail.value ? 1 : 0

            this.setValue('isDefault', value)
        },
        input(item,e){
            let value = e.detail.value   
            this.setValue(item.type, value)
        },
        submit(){
            let list = this.list
            let canLoad = true
            
            for(let i=0; i<list.length; i++){
                if(list[i].required && !list[i].value){
                    uni.showToast({
                        title:`${list[i].title}不能为空`,
                        icon:'none'
                    })
                    canLoad = false
                    break
                }
            }

            if(!canLoad) return

            if(!this.checkRegex()) return

            if(this.options.type == 'add'){
                this.add()
            }else{
                this.update()
            }
        },
        checkRegex(){
            //验证各种格式
            let regexMobile = /^1\d{10}$/
            let mobile = this.getValue('mobile')
            if(!regexMobile.test(mobile)){
                uni.showToast({
                    title:'手机号格式不正确',
                    icon:'none'
                })
                return false
            }

            //检查证件号码的格式
            let regexCer = this.certificateTypeList[this.certificateTypeIndex].regex
            let certificateNumber = this.getValue('certificateNumber')
            if(!regexCer.test(certificateNumber)){
                uni.showToast({
                    title:'证件号码格式不对',
                    icon:'none'
                })
                return false
            }

            return true
        },
        returnParams(type){
            let list = this.list
            let passengerDetail = this.passengerDetail

            let params = {
                birthday:'',
                certificateNumber:'',
                certificateType:2,
                channel:1,
                mobile:'',
                passengerName:'',
                passengerType:1
            }

            if(type == 'edit'){
                Object.assign(params,{
                    delFlag:0,  
                    facePhoto:'',
                    facePhotoId:'',
                    mobile:1,  
                    isDefault:0,
                    id:this.options.id,
                    createTime:passengerDetail.createTime,
                    openid:passengerDetail.openid
                })
            }

            list.forEach((item)=>{
                for(let p in params){
                    if(item.type == p){
                        params[p] = item.value    
                    }

                }   
            })

            return params
        },
        add(){
            let params = this.returnParams('add')

            getPassengerAddApi(this.options.id, params).then((res)=>{
                if(res.data.code == 200){
                    uni.showToast({
                        title:'新建成功',
                        icon:'none'
                    })

                    setTimeout(()=>{
                        this.goList()
                    },2000)
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        },
        update(){
            let params = this.returnParams('edit')

            getPassengerUpdateApi(params).then((res)=>{
                if(res.data.code == 200){
                    uni.showToast({
                        title:'保存成功',
                        icon:'none'
                    })

                    setTimeout(()=>{
                        this.goList()
                    },2000)
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        },
        confirmDelete(){
            uni.showModal({
                title:'提示',
                content:'确定删除该乘客吗？',
                success:(res)=>{
                    if(res.confirm){
                        this.deletePassenger()
                    }
                }
            })
        },
        deletePassenger(){
            getPassengerDeleteApi(this.options.id).then((res)=>{
                if(res.data.code == 200){
                    uni.showToast({
                        title:'删除成功',
                        icon:'none'
                    })

                    setTimeout(()=>{
                        this.goList()
                    },2000)
                }else{
                    uni.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        },
        goList(){
            let url = (this.options.from && decodeURIComponent(this.options.from)) || `/packageUser/pages/passenger/list`

            uni.redirectTo({
                url
            })
        },
        changePassengerType(index){
            this.passengerTypeIndex = index

            this.setValue('passengerType',this.passengerTypeList[index].value)
        },
        changeCertificateType(index){
            this.certificateTypeIndex = index
            this.setValue('certificateType',this.certificateTypeList[index].value)
        },
        changeBirthday(data){
            this.setValue('birthday',data)
        },
        setValue(name,value){
            let list = this.list

            for(let i=0; i<list.length; i++){
                if(list[i].type == name){
                    list[i].value = value
                    break
                }
            }
        },
        getValue(name){
            let list = this.list
            let value = ''

            for(let i=0; i<list.length; i++){
                if(list[i].type == name){
                    value = list[i].value
                    break
                }
            }
            return value
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    padding-top:32rpx;
    min-height:calc(100vh - 32px);
    background:#F8F8F8;   
}

.list {
    margin:0 auto;
    width:710rpx;
    background:#FFF;
    border-radius:20rpx;
    .item {
        position:relative;
        margin:0 40rpx 0 50rpx;
        height:116rpx;
        line-height:116rpx;
        border-bottom:1px solid #F7F7F7;
        .star {
            position:absolute;
            top:5rpx;
            left:-20rpx;
            color:#FF0000;
            font-size:20rpx;
        }
        .label {
            display:inline-block;
            margin-right:50rpx;
            width:150rpx;
            vertical-align:middle;
        }
        .ico {
            position:absolute;
            top:50%;
            right:0;
            transform:translateY(-50%);
            width:21rpx;
            height:11rpx;background:url('http://8.138.130.153:6003/vue/upload/static/order/icon.png') no-repeat;
            background-size:contain;
        }
        .placeholder {
            display:inline-block;
            width:420rpx;
            color:#999;
            font-size:28rpx;
            vertical-align:middle;
        }
        .input {
            display:inline-block;
            width:420rpx;
            font-size:28rpx;
            vertical-align:middle;
        }
        &.item-certificateNumber {
            padding-bottom:30rpx;
            height:auto;
            .item-tips {
                line-height:40rpx;
                font-size:24rpx;
                color:#acabab;
                .span {
                    color:rgba(59, 109, 148, 1);
                }
            }
        }
        &.item-isDefault {
            position:relative;
            margin:0 40rpx 0 50rpx;
            padding-bottom:32rpx;
            .label {
                display:inline-block;
                margin-right:50rpx;
                width:200rpx;
                vertical-align:middle;
            }
            .switch {
                display:inline-block;
                height:30rpx;
                vertical-align:top;
            }

        }
    }
}

.tips {
    margin:40rpx 40rpx;
    .hd {
        margin-bottom:24rpx;
        height:50rpx;
        line-height:50rpx;
        color:#333;
        font-size:30rpx;
        font-weight:500;
    }
    .bd {
        color:#939292;
        font-size:24rpx;
        text-align:justify;
        .p {
            margin-bottom:8rpx;
        }
    }
}

.actions-wrap {
    height:296rpx;
    .btn {
        margin:32rpx auto 0;
        width:664rpx;
        height:100rpx;
        line-height:100rpx;
        background:linear-gradient(87deg, #FFA63F, #EB5628);
        border-radius:50rpx;
        color:#FFF;
        font-size:34rpx;
        font-weight:500;
        text-align:center;
        &.b1 {
            background:#EBEBEB;
            color:#000;
        }
    }
}

.actions {
    position:fixed;
    bottom:0;
    left:0;
    width:100%;
    height:296rpx;
    background:#FFF;
}

.win-dialog {
    position:fixed;
    top:0;
    left:0;
    z-index:10;
    width:100%;
    height:100vh;
    .win-bg {
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.7);
    }
    .win-main {
        position:fixed;
        z-index:11;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        width:680rpx;
        background:#FFF;
        border-radius:40rpx;
        text-align:center;
        overflow:hidden;
        .hd {
            height:168rpx;
            line-height:168rpx;
            color:#000;
            font-size:40rpx;
            font-weight:500;
        }
        .bd {
            padding:0 16rpx;
            image {
                width:100%;
            }
            .tips {
                margin:40rpx 0 60rpx;
                color:#999;
                font-size:24rpx;
            }
        }
        .ft {
            margin:0 auto 82rpx;
            width:486rpx;
            height:100rpx;
            line-height:100rpx;
            background:linear-gradient(87deg, #FFA63F, #EB5628);
            border-radius:50rpx;
            color:#FFF;
            font-size:34rpx;
            font-weight:500;
        }
    }
}
</style>