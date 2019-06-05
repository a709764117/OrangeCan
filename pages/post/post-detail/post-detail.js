// pages/post/post-detail/post-detail.js
import { DBPost } from "../../../db/DBPost.js";

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
    var postId = options.id;
    this.dbPost = new DBPost(postId);
    this.postData = this.dbPost.getPostItemById().data
    this.setData({
      post:this.postData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.postData.title
    })
  },

  onCollectionTap:function(){
    //dbPost对象已在onLoad里被保存到了this变量中，无须再次new
    var newData = this.dbPost.collect();
    //重新绑定数据
    //只需选择性地更新部分数据
    this.setData({
      'post.collectionStatus': newData.collectionStatus,
      'post.collectionNum': newData.collectionNum
    })
    wx.showToast({
      title: newData.collectionStatus?"收藏成功":"取消成功",
      duration:1000,
      icon:"success",
      mask:true
    })

  }



})