// custom-tab-bar/indext.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        current: '/pages/index/index', // 是否被选择中
        list: [
            {
                icon: 'md-home',
                text: '首页',
                key: '/pages/index/index'
            },
            {
                icon: 'ios-list-box',
                text: '土地',
                key: '/pages/land/index'
            },
            {
                icon: 'ios-map',
                text: '需求',
                key: '/pages/require/index'
            },
            {
                icon: 'ios-information-circle',
                text: '资讯',
                key: '/pages/information/index',
            },
            {
                icon: 'ios-person',
                text: '我的',
                key: '/pages/my/index'
            }
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onChange(event) {
			wx.switchTab({
                url: event.detail.key
            });
		},

		init() {
            const page = getCurrentPages().pop();
			this.setData({
                current: '/'+page.route //当前页面路径
            });
		}
    }
})
