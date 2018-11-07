//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    animationData:{},
    phonenum:"",
    load:false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
  
    wx.getStorage({
      key: "userInfo",
      success:function(e){
        console.log(e)
      }
    })
    wx.getStorage({
      key: 'change',
      success: (res)=> {
        this.setData({
          change:res.data
        })
      },
    })
   
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.login({
        success:  (e)=> {
          console.log(e)
          wx.request({
            url: "https://wechat.fangxing123.cn/api/Wechat/WxGetOpenId?code=" + e.code,
            success:  (res)=> {
              console.log(res)
              this.setData({
                openid:res.data
              })
              wx.request({
                url: "https://wechat.fangxing123.cn/api/Wechat/WxGetPhone?openid=" + res.data,
                success: (res) => {
                  console.log(res)
                  if (res.data && !this.data.change){
                    wx.redirectTo({
                      url: '/pages/success/success',
                    }) 
                  }else{
                    this.setData({
                      load:true
                    })
                
                    wx.removeStorage({
                      key: 'change',
                    })
                  }
                },
                fail: function (res) {
                  console.log(res)
                }
              });
            },
            fail: function (res) {
              console.log(res)
            }
          });
        },
      })
     
   
    // }
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
   
  },
  getPhoneNumber: function (e) {
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  onGotUserInfo: function (e) {
    console.log(e.detail)
    if (e.detail.userInfo){
      wx.setStorage({
        key: "userInfo",
        data: e.detail.userInfo
      })
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo:true
      })
      var data = {};
      data.nick_name = e.detail.userInfo.nickName;
      data.img = e.detail.userInfo.avatarUrl;
      data.province = e.detail.userInfo.province;
      data.gender = e.detail.userInfo.gender;
      data.city = e.detail.userInfo.city;
      data.country = e.detail.userInfo.country;
      data.openid = this.data.openid;
  
      wx.request({
        url: "https://wechat.fangxing123.cn/api/Wechat/SetUserInfo",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        data: data,
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {
          console.log(res)
        }
      });
      this.commit();
    }else{
      wx.showToast({
        title: '请提供授权',
      })
      this.commit();
    }
   
  },
  commit:function(){
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (this.data.phonenum=='') {
      wx.showToast({
        title: '淘宝id不能为空',
        icon:'none',
        duration:2000
      })
      return false;
    } else {
      var data={};
      data.phone = this.data.phonenum;
      data.openid = this.data.openid;
      wx.request({
        url: "https://wechat.fangxing123.cn/api/Wechat/SetPhone",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        data: data,
        success:  (res)=> {
          console.log(res)
          if(res.data){
            wx.removeStorage({
              key: 'change',
            })
            wx.redirectTo({
              url: '/pages/success/success',
            })
          }
         
        },
        fail: function (res) {
          console.log(res)
        }
      });
    
      return true;
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      phonenum: e.detail.value
    })
  },
  isPoneAvailable:  (phone)=> {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    console.log(this.phonenum)
    console.log(myreg.test(this.phonenum))
    if (!myreg.test(phone)) {
      return false;
    } else {
      return true;
    }
  },  
  onShareAppMessage: function (res) {
    // var pages = getCurrentPages();
    // var currentPage = pages[pages.length - 1];
    // var options = currentPage.options;
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    // }
    // return {
    //   title: this.data.product.title,
    //   path: 'pages/product/product?id=' + options.id,
    //   success: function (res) {
    //     // 转发成功
    //   },
    //   fail: function (res) {
    //     // 转发失败
    //   }
    // }
  }
})
