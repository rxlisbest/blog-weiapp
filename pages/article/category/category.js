// category.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    article_category: [],
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type != undefined){
      this.setData({ "type": options.type })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getArticleCategory();
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
  getArticleCategory: function () {
    var _this = this; 
    wx.request({
      url: App.api.article_categories.index,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        type: _this.data.type,
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let models = [];
          for (let i in res.data) {
            models.push(res.data[i]);
          }
          _this.setData({ article_category: models })
          _this.setData({ loading: false });
        }
      }
    })
  },
})