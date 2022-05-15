// pages/landPost/index.js
const chooseLocation = requirePlugin('chooseLocation'); // 地图选点插件
const isTel = (value) => !/^1[34578]\d{9}$/.test(value); // 判断是否为手机号码
const app = getApp();
import { $wuxToptips } from '../../wuxui-lib/index' // 顶部提示

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isSubmitted: false, // 是否提交了
        landType: '',
        landTypeCode: [], // ["00", "05"]
        visible: false,
        landTypes: [
            {
                value: '00',
                label: '耕地',
                children:[
                    {
                        value: '01',
                        label: '水田'
                    },
                    {
                        value: '02',
                        label: '旱地'
                    },
                    {
                        value: '03',
                        label: '荒地'
                    },
                    {
                        value: '04',
                        label: '水浇地'
                    },
                    {
                        value: '05',
                        label: '盐碱地'
                    },{
                        value: '06',
                        label: '其它耕地'
                    }
                ]
            },
            {
                value: '10',
                label: '草地',
                children:[
                    {
                        value: '11',
                        label: '天然牧草地'
                    },
                    {
                        value: '12',
                        label: '人工草地'
                    },
                    {
                        value: '13',
                        label: '其它草地'
                    }
                ]
            }
        ],
        transferType: '',
        transferTypeCode: [], // ["2"]
        transferTypes: [
            {
                value: '0',
                label: '出租'
            },
            {
                value: '1',
                label: '合作'
            },
            {
                value: '2',
                label: '互换'
            },
            {
                value: '3',
                label: '入股'
            },
            {
                value: '4',
                label: '转包'
            },
            {
                value: '5',
                label: '转让'
            }
        ],
        area: '',
        transferTime: '',
        price: '',
        address: '',
        longtitude: '',
        latitude: '',
        province: '',
        city: '',
        district: '',
        description: '',
        landPictures: [],
        landVideo: [],
        landWarrants: [],
        telenumber: '', //onLoad()中初始化
        telenumberError: false,
    },

    onChange(e) {
        console.log('onChange', e)
        const value = e.detail.value;
        switch(e.currentTarget.dataset.index) {
            case "area": {
                this.setData({
                    area: value
                })
                break;
            }
            case "transferTime": {
                this.setData({
                    transferTime: value
                })
                break;
            }
            case "price": {
                this.setData({
                    price: value
                })
                break;
            }
            case "address": {
                this.setData({
                    address: value
                })
                break;
            }
            case "description": {
                this.setData({
                    description: value
                })
                break;
            }
            case "telenumber": {
                this.setData({
                    telenumberError: isTel(value),
                    telenumber: value
                })
                break;
            }
        }
    },

    // onFocus(e) {
    //     this.setData({
    //         telenumberError: isTel(e.detail.value),
    //     })
    //     console.log('onFocus', e)
    // },
    // onBlur(e) {
    //     this.setData({
    //         telenumberError: isTel(e.detail.value),
    //     })
    //     console.log('onBlur', e)
    // },

    onError() {
        wx.showModal({
            title: '警告',
            content: '请输入正确的手机号',
            showCancel: !1,
            confirmColor: "#387ef5"
        })
    },

    // 打开土地类型级联选择器
    openLandTypes() {
        this.setData({ visible: true })
    },
    closeLandTypes() {
        this.setData({ visible: false })
    },
    changeLandType(e) {
        this.setData({ 
            landType: e.detail.options.map((n) => n.label).join('/'),
            landTypeCode: e.detail.value
         })
        console.log('changeLandType', e.detail)
    },

    // 确认流转方式
    confirmTransferType(e) {
        console.log('confirmTransferType', e);
        this.setData({
            transferType: e.detail.label,
            transferTypeCode: e.detail.value
        })
        // console.log(e.detail)
    },

    
    // 使用定位插件
    usePlugin() {
        const key = 'FL6BZ-ON76U-ELXV4-27XN6-GN72E-XAB4R'; //使用在腾讯位置服务申请的key
        const referer = '闲置土地信息共享'; //调用插件的app的名称
        wx.navigateTo({
          url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
        });
    },

    // 土地图片
    changeLandPictures(e) {
        console.log('changeLandPictures', e)
        const { file, fileList } = e.detail
        console.log("fileList", fileList)
        if (file.status === 'uploading') {
            wx.showLoading({
                title: '上传中'
            }); // 显示 loading 提示框
        }else{
            console.log("完成",fileList)
        }
        this.setData({ 
            landPictures: fileList 
        })
    },

    // 土地视频
    changeLandVideo(e) {
        console.log('changeLandVideo', e)
        const { file, fileList } = e.detail
        console.log("fileList", fileList)
        if (file.status === 'uploading') {
            wx.showLoading({
                title: '上传中'
            }); // 显示 loading 提示框
        }else{
            console.log("完成",fileList)
        }
        this.setData({ 
            landVideo: fileList 
        })
    },

    // 土地权证
    changeLandWarrants(e) {
        console.log('changeLandWarrants', e)
        const { file, fileList } = e.detail
        console.log("fileList", fileList)
        if (file.status === 'uploading') {
            wx.showLoading({
                title: '上传中'
            }); // 显示 loading 提示框
        }else{
            console.log("完成",fileList)
        }
        this.setData({ 
            landWarrants: fileList 
        })
    },

    onSuccess(e) {
        console.log('onSuccess上传成功', e)
    },
    onFail(e) {
        console.log('onFail上传失败', e)
    },
    onComplete(e) {
        console.log('onComplete上传完成', e)
        wx.hideLoading() // 关闭 loading 提示框
    },

    // 预览图片
    previewImage(e) {
        console.log('onPreview', e)
        const { file, fileList } = e.detail
        wx.previewImage({
            current: file.url,
            urls: fileList.map((n) => n.url),
        })
    },

    // 预览视频
    previewVideo(e) {
        console.log('previewVideo', e)
        const file = e.detail.file
        const url = file.url
        const src = [{
            url: url,
            type: 'video'
        }]
        wx.previewMedia({
            sources: src
        })
    },

    // 删除云托管中的文件
    deleteFile(e) {
        console.log('deleteFile', e)
        const thisFile = e.detail.file
        wx.cloud.deleteFile({
            fileList: [thisFile.res.fileID], // 文件唯一标识符 cloudID, 可通过上传文件接口获取
            success: console.log,
            fail: console.error
        })
    },

    test() {
        console.log(this.data.landTypeCode)
        console.log(this.data.landType)
        console.log(this.data.transferTypeCode)
        console.log("transferTypr", this.data.transferType)
        console.log("landWarrants", this.data.landWarrants)
        console.log("area", this.data.area)
        console.log("transferTime", this.data.transferTime)
        console.log("price", this.data.price)
        console.log("address", this.data.address)
        console.log("description", this.data.description)
        
    },

    // 土地信息是否完整
    isCompleted(){
        if(this.data.landType!='' && this.data.transferType!=''
        && this.data.area!='' && this.data.transferTime!=''
        && this.data.price!='' && this.data.address!='' && this.data.landWarrants.length!=0
        && !this.data.telenumberError){
            console.log('信息已填写完整');
            return true;
        }else{ // 弹出警告
            $wuxToptips().warn({
                hidden: false,
                text: '请将 * 项填写完整',
                duration: 2500,
                success() {},
            })
            return false;
        }
    },
    
    // 提交土地信息
    submit(){
        const that = this;
        if(that.isCompleted()){
            wx.showModal({
                title: '确认提交？',
                content: '确保信息真实完整后再点击确定提交',
                confirmColor: "#387ef5",
                success: function(res){
                    if(res.confirm){
                        that.post(); // 调起后端
                    }
                }
            });
        }
    },

    // 调起后端
    async post() {
        wx.showLoading({
            title: '上传中'
        }); // 显示 loading 提示框
        let landPicturesFileIDs = this.data.landPictures.map(x => {return x.res.fileID}).join('|');
        let landVideoFileID = this.data.landVideo.map(x => {return x.res.fileID}).pop();
        let landWarrantsFileIDs = this.data.landWarrants.map(x => {return x.res.fileID}).join('|');
        let adInfo = this.data.province+'/'+this.data.city+'/'+this.data.district;
        const res = await app.callContainer({
            path: 'landPost/createLandPost',
            method: 'POST',
            data: {
                landType: this.data.landType,
                transferType: this.data.transferType,
                area: this.data.area,
                transferTime: this.data.transferTime,
                price: this.data.price,
                address: this.data.address,
                longtitude: this.data.longtitude,
                latitude: this.data.latitude,
                adInfo: adInfo,
                description: this.data.description,
                pictureFileID: landPicturesFileIDs,
                videoFileID: landVideoFileID,
                warrantsFileID: landWarrantsFileIDs,
                telenumber: this.data.telenumber
            }
        });
        wx.hideLoading();
        if(res.code=="00000"){ //云托管成功返回

            this.setData({
                isSubmitted: true
            })

            $wuxToptips().success({
                hidden: false,
                text: '上传成功，待审核',
                duration: 1500,
                success() {
                  setTimeout(function(){
                    wx.navigateBack({})},1000);
                },
            })
        }else{
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '云托管启动中',
                confirmColor: "#387ef5"
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 初始化默认电话号码
        this.setData({
            telenumber: app.globalData.telenumber
        })
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
        // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
        const rawAddress = this.data.address
        this.setData({
            address: ''
        })
        try{
            const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
            
            console.log("111",location)
            this.setData({
                address: location.address,
                longtitude: location.longitude,
                latitude: location.latitude,
                province: location.province,
                city: location.city,
                district: location.district
            })
            console.log("获取地址成功：", this.data.address)
            // console.log("long", this.data.longitude)
            // console.log("la", this.data.latitude)
        }catch(e){
            console.log("尚未定位")
            this.setData({
                address: rawAddress
            })
        }
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
        // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
        chooseLocation.setLocation(null);

        if(!this.data.isSubmitted){
            // 页面卸载时从云托管中删除已上传文件
            let landPicturesFileIDs = this.data.landPictures.map(x => {return x.res.fileID});
            let landVideoFileID = this.data.landVideo.map(x => {return x.res.fileID});
            let landWarrantsFileIDs = this.data.landWarrants.map(x => {return x.res.fileID});
            const files = landPicturesFileIDs.concat(landVideoFileID, landWarrantsFileIDs);
            console.log(files)
            wx.cloud.deleteFile({
                fileList: files, // 文件唯一标识符 cloudID, 可通过上传文件接口获取
                success: console.log,
                fail: console.error
            })
        }
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})