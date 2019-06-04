// pages/post/post.js
import{DBPost} from"../../db/DBPost.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  onLoad: function() {
    var dbPost = new DBPost();
    this.setData({
      postList: dbPost.getAllPostData()
    })
  }
})