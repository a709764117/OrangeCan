Page({
  onTapJump:function(){
    wx.redirectTo({
      url: '../post/post',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onTapClear:function(){
    wx.clearStorage()
    wx.redirectTo({
      url: '../post/post',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
  
})