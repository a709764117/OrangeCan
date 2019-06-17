  // pages/post/post-comment/post-comment.js
import {
  DBPost
} from "../../../db/DBPost.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //控制使用键盘还是发送语音
    useKeyboardFlag: true,
    //控制input组件的初始值
    keyboardInputValue: '',
    //控制是否显示图片选择面板
    sendMoreMsgFlag: false,
    //控制已选择的图片
    chooseFiles: [],
    //被删除的图片序号
    deleteIndex: -1,
    //当前播放语音url
    currentAudio:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取评论数据
    var postId = options.id
    this.dbPost = new DBPost(postId)
    var comments = this.dbPost.getCommentData();

    //绑定评论数据
    this.setData({
      'comments': comments
    })
  },
  previewImg: function(event) {
    //获取评论序号
    var commentIdx = event.currentTarget.dataset.commentIdx,
      //获取图片序号
      imgIdx = event.currentTarget.dataset.imgIdx,
      imgs = this.data.comments[commentIdx].content.img;
    wx.previewImage({
      current: imgs[imgIdx], //当前显示图片的http链接
      urls: imgs, //需要预览的图片http链接列表
    })
  },

  switchInputType: function(event) {
    this.setData({
      useKeyboardFlag: !this.data.useKeyboardFlag
    })
  },
  bindCommentInput: function(event) {
    var value = event.detail.value;
    var pos = event.detail.cursor;
    if (pos != -1) {
      //光标在中间
      var left = event.detail.value.slice(0, pos);
      console.log(left);
      //计算光标的位置
      pos = left.replace(/qq/g, '*').length;
    }

    this.data.keyboardInputValue = value.replace(/qq/g, '*')

    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/qq/g, '*'),
      cursor: pos
    }
  },
  submitComment: function(event) {
    var imgs = this.data.chooseFiles;
    var newData = {
      username: '青石',
      avatar: '/images/avatar/avatar-3.png',
      create_time: new Date().getTime() / 1000,
      content: {
        txt: this.data.keyboardInputValue,
        img:imgs
      }
    };
    if (!newData.content.txt && imgs.length==0) {
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
  showCommitSuccessToast: function (event) {
    wx.showToast({
      title: '评论成功',
      duration: 1000,
      icon: "success"
    })
  },
  bindCommentData: function (event) {
    var comments = this.dbPost.getCommentData()
    this.setData({
      comments: comments
    });
  },
  //将所有相关的按钮状态、输入状态都恢复到初始化状态
  resetAllDefaultStatus: function (event) {
    this.setData({
      keyboardInputValue: '',
      chooseFiles: [],
      sendMoreMsgFlag: false
    });
  },
  sendMoreMsg: function(event) {
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },
  //选择本地照片与拍照
  chooseImage: function(event) {
    //已选择图片数组
    var imgArr = this.data.chooseFiles;
    //只能上传3张照片，包括拍照
    var leftCount = 3 - imgArr.length;
    if (leftCount <= 0) {
      return;
    }
    var sourceType = [event.currentTarget.dataset.category],
      that = this;
    wx.chooseImage({
      count: leftCount,
      sourceType: sourceType,
      success: function(res) {
        that.setData({
          chooseFiles: imgArr.concat(res.tempFilePaths)
        });
      },
    })
  },
  //删除已经选择的图片
  deleteImage:function(event){
    var deleteIndex = event.currentTarget.dataset.idx,
          that = this;
    that.setData({
      deleteIndex:deleteIndex
    });

    that.data.chooseFiles.splice(deleteIndex, 1);
    setTimeout(
      function(){
        that.setData({
          deleteIndex: -1,
          chooseFiles: that.data.chooseFiles
        });
      },500)
  },
  //开始录音
  recordStart:function(event){
    var that = this;
    that.setData({
      recodingClass:'recoding'
    });
    //记录录音开始时间
    that.startTime = new Date();
    wx.startRecord({
      success:function(res){
        //计算录音时长
        var diff = (that.endTime - that.startTime) / 1000;
        diff = Math.ceil(diff);

        //发送语音
        that.submitVoiceComment({url:res.tempFilePath,timeLen:diff})
      }
    })
  },
  //结束录音
  recordEnd:function(event){
    this.setData({
      recodingClass:''
    });
    this.endTime = new Date();
    wx.stopRecord()
  },
  //提交语音评论
  submitVoiceComment:function(audio){
    var newData = {
      username: '青石',
      avatar: '/images/avatar/avatar-3.png',
      create_time: new Date().getTime() / 1000,
      content: {
        txt: '',
        img: [],
        audio: audio
      }
    };
    //保存新评论到缓存数据库中
    this.dbPost.newComment(newData);
    //显示操作结果
    this.showCommitSuccessToast();
    //重新渲染并绑定所有评论
    this.bindCommentData();
  },

  //播放语音
  playAudio:function(event){
    var url = event.currentTarget.dataset.url,
        that = this;
    //暂停当前播放语音
    if(url == this.data.currentAudio){
      wx.pauseVoice();
      this.data.currentAudio = '';
    }
    //播放录音
    else{
      this.data.currentAudio = url;
      wx.playVoice({
        filePath: url,
        complete:function(){
          //只有当录音播放完毕才会执行
          that.data.currentAudio='';
        }
      });
    }
  }


})