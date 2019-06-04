Page({
  onTapJump:function(){
    wx.redirectTo({
      url: '../post/post',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})