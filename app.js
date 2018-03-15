import api from './config/api'
//app.js
App({
  onLaunch: function() {
    let that = this;
    //调用API从本地缓存中获取数据
    that.doLogin();
  },
  doLogin: function () { // 小程序登录授权等操作
    let that = this;
    wx.getStorage({
      key: 'openid',
      fail: function (res) {
        wx.getUserInfo({
          success: function (userInfo) {
            let user_info = userInfo.userInfo;
            //更新数据
            wx.login({
              success: function (res) {
                if (res.code) {
                  user_info.code = res.code;
                  //发起网络请求
                  wx.request({
                    url: that.api.user_wechat.login,
                    method: 'POST',
                    data: user_info,
                    success: function (res) {
                      if (res.statusCode == 200) {
                        var data = res.data;
                        console.log(data);
                        wx.setStorage({
                          key: "user_id",
                          data: data.user_id
                        });
                        wx.setStorage({
                          key: "openid",
                          data: data.openid
                        });
                      }
                      else{
                        // wx.showToast({
                        //   title: res.data.message,
                        //   icon: 'none',
                        //   duration: 1000
                        // });
                      }
                    }
                  })
                }
                else {
                  console.log('获取用户登录态失败！' + res.errMsg)
                }
              }
            });
          }
        });
      }
    });
  },
  api: api
})
