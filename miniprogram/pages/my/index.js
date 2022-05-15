// pages/my/index.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName: '',
        avatarUrl: '../../images/unLoginAvatar.png',
        role: '0'
    },

    // 弹出 登录 提示框
    showLoginModal() {
        // if(app.globalData.role == '0'){
            const thisPage = getCurrentPages().pop()
            wx.showModal({
                title: '点击登录',
                content: '登录后更精彩',
                confirmText: '去登录',
                cancelColor: "#5c5d5e",
                confirmColor: "#387ef5",
                success: function(res){
                    if(res.confirm){
                        console.log(thisPage)
                        thisPage.login()
                    }
                }
            });
        //   }
    },

    // 弹出 实名 提示框
    showRealNameModal() {
        // if(app.globalData.role == '1'){
            wx.showModal({
                title: '未实名',
                content: '实名后享更多功能哦',
                confirmText: '去实名',
                cancelColor: "#5c5d5e",
                confirmColor: "#387ef5",
                success: function(res){
                    if(res.confirm){
                        wx.navigateTo({
                            url: '../realName/index'
                        })
                    }
                }
            });
        // }
    },

    // 跳转到指定页面
    navigateToPage: (event) => {
        console.log(event)
        const pageName = event.currentTarget.dataset.page;
        const path = '../'+pageName+'/index';
        const needLoginAndRealName = pageName == 'myPost' || pageName == 'myMessage' 
        || pageName == 'landPost' || pageName == 'landRequire' || pageName == 'landManage'
        || pageName == 'requireManage';
        const onlyNeedLogin = pageName == 'myCollection' || pageName == 'realName';
        const thisPage = getCurrentPages().pop()
        if(onlyNeedLogin && app.globalData.role == '0'){
            thisPage.showLoginModal();
        }else if(needLoginAndRealName){
            if(app.globalData.role == '0'){
                thisPage.showLoginModal();
            }else if(app.globalData.role == '1'){
                thisPage.showRealNameModal();
            }else{
                wx.navigateTo({
                    url: path
                })
            }
        }else{
            wx.navigateTo({
                url: path
            })
        }
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
          // console.log(res)
          // 看是否为新用户，如果是则自动注册，返回值为role
          wx.showLoading({
            title: '登录中'
          })          
          const res1 =  this.register(); 
          res1.then((result) => {
            wx.hideLoading();
            console.log(result)
            app.globalData.nickName = res.userInfo.nickName;
            app.globalData.avatarUrl = res.userInfo.avatarUrl;
            app.globalData.role = result.role; // role变为1或2
            app.globalData.telenumber = result.telenumber;
            this.setData({
              role: result.role,
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl
            })
            wx.setStorage({ // 保存用户信息至本地缓存
              key:'userInfo',
              data:{
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                telenumber: result.telenumber,
                role: result.role
              },
              success(res) {
                console.log("缓存成功", res)
              },
              fail(err) {
                  console.log("缓存失败", err)
              }
            })
          }).catch((err) => { // 云托管调用失败
            wx.hideLoading({
                success: (res) => {},
            });
            wx.showToast({
                icon: 'none',
                title: '云托管启动中，请稍后再登录',
                duration: 2000
            })
          })
        }
      })
    },
    
    /**
     * 看是否为新用户，如果是则自动注册
     * 返回用户角色role和telenumber
     */
    async register() {
      const res = await app.callContainer({
        path: '/my/loginOrRegister',
        method: 'GET'
      });
      // console.log(res.result);
      return res.result;
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

        //根据app.js中的全局变量初始化
        this.setData(
            {
                avatarUrl: '', // md，这是个bug，没有这一步头像会消失，可能是WuiUI或小程序的bug
            }
        )
        this.setData(
            {
                nickName: app.globalData.nickName,
                avatarUrl: app.globalData.avatarUrl,
                role: app.globalData.role
            }
        )
        // console.log("avatarUrl", this.data.avatarUrl)
        
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