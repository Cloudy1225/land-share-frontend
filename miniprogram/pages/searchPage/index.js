// pages/searchPage/index.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchText: '',
        hotSearchArr: ['南京', '耕地'],
        searchHistoryArr: [],

        right: [
        {
            text: '删除',
            style: 'background-color: #F4333C; color: white'
        }]
        
    },

    // 用户输入搜索内容
    changeSearch(e){
        console.log("222", e.detail.value)
        this.setData({
            searchText: e.detail.value,
        })
    },

    // 添加搜索历史
    addSearchHistory(searchText){
        let searchHistoryArr = this.data.searchHistoryArr;
        
        const i = searchHistoryArr.indexOf(searchText)
        if(i >= 0){ // 若已存在
            searchHistoryArr.splice(i, 1) // 先删
        }
        searchHistoryArr.unshift(searchText) // 再加
        this.setData({
            searchHistoryArr: searchHistoryArr
        })
        wx.setStorage({
            key: "searchHistoryArr",
            data: searchHistoryArr,
            success() {
                console.log("缓存成功")
            }
        })
    },

    // 跳转搜索结果页面，并传值用户输入
    toSearchLands1() {
        this.addSearchHistory(this.data.searchText)
        // const that = this
        wx.navigateTo({
          url: '../searchLands/index?searchText=' + this.data.searchText,
        //   success() {
        //     setTimeout(
        //         that.addSearchHistory(that.data.searchText),3000);
        //   }
        })
    },

    // 跳转搜索结果页面，并传值用户搜索历史
    toSearchLands2(e) {
        const i = e.currentTarget.dataset.i
        const searchText = this.data.searchHistoryArr[i]
        this.addSearchHistory(searchText)
        wx.navigateTo({
          url: '../searchLands/index?searchText=' + searchText
        })
    },

    // 热搜
    toSearchLands3(e) {
        const i = e.currentTarget.dataset.i
        const searchText = this.data.hotSearchArr[i]
        this.addSearchHistory(searchText)
        wx.navigateTo({
          url: '../searchLands/index?searchText=' + searchText
        })
    },

    // 清除全部搜索历史
    clearHistories() {
        const that = this
        wx.showModal({
            title: '确认清除全部搜索历史？',
            confirmColor: "#808080",
            success: function(res){
                if(res.confirm){
                    wx.setStorage({
                        key: "searchHistoryArr",
                        data: [],
                        success() {
                            console.log("清除成功")
                            that.setData({
                                searchHistoryArr: []
                            })
                        }
                    })
                }
            }
        });
    },

    // 删除指定搜索历史
    deleteThisHistory(e) {
        const that = this
        const i = e.detail.data;
        let histories = this.data.searchHistoryArr;
        histories.splice(i, 1)
        // 更新缓存
        wx.setStorage({
            key: "searchHistoryArr",
            data: histories,
            success() {
                // 更新页面变量
                that.setData({
                    searchHistoryArr: histories
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const that = this
        wx.getStorage({
            key: "searchHistoryArr",
            success(res){
                console.log("获取缓存",res.data)
                that.setData({
                    searchHistoryArr: res.data
                })
            }
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