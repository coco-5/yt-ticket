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
                <image :src="'http://8.138.130.153:6003/vue/upload/static/my/'+item.ico+'.png'"/>
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

        <c-member-name
            :isShoPop="isShowEditName"
        ></c-member-name>

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
        }
    },
    onLoad(e) {
        this.options = e

        this.isCompare = utils.compareBaseSDKVersion('2.21.2')

        this.getMemberInfo()

        this.getList()
    },
    methods:{
        getMemberInfo(){
            this.ticketMember = uni.getStorageSync('ticketMember') || {}

            if(this.ticketMember.avatarWechat){
                this.ticketMember.avatarWechat = this.ticketMember.avatarWechat.replace('http://','https://')
            }
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
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height:100vh;
    background:url('http://8.138.130.153:6003/vue/upload/static/my/bg.png') no-repeat #F8F8F8;
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
        background:url('http://8.138.130.153:6003/vue/upload/static/my/icon-jf.png') no-repeat;
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
            background:url('http://8.138.130.153:6003/vue/upload/static/my/icon-arrow.png') no-repeat;
            background-size:contain;
        }
    }
}
</style>