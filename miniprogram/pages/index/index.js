// index.js
const app = getApp()
// const { envList } = require('../../envList.js');

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
      submitTime: '',
      landDetails: []
  },


  // 弹出 登录 提示框
  showLoginModal() {
    wx.showModal({
        title: '需要登录哦',
        content: '登录后更精彩',
        confirmText: '去登录',
        cancelColor: "#5c5d5e",
        confirmColor: "#387ef5",
        success: function(res){
            if(res.confirm){
                wx.switchTab({
                    url: '../my/index'
                })
            }
        }
    });
  },

    // 弹出 实名 提示框
    showRealNameModal() {
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
    },

  // 跳转到指定页面
  navigateToPage(event) {
    //console.log(event)
    const pageName = event.currentTarget.dataset.page;
    const path = '../'+pageName+'/index';
    const needLoginAndRealName = pageName == 'landPost' || pageName == 'landRequire';
    // const thisPage = getCurrentPages().pop()
    if(needLoginAndRealName){
        if(app.globalData.role == '0'){
            this.showLoginModal();
        }else if(app.globalData.role == '1'){
            this.showRealNameModal();
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

  toMiniProgram() {
    wx.navigateToMiniProgram({
        appId: 'wx6a25b95bac9f3cfb',
        path: '',
        envVersion: 'release',
        success(res) {
          // 打开成功
          //console.log("打开成功")
        }
      })
  },

//   address: "江苏省南京市鼓楼区汉口22号"
//   city: "南京市"
//   district: "鼓楼区"
//   latitude: 32.055063
//   longitude: 118.779441
//   name: "南京大学(鼓楼校区)"
//   province: "江苏省"
//   usePlugin(){
//     let plugin = requirePlugin('routePlan');
//     let key = 'FL6BZ-ON76U-ELXV4-27XN6-GN72E-XAB4R';  //使用在腾讯位置服务申请的key
//     let referer = '闲置土地信息共享';   //调用插件的app的名称
//     let endPoint = JSON.stringify({  //终点
//         'name': '江苏省南京市鼓楼区汉口22号',
//         'latitude': 32.055063,
//         'longitude': 118.779441
//     });
//     wx.navigateTo({
//         url: 'plugin://routePlan/index?navigation=1&key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
//     });
//   },


  // 发出请求，获取土地
  async getLands(){
    var submitTime = this.data.submitTime;
    const res = await app.callContainer({
        path: 'landPost/getLandPosts',
        method: 'GET',
        data: {
            'submitTime': submitTime
        }
    })
    // return this.parseRes(res)
    return this.changeSubmitTime(res)
  },

  changeSubmitTime(res){
    var newlandDetails = res.result
    const len = newlandDetails.length
    if(len == 0){
        //console.log("没有更多了")
        wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 2000
        })
    }
    if(len >= 1){
        const newTime = newlandDetails[len-1].submitTime
        if(this.data.submitTime > newTime)
        this.setData({
            submitTime:  newTime
        })
    }
    // //console.log("newLandDetails", newlandDetails)
    return newlandDetails;
  },

  // 往土地列表中加土地
  async addLands(){
    const newLandDetails = await this.getLands();
    var landDetails = this.data.landDetails
    landDetails.push.apply(landDetails, newLandDetails)
    this.setData({
        landDetails: landDetails
    })
    //console.log("after addLands", this.data.landDetails)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 刷新要更新时间
    this.setData({
        submitTime: new Date().Format("yyyy-MM-dd HH:mm:ss")
    })
    this.addLands() // 初始时添加土地列表
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
    this.addLands() // 上拉触底加载更多土地
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})