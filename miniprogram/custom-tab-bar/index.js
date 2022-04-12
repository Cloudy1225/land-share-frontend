// components/custom-tab-bar/index.js
// 自定义组件底部导航栏
Component({
    /**
     * 组件的属性列表
     */
    // properties: {

    // },

    /**
     * 组件的初始数据
     */
    data: {
        active: 0, // 是否被选择中
        list: [
            {
                icon: 'wap-home',
                text: '首页',
                url: '/pages/index/index'
            },
            {
                icon: 'bars',
                text: '分类',
                url: '/pages/categories/index'
            },
            {
                icon: 'info',
                text: '资讯',
                url: '/pages/information/index',
                info: '99+'
            },
            {
                icon: 'chat',
                text: '消息',
                url: '/pages/message/index',
                info: '99+'
            },
            {
                icon: 'manager',
                text: '我的',
                url: '/pages/my/index'
            }
        ]

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onChange(event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
    }
})
