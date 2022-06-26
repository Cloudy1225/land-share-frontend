// pages/myPost/index.js
const app = getApp();

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
            path: 'landPost/getMyLandPosts',
            method: 'GET',
        })
        var newlandDetails = res.result
        this.setData({
            landDetails: newlandDetails
        })
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
    onLoad: async function (options) {
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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