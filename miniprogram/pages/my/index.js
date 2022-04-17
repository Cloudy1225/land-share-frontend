// pages/my/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: [],
        defaultAvatar: "../../images/unloginAvatar.png",
        hasUserInfo: false
    },

    // 点击登录函数
    login() {
      this.register(); 
      wx.getUserProfile({
        desc: '获取你的头像和昵称:)',
        success: (res) => {
          // console.log(res);
          this.setData({ // 设置用户信息：头像、昵称、性别等
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },
    
    // 看是否为新用户，如果是则自动注册
    register(){
      const res =  wx.cloud.callContainer({
        config: {
          env: 'prod-9grx0olg9c8cf232', // 微信云托管的环境ID
        },
        path: '/my/loginOrRegister', // 填入业务自定义路径和参数
        method: 'GET', // 按照自己的业务开发，选择对应的方法
        header: {
          'X-WX-SERVICE': 'land-share-test', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          // 其他header参数
        }
        // 其余参数同 wx.request
      });
      // console.log(res);
    },

    inc(){
      wx.cloud.callContainer({
        "config": {
          "env": "prod-9grx0olg9c8cf232"
        },
        "path": "/api/count",
        "header": {
          "X-WX-SERVICE": "land-share-test"
        },
        "method": "POST",
        "data": {
          "action": "inc"
        }
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