// pages/myCollection/index.js
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
        isEmpty: false, // 是否为空页面

        landDetails: []
        
    },
    // 发出请求，获取土地
    async getLands(){
        const res = await app.callContainer({
            path: 'collection/getMyCollection',
            method: 'GET',
        })
        // return this.parseRes(res)
        // console.log(res)
        var newlandDetails = res.result.myCollection
        // if(newlandDetails == null || newlandDetails.length == 0){
        //     wx.showToast({
        //         title: '没有更多了',
        //         icon: 'none',
        //         duration: 2000
        //     })
        // }
        this.setData({
            landDetails: newlandDetails
        })
    },

    // changeSubmitTime(res){
    //     console.log(res)
    //     var newlandDetails = res.result.myCollection
    //     if(newlandDetails == null){
    //         len = 0;
    //     }
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
    //     // console.log("newLandDetails", newlandDetails)
    //     return newlandDetails;
    // },


    // // 根据筛选条件刷新土地列表
    // async refreshLands(){
    //     // 刷新要更新时间
    //     this.setData({
    //         submitTime: new Date().Format("yyyy-MM-dd HH:mm:ss")
    //     })
    //     const newLandDetails = await this.getLands();
    //     this.setData({
    //         landDetails: newLandDetails
    //     })
    //     console.log("after refreshLands", this.data.landDetails)
    // },

    // // 往土地列表中加土地
    // async addLands(){
    //     const newLandDetails = await this.getLands();
    //     var landDetails = this.data.landDetails
    //     landDetails.push.apply(landDetails, newLandDetails)
    //     this.setData({
    //         landDetails: landDetails
    //     })
    //     console.log("after addLands", this.data.landDetails)
    // },

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
    onLoad: async function (options) {
        // await this.getLands() // 初始时刷新土地列表
        // console.log(this.data.landDetails)
        // if(this.data.landDetails == null || this.data.landDetails.length == 0) {
        //     this.setData({
        //         isEmpty: true
        //     })
        // }
        // console.log(this.data.isEmpty)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow:async function () {
        await this.getLands() // 初始时刷新土地列表
        console.log(this.data.landDetails)
        if(this.data.landDetails == null || this.data.landDetails.length == 0) {
            this.setData({
                isEmpty: true
            })
        }
        console.log(this.data.isEmpty)
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})