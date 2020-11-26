<template>
    <view class="grace-flex grace-columns">
        <view class="">
            <image src="../../static/Notice.png" mode="widthFix"></image>
        </view>
        <view>
            {{newText}}
        </view>
    </view>
</template>
<script>
    var richText = require('@/graceUI/jsTools/richText.js')
    export default {
        data(){
            return {
                //原始内容
                oldText : '',
                //渲染后内容
                newText : ''
            }
        },
        onLoad:function()  {
            
        }

    }
</script>
<style>
</style>