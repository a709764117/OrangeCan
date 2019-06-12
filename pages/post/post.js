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
  },
  onTapToDetail(event){
    var postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+ postId,
    })
  },
  onSwiperTap(event){
    var index = event.target.dataset.postId
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + index,
    })
  }
})