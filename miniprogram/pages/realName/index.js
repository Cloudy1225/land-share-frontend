// pages/realName/index.js
const app = getApp()
import { $wuxToptips } from '../../wuxui-lib/index' // 顶部提示
const isTel = (value) => !/^1[34578]\d{9}$/.test(value)
const isID = (value) => !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/.test(value)

Page({

    /**
     * 页面的初始数据
     */
    data: {
      avatarUrl: '',
      nickName: '',
      role: '1',
      usernameInput: null,
      IDnumberInput: null,
      phonenumberInput: null,
      IDnumberError: false,
      phonenumberError: false
    },


    onChange(e) {
      console.log('onChange', e)
      const value = e.detail.value;
      switch(e.currentTarget.dataset.index){
        case "usernameInput":{
          this.setData({
            usernameInput: value
          })
          break;
        }
        case "IDnumberInput":{
          this.setData({
            IDnumberInput: value,
            IDnumberError: isID(value)
          })
          break
        }
        case "phonenumberInput":{
          this.setData({
            phonenumberInput: value,
            phonenumberError: isTel(value)
          })
          break
        }
      }
    },

    onError(e) {
      console.log(e)

      switch(e.currentTarget.dataset.index){
        case "IDnumberInput":{
          wx.showModal({
            title: '警告',
            content: '请输入正确的身份证号码',
            showCancel: !1,
            confirmColor: "#387ef5"
        })
          break
        }
        case "phonenumberInput":{
          wx.showModal({
            title: '警告',
            content: '请输入正确的手机号',
            showCancel: !1,
            confirmColor: "#387ef5"
        })
          break
        }
      }
    },

    isCompleted(){  
      if(this.data.usernameInput != null &&  this.data.usernameInput != '' && !this.data.IDnumberError &&
        !this.data.phonenumberError){
          console.log('信息已填写完整');
          return true;
      }else{ // 弹出警告
            $wuxToptips().warn({
                hidden: false,
                text: '请将信息填写完整正确',
                duration: 2500,
                success() {},
            })
            return false;
        }
    },

    submit(){
      const that = this
        if(that.isCompleted()){
            wx.showModal({
                title: '确认提交？',
                content: '确保信息真实完整后再点击确定提交',
                confirmColor: "#387ef5",
                success: function(res){
                    if(res.confirm){
                        that.updateRealName(); // 调起后端
                    }
                }
            });
        }
    },

    // 更新用户实名信息
    async updateRealName() {

      const telenumber = this.data.phonenumberInput;
      const username = this.data.usernameInput;
      const idnumber = this.data.IDnumberInput;

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

          $wuxToptips().success({
            hidden: false,
            text: '上传成功，待审核',
            duration: 1500,
            success() {
              setTimeout(function(){wx.navigateBack({
              })},1000);
            },
          })
          // wx.showModal({
          //     title: '提示!',
          //     content: '您已完成实名认证',
          //     showCancel:false,
          //     success (res) {
          //       wx.navigateBack({
          //     delta: 8,
          //   })
          //     }
          //   })
            
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

    // 获取用户实名信息
    async getRealName() {
      const res = await app.callContainer({
        path: '/my/getUserInfo', 
        method: 'GET'
      });
      // console.log("实名信息获取结果", res.result);
      return res.result;
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
      this.setData({
        avatarUrl: app.globalData.avatarUrl,
        nickName: app.globalData.nickName,
        role: app.globalData.role,
      })
      const res = await this.getRealName();
      this.setData({
          usernameInput: res.username,
          IDnumberInput: res.idnumber,
          phonenumberInput: res.telenumber
      })
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