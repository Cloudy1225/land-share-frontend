// pages/chatPage/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        conversationName: '',
        conversation: {},
        messageList: [],
        showImage: false,
        showChat: true,
        conversationID: '',
        unreadCount: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const payloadData = JSON.parse(options.conversationInfomation);
        wx.setNavigationBarTitle({ title: payloadData.nickName })  
        const unreadCount = payloadData.unreadCount ? payloadData.unreadCount : 0;
        this.setData({
            conversationID: payloadData.conversationID,
            unreadCount
        });
        wx.$Kit.findConversation(this.data.conversationID).then((res) => {
          const conversation = res.data;
          this.setData({
            conversationName: this.getConversationName(conversation),
            conversation: conversation
          });
          wx.$Kit.setMessageRead(this.data.conversationID, conversation.userProfile.openid).then(() => {
            console.log("设置消息已读");
        });
        });
    },

    // 获取会话名
    getConversationName(conversation) {
        return conversation.userProfile.nickName || conversation.userProfile.openid;
    },

    sendMessage(event) {
        // 将自己发送的消息写进消息列表里面
        this.selectComponent('#message-list').updateMessageList(event.detail.message);
    },
    showMessageErrorImage(event) {
        this.selectComponent('#message-list').sendMessageError(event);
    },
    triggerClose() {
        this.selectComponent('#message-input').handleClose();
    },
    resendMessage(event) {
        this.selectComponent('#message-input').onInputValueChange(event);
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
        wx.$Kit.setMessageRead(this.data.conversationID, this.data.conversation.userProfile.openid).then(() => {
            console.log("设置消息已读");
        });
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