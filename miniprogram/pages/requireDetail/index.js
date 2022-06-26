// pages/landPage.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        
        list:{},
        landDetail: {},
        title:"",
        cells: [],
        tags:[{tag:"最新",_id:"1"},{tag:"水田",_id:"5"}],
        tagColor:[],
        daysago: 0,
        collect:false,
        description:"该用户很懒，没有进行描述",
        items:[]  

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
        if(landDetail.description==""){
            that.setData({
                description:"该用户很懒，没有进行描述"
            })
        }
            
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