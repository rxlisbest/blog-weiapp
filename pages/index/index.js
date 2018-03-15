//index.js
//获取应用实例
const App = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  toList: function() {
    wx.navigateTo({
      url: '../list/list'
    })
  },
  onLoad: function () {
    // wx.clearStorage();
    var that = this;
  }
})
