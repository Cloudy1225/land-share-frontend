// app.js
import * as SDK from './static/SDK'
App({
  // 全局变量
  globalData: {
    openid: '',
    nickName: '',
    avatarUrl: '../../images/unLoginAvatar.png',
    telenumber: '',
    role: '0' // 用户角色，初始值为0，后面改为1或2
  },  
  async onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'prod-9grx0olg9c8cf232',
        traceUser: true,
      });
    }
    
    this.setUserInfo(); // 获取缓存中的用户信息

    const res = await this.callContainer({
        path: '/conversation/getMyOpenid'
    })
    this.globalData.openid = res.result;

    wx.$Kit = SDK.create(this.globalData.openid, 'land-share-test');
    wx.$KitEvent = SDK.EVENT;
    wx.$KitTypes = SDK.MessageType;
    // console.log(wx.$Kit)
  },

  // 从本地缓存获取用户信息，并设置
  setUserInfo(){
    wx.getStorage({//异步获取缓存
      key: 'userInfo',
      success:(res)=>{ 
        console.log('获取缓存成功', res.data);   
        this.globalData.nickName = res.data.nickName,
        this.globalData.avatarUrl = res.data.avatarUrl,
        this.globalData.telenumber = res.data.telenumber,
        this.globalData.role = res.data.role
      },
      fail:(err)=>{
        console.log('获取缓存失败', err)
      }
    })
  },

  /**
   * 封装的微信云托管调用方法
   * @param {*} obj 业务请求信息，可按照需要扩展
   * @param {*} number 请求等待，默认不用传，用于初始化等待
   */
  async callContainer(obj, number=0){
    try{
      const result = await wx.cloud.callContainer({
        path: obj.path, // 填入业务自定义路径和参数，根目录，就是 / 
        method: obj.method||'GET', // 按照自己的业务开发，选择对应的方法
        // dataType:'text', // 如果返回的不是json格式，需要添加此项
        header: {
          'X-WX-SERVICE': 'land-share-test' // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          // 其他header参数
        },
        data: obj.data
        // 其余参数同 wx.request
      })
      console.log(`微信云托管调用结果${result.errMsg} | callid:${result.callID}`)
      console.log(result.data)
      return result.data // 业务数据在data中
    } catch(e){
      const error = e.toString()
       // 如果错误信息为未初始化，则等待300ms再次尝试，因为init过程是异步的
      if(error.indexOf("Cloud API isn't enabled")!=-1 && number<3){
        return new Promise((resolve)=>{
          setTimeout(function(){
            resolve(that.call(obj,number+1))
          },300)
        })
      } else {
        throw new Error(`微信云托管调用失败${error}`)
      }
    }
  },

  // 引入`towxml3.0`解析方法
  towxml: require('/towxml/index')
})