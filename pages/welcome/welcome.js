Page({
  onTapJump:function(){
    wx.switchTab({
      url: '../post/post',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onTapClear:function(){
    wx.clearStorage()
    wx.switchTab({
      url: '../post/post',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
  
})