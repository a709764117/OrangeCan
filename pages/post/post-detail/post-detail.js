// pages/post/post-detail/post-detail.js
import { DBPost } from "../../../db/DBPost.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //控制音乐播放状态
    isPlayingMusic: false
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
    this.addReadingTimes();
    this.setMusicMonitor();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.postData.title
    })
  },
  onUnload: function() {
    wx.stopBackgroundAudio()
    this.setData({
      isPlayingMusic: false
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
  },
    onUpTap:function(event){
    var newData = this.dbPost.up()
    this.setData({
      'post.upNum' : newData.upNum,
      'post.upStatus': newData.upStatus
      })
  },
  onCommentTap: function (event){
    this.dbPost.postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: '../post-comment/post-comment?id=' + this.dbPost.postId,
    })
  },
  addReadingTimes:function(){
    this.dbPost.addReadingTimes();
  },
  onMusicTap:function(){
    if (this.data.isPlayingMusic){
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
      
    }else{
      wx.playBackgroundAudio({
        dataUrl: this.postData.music.url,
        title:this.postData.music.title,
        coverImgUrl:this.postData.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },
  setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioStop(function(){
      that.setData({
        isPlayingMusic:false
      })
    });
  }
})