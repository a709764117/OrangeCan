// pages/post/post-detail/post-detail.js
import {
  DBPost
} from "../../../db/DBPost.js";

var app = getApp();

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
  onLoad: function(options) {
    var postId = options.id;
    this.dbPost = new DBPost(postId);
    this.postData = this.dbPost.getPostItemById().data
    this.setData({
      post: this.postData
    })
    this.addReadingTimes();
    this.setMusicMonitor();
    this.initMusicStatus();
    this.setAnimation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.postData.title
    })
  },
  onUnload: function() {
    // wx.stopBackgroundAudio()
    // this.setData({
    //   isPlayingMusic: false
    // })
  },

  onCollectionTap: function() {
    //dbPost对象已在onLoad里被保存到了this变量中，无须再次new
    var newData = this.dbPost.collect();
    //重新绑定数据
    //只需选择性地更新部分数据
    this.setData({
      'post.collectionStatus': newData.collectionStatus,
      'post.collectionNum': newData.collectionNum
    })
    wx.showToast({
      title: newData.collectionStatus ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success",
      mask: true
    })
  },
  onUpTap: function(event) {
    var newData = this.dbPost.up()
    this.setData({
      'post.upNum': newData.upNum,
      'post.upStatus': newData.upStatus
    })

    //定义动画方法并使用动画
    this.animationUp.scale(2).step();
    this.setData({
      animationUp:this.animationUp.export()
    })
    setTimeout(
      function(){
        this.animationUp.scale(1).step();
        this.setData({
          animationUp: this.animationUp.export()
        })
      }
    .bind(this),300);
  },
  onCommentTap: function(event) {
    this.dbPost.postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: '../post-comment/post-comment?id=' + this.dbPost.postId,
    })
  },
  addReadingTimes: function() {
    this.dbPost.addReadingTimes();
  },
  onMusicTap: function() {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.postData.music.url,
        title: this.postData.music.title,
        coverImgUrl: this.postData.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = this.dbPost.postId;
    }
  },

  //监听音乐结束、暂停、播放
  setMusicMonitor: function() {
    var that = this;
    //播放结束
    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
    });
    //播放暂停
    wx.onBackgroundAudioPause(function(event) {
      if (app.globalData.g_currentMusicPostId === that.dbPost.postId) {
        that.setData({
          isPlayingMusic: false
        });
        app.globalData.g_isPlayingMusic = false;
      }
    });
    //正在播放
    wx.onBackgroundAudioPlay(function() {
      if (app.globalData.g_currentMusicPostId === that.dbPost.postId) {
        that.setData({
          isPlayingMusic: true
        });
        app.globalData.g_isPlayingMusic = true;
      }
    });
  },

  //初始化音乐播放图标状态
  initMusicStatus: function() {
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId == this.dbPost.postId) {
      //如果全局播放的音乐是当前文章的音乐，就将图标状态设置为正在播放
      this.setData({
        isPlayingMusic: true
      });
    } else {
      isPlayingMusic: false
    }
  },
  onShareAppMessage: function() {
    return {
      title:this.postData.title,
      desc:this.postData.content,
      path:'/pages/post/post-detail/post-detail'
    }
  },
  //创建animation实例
  setAnimation:function(){
    //定义动画
    var animationUp = wx.createAnimation({
      timingFunction:'ease-in-out'
    })
    this.animationUp = animationUp
  }
})