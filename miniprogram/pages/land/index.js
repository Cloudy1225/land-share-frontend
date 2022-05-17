// pages/land/index.js
import districts from '../../data/districts'
const app = getApp();

// 时间格式化
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
        "H+" : this.getHours(), //小时  
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
},

Page({

    /**
     * 页面的初始数据
     */
    data: {

        district: '全部地区',
        districtCode: [''],
        rotated1: '',
        visible1: false,
        districts: districts,
        
        landType: '土地类型',
        landTypeCode: [''], // ["耕地", "水田"]
        rotated2: '',
        visible2: false,
        landTypes: [
            {
                value: '',
                label: '全部'
            },
            {
                value: '耕地',
                label: '耕地',
                children:[
                    {
                      value: '',
                      label: '全部'  
                    },
                    {
                        value: '水田',
                        label: '水田'
                    },
                    {
                        value: '旱地',
                        label: '旱地'
                    },
                    {
                        value: '荒地',
                        label: '荒地'
                    },
                    {
                        value: '水浇地',
                        label: '水浇地'
                    },
                    {
                        value: '盐碱地',
                        label: '盐碱地'
                    },{
                        value: '其它耕地',
                        label: '其它耕地'
                    }
                ]
            },
            {
                value: '草地',
                label: '草地',
                children:[
                    {
                        value: '',
                        label: '全部'
                    },
                    {
                        value: '天然牧草地',
                        label: '天然牧草地'
                    },
                    {
                        value: '人工草地',
                        label: '人工草地'
                    },
                    {
                        value: '其它草地',
                        label: '其它草地'
                    }
                ]
            }
        ],

        toolbar: {title:'土地类型', cancelText:'取消', confirmText:'确定'},
        transferType: '流转方式',
        transferTypeCode: [''], // ['出租']
        rotated3: '',
        visible3: false,
        transferTypes: [
            {
                value: '',
                label: '不限'
            },
            {
                value: '出租',
                label: '出租'
            },
            {
                value: '合作',
                label: '合作'
            },
            {
                value: '互换',
                label: '互换'
            },
            {
                value: '入股',
                label: '入股'
            },
            {
                value: '转包',
                label: '转包'
            },
            {
                value: '转让',
                label: '转让'
            }
        ],

        submitTime: '',

        landDetails: []
        
    },

    // 选择地区
    openDistricts() {
        this.setData({
            visible1: true,
            rotated1: 'rotated'
        })
    },
    closeDistricts() {
        this.setData({ 
            visible1: false,
            rotated1: ''
        })
        this.refreshLands() // 更新土地列表
    },
    changeDistrict(e) {
        var label = e.detail.options.pop().label;
        var code = []
        console.log("1233", label)
        if(label == '全国'){
            label = '全部地区',
            code.push('全国')
            code.push('')
        }else if(label == '全部'){
            label = e.detail.options.pop().label
            code = e.detail.value
        }else{
            code = e.detail.value
        }
        // console.log("11111",e.detail)
        this.setData({ 
            district: label,
            districtCode: code
         })
        // console.log('changeDistrictCode', this.data.districtCode)
    },

    // 选择土地类型
    openLandTypes() {
        this.setData({ 
            visible2: true,
            rotated2: 'rotated'
        })
    },
    closeLandTypes() {
        this.setData({ 
            visible2: false,
            rotated2: ''
        })
        this.refreshLands() // 更新土地列表
    },
    changeLandType(e) {
        var label = e.detail.options.pop().label;
        if(label == '全部' || label == '不限'){
            var option = e.detail.options.pop();
            if(typeof(option) == "undefined"){
                label = '土地类型'
            }else{
                label = option.label
            }
        }
        this.setData({ 
            landType: label,
            landTypeCode: e.detail.value
         })
        // console.log('landTypecode', this.data.landTypeCode)
    },

    // 选择流转方式
    openTransferTypes() {
        this.setData({ visible3: true, rotated3: 'rotated' })
    },
    cancelTransferType(){
        this.setData({
            visible3: false,
            rotated3: ''
        })
    },
    confirmTransferType(e) {
        console.log('confirmTransferType', e);
        var label = e.detail.label;
        if(label == '不限'){
            label = '流转方式'
        }
        this.setData({
            transferType: label,
            transferTypeCode: e.detail.value,
            visible3: false,
            rotated3: ''
        })
        // console.log(e.detail)
        this.refreshLands() // 更新土地列表
    },

    // 获取筛选条件
    getFilters(){
        // console.log(this.data.districtCode)
        // console.log(this.data.landTypeCode)
        // console.log(this.data.transferTypeCode)
        var district =''
        if(this.data.districtCode.length == 3){
            district = this.data.districtCode[1]+'/'+this.data.districtCode[2]
        }else if(this.data.districtCode.length == 2){
            district = this.data.districtCode[1]
        }
        var landType = ''
        if(this.data.landTypeCode[1] == ""){
            landType = this.data.landTypeCode[0]
        }else{
            landType = this.data.landTypeCode.join('/')
        }
        var transferType = this.data.transferTypeCode[0]

        var submitTime = this.data.submitTime;

        // console.log(district, landType, transferType)
        var data = {
            'adInfo': district,
            'landType': landType,
            'transferType': transferType,
            'submitTime': submitTime
        }
        console.log("RequestBody", data)
        return data
    },

    // 发出请求，获取土地
    async getLands(){
        const data = this.getFilters()
        const res = await app.callContainer({
            path: 'landPost/getLandPosts',
            method: 'POST',
            data: data
        })
        // return this.parseRes(res)
        return this.changeSubmitTime(res)
    },

    changeSubmitTime(res){
        var newlandDetails = res.result
        const len = newlandDetails.length
        if(len == 0){
            console.log("没有更多了")
            wx.showToast({
                title: '没有更多了',
                icon: 'none',
                duration: 2000
            })
        }
        if(len >= 1){
            const newTime = newlandDetails[len-1].submitTime
            if(this.data.submitTime > newTime)
            this.setData({
                submitTime:  newTime
            })
        }
        // console.log("newLandDetails", newlandDetails)
        return newlandDetails;
    },

    // 解析响应结果
    // parseRes(res){
    //     var newlandDetails = res.result
    //     const len = newlandDetails.length
    //     if(len == 0){
    //         console.log("没有更多了")
    //         wx.showToast({
    //             title: '没有更多了',
    //             icon: 'none',
    //             duration: 2000
    //         })
    //     }
    //     if(len >= 1){
    //         const newTime = newlandDetails[len-1].submitTime
    //         if(this.data.submitTime > newTime)
    //         this.setData({
    //             submitTime:  newTime
    //         })
    //     }
    //     for(var i = 0; i < len; i++){
    //         const district = newlandDetails[i].adInfo
    //         var adInfo = district.replaceAll('/', '')
    //         if(adInfo == ''){
    //             adInfo = newlandDetails[i].address
    //         }
    //         var landType = newlandDetails[i].landType.replaceAll('/', '')
    //         var title = adInfo+newlandDetails[i].area+'亩'+landType+newlandDetails[i].transferType
    //         newlandDetails[i].title = title
    //         newlandDetails[i].adInfo = adInfo
    //         newlandDetails[i].district = district
    //         var defaultPicture = '../../images/unloginAvatar.png'
    //         if(newlandDetails[i].pictureFileID!=null && newlandDetails[i].pictureFileID!=''){
    //             // console.log(newlandDetails[i].pictureFileID.split('|'))
    //             defaultPicture = newlandDetails[i].pictureFileID.split('|')[0]
    //         }
    //         // console.log("1111", defaultPicture)
    //         newlandDetails[i].defaultPicture = defaultPicture
    //     }
    //     // console.log(newlandDetails)
    //     return newlandDetails
    // },


    // 根据筛选条件刷新土地列表
    async refreshLands(){
        // 刷新要更新时间
        this.setData({
            submitTime: new Date().Format("yyyy-MM-dd HH:mm:ss")
        })
        const newLandDetails = await this.getLands();
        this.setData({
            landDetails: newLandDetails
        })
        console.log("after refreshLands", this.data.landDetails)
    },

    // 往土地列表中加土地
    async addLands(){
        const newLandDetails = await this.getLands();
        var landDetails = this.data.landDetails
        landDetails.push.apply(landDetails, newLandDetails)
        this.setData({
            landDetails: landDetails
        })
        console.log("after addLands", this.data.landDetails)
    },

    // 跳转土地详情页面
    toLandDetailPage(e){
        // console.log("eeee", e)
        const i = e.currentTarget.dataset.index;
        const landDetail = JSON.stringify(this.data.landDetails[i])
        // console.log(landDetail)
        wx.navigateTo({
            url: '../landPage/landPage?landDetail='+landDetail,
          })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.refreshLands() // 初始时刷新土地列表
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getTabBar().init(); // 加载底部导航栏
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.addLands() // 上拉触底加载更多土地
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})