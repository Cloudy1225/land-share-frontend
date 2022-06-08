// pages/myMessage/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        conversationList: [],
        index: Number,
        unreadCount: 0,
        conversationInfomation: {},
        transChenckID: ''
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 登入后拉去会话列表
        wx.$Kit.on(wx.$KitEvent.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated, this)
        this.getConversationList();
    },

     /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        wx.$Kit.off(wx.$KitEvent.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated);
    },

    // 跳转到子组件需要的参数
    handleRoute(event) {
        const flagIndex = this.data.conversationList.findIndex(item => item.conversationID === event.currentTarget.id);
        this.setData({
            index: flagIndex,
        });
        this.getConversationList();
        this.data.conversationInfomation = { conversationID: event.currentTarget.id,
            nickName: this.data.conversationList[this.data.index].userProfile.nickName,
            unreadCount: this.data.conversationList[this.data.index].unreadCount };
        const url = `../chatPage/index?conversationInfomation=${JSON.stringify(this.data.conversationInfomation)}`;
        wx.navigateTo({
            url,
          });
    },
      
    // 更新会话列表
    onConversationListUpdated(event) {
        this.setData({
            conversationList: event.data,
        })
    },

    // 获取会话列表
    getConversationList() {
        wx.$Kit.getConversationList().then((res) => {
            console.log(res)
            this.setData({
                conversationList: res.data
            })
        })
    },


  transCheckID(event) {
    this.setData({
      transChenckID: event.detail.checkID,
    });
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