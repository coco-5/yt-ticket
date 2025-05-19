<template>
    <view class="c-birth">
        <picker 
            mode="date" 
            :value="date" 
            start="2015-09-01" 
            end="2017-09-01" 
            @change="dateChange"
        >
            <view class="picker">
              当前选择: {{date}}
            </view>
          </picker>
    </view>
</template>

<script>
export default {
    data(){
        return{
            date:''
        }
    },
    methods:{
        dateChange(e){
            this.date = e.target.value

            this.$emit('dateChange',this.date)
        }
    }
}
</script>

<style lang="scss" scoped>
.c-birth{
}
</style>