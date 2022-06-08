import {EventEmitter} from "./EventEmitter.js";

/**
 * 接入侧需要监听处理的事件列表
 */
const EVENT = {
    MESSAGE_RECEIVED: "onMessageReceived",
    MESSAGE_REVOKED: "onMessageRevoked",
    MESSAGE_READ_BY_PEER: "onMessageReadByPeer",
    CONVERSATION_LIST_UPDATED: "onConversationListUpdated"
};

/**
 * 消息类型
 */
const MessageType = {

    /**
     * 文本消息
     */
    MSG_TEXT: 'MSG_TEXT',

    /**
     * 图片消息
     */
    MSG_IMAGE: 'MSG_IMAGE',

    /**
     * 音频消息
     */
    MSG_AUDIO: 'MSG_AUDIO',

    /**
     * 视频消息
     */
    MSG_VIDEO: 'MSG_VIDEO',
}

const SendType = {

    /**
     * ping，用于心跳检测
     */
    PING: 'PING',

    /**
     * close，告知服务端端口连接
     */
    CLOSE: 'CLOSE',

    /**
     * 新建消息
     */
    CREATE_MSG: 'CREATE_MSG',

    /**
     * 删除消息
     */
    DELETE_MSG: 'DELETE_MSG',

    /**
     * 撤回消息
     */
    REVOKE_MSG: 'REVOKE_MSG',

    /**
     * 已读消息
     */
    READ_MSG: 'READ_MSG'
}

const ReceiveType = {

    /**
     * pong，用于心跳检测
     */
    PONG: 'PONG',

    /**
     * 说明socket已关闭
     */
    BYE: 'BYE',

    /**
     * 说明消息发送成功
     */
    MSG_SENDED: 'MSG_SENDED',

    /**
     * 说明有新消息进来了
     */
    MSG_RECEIVED: 'MSG_RECEIVED',

    /**
     * 说明自己消息撤回成功
     */
    MSG_REVOKED: 'MSG_REVOKED',

    /**
     * 说明消息被对方撤回
     */
    MSG_REVOKED_BY_PEER: 'MSG_REVOKED_BY_PEER',
    
    /**
     * 说明消息删除成功
     */
    MSG_DELETED: 'MSG_DELETED',

    /**
     * 说明自己消息设置已读成功
     */
    MSG_READ: 'MSG_READ',

    /**
     * 说明对方已读消息
     */
    MSG_READ_BY_PEER: 'MSG_READ_BY_PEER'
}

/**
 * 用户openid {string}
 */
let OPENID;

/**
 * 服务名称 {string}
 */
let SERVICE

/**
 * 发布/订阅模式的实现
 * @type {EventEmitter}
 */
let emitter = new EventEmitter();


/**
 * 监听事件 {API}
 * @param eventName {EVENT} 事件名称
 * @param handler {function} 处理事件的方法，当事件触发时，会调用此handler进行处理
 * @param context {*} <optional> 期望 handler 执行时的上下文
 */
let on = function (eventName, handler, context) {
    emitter.on(eventName, handler, context)
}

/**
 * 取消监听事件 {API}
 * @param eventName {EVENT} 事件名称
 * @param handler {function} 处理事件的方法，当事件触发时，会调用此handler进行处理
 * @param context {*} <optional> 期望 handler 执行时的上下文
 * @param once {boolean} <optional>  是否只解绑一次
 */
let off = function (eventName, handler, context, once) {
    emitter.removeListener(eventName, handler, context, once);
}

/**
 * WebSocket任务，通过调用微信接口返回 {SocketTask}
 */
let socketTask;

/**
 * 保存成功持久化到数据库且还没告知客户端的消息，用于判断消息是否发送成功，只存放了messageID
 * @type {Set<string>}
 */
// let sendedMsgSet = new Set();
// let revokedMsgSet = new Set();
// let deletedMsgSet = new Set();
// let readCvstSet = new Set();

/**
 * 初始化
 * @param _openid
 * @param _service
 * @return API {object}
 */
let create = function (_openid, _service) {
    OPENID = _openid;
    SERVICE = _service
    connectSocket();
    return API
}

let destroy = function () {
    closeSocket();
}

/**
 * Message构造函数
 * @param options {object}
 * @constructor
 */
function Message(options) {
    /**
     * 客户端时间戳，会变成数据库保存时间
     * @type {number}
     */
    this.time = options.time || Date.now();

    /**
     * 消息ID: '${OPENID}-#{clientTime}'
     * @type {string}
     */
    this.messageID = options.messageID || (OPENID+'-'+this.time);

    /**
     * 消息类型
     * @type {MessageType}
     */
    this.type = options.type;

    /**
     * 消息内容：文字或url
     * @type {string}
     */
    this.payload = options.payload;

    /**
     * 发送者
     */
    this.from = options.from || OPENID;

    /**
     * 接收者
     * @type {string}
     */
    this.to = options.to;

    /**
     * 消息所属的会话ID：'${openid1}+C2C+${openid2}'，openid1 < openid2
     * @type {string}
     */
    this.conversationID = options.conversationID || (this.from < this.to ? `${this.from}C2C${this.to}` : `${this.to}C2C${this.from}`);

    /**
     * 消息流向：true为发送，false为接收
     * @type {boolean}
     */
    this.isOut = (options.isOut == null) ? true : options.isOut;

    /**
     * 消息是否撤回
     * @type {boolean}
     */
    this.isRevoked = (options.isRevoked == null) ? false : options.isRevoked;

    /**
     * 对方是否已读
     * @type {boolean}
     */
    this.isPeerRead = (options.isPeerRead == null) ? false : options.isPeerRead;
}


/**
 * 连接websocket
 */
let connectSocket = function () {
    wx.cloud.connectContainer({
        service: SERVICE,        // 服务名
        path: `/chat/${OPENID}`
    }).then(function (res) {
        socketTask = res.socketTask
        socketTask.onOpen(onSocketOpen);
        socketTask.onClose(onSocketClose);
        socketTask.onMessage(onSocketMessage);
        socketTask.onError(onSocketError);
        wx.onNetworkStatusChange(function (res) { // 网络连接时重连websocket
            if(res.isConnected) {
                reconnect()
            }
        })
        wx.onAppShow(function () {
            if(socketTask.readyState !==  1) { // 小程序切换到前台时
                reconnect();
            }
        })
        wx.onAppHide(function () {
            if(socketTask.readyState === 1) { // 主动关闭，否则上面会重连两次
                closeSocket()
            }
        })
    })
}

/**
 * 1）首先：通过定时发送心跳包的方式检测当前连接是否可用，同时监测网络恢复事件，在恢复后立即发送一次心跳，快速感知当前状态，判断是否需要重连；
 * 2）其次：正常情况下由服务器断开旧连接，与服务器失去联系时直接弃用旧连接，上层模拟断开，来实现快速断开；
 * 3）最后：发起新连接时使用退避算法延迟一段时间再发起连接，同时考虑到资源浪费和重连速度，可以在网络离线时调大重连间隔，在网络正常或网络由offline变为online时缩小重连间隔，使之尽可能快地重连上。
 */



let onSocketOpen = function () {
    heartCheck.reset().start();      //心跳检测重置
    console.log('【WEBSOCKET】连接成功！')
}

let onSocketClose = function (res) {
    closeCheck.clear();
    heartCheck.reset(); // 关闭心跳检测
    if(res.code === 1000) {
        console.log('【WEBSOCKET】链接正常关闭！', res);
    }else {
        console.warn('【WEBSOCKET】链接异常关闭！', res);
        reconnect();
    }
}

let onSocketError = function (res) {
    console.error(`【WEBSOCKET】错误，错误信息：${res.errMsg}`)
    reconnect();
}


let lockReconnect = false;  //避免ws重复连接
//心跳检测
let heartCheck = {
    timeout: 40000,        //40s发一次心跳
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        const self = this;
        this.timeoutObj = setTimeout(function(){
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            const pingData = {
                event: SendType.PING
            }
            socketTask.send({
                data: JSON.stringify(pingData)
            })
            console.log("ping");
            self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                socketTask.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, 20000)
        }, this.timeout)
    }
}

let closeCheck = {
    serverTimeoutObj: null,
    clear: function(){
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        const self = this;
        const closeData = {
            event: SendType.CLOSE
        }
        socketTask.send({
            data: JSON.stringify(closeData)
        })
        self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
            if(socketTask.readyState === 1) { // 如果服务器还未关闭
                socketTask.close({
                    reason: '小程序生命结束，任务完成'
                })
            }   //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        }, 20000)
    }
}

let closeSocket = function () {
    closeCheck.start();
}

let reconnect = function () {
    if(lockReconnect) return;
    lockReconnect = true;
    setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
        connectSocket();
        lockReconnect = false;
    }, 2000);
}

let onSocketMessage = function (res) {
    heartCheck.reset().start();      //拿到任何消息都说明当前连接是正常的，心跳检测重置
    console.log("websocket收到信息：", res.data)
    let response = JSON.parse(res.data);
    switch (response.event) {
        case ReceiveType.BYE: {
            closeCheck.clear();
            if(socketTask.readyState === 1) { // 如果服务器还未关闭
                socketTask.close({
                    reason: '小程序生命结束，任务完成'
                })
            }
            break;
        }
        case ReceiveType.MSG_SENDED: {
            emitCvstListUpdated();
            // if(response.data.isSended) {
            //     sendedMsgSet.add(response.data.messageID);
            // }
            break;
        }
        case ReceiveType.MSG_RECEIVED: {
            const eventName = EVENT.MESSAGE_RECEIVED;
            let event = {
                name: eventName,
                data: response.data
            }
            emitter.emit(eventName, event);
            emitCvstListUpdated();
            break;
        }
        case ReceiveType.MSG_REVOKED: {
            // const eventName = EVENT.MESSAGE_REVOKED;
            // let event = {
            //     name: eventName,
            //     data: response.data.messageID
            // };
            // emitter.emit(eventName, event);
            emitCvstListUpdated();
            // if(response.data.isRevoked) {
            //     revokedMsgSet.add(response.data.messageID)
            // }
            break;
        }
        case ReceiveType.MSG_REVOKED_BY_PEER: {
            const eventName = EVENT.MESSAGE_REVOKED
            let event = {
                name: eventName,
                data: response.data.messageID
            }
            emitter.emit(eventName, event);
            emitCvstListUpdated();
            break;
        }
        case ReceiveType.MSG_DELETED: {
            emitCvstListUpdated();
            // if(response.data.isDeleted) {
            //     deletedMsgSet.add(response.data.messageID);
            // }
            break;
        }
        case ReceiveType.MSG_READ: {
            emitCvstListUpdated();
            // if(response.data.isRead) {
            //     readCvstSet.add(response.data.conversationID);
            // }
            break;
        }case ReceiveType.MSG_READ_BY_PEER: {
            const eventName = EVENT.MESSAGE_READ_BY_PEER;
            let event = {
                name: eventName,
                data: response.data.conversationID
            }
            emitter.emit(eventName, event);
            break;
        }
        // default: {
        //     console.log("pong")
        //     break
        // }
    }
}

/**
 * 封装的微信云托管调用方法
 * @param options {object} 业务请求信息
 * @return {Promise<object|string>}
 */
let callContainer =  function (options) {
    const _path = options.path;
    const _method = options.method || 'GET';
    const _data = options.data;
    return new Promise(function (resolve, reject) {
        wx.cloud.callContainer({
            path: _path, // 填入业务自定义路径和参数，根目录，就是 /
            method: _method, // 按照自己的业务开发，选择对应的方法
            // dataType:'text', // 如果返回的不是json格式，需要添加此项
            header: {
                'X-WX-SERVICE': SERVICE // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
                // 其他header参数
            },
            data: _data
        }).then(function (res) {
            if(res.statusCode === 200){
                console.log(`${_method}请求${_path}成功，响应结果：`, res.data);
                resolve(res.data);
            }else {
                console.error(`${_method}请求${_path}失败，响应结果：`, res.data);
                reject(res.data)
            }
        }).catch(function (err) {
            // console.log(`微信云托管调用失败${err}`)
            // reject(err)
            throw new Error(`微信云托管调用失败${err}`)
        })
    })
}

/**
 * 返回值为Promise时，构造resolve结果
 * @param res
 * @return {{code: string, data: object}}
 */
function buildThen(res) {
    return {
        code: '00000',
        data: res.result
    }
}

/**
 * 返回值为Promise时，构造reject结果
 * @param err
 * @return {{code: (string|number|string|"ERR_ASSERTION"|*), message: *}}
 */
function buildCatch(err) {
    return {
        code: err.code,
        message: err.msg
    }
}

/**
 * 获取个人资料 {API}
 * @return {Promise<object>}
 */
let getMyProfile = function () {
    return new Promise(function (resolve, reject) {
        callContainer({
            path: `/conversation/getUserProfile?openid=${OPENID}`
        }).then(function (res) {
            if(res.code === '00000') {
                resolve(buildThen(res));
            }else {
                reject(buildCatch(res))
            }
        })
    })
}

/**
 * 获取用户资料 {API}
 * @param openid
 * @return {Promise<object>}
 */
let getUserProfile = function (openid) {
    return new Promise(function (resolve, reject) {
        callContainer({
            path: `/conversation/getUserProfile?openid=${openid}`
        }).then(function (res) {
            if(res.code === '00000') {
                resolve(buildThen(res));
            }else {
                reject(buildCatch(res))
            }
        })
    })
}

/**
 * 根据 conversationID 查询会话 {API}
 * @param conversationID
 * @return {Promise<object>}
 */
let findConversation = function (conversationID) {
    return new Promise(function (resolve, reject) {
        callContainer({
            path: `/conversation/findConversation?conversationID=${conversationID}&openid=${OPENID}`
        }).then(function (res){
            if(res.code === '00000') {
                resolve(buildThen(res));
            }else {
                reject(buildCatch(res))
            }
        })
    })
}

/**
 * 获取会话列表的接口 {API}
 * @return {Promise<object>}
 */
let getConversationList = function () {
    return new Promise(function (resolve, reject) {
        callContainer({
            path: `/conversation/getConversationList?openid=${OPENID}`
        }).then(function (res) {
            if(res.code === '00000') {
                resolve(buildThen(res));
            }else {
                reject(buildCatch(res))
            }
        })
    })
}

/**
 * 派发事件EVENT.CONVERSATION_LIST_UPDATED
 */
let emitCvstListUpdated = function () {
    console.log('派发事件EVENT.CONVERSATION_LIST_UPDATED前的获取新列表')
    getConversationList().then(function (res) {
        const eventName = EVENT.CONVERSATION_LIST_UPDATED;
        let event = {
            name: eventName,
            data: res.data
        }
        emitter.emit(eventName, event);
    })
}

/**
 * 置顶或取消置顶会话的接口 {API}
 * @param options
 * @return {Promise<object>}
 */
let pinConversation = function (options) {
    return new Promise(function (resolve, reject) {
        callContainer({
            path: `/conversation/pinConversation?conversationID=${options.conversationID}&isPinned=${options.isPinned}&openid=${OPENID}`
        }).then(function (res) {
            if(res.code === '00000') {
                // 调用接口成功后会话列表重新排序，派发事件EVENT.CONVERSATION_LIST_UPDATED
                emitCvstListUpdated()
                resolve(buildThen({
                    result: options
                }))
            }else {
                reject(buildCatch(res))
            }
        })
    })
}

/**
 * 创建会话 {API}
 * @param toOpenid {string} 会话对方
 * @return {Promise<object>} res.data中为conversationID
 */
let createConversation = function (toOpenid) {
    let openid1, openid2;
    if(OPENID < toOpenid) {
        openid1 = OPENID;
        openid2 = toOpenid;
    }else {
        openid1 = toOpenid;
        openid2 = OPENID;
    }
    const cvstID = openid1+'C2C'+openid2;
    return new Promise(function (resolve, reject) {
        callContainer({
            path: '/conversation/createConversation',
            method: 'POST',
            data: {
                conversationID: cvstID,
                openid1: openid1,
                openid2: openid2
            }
        }).then(function (res) {
            if(res.code === '00000') {
                emitCvstListUpdated()
                resolve(buildThen(res));
            }else {
                reject(buildCatch(res))
            }
        })
    })
}

/**
 * 删除会话，聊天记录啥的都没删 {API}
 * @param conversationID
 * @return {Promise<object>}
 */
let deleteConversation = function (conversationID) {
    return new Promise(function (resolve, reject) {
        callContainer({
            path: `/conversation/deleteConversation?conversationID=${conversationID}&openid=${OPENID}`
        }).then(function (res) {
            if(res.code === '00000') {
                emitCvstListUpdated();
                resolve(buildThen({
                    result: {
                        conversationID: conversationID,
                        isDeleted: true
                    }
                }))
            }else {
                reject(buildCatch(res))
            }
        })
    })
}

/**
 * 创建消息 {API}
 * @param options {object}
 * @return {Message}
 */
let createMessage = function (options) {
    return new Message(options);
}

/**
 * 根据 messageID 查询消息 {API}
 * @param messageID
 * @return {Promise<object>}
 */
let findMessage = function (messageID) {
    return new Promise(function (resolve, reject) {
        callContainer({
            path: `/message/getMessage?messageID=${messageID}&openid=${OPENID}`
        }).then(function (res){
            if(res.code === '00000') {
                resolve(buildThen(res));
            }else {
                reject(buildCatch(res))
            }
        })
    })
}

/**
 * 分页拉取指定会话的消息列表 {API}
 * @param options <object>
 */
let getMessageList = function (options) {
    return new Promise(function (resolve, reject) {
        callContainer({
            path: 'message/getMessageList',
            method: 'POST',
            data: {
                conversationID: options.conversationID,
                time: options.time || -1,
                count: options.count || 15,
                openid: OPENID
            }
        }).then(function (res){
            if(res.code === '00000') {
                resolve(buildThen(res));
            }else {
                reject(buildCatch(res))
            }
        })
    })
}

/**
 * 发送消息，以一分钟为限 {API}
 * @param message {Message}
 * @return {Promise<object>}
 */
let sendMessage = function (message) {
    const sendTime = Date.now();
    const sendData = {
        event: SendType.CREATE_MSG,
        message: message
    }
    const msgStr = JSON.stringify(sendData);
    return new Promise(function (resolve, reject) {
        socketTask.send({
            data: msgStr
        }).then(function () {
            resolve(buildThen({
                result: {
                    messageID: message.messageID,
                    isSended: true
                }
            }))
            // let isSended = false;
            // while ((Date.now()-sendTime) < 60000) { // 1分钟
            //     if(sendedMsgSet.has(message.messageID)) {
            //         isSended = true;
            //         break;
            //     }
            // }
            // if(isSended) {
            //     sendedMsgSet.delete(message.messageID);
            //     emitCvstListUpdated();
            //     resolve(buildThen({
            //         result: {
            //             messageID: message.messageID,
            //             isSended: true
            //         }
            //     }))
            // } else { // 防止Socke意外断开，再请求一下
            //     findMessage(message.messageID).then(function (res) {
            //         if(res.data == null) {
            //             reject(buildCatch({
            //                 code: '50002',
            //                 msg: '消息未保存到数据库，发送失败'
            //             }))
            //         }else {
            //             emitCvstListUpdated()
            //             resolve(buildThen({
            //                 result: {
            //                     messageID: message.messageID,
            //                     isSended: true
            //                 }
            //             }))
            //         }
            //     }).catch(function (err) {
            //         reject(buildCatch({
            //             code: '50002',
            //             msg: '消息未保存到数据库，发送失败'
            //         }))
            //     })
            // }
        }).catch(function (err) {
            const error = {
                code: '50001',
                msg: `SocketTask.send()接口调用失败：${err}`
            }
            reject(buildCatch(error))
        })
    })
}

/**
 * 撤回消息 {API}
 * @param messageID
 * @return {Promise<Object>}
 */
let revokeMessage = function (messageID) {
    const sendTime = Date.now();
    const sendData = {
        event: SendType.REVOKE_MSG,
        messageID: messageID
    }
    const msgStr = JSON.stringify(sendData);
    return new Promise(function (resolve, reject) {
        socketTask.send({
            data: msgStr
        }).then(function () {
            resolve(buildThen({
                result: {
                    messageID: messageID,
                    isRevoked: true
                }
            }))
            // let isRevoked = false;
            // while ((Date.now()-sendTime) < 60000) { // 1分钟
            //     if(revokedMsgSet.has(messageID)) {
            //         isRevoked = true;
            //         break;
            //     }
            // }
            // if(isRevoked) {
            //     revokedMsgSet.delete(messageID);
            //     emitCvstListUpdated()
            //     resolve(buildThen({
            //         result: {
            //             messageID: messageID,
            //             isRevoked: true
            //         }
            //     }))
            // } else { // 防止Socke意外断开，再请求一下
            //     findMessage(messageID).then(function (res) {
            //         if(res.data == null) {
            //             reject(buildCatch({
            //                 code: '50002',
            //                 msg: '消息未保存到数据库，发送失败'
            //             }))
            //         }else if(!res.data.isRevoked) {
            //             reject(buildCatch({
            //                 code: '50003',
            //                 msg: '消息撤回失败'
            //             }))
            //         }else {
            //             emitCvstListUpdated()
            //             resolve(buildThen({
            //                 result: {
            //                     messageID: messageID,
            //                     isRevoked: true
            //                 }
            //             }))
            //         }
            //     }).catch(function (err) {
            //         reject(buildCatch({
            //             code: '50002',
            //             msg: '消息未保存到数据库，发送失败'
            //         }))
            //     })
            // }
        }).catch(function (err) {
            const error = {
                code: '50001',
                msg: `SocketTask.send()接口调用失败：${err}`
            }
            reject(buildCatch(error))
        })
    })
}

/**
 * 删除消息 {API}
 * @param messageID
 * @return {Promise<object>}
 */
let deleteMessage = function (messageID) {
    const sendTime = Date.now();
    const sendData = {
        event: SendType.DELETE_MSG,
        messageID: messageID
    }
    const msgStr = JSON.stringify(sendData);
    return new Promise(function (resolve, reject) {
        socketTask.send({
            data: msgStr
        }).then(function () {
            resolve(buildThen({
                result: {
                    messageID: messageID,
                    isDeleted: true
                }
            }))
            // let isDeleted = false;
            // while ((Date.now()-sendTime) < 60000) { // 1分钟
            //     if(deletedMsgSet.has(messageID)) {
            //         isDeleted = true;
            //         break;
            //     }
            // }
            // if(isDeleted) {
            //     deletedMsgSet.delete(messageID);
            //     resolve(buildThen({
            //         result: {
            //             messageID: messageID,
            //             isDeleted: true
            //         }
            //     }))
            // } else { // 防止Socke意外断开，再请求一下
            //     findMessage(messageID).then(function (res) {
            //         if(res.data == null) {
            //             reject(buildCatch({
            //                 code: '50002',
            //                 msg: '消息未保存到数据库，发送失败'
            //             }))
            //         }else if(!res.data.isDeleted) {
            //             reject(buildCatch({
            //                 code: '50004',
            //                 msg: '消息删除失败'
            //             }))
            //         }else {
            //             resolve(buildThen({
            //                 result: {
            //                     messageID: messageID,
            //                     isDeleted: true
            //                 }
            //             }))
            //         }
            //     }).catch(function (err) {
            //         reject(buildCatch({
            //             code: '50002',
            //             msg: '消息未保存到数据库，发送失败'
            //         }))
            //     })
            // }
        }).catch(function (err) {
            const error = {
                code: '50001',
                msg: `SocketTask.send()接口调用失败：${err}`
            }
            reject(buildCatch(error))
        })
    })
}

/**
 * 将某会话下的未读消息状态设置为已读(Http请求)
 * @param conversationID
 * @return {Promise<object>}
 */
let setConversationRead = function (conversationID) {
    return new Promise(function (resolve, reject) {
        callContainer({
            path: `/conversation/setMessageRead?conversationID=${conversationID}&openid=${OPENID}`
        }).then(function (res) {
            if(res.code === '00000') {
                resolve(buildThen(res));
            }else {
                reject(buildCatch(res))
            }
        })
    })
}

/**
 * 将某会话下的未读消息状态设置为已读 {API}
 * @param conversationID {string}
 * @param toOpenid {string}
 * @return {Promise<object>}
 */
let setMessageRead = function (conversationID, toOpenid) {
    const sendTime = Date.now();
    const sendData = {
        event: SendType.READ_MSG,
        toOpenid: toOpenid,
        conversationID: conversationID
    }
    const msgStr = JSON.stringify(sendData);
    return new Promise(function (resolve, reject) {
        socketTask.send({
            data: msgStr
        }).then(function () {
            resolve(buildThen({
                result: {
                    conversationID: conversationID,
                    isRead: true
                }
            }))
            // let isRead = false;
            // while ((Date.now()-sendTime) < 60000) { // 1分钟
            //     if(readCvstSet.has(conversationID)) {
            //         isRead = true;
            //         break;
            //     }
            // }
            // if(isRead) {
            //     readCvstSet.delete(conversationID);
            //     emitCvstListUpdated()
            //     resolve(buildThen({
            //         result: {
            //             conversationID: conversationID,
            //             isRead: true
            //         }
            //     }))
            // } else { // 防止Socke意外断开，再请求一下
            //     setConversationRead(conversationID).then(function () {
            //         emitCvstListUpdated();
            //         resolve(buildThen({
            //             result: {
            //                 conversationID: conversationID,
            //                 isRead: true
            //             }
            //         }))
            //     }).catch(function () {
            //         reject(buildCatch({
            //             code: '50005',
            //             msg: '设置消息已读失败'
            //         }))
            //     })
            //
            // }
        }).catch(function (err) {
            const error = {
                code: '50001',
                msg: `SocketTask.send()接口调用失败：${err}`
            }
            reject(buildCatch(error))
        })
    })
}

const API = {
    'on': on,
    'off': off,
    'createMessage': createMessage,
    'sendMessage': sendMessage,
    'revokeMessage': revokeMessage,
    'deleteMessage': deleteMessage,
    'getMessageList': getMessageList,
    'findMessage': findMessage,
    'setMessageRead': setMessageRead,
    'createConversation': createConversation,
    'findConversation': findConversation,
    'getConversationList': getConversationList,
    'pinConversation': pinConversation,
    'deleteConversation': deleteConversation,
    'getMyProfile': getMyProfile,
    'getUserProfile': getUserProfile,
}

export {
    EVENT,
    MessageType,
    create,
    destroy
}