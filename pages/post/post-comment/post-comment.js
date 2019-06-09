// pages/post/post-comment/post-comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取评论数据
    var postId = options.id
    this.dbPost = new dbPost(postId)
    var comments = dbPost.getAllComments();

    //绑定评论数据
    this.setData({
      'comments': comments
    })
  },


})