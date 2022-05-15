// index.js
// const app = getApp()
// const { envList } = require('../../envList.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
//   address: "江苏省南京市鼓楼区汉口22号"
//   city: "南京市"
//   district: "鼓楼区"
//   latitude: 32.055063
//   longitude: 118.779441
//   name: "南京大学(鼓楼校区)"
//   province: "江苏省"
  usePlugin(){
    let plugin = requirePlugin('routePlan');
    let key = 'FL6BZ-ON76U-ELXV4-27XN6-GN72E-XAB4R';  //使用在腾讯位置服务申请的key
    let referer = '闲置土地信息共享';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
        'name': '江苏省南京市鼓楼区汉口22号',
        'latitude': 32.055063,
        'longitude': 118.779441
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?navigation=1&key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },
  toLandPage(){
    wx.navigateTo({
        url:'../landPage/landPage'
    });

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