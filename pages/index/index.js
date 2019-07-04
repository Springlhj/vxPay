//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  oneClickLogin: function (e) {

    var code = "";
    var that = this;
    wx.login({
      success: function (res) {
        code = res.code;
        console.log(">>>" + code);
        var url = "https://api.weixin.qq.com/sns/jscode2session?appid=wx50b0df2cae595948&secret=338d17c6f8edcc89b7f27ef1d2bf6f16&js_code=" + code + "&grant_type=authorization_code";

        wx.request({
          url: url,
          success:function(res){
            console.info("-----------"+JSON.stringify(res));
            

          }
        }) 
      },
      fail: function () {
        wx.showToast({
          title: '无法访问网络',
          icon: '',
          image: '../../images/fail.png',
          duration: 2000
        });
        return;
      }
    });


  },
  zhifu:function(res){
    wx.request({
      url: "http://127.0.0.1:8081/api/wxp/wxPreOrder",
      method: 'post',
      data: {
        "commodityId": "10",
        "money": "2040",
        "openid": "op3G15NSSsT_PHaA8L_aYzYzztrM"
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.info("-------ooo----" + JSON.stringify(res));

        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.paySign,
          success: function (res) {

            wx.showToast({
              title: "支付成功!",
              duration: 2000,
            });
            setTimeout(function () {
              wx.navigateTo({
                url: '../user/dingdan?currentTab=0&otype=-1',
              });
            }, 2500);

          },
          fail: function (res) {
            wx.showToast({
              title: '支付失败',
              duration: 3000
            })
          }
        })
 
      }
    }) 
  }
})
