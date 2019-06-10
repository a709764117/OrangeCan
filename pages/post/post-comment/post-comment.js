// pages/post/post-comment/post-comment.js
import { DBPost } from "../../../db/DBPost.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    useKeyboardFlag:true,
    keyboardInputValue:'',
    sendMoreMsgFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取评论数据
    var postId = options.id
    this.dbPost = new DBPost(postId)
    var comments = this.dbPost.getCommentData();

    //绑定评论数据
    this.setData({
      'comments': comments
    })
  },
  previewImg:function(event){
    //获取评论序号
    var commentIdx = event.currentTarget.dataset.commentIdx,
    //获取图片序号
      imgIdx = event.currentTarget.dataset.imgIdx,
        imgs = this.data.comments[commentIdx].content.img;
    wx.previewImage({
      current:imgs[imgIdx],//当前显示图片的http链接
      urls: imgs, //需要预览的图片http链接列表
    })
  },

  switchInputType:function(event){
    this.setData({
      useKeyboardFlag: !this.data.useKeyboardFlag
    })
  },
  bindCommentInput:function(event){
    var value = event.detail.value;
    var pos = event.detail.cursor;
    if(pos != -1){
      //光标在中间
      var left = event.detail.value.slice(0,pos);
      console.log(left);
      //计算光标的位置
      pos = left.replace(/qq/g,'*').length;
    }

    this.data.keyboardInputValue = value.replace(/qq/g, '*')

    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value:value.replace(/qq/g,'*'),
      cursor:pos
    }
  },
  submitComment:function(event){
    var newData = {
      username:'青石',
      avatar:'/images/avatar/avatar-3.png',
      create_time:new Date().getTime()/1000,
      content:{
        txt:this.data.keyboardInputValue
      }
    };
    if(!newData.content.txt){
      //如果没有评论内容，则不执行任何操作
      return
    }
    //保存新评论到缓存数据库中
    this.dbPost.newComment(newData);
    //显示操作结果Toast
    this.showCommitSuccessToast();
    //重新渲染并绑定所有评论
    this.bindCommentData();
    //评论栏恢复初始状态
    this.resetAllDefaultStatus();
  },
  showCommitSuccessToast:function(){
    wx.showToast({
      title: '评论成功',
      duration: 1000,
      icon:"success"
    })
  },
  bindCommentData:function(){
    var comments = this.dbPost.getCommentData()
    this.setData({
      comments:comments
    });
  },
  resetAllDefaultStatus:function(){
    this.setData({
      keyboardInputValue:''
    });
  },
  sendMoreMsg:function(){
    this.setData({
      sendMoreMsgFlag:!this.data.sendMoreMsgFlag
    })
  }


})