// pages/movie/movie.js
var app = getApp();
var util = require('../../util/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase + 
    "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + 
    "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + 
    "/v2/movie/top250" + "?start=0&count=3";

    console.log(inTheatersUrl)

    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250Url,"top250","豆瓣top250");
  },
  getMovieListData:function(url,settedKey,categoryTitle){
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header:{
        "content-type":"json"
      },
      success:function(res){
        that.processDoubanData(res.data,settedKey,categoryTitle)
      },
      fail:function(error){
        console.log(error)
      }
    })
  },
  processDoubanData:function(movieDouban,settedKey,categoryTitle){
    var movies = [];
    //for中的代码将所有豆瓣电影数据转化成我们需要的格式
    for(var idx in movieDouban.subjects){
      var subject = movieDouban.subjects[idx];
      var title = subject.title;
      if(title.length>=6){
        //电影标题只取前6个字
        title = title.substring(0,6) + "...";
      }
      var temp = {
        stars:util.convertToStarsArray(subject.rating.stars),
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id
      }
     // console.log(temp.title, temp.stars + " && " + subject.rating.stars)
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies:movies
    }

    this.setData(readyData)
  }
})