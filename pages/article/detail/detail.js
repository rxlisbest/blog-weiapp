const App = getApp()
const WxParse = require('../../../plugins/wxParse/wxParse.js')

Page({
  inputValue: '',
  data: {
    article: {
      id: 0,
      title: '',
      content: '',
      file_id: 0,
      type: 1,
    },
    current_time: 0,
    article_content: ''
  },
  onLoad: function (options) {
    this.setData({ 'article.id': options.id })
  },
  onReady: function (res) {
    var data = this.getArticle();
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
          res.data.create_time = _this.toDate(res.data.create_time);
          _this.setData({ article: res.data });
          _this.setData({ article_content: WxParse.wxParse('article_content', 'html', res.data.content, _this, 5) })
        }
      }
    })
  },
  toDate: function (number) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D);
  }  
})