// pages/information/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    toArticle(e){
        console.log(e)
        let articleUrl = '';
        if(e.currentTarget.dataset.index == 1){
            articleUrl = 'https://7072-prod-9grx0olg9c8cf232-1311076540.tcb.qcloud.la/articles/news/news1.md?sign=25393c431fbd2419159508a25d95c5e4&t=1651909381';
        }else{
            articleUrl = 'https://7072-prod-9grx0olg9c8cf232-1311076540.tcb.qcloud.la/articles/questions/question1.md?sign=b0b36edbacbb9dce46b0f04a521e5e61&t=1651912459';
        }
        
        wx.navigateTo({
          url: '../article/index?articleUrl='+articleUrl,
        })
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})