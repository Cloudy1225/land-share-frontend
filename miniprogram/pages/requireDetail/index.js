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
        daysago: 0,
        collect:false,
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
        
        // console.log('lsjuhsjfjd', JSON.parse(options.landDetail))
        const landDetail = JSON.parse(options.landDetail)
        this.setData({
            landDetail: landDetail
        })
        var date1 = new Date().getDate()
        var wodao = new Date(landDetail.submitTime)
        const a=date1-wodao.getDate()
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
       var cells = [[]]
       cells[0].push({title:'土地类型', text:that.data.landDetail.landType, access: false, fn: ''})
       cells[0].push({title:'地址', text:that.data.landDetail.address , access: false, fn: ''})
       cells[0].push({title:'期望面积（亩）', text:that.data.landDetail.area , access: false, fn: ''})
       cells[0].push({title:'转让方式', text:that.data.landDetail.transferType, access: false, fn: ''})
       cells[0].push({title:'流转年限', text:that.data.landDetail.transferTime, access: false, fn: ''})
       cells[0].push({title:'联系方式', text:that.data.landDetail.telenumber, access: false, fn: ''})
       cells[0].push({title:'期望价格(亩/年/元)', text:that.data.landDetail.price, access: false, fn: ''})
       
       //cell 用于把数据展示到列表中，
       //
       that.setData({
        tags:[{tag:"最新",_id:"1"},{tag:that.data.landDetail.landType,_id:"5"},{tag:that.data.landDetail.transferType,_id:"8"}],
        cells: cells,
        description:landDetail.description,
        
      })
            
          //console.log("111",this.data.collect)

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    }
      ,
    phoneCall(){
        wx.makePhoneCall({
          phoneNumber: this.data.landDetail.telenumber,
          success: (res) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
    }
    ,
    gps(){
        const key = 'FL6BZ-ON76U-ELXV4-27XN6-GN72E-XAB4R'; //使用在腾讯位置服务申请的key
        const referer = '闲置土地信息共享'; //调用插件的app的名称
        wx.navigateTo({
          url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
          ,
        
        });
    }

    /**
     * 生命周期函数--监听页面显示
     */,
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