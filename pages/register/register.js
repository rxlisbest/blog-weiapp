// register.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    RecNum: '',
    sendSmsText: "发送",
    sendSmsDisabled: false,
    captcha: '',
    captcha_src: App.api.sms_aliyun.captcha + 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  bindInputBlur: function (e) {
    this.RecNum = e.detail.value
  },
  bindCodeInputBlur: function (e) {
    this.code = e.detail.value
  },
  bindSendSms: function () {
    let _this = this;
    if (!_this.RecNum) {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'success',
        duration: 1000
      });
      return false;
    }
    // 微信小程序不支持cookie
    // if (!_this.captcha) {
    //   wx.showToast({
    //     title: '图形验证码不能为空',
    //     icon: 'success',
    //     duration: 1000
    //   });
    //   return false;
    // }
    wx.request({
      url: App.api.sms_aliyun.send,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        TemplateCode: 'register',
        RecNum: _this.RecNum,
        // 微信小程序不支持cookie
        // captcha: _this.captcha,
      },
      success: function (res) {
        if (res.statusCode == 200) {
          function countdown(n){
            if(n > 0){
              _this.setData({ 'sendSmsText': n });
              setTimeout(function () { countdown(n-1)}, 1000);
            }
            else {
              _this.setData({ 'sendSmsText': '发送' })
              _this.setData({ 'sendSmsDisabled': false })
            }
          }
          countdown(120);
          _this.setData({ 'sendSmsDisabled': true })
        }
        else{
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 1000
          });
        }
      }
    })
  },
  bindRegister: function () {
    let _this = this;
    if (!_this.RecNum) {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'success',
        duration: 1000
      });
      return false;
    }
    if (!_this.code) {
      wx.showToast({
        title: '短信验证码不能为空',
        icon: 'success',
        duration: 1000
      });
      return false;
    }

    wx.getStorage({
      key: "openid",
      success: function (res) {
        var openid = res.data;
        wx.request({
          url: App.api.user_wechat.register,
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: {
            cellphone: _this.RecNum,
            code: _this.code,
            openid: openid,
          },
          success: function (res) {
            if (res.statusCode == 200) {
              wx.setStorageSync('user_id', res.data.user_id)
              wx.navigateBack();
            }
            else {
              wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 1000
              });
            }
          }
        })
      } 
    });
  },
  bindChangeCaptcha: function(){
    var src = App.api.sms_aliyun.captcha + Math.random();
    this.setData({ 'captcha_src': src })
  },
  bindCaptchaInputBlur: function (e) {
    this.captcha = e.detail.value
  }
})