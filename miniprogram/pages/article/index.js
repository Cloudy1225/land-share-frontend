// pages/article/index.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoading: true,					// 判断是否尚在加载中
		article: {}						// 内容数据
    },

    getText: (url, callback) => {
		wx.request({
			url: url,
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (typeof callback === 'function') {
					callback(res);
				};
			}
		});
	},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const url = options.articleUrl;
        this.getText(url, res=>{
            let result = app.towxml(res.data,'markdown',{
                // base:'https://xxx.com',				// 相对资源的base路径
                // theme:'dark',					// 主题，默认`light`
                // events:{					// 为元素绑定的事件方法
                //     tap:(e)=>{
                //         console.log('tap',e);
                //     }
                // }
            });
            
            // 更新解析数据
            this.setData({
                article:result,
                isLoading: false
            });

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