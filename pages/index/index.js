// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    windowWidth: 0,
    // 状态栏高度（px）
    statusBarHeight: 0,
    navBarHeight: 0,
    menuButtonHeight: 0,
    menuButtonWidth: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getSystemInfo().then(({ info, rect }) => {
      console.log(info)
      console.log(rect)
      const {
        windowHeight,
        windowWidth,
        statusBarHeight
      } = info
      let {
        top,
        height,
        width
      } = rect
      top += 2
      const navBarHeight = (top - statusBarHeight) * 2 + height
      this.setData({
        windowHeight,
        windowWidth,
        statusBarHeight,
        navBarHeight,
        menuButtonHeight: height,
        menuButtonWidth: width,
      })
    })
    const rect = wx.getMenuButtonBoundingClientRect()
    let {
      top,
      height,
      width
    } = rect
  },
  getSystemInfo() {
    return new Promise((resolve, reject) => {
      const rect = wx.getMenuButtonBoundingClientRect()
      wx.getSystemInfo({
        success: info => {
          resolve({
            info, rect
          })
        }
      })
    })
  },
  goBack() {
    wx.navigateBack()
  },
  goHome() {
    wx.reLaunch({
      url: '/pages/home/home'
    })
  },
})