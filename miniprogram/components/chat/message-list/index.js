import dayjs from '../../base/dayjs';
// eslint-disable-next-line no-undef
const app = getApp();
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
        if (!newVal.conversationID) return;
        this.setData({
          conversation: newVal,
          myAvatarUrl: app.globalData.avatarUrl,
          openid: app.globalData.openid,
          curLastTime: Date.now()
        }, () => {
          this.getMessageList(this.data.conversation);
        });
      },
    },
    unreadCount: {
      type: Number,
      value: '',
      observer(newVal) {
        this.setData({
          unreadCount: newVal,
        });
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    myAvatarUrl: '',
    openid: '',
    isLostsOfUnread: false,
    unreadCount: '',
    conversation: {}, // 当前会话
    messageList: [],
    // 自己的 messageID 用于区分历史消息中，哪部分是自己发出的
    scrollView: '',
    triggered: true,
    curLastTime: Date.now(), // 用于分页拉取消息
    isCompleted: false, // 当前会话消息是否已经请求完毕
    messagepopToggle: false,
    messageID: '',
    checkID: '',
    selectedMessage: {},
    deleteMessage: '',
    isRevoke: false,
    RevokeID: '', // 撤回消息的ID用于处理对方消息展示界面
    showName: '',
    showDownJump: false,
    showUpJump: false,
    jumpAim: '',
    messageIndex: '',
    isShow: false,
    Show: false,
    UseData: '',
    chargeLastmessage: '',
    groupOptionsNumber: '',
    showNewMessageCount: [],
    messageTime: '',
    messageHistoryTime: '',
    messageTimeID: {},
    showMessageTime: false,
    showMessageHistoryTime: false,
    showMessageError: false,
    showOnlyOnce: false,
    isMessageTime: {},
    firstTime: Number,
    newArr: {},
    errorMessage: {},
    errorMessageID: ''
  },

  lifetimes: {
    attached() {
    },
    ready() {
      if (this.data.unreadCount > 12) {
        if (this.data.unreadCount > 99) {
          this.setData({
            isLostsOfUnread: true,
            showUpJump: true,
          });
        } else {
          this.setData({
            showUpJump: true,
          });
        }
      }
      wx.$Kit.on(wx.$KitEvent.MESSAGE_RECEIVED, this.$onMessageReceived, this);
      wx.$Kit.on(wx.$KitEvent.MESSAGE_READ_BY_PEER, this.$onMessageReadByPeer, this);
      wx.$Kit.on(wx.$KitEvent.MESSAGE_REVOKED, this.$onMessageRevoked, this);
    },

    detached() {
      // 一定要解除相关的事件绑定
      wx.$Kit.off(wx.$KitEvent.MESSAGE_RECEIVED, this.$onMessageReceived);
      wx.$Kit.off(wx.$KitEvent.MESSAGE_READ_BY_PEER, this.$onMessageReadByPeer);
      wx.$Kit.off(wx.$KitEvent.MESSAGE_REVOKED, this.$onMessageRevoked);
    },
  },

  methods: {
    // 刷新消息列表
    refresh() {
      if (this.data.isCompleted) {
        this.setData({
          isCompleted: true,
          triggered: false,
        });
        return;
      }
      this.getMessageList(this.data.conversation);
      setTimeout(() => {
        this.setData({
          triggered: false,
        });
      }, 2000);
    },
    // 获取消息列表
    getMessageList(conversation) {
      if (!this.data.isCompleted) {
        wx.$Kit.getMessageList({
          conversationID: conversation.conversationID,
          time: this.data.curLastTime,
          count: 15,
        }).then((res) => {
          const messageList = res.data; // 消息列表。
          if(messageList != null && messageList.length == 0) {
            this.data.isCompleted = true; // 表示是否已经拉完所有消息。
          } else {
            this.showMoreHistoryMessageTime(messageList);
            this.data.curLastTime = res.data[0].time; // 用于续拉，分页续拉时需传入该字段。
            this.data.messageList = [...messageList, ...this.data.messageList];
            if(this.data.messageList.length < this.data.unreadCount) {
                this.getMessageList(conversation);
            }
          }
          this.$handleMessageRender(this.data.messageList, messageList);
        });
      }
    },
    // 历史消息渲染
    $handleMessageRender(messageList, currentMessageList) {
      this.showHistoryMessageTime(currentMessageList);
      for (let i = 0; i < messageList.length; i++) {
        if (messageList[i].isOut) {
          messageList[i].isSelf = true;
        }
      }
      if (messageList.length > 0) {
          this.setData({
            messageList,
            jumpAim: currentMessageList[currentMessageList.length - 1].messageID,
          }, () => {
          });
      }
    },
    // 消息已读更新
    $onMessageReadByPeer(event) {
        if(event.data.conversationID === this.data.conversationID) {
            const messageList = this.data.messageList;
            const len = messageList.length;
            for(let i = len-1; i>=0; i--) {
                if(messageList[i].isPeerRead) {
                    break;
                } else {
                    messageList[i].isPeerRead = true
                }
            }
            this.setData({
                messageList: messageList,
              });
        }
    },

    // 收到的消息
    $onMessageReceived(event) {
        const value = {
            data: [event.data]
        }
      this.messageTimeForShow(value.data[0]);
      this.setData({
        UseData: value,
      });
      value.data.forEach((item) => {
        if (this.data.messageList.length > 12 && !value.data[0].isRead
        && item.conversationID === this.data.conversation.conversationID) {
          this.data.showNewMessageCount.push(value.data[0]);
          this.setData({
            showNewMessageCount: this.data.showNewMessageCount,
            showDownJump: true,
          });
        } else {
          this.setData({
            showDownJump: false,
          });
        }
      });
      // 若需修改消息，需将内存的消息复制一份，不能直接更改消息，防止修复内存消息，导致其他消息监听处发生消息错误
      const list = [];
      value.data.forEach((item) => {
        if (item.conversationID === this.data.conversation.conversationID) {
          list.push(item);
        }
      });
      this.data.messageList = this.data.messageList.concat(list);
      this.setData({
        messageList: this.data.messageList
      });
    },
    // 自己的消息上屏
    updateMessageList(message) {
      this.messageTimeForShow(message);
      message.isSelf = true;
      this.data.messageList.push(message);
      this.setData({
        messageList: this.data.messageList,
        jumpAim: this.data.messageList[this.data.messageList.length - 1].messageID,
      });
    },
    // 获取消息ID
    handleLongPress(e) {
      const { index } = e.currentTarget.dataset;
      this.setData({
        messageID: e.currentTarget.id,
        selectedMessage: this.data.messageList[index],
        Show: true,
      });
    },
    // 更新messagelist
    updateMessageByID(deleteMessageID) {
      const { messageList } = this.data;
      const deletedMessageArr = messageList.filter(item => item.messageID !== deleteMessageID);
      this.setData({
        messageList: deletedMessageArr,
      });
      return deletedMessageArr;
    },
    // 删除消息
    deleteMessage() {
      wx.$Kit.deleteMessage(this.data.selectedMessage.messageID)
        .then((imResponse) => {
          this.updateMessageByID(imResponse.data.messageID);
          wx.showToast({
            title: '删除成功!',
            duration: 800,
            icon: 'none',
          });
        })
        .catch(() => {
          wx.showToast({
            title: '删除失败!',
            duration: 800,
            icon: 'error',
          });
        });
    },
    // 撤回消息
    revokeMessage() {
        const messageID = this.data.selectedMessage.messageID;
        const time = this.data.selectedMessage.time;
        if(Date.now()-time > 120000) {
            wx.showToast({
                title: '超过2分钟消息不支持撤回',
                duration: 800,
                icon: 'none',
              }),
              this.setData({
                Show: false,
              });
              // 消息撤回失败
              console.warn('revokeMessage error:', imError);
        }else{
            wx.$Kit.revokeMessage(messageID)
            .then((imResponse) => {
                this.updateMessageByID(imResponse.data.messageID);
                this.setData({
                    showName: '你',
                    isRevoke: true
                });
             // 消息撤回成功
            }).catch((imError) => {
                wx.showToast({
                    title: '超过2分钟消息不支持撤回',
                    duration: 800,
                    icon: 'none',
                  }),
                  this.setData({
                    Show: false,
                  });
                  // 消息撤回失败
                  console.warn('revokeMessage error:', imError);
            });
        }
    },
    // 关闭弹窗
    handleEditToggleAvatar() {
      this.setData({
        Show: false,
      });
    },
    // 收到对方消息撤回事件
    $onMessageRevoked(event) {
        this.setData({
            showName: '对方',
            RevokeID: event.data.messageID,
            isRevoke: true,
        });
        this.updateMessageByID(event.data);
    },
    // 复制消息
    copyMessage() {
      wx.setClipboardData({
        data: this.data.selectedMessage.payload,
        success() {
          wx.getClipboardData({
            success(res) {
              console.log(`| TUI-chat | message-list | copyMessage: ${res.data} `);
            },
          });
        },
      });
      this.setData({
        Show: false,
      });
    },
    // 消息跳转到最新
    handleJumpNewMessage() {
        wx.$Kit.setMessageRead(this.data.conversation.conversationID, this.data.conversation.userProfile.openid).then(() => {
            // console.log("设置消息已读");
        });
      this.setData({
        jumpAim: this.data.messageList[this.data.messageList.length - 1].messageID,
        showDownJump: false,
        showNewMessageCount: [],
      });
    },
    // 消息跳转到最近未读
    handleJumpUnreadMessage() {
        wx.$Kit.setMessageRead(this.data.conversation.conversationID, this.data.conversation.userProfile.openid).then(() => {
            // console.log("设置消息已读");
        });
      if (this.data.unreadCount > 15) {
        this.getMessageList(this.data.conversation);
        this.setData({
          jumpAim: this.data.messageList[this.data.messageList.length - this.data.unreadCount].messageID,
          showUpJump: false,
        });
      } else {
        this.getMessageList(this.data.conversation);
        this.setData({
          jumpAim: this.data.messageList[this.data.messageList.length - this.data.unreadCount].messageID,
          showUpJump: false,
        });
      }
    },
    // 滑动到最底部置跳转事件为false
    scrollHandler() {
        wx.$Kit.setMessageRead(this.data.conversation.conversationID, this.data.conversation.userProfile.openid).then(() => {
            // console.log("设置消息已读");
        });
      this.setData({
        jumpAim: this.data.messageList[this.data.messageList.length - 1].messageID,
        showDownJump: false,
      });
    },

    // 展示消息时间
    messageTimeForShow(messageTime) {
      const interval = 5 * 60 * 1000;
      const nowTime = Math.floor(messageTime.time / 10) * 10;
      if(this.data.messageList!=null && this.data.messageList.length > 0) {
          const lastTime = this.data.messageList[this.data.messageList.length-1].time;
          if (nowTime  - lastTime > interval) {
            Object.assign(messageTime, {
              isShowTime: true,
            }),
            this.data.messageTime = dayjs(nowTime);
            this.setData({
              messageTime: dayjs(nowTime).format('YYYY-MM-DD HH:mm:ss'),
              showMessageTime: true,
            });
          }
      } else {
        Object.assign(messageTime, {
            isShowTime: true,
          }),
          this.data.messageTime = dayjs(nowTime);
          this.setData({
            messageTime: dayjs(nowTime).format('YYYY-MM-DD HH:mm:ss'),
            showMessageTime: true,
          });
      }
    },
    // 渲染历史消息时间
    showHistoryMessageTime(messageList) {
      const cut = 30 * 60 * 1000;
      for (let index = 0; index < messageList.length; index++) {
        const nowadayTime = Math.floor(messageList[index].time / 10) * 10;
        const firstTime = messageList[0].time;
        if (nowadayTime - firstTime > cut) {
          const indexbutton = messageList.map(item => item).indexOf(messageList[index]); // 获取第一个时间大于30分钟的消息所在位置的下标
          const firstTime = nowadayTime; // 找到第一个数组时间戳大于30分钟的将其值设为初始值
          const showHistoryTime = Math.floor(messageList[indexbutton].time / 10) * 10;
          Object.assign(messageList[indexbutton], {
            isShowHistoryTime: true,
          }),
          this.setData({
            firstTime: nowadayTime,
            messageHistoryTime: dayjs(showHistoryTime).format('YYYY-MM-DD HH:mm:ss'),
            showMessageHistoryTime: true,
          });
          return firstTime;
        }
      }
    },
    // 拉取更多历史消息渲染时间
    showMoreHistoryMessageTime(messageList) {
      const showHistoryTime = messageList[0].time;
      Object.assign(messageList[0], {
        isShowMoreHistoryTime: true,
      });
      this.data.newArr[messageList[0].messageID] = dayjs(showHistoryTime).format('YYYY-MM-DD HH:mm:ss');
      this.setData({
        newArr: this.data.newArr,
      });
    },
    // 消息发送失败
    sendMessageError(event) {
      this.setData({
        errorMessage : event.detail.message,
        errorMessageID: event.detail.message.messageID
      })
      const DIRTYWORDS_CODE = 80001;
      const UPLOADFAIL_CODE = 6008;
      const REQUESTOVERTIME_CODE = 2081;
      const DISCONNECTNETWORK_CODE = 2800;
      if (event.detail.showErrorImageFlag === DIRTYWORDS_CODE) {
        this.setData({
          showMessageError: true,
        });
        wx.showToast({
          title: '您发送的消息包含违禁词汇!',
          duration: 800,
          icon: 'none',
        });
      } else if (event.detail.showErrorImageFlag === UPLOADFAIL_CODE) {
        this.setData({
          showMessageError: true,
        });
        wx.showToast({
          title: '文件上传失败!',
          duration: 800,
          icon: 'none',
        });
      } else if (event.detail.showErrorImageFlag === (REQUESTOVERTIME_CODE || DISCONNECTNETWORK_CODE)) {
        this.setData({
          showMessageError: true,
        });
        wx.showToast({
          title: '网络已断开!',
          duration: 800,
          icon: 'none',
        });
      }
    },
  },

});
