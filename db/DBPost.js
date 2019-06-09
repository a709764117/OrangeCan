class DBPost {
  constructor(postId) {
    this.storageKeyName = "postList"; //所有的文章本地缓存存储键值
    this.postId = postId;
  }

  //本地缓存 保存/更新
  execSetStorageSync(data) {
    wx.setStorageSync(this.storageKeyName, data)
  }

  //得到全部文章信息
  getAllPostData() {
    var res = wx.getStorageSync(this.storageKeyName)
    if (!res) {
      res = require("../data/data.js").postList;
      this.execSetStorageSync(res);
    }
    return res
  }

  //获取指定id号的文章数据
  getPostItemById(){
    var postsData = this.getAllPostData()
    for(var i=0; i< postsData.length; i++){
      if (postsData[i].postId == this.postId){
        return{
          index: i,
          data: postsData[i]
        }
      }
    }
  }

  //更新本地的点赞，评论信息、收藏、阅读量
  updatePostData(category){
    var postItem = this.getPostItemById(),
        postData = postItem.data,
        allPostData = this.getAllPostData();
        
    switch(category){
      case 'collect':
        if (!postData.collectionStatus){
          //如果当前状态是未收藏
          postData.collectionNum++
          postData.collectionStatus = true
        }else{
          //如果当前状态是已收藏
          postData.collectionNum--
          postData.collectionStatus = false
        }
        break;
      case 'up':
        if (!postData.upStatus){
          //如果当前状态是未点赞
          postData.upNum++;
          postData.upStatus = true;
        }else{
          //如果当前状态是已点赞
          postData.upNum--;
          postData.upStatus = false;
        }
        break;
      default:
        break;
    }
    //更新缓存数据库
    allPostData[postItem.index] = postData;
    this.execSetStorageSync(allPostData);

    return postData
  }

  //收藏文章
  collect(){
    return this.updatePostData('collect');
  }

  //点赞文章
  up(){
    return this.updatePostData('up');  
  }

  //获取文章的评论数据
  getCommentData(){
    var itemPost = getPostItemById().data;

    //评论按照最新时间排序，降序
    itemPost.comments.sort(this.compareWithTime);
    var len = itemPost.data.comments.length,
        comment;
    for(var i = 0;i<len;i++){
      comment = itemPost.comments[i];
      comment.create_time = util.getDiffTime(comment.create_time,true);
    }
    
    return itemPost.comments
  }

  compareWithTime(value1,value2){
    var flag = parseFloat(value1.create_time) - parseFloat(value2.create_time)
    if(flag > 0){
      return -1;
    }else if(flag == 0){
      return 0;
    }else if(flag < 0){
      return 1;
    }
  }

};
export{DBPost}
