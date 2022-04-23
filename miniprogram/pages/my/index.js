// pages/my/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: [],
        role: '0',
        hasUserInfo: false
    },

    // 跳转到指定页面
    navigateToPage: (event) => {
      console.log(event)
      const path = '../'+event.currentTarget.dataset.page+'/index';
      wx.navigateTo({
        url: path
      })
    },

    // 打开客服会话
    // onContact(e) {
    //   console.log('onContact', e)
    // },

    // 点击登录函数
    login() {
      wx.getUserProfile({
        desc: '获取你的头像和昵称:)',
        success: (res) => {
          // console.log(res);
          this.setData({ // 设置用户信息：头像、昵称、性别等
            userInfo: res.userInfo,
            hasUserInfo: true
          });

          // 看是否为新用户，如果是则自动注册，返回值为role
          const res1 =  this.register(); 
          res1.then((fulfilledData) => {
            // console.log(fulfilledData)
            app.globalData.role = fulfilledData; // role变为1或2
            this.setData({
              role: fulfilledData
            })
            wx.setStorage({ // 保存用户信息至本地缓存
              key:'userInfo',
              data:{
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                role: fulfilledData
              },
              success(res){
                console.log("缓存成功",res)
              }
            })
          })
        }
      })
    },
    
    /**
     * 看是否为新用户，如果是则自动注册
     * 返回用户角色role
     */
    async register() {
      const res = await app.callContainer({
        path: '/my/loginOrRegister',
        method: 'GET'
      });
      // console.log(res.result.role);
      return res.result.role;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // 根据app.js中的全局变量初始化
      this.setData(
        {
          userInfo:{
            nickName: app.globalData.nickName,
            avatarUrl: app.globalData.avatarUrl
          },
          role: app.globalData.role,
          hasUserInfo: app.globalData.hasUserInfo
        }
      )
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