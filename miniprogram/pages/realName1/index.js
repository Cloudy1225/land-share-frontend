// pages/realName/index.js
const app = getApp();
Page({

    
    /**
     * 页面的初始数据
     */
    data: {
        comfirmInfo: [],
        usernameInput: null,
        IDnumberInput: null,
        phonenumberInput: null,
        // 获取实名认证时的认证
        hasComfirm_user:false,
        hasComfirm_ID:false,
        hasComfirm_phone:false,
      },
  
      // 编写信息记录函数
      usernameInput:function(e) {
        this.data.usernameInput = e.detail.value
      },
  
      IDnumberInput:function(e) {
        this.data.IDnumberInput = e.detail.value
      },
  
      phonenumberInput:function(e) {
        this.data.phonenumberInput = e.detail.value
      },
  
      emailInput:function(e) {
        this.data.emailInput = e.detail.value
      },

      infoConfirm:function(e) {
        // 正则匹配
        // 姓名匹配
        var name_reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/;
        // 身份证号匹配
        var ID_reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
        // 手机号匹配
        var phone_reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        // 电子邮箱匹配
        var email_reg = /^(\w+([-.][A-Za-z0-9]+)*){3,18}@\w+([-.][A-Za-z0-9]+)*\.\w+([-.][A-Za-z0-9]+)*$/
  
        var that = this;
  
        // 姓名输入格式正确，本地缓存
        if (name_reg.test(that.data.usernameInput) && !this.data.hasComfirm_user) {
          that.setData({
            usernameInput:that.data.usernameInput,
            hasComfirm_user:true
          });
        //   wx.setStorage({
        //     key:'comfirmInfo',
        //     data:{
        //       usernameInput:that.data.usernameInput
        //     },
        //     success(res){
        //       console.log("缓存成功",res)
        //     }
        //   })
        }
        else if (that.data.usernameInput == '') {
          wx.showModal({
          title: '提示!',
          content: '请输入姓名',
          showCancel:false,
          success (res) {
            that.setData({
              usernameInput: "",
              hasComfirm:false
            });
            // wx.setStorage({
            //   key:'comfirmInfo',
            //   data:{
            //     usernameInput:""
            //   },
            //   success(res){
            //     console.log("无效缓存",res)
            //   }
            // })
          }
        })
        }
        else if (!name_reg.test(that.data.usernameInput)) {
          wx.showModal({
            title: '提示!',
            content: '姓名不符合格式，请输入正确姓名',
            showCancel:false,
            success (res) {}
        })
      }
      // 身份证号输入格式正确，本地缓存
      else if (ID_reg.test(that.data.IDnumberInput) && !this.data.hasComfirm_ID) {
        ID_flag--;
        that.setData({
          IDnumberInput:that.data.IDnumberInput,
          hasComfirm_ID:true
        });
        // wx.setStorage({
        //   key:'comfirmInfo',
        //   data:{
        //     IDnumberInput:that.data.IDnumberInput
        //   },
        //   success(res){
        //     console.log("缓存成功",res)
        //   }
        // })
      }
        else if (that.data.IDnumberInput == '') {
          wx.showModal({
            title: '提示!',
            content: '请输入身份证号',
            showCancel:false,
            success (res) {
              that.setData({
                IDnumberInput: ""
              });
            //   wx.setStorage({
            //     key:'comfirmInfo',
            //     data:{
            //       IDnumberInput:"",
            //     },
            //     success(res){
            //       console.log("无效缓存",res)
            //     }
            //   })
            }
          })
        }
        else if (!ID_reg.test(that.data.IDnumberInput)) {
          wx.showModal({
            title: '提示!',
            content: '身份证号码错误，请输入正确身份证号',
            showCancel:false,
            success (res) {}
        })
      }
      // 手机号输入格式正确，本地缓存
      else if (phone_reg.test(that.data.phonenumberInput) && !this.data.hasComfirm_phone) {
        that.setData({
          phonenumberInput:that.data.phonenumberInput,
          hasComfirm_phone:true
        });
        wx.setStorage({
          key:'comfirmInfo',
          data:{
            phonenumberInput:that.data.phonenumberInput
          },
          success(res){
            console.log("缓存成功",res)
          }
        })
      }
        else if (that.data.phonenumberInput == '') {
          wx.showModal({
            title: '提示!',
            content: '请输入手机号',
            showCancel:false,
            success (res) {
                  console.log("无效缓存",res)
            }
          })
        }
        else if (!phone_reg.test(that.data.phonenumberInput)) {
          wx.showModal({
            title: '提示!',
            content: '手机号错误，请输入正确的手机号',
            showCancel:false,
            success (res) {}
          })
        }
        else {
            this.updateRealName();


            
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

            wx.showModal({
                title: '提示!',
                content: '您已完成实名认证',
                showCancel:false,
                success (res) {
                  wx.navigateBack({
                delta: 8,
              })
                }
              })
              
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
    onLoad: async function (options) {
        const res = await this.getRealName();
        console.log("res11111", res);
        this.setData({
            usernameInput: res.username,
            IDnumberInput: res.idnumber,
            phonenumberInput: res.telenumber,
            hasComfirm_user: true,
            hasComfirm_ID: true,
            hasComfirm_phone: true
        })
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