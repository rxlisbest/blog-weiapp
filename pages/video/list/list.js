const App = getApp()
// list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category_id: 0,
    articles: {
      models: [],
      pages: {
        totalPage: 0,
        page: 0
      }
    },
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ "category_id": options.category_id })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getArticles();
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
    let pages = this.data.articles.pages;
    if (pages.totalPage > 1 && pages.totalPage - 1 >= pages.page) {
      this.setData({ loading: true });
      this.setData({ 'articles.pages.page': parseInt(pages.page) + 1 });
      this.getArticles();
    }
    else{
      wx.showToast({
        title: '没有更多数据',
        icon: 'success',
        duration: 1000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getArticles: function () {
    var _this = this;
    wx.request({
      url: App.api.articles.index,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        page: _this.data.articles.pages.page,
        category_id: _this.data.category_id
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let articles = {};
          let pages = {};
          let data = res.data;
          let models = _this.data.articles.models;
          for (let i in data){
            data[i].create_time = _this.toDate(data[i].create_time);
            models.push(data[i]);
          }
          pages.totalPage = res.header['X-Pagination-Page-Count'];
          pages.page = res.header['X-Pagination-Current-Page'];
          articles.models = models;
          articles.pages = pages;
          _this.setData({ articles: articles })

          _this.setData({ loading: false });
        }
      }
    })
  },
  toDate: function(number){  
    var n= number * 1000;  
    var date = new Date(n);  
    var Y = date.getFullYear() + '-';  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';  
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();  
    return (Y+M+D);
  }  
})