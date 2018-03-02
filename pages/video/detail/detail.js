const App = getApp()

function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  inputValue: '',
  data: {
    src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    article: {
      id: 0,
      title: '',
      content: '',
      file_id: 0,
      type: 1,
    },
    danmuTimes: 0,
    danmuInterval: 20,
    danmuList: [],
    current_time: 0
  },
  onLoad: function (options) {
    this.setData({ 'article.id': options.id })
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
    var data = this.getArticle();
    
    var danmuInterval = this.data.danmuInterval;
    this.getDanmu(0, danmuInterval*2);
  },
  bindInputBlur: function (e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  bindButtonTap: function () {
    let _this = this;
    wx.setClipboardData({
      data: _this.data.src,
      success: function (res) {
        wx.showToast({
          title: '地址已复制',
          icon: 'success',
          duration: 1000
        });
      }
    });
    // return false;
    // var _this = this
    // wx.downloadFile({
    //   url: _this.data.src,
    //   success: function (res) {
    //     var filePath = res.tempFilePath
    //     wx.openDocument({
    //       filePath: filePath,
    //       success: function (res) {
    //         console.log('打开文档成功')
    //       }
    //     })
    //   }
    // })
    // wx.chooseVideo({
    //   sourceType: ['album', 'camera'],
    //   maxDuration: 60,
    //   camera: ['front', 'back'],
    //   success: function (res) {
    //     that.setData({
    //       src: res.tempFilePath
    //     })
    //   }
    // })
  },
  timeUpdate: function (event){
    let danmuInterval = this.data.danmuInterval;
    var current_time = Math.round(event.detail.currentTime);
    let danmuTimes = 0;
    if (Math.floor(current_time / danmuInterval) > this.data.danmuTimes){
      danmuTimes = Math.floor(current_time / danmuInterval);
      this.setData({ danmuTimes: danmuTimes });
      // this.getDanmu(danmuTimes * danmuInterval + danmuInterval, danmuTimes * danmuInterval + danmuInterval*2);
    }
    this.setData({ current_time: current_time })
  },
  bindSendDanmu: function () {
    let _this = this;
    var user_id = wx.getStorageSync('user_id');
    if (user_id > 0) {
      if (!_this.data.inputValue) {
        wx.showToast({
          title: '弹幕不能为空',
          icon: 'warn',
          duration: 1000
        });
        return false;
      }
      if (_this.data.inputValue.length > 15) {
        wx.showToast({
          title: '弹幕不能超15字',
          icon: 'warn',
          duration: 1000
        });
        return false;
      }

      let danmuList = _this.data.danmuList;
      let danmu = {};
      danmu = {
        text: _this.data.inputValue,
        color: getRandomColor(),
        time: _this.data.current_time + 1,
      };
      this.videoContext.sendDanmu(danmu);
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          var openid = res.data;
          wx.request({
            url: App.api.discussions.create,
            method: 'POST',
            header: {
              'content-type': 'application/json',
              'Authorization': 'Openid ' + openid,
            },
            data: {
              content: _this.data.inputValue,
              type: 1,
              time: _this.data.current_time,
              article_id: _this.data.article.id
            },
            success: function (res) {
              _this.setData({
                inputValue: ''
              })
            }
          })
        }
      });
    }
    else{
      wx.showModal({
        title: '提示',
        content: '去注册？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../register/register'
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      });
      return false;
    }
    
    // wx.showToast({
    //   title: '暂未开放',
    //   icon: 'success',
    //   duration: 1000
    // });
    // return false;
  },
  getArticle: function(){
    var _this = this;
    wx.request({
      url: App.api.articles.view + _this.data.article.id,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          _this.setData({ article: res.data })
          _this.getFile(res.data.file_id);
        }
      }
    })
  },
  getFile: function (file_id) {
    let _this = this;
    wx.request({
      url: App.api.files.view + file_id,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let src = '';
        if(res.statusCode == 200){
          let data = res.data;
          if(data.transcode_id != null && data.is_transcoded == 1){
            src = data.domain + data.transcode_name;
          }
          else{
            src = data.domain + data.save_name;
          }
          _this.setData({src:src})
        }
      }
    })
  },
  getDanmu: function (start_time, end_time) {
    let _this = this;
    wx.request({
      url: App.api.discussions.index,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        type: 1,
        article_id: _this.data.article.id,
        // time: start_time.toString() + ',' + end_time.toString() 
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let danmuList = _this.data.danmuList;
          let danmu = {};
          let models = res.data;
          for (let i in models) {
            danmu ={
              text: models[i]['content'],
              color: getRandomColor(),
              time: models[i]['time'],
            };
            danmuList.push(danmu);
          }
          _this.setData({ danmuList: danmuList })
        }
      }
    })
  }
})