const app = getApp()
// import { formatTime } from '../../utils/util'
// import socket from '../../utils/socket'
Page({
  data: {
    list: []
  },
  goPage(e) {
    let newlist = this.data.list
    console.log(this.data)
    const index = e.currentTarget.dataset.index
    console.log(e.currentTarget.dataset)
    newlist[index].count = 0;
    this.setData({
      list: newlist
    })
    wx.navigateTo({
      url: '../message/message?name=' + e.currentTarget.dataset.name + "&id=" + e.currentTarget.dataset.id
    })
  },
  onReady(){
  },
  onLoad() {
    var lists = [
      {
        avatar: "../../images/unLoginAvatar.png",
        name: "yxb",
        text: "哈哈",
        updated: "22:00",
        count: 1,
        id: "1"
      },
      {
        avatar: "../../images/unLoginAvatar.png",
        name: "lyh",
        text: "干什么呢",
        updated: "17:30",
        count: 0,
        id: "2"
      },
      {
        avatar: "../../images/unLoginAvatar.png",
        name: "zhs",
        text: "O(∩_∩)O",
        updated: "16:00",
        count: 0,
        id: "3"
      },
      {
        avatar: "../../images/unLoginAvatar.png",
        name: "xrs",
        text: "那先不管了",
        updated: "14:00",
        count: 14,
        id: "4"
      },
      {
        avatar: "../../images/unLoginAvatar.png",
        name: "ff",
        text: "可以",
        updated: "10:00",
        count: 7,
        id: "5"
      }
    ];
    this.setData({
      list: lists
    })
  }
})