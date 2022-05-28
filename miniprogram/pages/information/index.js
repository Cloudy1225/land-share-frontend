// pages/information/index.js
const app = getApp();
Date.prototype.Format = function (fmt) { // author: meizz
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
        current: 'all',
        tabs: [
            {
        		key: 'all',
        		title: '全部',
        		content: 'Content of tab 0',
        	},
        	{
        		key: 'news',
        		title: '土地政策',
        		content: 'Content of tab 1',
        	},
        	{
        		key: 'policy',
        		title: '土地新闻',
        		content: 'Content of tab 2',
        	},
        	{
        		key: 'question',
        		title: '土地问答',
        		content: 'Content of tab 3',
            },
            {
        		key: 'reference',
        		title: '参考案例',
        		content: 'Content of tab 4',
        	}
        ],
        submitTime: new Date().Format("yyyy-MM-dd HH:mm:ss"),
        articleDetails: []
    },

    //改变tab
    onChange(e) {
        console.log('onChange',e)
        this.setData({
            current: e.detail.key,
            submitTime: new Date().Format("yyyy-MM-dd HH:mm:ss")
        })
        this.refreshArticles()
    },

    //发出请求。获取文章
    async getAticles(){
        var time = this.data.submitTime
        time = time.substr(0,10)
        console.log(time)
        var type = this.data.current
        if(type == 'all')
            var currentPath = '?time='+time
        else
            var currentPath = '?time='+time+'&type='+type
        currentPath = 'article/getArticles' + currentPath
        console.log(currentPath)
        console.log(this.data.current)
        const res = await app.callContainer({
            path: currentPath,
            method: 'GET'
        })
        console.log('res',res)
        return this.parseRes(res)
    },
    //解析响应结果
    parseRes(res){
        var newArticleDetails = res.result
        console.log(this.res)
        const len = newArticleDetails.length
        if(len == 0){
            console.log('没有更多了')
            wx.showToast({
                title: '没有更多了',
                icon: 'none',
                duration: 2000
            })
        }
        if(len > 0){
            const newTime = newArticleDetails[len-1].time
            if (this.data.submitTime > newTime){
                this.setData({
                    submitTime: newTime
                })
            }
        }
        for(var i=0;i < len;i++){
            if(newArticleDetails[i].type == 'news'){
                newArticleDetails[i].type = '土地新闻'
            }   
            if(newArticleDetails[i].type == 'policy'){
                newArticleDetails[i].type = '土地政策'
            }
            if(newArticleDetails[i].type == 'question'){
                newArticleDetails[i].type = '土地问答'
            }
            if(newArticleDetails[i].type == 'reference'){
                newArticleDetails[i].type = '参考案例'
            }
        }
        return newArticleDetails

    },

    // 根据筛选条件刷新文章列表
    async refreshArticles(){
        // 刷新要更新时间
        // this.setData({
        //     submitTime: new Date().Format("yyyy-MM-dd HH:mm:ss")
        // })
        const newArticleDetails = await this.getAticles()

        this.setData({
            articleDetails: newArticleDetails
        })
        console.log("after refreshArticles", this.data.articleDetails)
    },

    //往文章列表添加文章
    async addArticle(){
        // 刷新要更新时间
        // this.setData({
        //     submitTime: new Date().Format("yyyy-MM-dd HH:mm:ss")
        // })
        const newArticleDetails = await this.getAticles();
        var ArticleDetails = this.data.articleDetails
        ArticleDetails.push.apply(ArticleDetails, newArticleDetails)
        this.setData({
            articleDetails: ArticleDetails
        })
        console.log("after refreshArticles", this.data.ArticleDetails)
    },
    

    //跳转到文章界面
    toArticle(e){
        console.log(e)
        // let articleUrl = '';
        // if(e.currentTarget.dataset.index == 1){
        //     articleUrl = 'https://7072-prod-9grx0olg9c8cf232-1311076540.tcb.qcloud.la/articles/news/news1.md?sign=25393c431fbd2419159508a25d95c5e4&t=1651909381';
        // }else{
        //     articleUrl = 'https://7072-prod-9grx0olg9c8cf232-1311076540.tcb.qcloud.la/articles/questions/question1.md?sign=b0b36edbacbb9dce46b0f04a521e5e61&t=1651912459';
        // }
        const i = e.currentTarget.dataset.index;
        const articleUrl = this.data.articleDetails[i].url
        wx.navigateTo({
          url: '../article/index?articleUrl='+articleUrl,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.refreshArticles()
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
        this.addArticle() //上拉触底加载更多文章
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})