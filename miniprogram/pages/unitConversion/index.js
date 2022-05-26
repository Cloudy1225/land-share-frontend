// pages/unitConversion/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        which: true, // true为面积，false为长度

        bits1: ["0"],
        curArea1: '0', // 字符串
        curArea2:  0, // 数字
        curAreaTitle1: "亩",
        curAreaTitle2: "平方米",
        curAreaUnit1: 'mu',
        curAreaUnit2: 'm²',
        areaUnits: [
            {
                title: "亩",
                value: "mu"
            },
            {
                title: "顷",
                value: "qing"
            },
            {
                title: "公亩",
                value: "a"
            },
            {
                title: "公顷",
                value: "ha"
            },
            {
                title: "平方米",
                value: "m²"
            },
            {
                title: "平方千米",
                value: "km²"
            }
        ],

        bits3: ["0"],
        curLength1: '0', // 字符串
        curLength2:  0, // 数字
        curLengthTitle1: "米",
        curLengthTitle2: "尺",
        curLengthUnit1: 'm',
        curLengthUnit2: 'chi',
        lengthUnits: [
            {
                title: "米",
                value: "m"
            },
            {
                title: "里",
                value: "li"
            },
            {
                title: "丈",
                value: "zhang"
            },
            {
                title: "尺",
                value: "chi"
            },
            {
                title: "寸",
                value: "cun"
            },
            {
                title: "千米",
                value: "km"
            }
        ]
    },

    changeWhich() {
        this.setData({
            which: !this.data.which
        })
    },

    confirmAreaUnit(e) {
        console.log(e)
        const index = e.currentTarget.dataset.index;
        let i = e.detail.selectedIndex;
        if(i == ""){ // 组件的bug
            i = 0
        }
        const unit = this.data.areaUnits[i]
        if(index == 0){
            this.setData({
                curAreaTitle1: unit.title,
                curAreaUnit1: unit.value
            })
        }else {
            this.setData({
                curAreaTitle2: unit.title,
                curAreaUnit2: unit.value
            })
        }
        var num1 = this.data.curArea1
        this.setCurArea(num1)
    },

    setCurArea(num1) {
        var num2 = this.convertArea(num1)
        this.setData({
            curArea1: num1,
            curArea2: num2
        })
    },

    convertArea(curArea1) {
        var num1 = parseFloat(curArea1);
        var mu1 = 0;
        switch (this.data.curAreaUnit1) {
            case "mu": {
                mu1 = num1;
                break;
            }
            case "qing": {
                mu1 = num1 * 100;
                break;
            }
            case "a": {
                mu1 = num1 * 0.15;
                break;
            }
            case "ha": {
                mu1 = num1 * 15;
                break;
            }
            case "m²": {
                mu1 = num1 * 0.0015;
                break;
            }
            case "km²": {
                mu1 = num1 * 1500;
                break;
            }
        }
        var mu2 = 0;
        switch (this.data.curAreaUnit2) {
            case "mu": {
                mu2 = mu1;
                break;
            }
            case "qing": {
                mu2 = mu1 * 0.01;
                break;
            }
            case "a": {
                mu2 = mu1 * 20 / 3;
                break;
            }
            case "ha": {
                mu2 = mu1 * 0.2 / 3;
                break;
            }
            case "m²": {
                mu2 = mu1 * 2000 / 3;
                break;
            }
            case "km²": {
                mu2 = mu1 * 0.002 / 3;
                break;
            }
        }
        return Math.round(mu2 * 100000000) / 100000000; // 小数点后保留8位
    },
    
    confirmLengthUnit(e) {
        console.log(e)
        const index = e.currentTarget.dataset.index;
        let i = e.detail.selectedIndex;
        if(i == ""){ // 组件的bug
            i = 0
        }
        const unit = this.data.lengthUnits[i]
        if(index == 0){
            this.setData({
                curLengthTitle1: unit.title,
                curLengthUnit1: unit.value
            })
        }else {
            this.setData({
                curLengthTitle2: unit.title,
                curLengthUnit2: unit.value
            })
        }
        var num1 = this.data.curLength1
        this.setCurLength(num1)
    },

    setCurLength(num1) {
        var num2 = this.convertLength(num1)
        this.setData({
            curLength1: num1,
            curLength2: num2
        })
    },

    convertLength(curLength1) {
        var num1 = parseFloat(curLength1);
        var m1 = 0;
        switch (this.data.curLengthUnit1) {
            case "m": {
                m1 = num1;
                break;
            }
            case "li": {
                m1 = num1 * 500;
                break;
            }
            case "zhang": {
                m1 = num1 * 10 / 3;
                break;
            }
            case "chi": {
                m1 = num1 / 3;
                break;
            }
            case "cun": {
                m1 = num1 / 30;
                break;
            }
            case "km": {
                m1 = num1 * 1000;
                break;
            }
        }
        var m2 = 0;
        switch (this.data.curLengthUnit2) {
            case "m": {
                m2 = m1;
                break;
            }
            case "li": {
                m2 = m1 * 0.002;
                break;
            }
            case "zhang": {
                m2 = m1 * 0.3;
                break;
            }
            case "chi": {
                m2 = m1 * 3;
                break;
            }
            case "cun": {
                m2 = m1 * 30;
                break;
            }
            case "km": {
                m2 = m1 * 0.001;
                break;
            }
        }
        return Math.round(m2 * 100000000) / 100000000; // 小数点后保留8位
    },
    

    onChange(e) {
        console.log("onChange", e)
        const bit = e.currentTarget.dataset.bit;
        if(this.data.which){
            var bits = this.data.bits1
        }else {
            var bits = this.data.bits3
        }
        
        switch (bit) {
            case "0": {
                if(bits[0] == "0" && bits.length == 1){
                }else {
                    bits.push("0")
                }
                break;
            }
            case ".": {
                if(bits[bits.length-1] != "."){
                    bits.push(".")
                }
                break;
            }
            case "x": {
                if(bits.length == 1){
                    bits[0] = '0'
                }else{
                    bits.pop();
                }
                
                break;
            }
            default: {
                if(bits[0] == "0" && bits.length == 1){
                    bits.pop()
                }
                bits.push(bit);
                break;
            }
        }
        var num1 = bits.join("")

        if(this.data.which) {
            this.setCurArea(num1)
        }else {
            this.setCurLength(num1)
        }  
    },

    

   

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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