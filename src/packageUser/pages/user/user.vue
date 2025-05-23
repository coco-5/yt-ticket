<template>
    <view class="page">
        <view class="user-info">
            <view class="avatar">
                <block v-if="isCompare">
                    <button 
                        class="avatar-btn"
                        open-type="chooseAvatar" 
                        @chooseavatar="chooseavatar" 
                        plain="true"
                    >
                        <image :src="ticketMember.avatarWechat"></image>
                    </button>
                </block>
            </view>
            <view 
                class="name"
                @click="isShowEditName = true"
            >
                {{ticketMember.nicknameWechat || '用户'}}
            </view>
            <view class="tags">
                <view 
                    class="tag tag-jm"
                    v-if="baseInfo.isTicketCitizen"
                >
                    珠澳居民
                </view>
                <view 
                    class="tag tag-card"
                    v-if="baseInfo.isTicketCard"
                >
                    珠澳卡
                </view>
            </view>
        </view>

        <view 
            class="credit"
            v-if="ticketMember && ticketMember.points"
        >
            <view class="ico"></view>可用积分<text>{{ticketMember.points || 0}}</text>
        </view>

        <view class="list">
            <view 
                class="item"
                @click="go(item)"
                v-for="(item,index) in list"
                :key="index"
            >
                <image :src="'https://newxcx.soofound.cn/vue/upload/static/my/'+item.ico+'.png'"/>
                <view class="name">{{item.name}}</view>
            </view>
        </view>

        <view 
            class="advertise"
            v-if="advertiseList.length > 0"
        >
            <c-banner
                style="width:720rpx;height:147rpx;"
                :list="advertiseList"
                :current="advertiseIndex"
            ></c-banner>
        </view>

        <c-pop
            height="50vh"
            :isShow="isShowEditName"
            @cbClosePop="cbClosePop"
        >
            <template #content>
                <view 
                    class="c-pop-name"
                    :style="bottomStyle"
                >
                    <view class="hd">编辑用户名</view>
                    <form @submit="submit">
                        <view class="bd">
                            <view class="name-wrap">
                                <!-- <view 
                                    class="clear" 
                                    @click.stop="name = ''" 
                                    v-if="name"
                                ></view> -->
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

        <c-bottom
            current="2"
            :isShowNav="true"
        ></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getAdvertiseListApi } from '@/api/common'
import { memberUpdateApi } from '@/api/passenger'
import { getBaseInfoApi } from '@/api/member'
export default {
    data(){
        return{
            options:{},
            list:[
                {type:'ld',name:'轮渡订单',link:'/packageUser/pages/order/list',ico:'icon-ld'},
                {type:'ld',name:'我的增值服务',link:'/packageUser/pages/order/services',ico:'icon-ld'},
                {type:'sp',name:'商品订单',link:'',ico:'icon-sp'},
                {type:'ck',name:'乘客',link:'/packageUser/pages/passenger/list',ico:'icon-ck'},
                {type:'pk',name:'票卡',link:'/packageUser/pages/card/list',ico:'icon-pk'},
				{type:'vip',name:'会员信息',link:'/packageUser/pages/member/list',ico:'icon-vip'},
            ],
            advertiseList:[],
            advertiseIndex:0,
            ticketMember:{},
            isCompare:false,
            baseInfo:{},
            isShowEditName:false,
            bottomStyle:'',
            name:'',
        }
    },
    onLoad(e) {
        this.options = e

        this.isCompare = utils.compareBaseSDKVersion('2.21.2')

        this.query = uni.createSelectorQuery(this)

        this.fixBottom()

        this.getMemberInfo()

        this.getList()
    },
    methods:{
        fixBottom(){
            let height = utils.fixIPhoneX() ? 68 : 0

            this.bottomStyle = `padding-bottom:${height}rpx; height:calc(50vh - ${height}rpx);`
        },
        getMemberInfo(){
            this.ticketMember = uni.getStorageSync('ticketMember') || {}

            if(this.ticketMember.avatarWechat){
                this.ticketMember.avatarWechat = this.ticketMember.avatarWechat.replace('http://','https://')
            }

            this.name = this.ticketMember.nicknameWechat
        },
        getList(){
            let list = [
                this.getBaseInfo(),
                this.getAdvertiseList()
            ]

            Promise.all(list).then(()=>{
            })
        },
        getBaseInfo(){
            return new Promise((resolve)=>{
                getBaseInfoApi({}).then((res)=>{
                    if(res.data.code == 200){
                        let data = res.data.data

                        this.baseInfo = data
                    }
                })
            })
        },
        getAdvertiseList(){
            let params = {
                position:3
            }

            getAdvertiseListApi(params).then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data || []
                    this.advertiseList = data
                }
            })
        },
        go(item){
            if(!item.link){
                uni.showToast({
                    title:'即将上线，敬请期待',
                    icon:'none'
                })
                return
            }

            uni.navigateTo({
                url:item.link
            })
        },

        chooseavatar(e){
            console.log(e.detail.avatarUrl)
            if(e.detail.avatarUrl){
                this.uploadFile(e.detail.avatarUrl)
            }
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
                        let url = json.url
                        this.update({
                            avatarWechat:url
                        })
                    }
                    uni.hideLoading()
                },
                fail: (res) => {
                    uni.hideLoading()
                }
			})
        },
        update(params){
            params.id = this.ticketMember.id

            return new Promise((resolve)=>{
                memberUpdateApi(params).then((res)=>{
                    if(res.data.code == 200){
                        uni.showToast({
                            title:'修改成功',
                            icon:'none'
                        })
                    }else{
                        uni.showToast({
                            title:res.data.msg,
                            icon:'none'
                        })
                    }
                    resolve()
                })
            })
        },
        submit(e){
            if(this.timer){
                this.timer = null
                clearTimeout(this.timer)
            }

            if(!this.name){
                uni.showToast({
                    title:'请输入昵称',
                    icon:'none'
                })
                return
            }

            uni.showLoading()

            // 延迟等待是否昵称验证通过
            this.timer = setTimeout(()=>{
                this.query.select('#name').fields({
                    properties:['value']
                },(res)=>{
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

                    this.update({
                        nicknameWechat:name
                    }).then(()=>{
                        this.ticketMember.nicknameWechat = name
                        this.cbClosePop()    
                    })
                }).exec()
            },1000)
        },
        cbClosePop(){
            this.isShowEditName = false
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:url('https://newxcx.soofound.cn/vue/upload/static/my/bg.png') no-repeat #F8F8F8;
    background-size:contain;
}

.user-info {
    box-sizing:border-box;
    position:relative;
    padding:56rpx 26rpx 0 206rpx;
    height:227rpx;
    overflow:hidden;
    .avatar {
        position:absolute;
        top:50%;
        left:26rpx;
        transform:translateY(-50%);
        width:133rpx;
        height:133rpx;
        .avatar-btn {
            margin:0;
            padding:0;
            width:133rpx;
            height:133rpx;
            border:0 none;
        }
        image {
            width:100%;
            height:100%;
            border-radius:50%;
            background:#000;
            overflow:hidden;
        }
    }
    .name {
        margin-bottom:12rpx;
        color:#000;
        font-size:40rpx;
        font-weight:500;
    }
    .tags {
        height:36rpx;
        .tag {
            display:inline-block;
            margin-right:12rpx;
            padding:0 16rpx;
            height:36rpx;
            line-height:36rpx;
            border-radius:18rpx;
            font-size:20rpx;
            vertical-align:top;
            &.tag-jm {
                background:linear-gradient(96deg, #F9BCA7, #FFD9C9);
                color:#94341E;
            }
            &.tag-card {
                background:linear-gradient(87deg, #FFA63F, #EB5628);
                color:#FFF;
            }
        }
    }
}

.credit {
    box-sizing:border-box;
    margin:0 auto;
    padding:0 28rpx;
    width:710rpx;
    height:98rpx;
    line-height:98rpx;
    background:#FFF;
    border-radius:20rpx;
    color:#000;
    font-size:28rpx;
    .ico {
        display:inline-block;
        width:54rpx;
        height:52rpx;
        background:url('https://newxcx.soofound.cn/vue/upload/static/my/icon-jf.png') no-repeat;
        background-size:contain;
        vertical-align:middle;
    }
    text {
        display:inline-block;
        margin-left:8rpx;
        font-size:38rpx;
        font-weight:500;
    }
}

.list {
    margin:24rpx auto 0;
    padding-top:48rpx;
    width:710rpx;
    background:#FFF;
    border-radius:20rpx;
    overflow:hidden;
    .item {
        position:relative;
        margin-bottom:48rpx;
        padding-left:98rpx;
        height:58rpx;
        line-height:58rpx;
        image {
            position:absolute;
            left:28rpx;
            top:0;
            width:58rpx;
            height:58rpx;

        }
        .name {
            display:inline-block;
            vertical-align:middle;
        }
        &::before {
            content:' ';
            position:absolute;
            right:40rpx;
            top:0;
            transform:translateY(50%);
            width:14rpx;
            height:25rpx;
            background:url('https://newxcx.soofound.cn/vue/upload/static/my/icon-arrow.png') no-repeat;
            background-size:contain;
        }
    }
}

.c-pop-name {
    box-sizing:border-box;
    position:relative;
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
}
</style>