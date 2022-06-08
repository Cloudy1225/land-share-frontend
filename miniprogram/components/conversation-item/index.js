// components/conversation-item/index.js
import { caculateTimeago } from '../base/common';
// eslint-disable-next-line no-undef
// eslint-disable-next-line no-undef
// eslint-disable-next-line no-undef
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    conversation: {
      type: Object,
      value: {},
      observer(conversation) {
        this.setData({
          conversationName: this.getConversationName(conversation),
          setConversationAvatar: this.setConversationAvatar(conversation),
        });
        this.$updateTimeAgo(conversation);
        this.setPinName(conversation.isPinned);
      },
    },
    charge: {
      type: Boolean,
      value: {},
      observer(charge) {
        if (!charge) {
          this.setData({
            xScale: 0,
          });
        }
      },
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    xScale: 0,
    conversationName: '',
    conversationAvatar: '',
    showMessage: '',
    showPin: '置顶聊天',
    popupToggle: false,
    isTrigger: false,
    num: 0,
  },
  lifetimes: {
    attached() {
    },

  },
  pageLifetimes: {
    // 展示已经置顶的消息和更新时间戳
    show() {
      this.setPinName(this.data.conversation.isPinned);
      this.$updateTimeAgo(this.data.conversation);
    },
    // 隐藏动画
    hide() {
      this.setData({
        xScale: 0,
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 切换置顶聊天状态
    setPinName(isPinned) {
      this.setData({
        showPin: isPinned ? '取消置顶' : '置顶聊天',
      });
    },
    // 设置会话名称
    getConversationName(conversation) {
        return conversation.userProfile.nickName || conversation.userProfile.openid;
    },
    // 设置会话的头像
    setConversationAvatar(conversation) {
        return conversation.userProfile.avatarUrl || 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/component/TUIKit/assets/avatar_21.png';
    },
    // 删除会话
    deleteConversation() {
      wx.showModal({
        content: '确认删除会话？',
        success: (res) => {
          if (res.confirm) {
            wx.$Kit.deleteConversation(this.data.conversation.conversationID).then(() => {
                this.setData({
                    conversation: {},
                    xScale: 0,
                  });
            })
          }
        },
      });
    },

    // 消息置顶
    pinConversation() {
        wx.$Kit.pinConversation({
            conversationID: this.data.conversation.conversationID,
            isPinned: true
        }).then(() => {
            this.setData({
                xScale: 0,
              });
        }).catch((err) => {
            console.warn('pinConversation error:', err); // 置顶会话失败的相关信息
        });
        if(this.data.showPin === '取消置顶') {
            wx.$Kit.pinConversation({
                conversationID: this.data.conversation.conversationID,
                isPinned: false
            }).then(() => {
                this.setData({
                    xScale: 0,
                  });
            }).catch((err) => {
                console.warn('pinConversation error:', err); // 取消置顶会话失败的相关信息
            });
        }

    },

    // 控制左滑动画
    handleTouchMove(e) {
      this.setData({
        num: e.detail.x,
      });
      if (e.detail.x < 0 && !this.data.isTrigger) {
        this.setData({
          isTrigger: true,
        });
        this.triggerEvent('transCheckID', {
          checkID: this.data.conversation.conversationID,
        });
      }
      if (e.detail.x === 0) {
        this.setData({
          isTrigger: false,
        });
      }
    },
    handleTouchEnd() {
      if (this.data.num < -wx.getSystemInfoSync().windowWidth / 5) {
        this.setData({
          xScale: -wx.getSystemInfoSync().windowWidth,
        });
      }
      if (this.data.num >= -wx.getSystemInfoSync().windowWidth / 5 && this.data.num < 0) {
        this.setData({
          xScale: 0,
        });
      }
    },
    // 更新会话的时间戳，显示会话里的最后一条消息
    $updateTimeAgo(conversation) {
      if (conversation.conversationID) {
          if(conversation.lastMessage) {
            conversation.lastMessage.timeago = caculateTimeago(conversation.lastMessage.lastTime);
            conversation.lastMessage.messageForShow = conversation.lastMessage.messageForShow.slice(0, 15);
            this.setData({
            showMessage: conversation.lastMessage.messageForShow,
            });
            this.setData({
              conversation,
            });
          }
      }
    },
    // 会话头像显示失败显示的默认头像
    handleimageerro() {
      this.setData({
        setConversationAvatar: '../../../static/assets/gruopavatar.svg',
      });
    },
  },
});
