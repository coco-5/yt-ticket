<template>
    <view class="page">
        <view class="block"></view>
        <view class="list">
            <view 
                class="item"
                :class="'item-'+item.type"
                v-for="(item,index) in list"
                :key="index"
            >
                <view class="label">
                    <text v-if="item.required">*</text>
                    {{item.title}}
                </view>
                <view 
                    class="picker"
                    v-if="item.type == 'date'"
                >
                    <c-date-picker
                        :date="item.value || startDate"
                        :start="startDate"
                        :end="endDate"
                        @change="changeDate"
                    ></c-date-picker>
                </view>
                <view 
                    class="imgs"
                    v-else-if="item.type == 'img'"
                >
                    <view 
                        class="img"
                        v-if="item.value"
                    >
                        <image 
                            :src="item.value"
                            mode="aspectFill"
                        ></image>
                        <view 
                            class="del"
                            @click.stop="delImg"
                        ></view>
                    </view>
                    <view 
                        class="btn-upload"
                        @click="handlerUpload"
                    ></view>
                </view>
                <view 
                    class="input"
                    v-else
                >
                    <input 
                        type="text" 
                        placeholder-style="color:#999;"
                        maxlength="20"
                        :placeholder="item.placeholder"
                        @input="input(item,$event)"
                    />
                </view>
                <view 
                    class="img-tips"
                    v-if="item.type == 'img'"
                > 
                    照片只做优惠认证使用，认证完成30天内系统自动删除照片信息 
                </view>
            </view>
        </view>
        <view class="tips">
            <rich-text :nodes="tips"></rich-text>
        </view>
        <view 
            class="btn"
            @click="handlerSubmit"
        >
            提交
        </view>

        <!-- <c-birth></c-birth> -->
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { bindCitizenApi } from '@/api/member'
export default {
    data(){
        return{
            list:[
                {
                    title:'姓名',
                    type:'name',
                    placeholder:'请输入您的姓名',
                    required:true,
                    value:'',
                },
                {
                    title:'通关证件号码',
                    type:'number',
                    placeholder:'通行证、台胞证、回乡证、护照等',
                    required:true,
                    value:'',
                },
                {
                    title:'优惠证件图片',
                    type:'img',
                    placeholder:'',
                    required:true,
                    value:'',
                    //value:'https://newxcx.soofound.cn/stage-api/profile/upload/2025/05/12/fKZqg1eSHRvl5016e11c07a14d070f7f847f2193094c_20250512150152A002.jpg',
                },/* 
                {
                    title:'联系电话',
                    type:'mobile',
                    placeholder:'请输入您的联系电话',
                    required:true,
                    value:'',
                }, */
                {
                    title:'证件有效期',
                    type:'date',
                    placeholder:'请参考备注选择优惠证件的有效期',
                    required:true,
                    value:'',
                }
            ],
            tips:'<p> 申请珠澳居民优惠认证根据持有证件不同请上传以下证件：</p><p> (1) 澳门居民请上传回乡证有效期面相片或护照+澳门身份证有效期面相片；</p><p>(2) 珠海居民请上传珠海居民身份证正反面（有效期必须清晰可见）+通行证相片；</p><p> (3) 持有蓝卡的乘客请上传蓝卡+蓝卡有效期截图+通行证相片；</p><p> (4) 持有珠海居住证/社保卡的乘客请上传珠海居住证/社保卡（有效期必须清晰可见）+通行证相片；</p><p> ((5) 持有因公通行证的乘客请上传因公签证（绿卡）有效期+因公通行证相片；</p><p> (6) 如您提交3日后系统依然未通过请前往澳门内港码头票务处人工处理。 </p>',
            startDate:'',
            endDate:'',
        }
    },
    onLoad(e){
        this.options = e

        this.initDate()
    },
    methods:{
        initDate(){
            let now = new Date()
            let max = `${now.getFullYear()+50}-12-31`

            this.startDate = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`

            this.endDate = max

            this.setValue('date',this.startDate)
        },
        handlerUpload(){
            uni.chooseImage({
                count:1, 
                sizeType:['original', 'compressed'],
                sourceType:['album'], 
                success:(res)=>{
                    this.uploadFile(res.tempFilePaths[0])
                },
                fail:(err)=>{
                    uni.showToast({ 
                        title:'打开相册失败', 
                        icon:'none', 
                        duration:2000 
                    })
                }
            })
        },
        uploadFile(filePath){
            uni.showLoading()

			uni.uploadFile({
				url:`${this.baseConfig.proxyApi.main}/api/common/upload`,
                header:{
                    Authorization:'Bearer ' + uni.getStorageSync('token')
                },
                fileType:'image',
                name:'file',
                filePath:filePath,
                success:(res)=>{
                    let json = JSON.parse(res.data)
                    if(json.code == 200){
                        let url = json.url.replace('http://', 'https://')

                        this.setValue('img',url)
                    }
                    uni.hideLoading()
                },
                fail: (res) => {
                    uni.hideLoading()
                }
			})
        },
        delImg(){
            this.setValue('img','')    
        },
        setValue(key,value){
            let list = this.list

            for(let i=0; i<list.length; i++){
                if(list[i].type == key){
                    list[i].value = value
                    break
                }
            }
        },
        getValue(key){
            let list = this.list

            for(let i=0; i<list.length; i++){
                if(list[i].type == key){
                    return list[i].value
                    
                }
            }
        },
        handlerSubmit(){
            if(!this.getValue('name')){
                uni.showToast({ 
                    title:'请输入姓名', 
                    icon:'none', 
                    duration:2000 
                })
                return
            }
            if(!this.getValue('number')){
                uni.showToast({ 
                    title:'请输入您通关证件号码', 
                    icon:'none', 
                    duration:2000 
                })
                return
            }
            if(!this.getValue('img')){
                uni.showToast({ 
                    title:'请上传优惠证件图片', 
                    icon:'none', 
                    duration:2000 
                })
                return
            }
            if(!this.getValue('date')){
                uni.showToast({ 
                    title:'请选择证件有效期', 
                    icon:'none', 
                    duration:2000 
                })
                return
            }

            let params = {
                certificateImg:this.getValue('img'),
                expiryDate:this.getValue('date'),
                idcard:this.getValue('number'),
                name:this.getValue('name'),
            }

            bindCitizenApi(params).then((res)=>{
                if(res.data.code == 200){
                    uni.showToast({ 
                        title:'提交成功', 
                        icon:'none', 
                        duration:2000 
                    })

                    setTimeout(()=>{
                        let query = {
                            type:'successApply'
                        }

                        let url = `/packageUser/pages/member/result?${utils.paramsStringify(query)}`  
                        uni.redirectTo({
                            url                        
                        })
                    },2000)
                }else{
                    uni.showToast({ 
                        title:res.data.msg, 
                       icon:'none', 
                    })
                }
            })
        },
        input(item,e){
            let value = e.detail.value   
            this.setValue(item.type, value)
        },
        changeDate(data){
            this.setValue('date',data)
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:#F8F8F8;    
}

.block {
    height:32rpx;
}

.list {
    margin:0 auto;
    width:710rpx;
    background:#FFF;
    border-radius:20rpx;
    .item {
        position:relative;
        margin:0 32rpx;
        padding:0 40rpx 0 210rpx;
        height:116rpx;
        border-bottom:1px solid #EFEFEF;
        .label {
            position:absolute;
            top:0;
            left:0;
            width:200rpx;
            line-height:116rpx;
            color:#000;
            opacity:0.9;
            font-size:28rpx;
            text {
                display:inline-block;
                margin-right:8rpx;
                color:#ee0a24;
                font-weight:500;
                vertical-align:middle;
            }
        }
        .input {
            display:inline-block;
            margin:30rpx 0 0;
            padding:8rpx 0;
            vertical-align:middle;
            input {
                width:420rpx;
                font-size:28rpx;
            }
        }
        .picker {
            display:inline-block;
            margin:24rpx 0 0;
            padding:8rpx 0;
            width:400rpx;
            vertical-align:middle;
        }
        .imgs {
            display:inline-block;
            margin-top:32rpx;
            height:200rpx;
            vertical-align:middle;
            .btn-upload,
            .img {
                position:relative;
                display:inline-block;
                width:200rpx;
                height:200rpx;
                line-height:200rpx;
                background:#EDEDED;
                text-align:center;
                vertical-align:middle;
            }
            .img {
                position:relative;
                margin-right:24rpx;
                overflow:hidden;
                image {
                    width:200rpx;
                    height:200rpx;
                }
                .del {
                    position:absolute;
                    top:-40rpx;
                    right:-40rpx;
                    width:80rpx;
                    height:80rpx;
                    line-height:50rpx;
                    background:rgba(0,0,0,.3);
                    border-radius:050%;
                    text-align:center;
                    &::before {
                        content:'x';
                        position:absolute;
                        bottom:0;
                        left:18rpx;
                        color:#FFF;
                        font-size:20rpx;
                    }
                }
            }
            .btn-upload {
                &::after {
                    content:' ';
                    position:absolute;
                    top:50%;
                    left:50%;
                    transform:translate(-50%,-50%);
                    width:60rpx;
                    height:60rpx;
                    background-image:url('http://8.138.130.153:6003/vue/upload/static/common/2294174703026.png');
                    background-size:contain;
                }
            }
        }
        .img-tips {
            position:absolute;
            width:640rpx;
            font-size:22rpx;
            color:rgba(0, 0, 0, 0.3);
            left:0rpx;
            bottom:20rpx;
        }
        &.item-img {
            padding-right:0;
            padding-bottom:80rpx;
            height:auto;
        }
    }
}

.tips {
    margin:40rpx 20rpx 0;
    font-size:24rpx;
    color:rgba(119, 119, 119, 1);
    line-height:40rpx;
}

.btn {
    position:fixed;
    bottom:60rpx;
    left:50%;
    transform:translateX(-50%);
    width:664rpx;
    height:100rpx;
    line-height:100rpx;
    background:linear-gradient(87deg, #FFA63F, #EB5628);
    border-radius:50rpx;
    color:#FFF;
    font-size:34rpx;
    text-align:center;
}
</style>