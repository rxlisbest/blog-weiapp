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
    var that = this
    //调用应用实例的方法获取全局数据
    App.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      wx.login({
        success: function (res) {
          if (res.code) {
            userInfo.code = res.code;
            // that.setData({
            //   "userInfo.code": res.code
            // })
            //发起网络请求
            wx.request({
              url: App.api.user_wechat.login,
              method: 'POST',
              data: userInfo,
              success: function (res) {
                var data = res.data;
                wx.getStorage({
                  key: 'user_id',
                  fail: function (res) {
                    wx.setStorage({
                      key: "user_id",
                      data: data.user_id.toString()
                    });
                    wx.setStorage({
                      key: "openid",
                      data: data.openid
                    });
                  }
                });
              }
            })
          }
          else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    });
  }
})
