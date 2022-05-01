// pages/realName/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    // 获取用户实名信息
    async getRealName() {
        const res = await app.callContainer({
          path: '/my/getUserInfo', 
          method: 'GET'
        });
        // console.log(res.result);
        return res.result;
      },
  
      // 更新用户实名信息
      async updateRealName() {
        const telenumber = '18355442634';
        const username = '刘云辉';
        const idnumber = '340421200212253412';
        const res = await app.callContainer({
          path: '/my/realName',
          method: 'POST',
          data: {
            telenumber: telenumber,
            username: username,
            idnumber: idnumber
          }
        });
        // console.log("res", res);
        if(res.code=="00000"){ //云托管成功返回
            app.globalData.role = '2'; // role变为1或2
            app.globalData.telenumber = telenumber;
            wx.setStorage({ // 保存用户信息至本地缓存
                key:'userInfo',
                data:{
                    nickName: app.globalData.nickName,
                    avatarUrl: app.globalData.avatarUrl,
                    telenumber: telenumber,
                    role: '2'
                },
                success(res) {
                    console.log("缓存成功", res)
                },
                fail(err) {
                    console.log("缓存失败", err)
                }
            })
        }
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