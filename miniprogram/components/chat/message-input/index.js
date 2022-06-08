const app = getApp()
// eslint-disable-next-line no-undef
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    conversation: {
      type: Object,
      value: {},
      observer(newVal) {
        this.setData({
          conversation: newVal,
        });
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    conversation: {},
    message: '',
    extensionArea: false,
    sendMessageBtn: false,
    displayFlag: '',
    isAudio: false,
    bottomVal: 0,
    startPoint: 0,
    popupToggle: false,
    isRecording: false,
    canSend: true,
    text: '按住说话',
    title: ' ',
    notShow: false,
    isShow: true,
    showErrorImageFlag: 0,
  },

  lifetimes: {
    attached() {
      // 加载声音录制管理器
      this.recorderManager = wx.getRecorderManager();
      this.recorderManager.onStop((res) => {
        wx.hideLoading();
        if (this.data.canSend) {
          if (res.duration < 1000) {
            wx.showToast({
              title: '录音时间太短',
              icon: 'none',
            });
          } else {
            const fileName = res.tempFilePath.split("/").pop()
            wx.cloud.uploadFile({
              cloudPath: `chat/audio/${fileName}`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
              filePath: res.tempFilePath // 微信本地文件，通过选择图片，聊天文件等接口获取
            }).then(res => {
                console.log('语音上传结果', res)
                const message = wx.$Kit.createMessage({
                  to: this.getToAccount(),
                  type: wx.$KitTypes.MSG_AUDIO,
                  payload: res.fileID,
                  conservationID: this.data.conversation.conversationID,
                  isOut: true
              });
              this.$sendTIMMessage(message);
            }).catch(error => {
                wx.showToast({
                    title: '语音上传失败!',
                    duration: 800,
                    icon: 'none',
                  });
            })
          }
        }
        this.setData({
          startPoint: 0,
          popupToggle: false,
          isRecording: false,
          canSend: true,
          title: ' ',
          text: '按住说话',
        });
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 打开录音开关
    switchAudio() {
      this.setData({
        isAudio: !this.data.isAudio,
        text: '按住说话',
      });
    },
    // 长按录音
    handleLongPress(e) {
      this.recorderManager.start({
        duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
        sampleRate: 44100, // 采样率
        numberOfChannels: 1, // 录音通道数
        encodeBitRate: 192000, // 编码码率
        format: 'aac', // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
      });
      this.setData({
        startPoint: e.touches[0],
        title: '正在录音',
        // isRecording : true,
        // canSend: true,
        notShow: true,
        isShow: false,
        isRecording: true,
        popupToggle: true,
      });
    },

    // 录音时的手势上划移动距离对应文案变化
    handleTouchMove(e) {
      if (this.data.isRecording) {
        if (this.data.startPoint.clientY - e.touches[e.touches.length - 1].clientY > 100) {
          this.setData({
            text: '抬起停止',
            title: '松开手指，取消发送',
            canSend: false,
          });
        } else if (this.data.startPoint.clientY - e.touches[e.touches.length - 1].clientY > 20) {
          this.setData({
            text: '抬起停止',
            title: '上划可取消',
            canSend: true,
          });
        } else {
          this.setData({
            text: '抬起停止',
            title: '正在录音',
            canSend: true,
          });
        }
      }
    },
    // 手指离开页面滑动
    handleTouchEnd() {
      this.setData({
        isRecording: false,
        popupToggle: false,

      });
      wx.hideLoading();
      this.recorderManager.stop();
    },
    // 选中表情消息
    handleEmoji() {
      let targetFlag = 'emoji';
      if (this.data.displayFlag === 'emoji') {
        targetFlag = '';
      }
      this.setData({
        displayFlag: targetFlag,
      });
    },
    // 选自定义消息
    handleExtensions() {
      let targetFlag = 'extension';
      if (this.data.displayFlag === 'extension') {
        targetFlag = '';
      }
      this.setData({
        displayFlag: targetFlag,
      });
    },

    error(e) {
      console.log(e.detail);
    },

    handleSendPicture() {
      this.sendImageMessage('camera');
    },
    handleSendImage() {
      this.sendImageMessage('album');
    },
    sendImageMessage(type) {
      const maxSize = 20480000;
      wx.chooseImage({
        sourceType: [type],
        count: 1,
        success: (res) => {
            console.log('chooseImage',res)
            
          if (res.tempFiles[0].size > maxSize) {
            wx.showToast({
              title: '大于20M图片不支持发送',
              icon: 'none',
            });
            return;
          }
          const fileName = res.tempFilePaths[0].split("/").pop()
          wx.cloud.uploadFile({
            cloudPath: `chat/image/${fileName}`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
            filePath: res.tempFilePaths[0] // 微信本地文件，通过选择图片，聊天文件等接口获取
          }).then(res => {
              console.log('图片上传结果', res)
              const message = wx.$Kit.createMessage({
                to: this.getToAccount(),
                type: wx.$KitTypes.MSG_IMAGE,
                payload: res.fileID,
                conservationID: this.data.conversation.conversationID,
                isOut: true
            });
            this.$sendTIMMessage(message);
          }).catch(error => {
            wx.showToast({
                title: '图片上传失败!',
                duration: 800,
                icon: 'none',
              });
          })
        },
      });
    },
    handleShootVideo() {
      this.sendVideoMessage('camera');
    },
    handleSendVideo() {
      this.sendVideoMessage('album');
    },
    sendVideoMessage(type) {
      wx.chooseVideo({
        sourceType: [type], // 来源相册或者拍摄
        maxDuration: 60, // 设置最长时间60s
        camera: 'back', // 后置摄像头
        success: (res) => {
            console.log("chooseVideo", res)
              const fileName = res.tempFilePath.split("/").pop()
              wx.cloud.uploadFile({
                cloudPath: `chat/video/${fileName}`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
                filePath: res.tempFilePath // 微信本地文件，通过选择图片，聊天文件等接口获取
              }).then(res => {
                  console.log('视频上传结果', res)
                  const message = wx.$Kit.createMessage({
                    to: this.getToAccount(),
                    type: wx.$KitTypes.MSG_VIDEO,
                    payload: res.fileID,
                    conservationID: this.data.conversation.conversationID,
                    isOut: true
                });
                this.$sendTIMMessage(message);
              }).catch(error => {
                wx.showToast({
                    title: '视频上传失败!',
                    duration: 800,
                    icon: 'none',
                  });
              })
            },
      });
    },
    appendMessage(e) {
        console.log('appendMessage', e)
      this.setData({
        message: this.data.message + e.detail.message,
        sendMessageBtn: true,
      });
    },
    getToAccount() {
      if (!this.data.conversation || !this.data.conversation.conversationID) {
        return '';
      }
      return this.data.conversation.userProfile.openid;
    },

    sendTextMessage(msg, flag) {
      const to = this.getToAccount();
      const text = flag ? msg : this.data.message;
      const message = wx.$Kit.createMessage({
          to: to,
          type: wx.$KitTypes.MSG_TEXT,
          payload: text,
          conservationID: this.data.conversation.conversationID,
          isOut: true
      });
      this.setData({
        message: '',
        sendMessageBtn: false,
      });
      this.$sendTIMMessage(message);
    },

    onInputValueChange(event) {
        console.log('event.detail', event.detail)
      if (event.detail.message) {
        this.setData({
          message: event.detail.message.payload,
          sendMessageBtn: true,
        });
      } else if (event.detail.value!='') {
          console.log('event.detail.valu', event.detail.value)
            this.setData({
                message: event.detail.value,
                sendMessageBtn: true,
            });
      }  else if (event.detail.value=='') {
        console.log('event.detail.valu', event.detail.value)
          this.setData({
              message: event.detail.value,
              sendMessageBtn: false,
          });
    }else {
        this.setData({
          sendMessageBtn: false,
        });
      }
    },

    $handleSendTextMessage(event) {
      this.sendTextMessage(event.detail.message, true);
    },

    $sendTIMMessage(message) {
        this.triggerEvent('sendMessage', {
            message,
        });
        wx.$Kit.sendMessage(message).then((res)=>{
            console.log('消息发送成功')
        }
        ).catch((error) => {
            console.log(`| TUI-chat | message-input | sendMessageError: ${error.code} `);
            this.triggerEvent('showMessageErrorImage', {
            showErrorImageFlag: error.code,
            message,
            });
        });
        this.setData({
            displayFlag: '',
        });
    },

    handleClose() {
      this.setData({
        displayFlag: '',
      });
    },
  },
});
