// pages/searchLands/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        landDetails: []
    },

    async search(input){
        const res = await app.callContainer({
            path: 'landPost/searchLandPosts',
            method: 'POST',
            data: {
                "input": input
            }
        })
        if(res.result!=null && res.result.length != 0){
            this.setData({
                landDetails: res.result
            })
        }
    },

    // 跳转土地详情页面
    toLandDetailPage(e){
        // console.log("eeee", e)
        const i = e.currentTarget.dataset.index;
        const landDetail = JSON.stringify(this.data.landDetails[i])
        // console.log(landDetail)
        wx.navigateTo({
            url: '../landDetail/index?landDetail='+landDetail,
          })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options)
        this.search(options.searchText)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})