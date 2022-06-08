// pages/landPage.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:{},
        landDetail: {},
        title:"A650峰峰故居转让",
        cells: [],
        tags:[{tag:"最新",_id:"1"},{tag:"水田",_id:"5"},{tag:"峰峰",_id:"8"}],
        tagColor:[],
        collect:false,
        daysago:'',
        description:"在这个多姿多彩的世界中，有许多值得敬佩的人，但是，我最敬佩的人还是我们班的班主任张老师。我们班张老师是一位对同学们都非常温柔的男老师，他de地理、历史、数学、语文样样精通。但在其中最好的还是数学，老师用教了十年书得来的知识给我们总结了我们书上没有的结论与方法，是我们的数学成绩也比以前好了。他也非常重视我们上课的认真听讲习惯。",
        items:[
            "../../images/fengshouse.png"]  

            ,
        markers:{},

    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const data = '{"lid":42,"landType":"耕地/荒地","transferType":"合作","area":123,"transferTime":2,"price":23,"address":"江苏省南京市玄武区北京东路41号","longtitude":118.79647,"latitude":32.05838,"adInfo":"江苏省南京市玄武区","description":"12","pictureFileID":"cloud://prod-9grx0olg9c8cf232.7072-prod-9grx0olg9c8cf232-1311076540/landPost/land/0Utzl46PXoJS48904236c7ef3ef249786aa2b23bdb2a.png|cloud://prod-9grx0olg9c8cf232.7072-prod-9grx0olg9c8cf232-1311076540/landPost/land/bOr4Rz7Bkk4ae7f34db74e7f75b44f4e7dbab48ff8dd.png","videoFileID":null,"telenumber":"18355442634","status":0,"openid":"ob7d15cPOmz6_y8WAViPMAslKS4g","submitTime":"2022-05-11 23:22:51","title":"江苏省南京市玄武区123亩耕地荒地合作","defaultPicture":"cloud://prod-9grx0olg9c8cf232.7072-prod-9grx0olg9c8cf232-1311076540/landPost/land/0Utzl46PXoJS48904236c7ef3ef249786aa2b23bdb2a.png","district": "江苏省/南京市/玄武区/"}'
    
        // console.log('lsjuhsjfjd', JSON.parse(options.landDetail))
        const landDetail = JSON.parse(options.landDetail)
        //JSON.parse(data)
       // console.log("11111", landDetail)
        this.setData({
            landDetail: JSON.parse(options.landDetail)
        })
        var date1 = new Date().getDate()
        var wodao = new Date(landDetail.submitTime)
        const a = wodao.getDate()- date1
       var that=this
       if(a==0){
       that.setData({
           daysago: "今天"
       })}
       else{
        that.setData({
            daysago: a+"天前"
        })
       }
       var that=this
       var cells = [[]]
       cells[0].push({title:'土地类型', text:that.data.landDetail.landType, access: false, fn: ''})
       cells[0].push({title:'地址', text:that.data.landDetail.address , access: false, fn: ''})
       cells[0].push({title:'土地面积（亩）', text:that.data.landDetail.area , access: false, fn: ''})
       cells[0].push({title:'转让方式', text:that.data.landDetail.transferType, access: false, fn: ''})
       cells[0].push({title:'流转年限', text:that.data.landDetail.transferTime, access: false, fn: ''})
       cells[0].push({title:'联系方式', text:that.data.landDetail.telenumber, access: false, fn: ''})
       cells[0].push({title:'价格(亩/年/元)', text:that.data.landDetail.price, access: false, fn: ''})
       
       //cell 用于把数据展示到列表中，
       //
       that.setData({
        tags:[{tag:"最新",_id:"1"},{tag:that.data.landDetail.landType,_id:"5"},{tag:that.data.landDetail.transferType,_id:"8"}],
        cells: cells,
        description:landDetail.description
      })
      var maker={
        longitude:landDetail.longtitude,
        latitude:landDetail.latitude,
        iconPath:'../../images/maker.png'
    }
    this.setData({
        markers:{maker}
    })
            const res= await this.iscollected();
          const pictureurls=landDetail.pictureFileID;
          var pictures=pictureurls.split("|");
          if(pictureurls!=""){
            that.setData(
                {   
                    items:pictures,
                    

                }
            )}
 //           console.log("sdasd",pictures)
          const isCollected = res

                 that.setData(
              {

                  collect: isCollected
              }
          )
          //console.log("111",this.data.collect)

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    chatwith(e){
        let newlist = this.data.list
        console.log(this.data)
        const index = e.currentTarget.dataset.index
        console.log(e.currentTarget.dataset)
        this.setData({
          list: newlist
        })
        wx.navigateTo({
            url: '../message/message?name=' + e.currentTarget.dataset.name + "&id=" + e.currentTarget.dataset.id
          })
    }

    ,
    async collect(){
        if(this.data.collect){
            const isSuccess = await this.delcollection()
            if(isSuccess){
                this.setData({
                    collect: false
                })
                wx.showToast({
                    title: '取消收藏',
                })
            }
        }else{
            const lid = this.data.landDetail.lid;
            var src = '/collection/addMyCollection?lid='+lid;
            const res = await app.callContainer({
                path: src,
                method: 'GET'
            })
            if(res.code=="00000"){
                this.setData({
                    collect: true
                })
                wx.showToast({
                    title: '收藏成功',
                })

            }
            else{
                wx.showToast({
                    title: '收藏失败',
                    image: '../../images/wrong.png'
                })

            }
        }
    },
    async iscollected() {
        const lid = this.data.landDetail.lid;
        var src = '/collection/isCollected?lid='+lid;
        const res = await app.callContainer({
          path: src,
          method: 'GET'
        });
        return res.result;
      },
      async delcollection(){
        const lid = this.data.landDetail.lid;
        var src = 'collection/addMyCollection?lid='+lid;
        const res = await app.callContainer({
            path: src,
            method: 'GET'
          });
          if(res.code=="00000"){
              return true;
          }
          return  false;
      }
      ,
    phoneCall(){
        wx.makePhoneCall({
          phoneNumber: this.data.landDetail.telenumber,
          success: (res) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
    },

    routePlan(){
        const that =this
        let plugin = requirePlugin('routePlan');
        let key = 'FL6BZ-ON76U-ELXV4-27XN6-GN72E-XAB4R';  //使用在腾讯位置服务申请的key
        let referer = '闲置土地信息共享';   //调用插件的app的名称
        let endPoint = JSON.stringify({  //终点
            'latitude': that.data.landDetail.latitude,
            'longitude':that.data.landDetail.longtitude,
            'name':'目的土地'
        });
        wx.navigateTo({
            url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
        });
    }
    ,
    gps(){
        const key = 'FL6BZ-ON76U-ELXV4-27XN6-GN72E-XAB4R'; //使用在腾讯位置服务申请的key
        const referer = '闲置土地信息共享'; //调用插件的app的名称
        wx.navigateTo({
          url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
          ,
        
        });
    },


    async chat() {
        if(app.globalData.role == '0') {
            this.showLoginModal;
        }else if( app.globalData.role == '1') {
            this.showRealNameModal;
        }else {
            const openid = this.data.landDetail.openid;
            wx.$Kit.getUserProfile(openid).then(function(res) {
                const nickName = res.data.nickName
                wx.$Kit.createConversation(openid).then(function(res) {
                    console.log("建立会话成功",res);
                    const conversationID = res.data.conversationID;
                    const conversationInfomation = {
                        conversationID: conversationID,
                        nickName: nickName,
                        unreadCount: 0 // 这里是个bug，不一定是0
                    }
                    const url = `../chatPage/index?conversationInfomation=${JSON.stringify(conversationInfomation)}`;
                    wx.navigateTo({
                        url,
                    });
                })
            })
        }

    },

    // 弹出 登录 提示框
    showLoginModal() {
        // if(app.globalData.role == '0'){
            const thisPage = getCurrentPages().pop()
            wx.showModal({
                title: '还未登录',
                content: '登录后更精彩',
                confirmText: '去登录',
                cancelColor: "#5c5d5e",
                confirmColor: "#387ef5",
                success: function(res){
                    if(res.confirm){
                        wx.redirectTo({
                          url: '../my/index',
                        })
                    }
                }
            });
        //   }
    },

    // 弹出 实名 提示框
    showRealNameModal() {
        // if(app.globalData.role == '1'){
            wx.showModal({
                title: '尚未实名',
                content: '实名后便可私聊',
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