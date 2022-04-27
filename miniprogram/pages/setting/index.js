// pages/setting/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
 
    },


    //退出登录函数
    logout(){
        wx.showModal({
            title: '提示',
            content: '确定退出登录吗，此操作会清空缓存',
            cancelColor: 'cancelColor',
            success: function(res){
                if(res.confirm){
                    app.globalData.role="0";
                    app.globalData.hasUserInfo="false";
                    wx.clearStorage({
                      success: (res) => {},
                    });
                    wx.switchTab({
                      url: '/pages/my/index',
                    });
                }
            }
        });


    },

    //注销账号函数
    cancelAccount(){
        wx.showModal({
            title: '提示',
            content: '您确定要注销账号吗，注销后无法恢复',
            cancelColor: 'cancelColor',
            success: function(res){
                if(res.confirm){
                    app.callContainer({
                        path: '/my/deleteUser',
                        method: 'GET'
                    });
                    app.globalData.role="0";
                    app.globalData.hasUserInfo="false";
                    wx.clearStorage({
                      success: (res) => {},
                    });
                    wx.switchTab({
                      url: '/pages/my/index',
                    });
                }
            }
        });
        //console.log(res)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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