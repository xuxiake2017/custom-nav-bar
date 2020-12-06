## 自定义小程序导航栏

最近我司要做小程序，而我作为从来没碰过小程序的小白，只好先研究一番，同时也自己单独开了一个项目试试水，在做的过程中就遇到了自定义导航栏的需求，同时也想到后面公司项目可能也会有这样的需求，变决定深入探讨一下关于微信小程序如何自定义导航栏。

### 基本概念

首先了解一个基本概念，什么叫导航栏（小程序老玩家可自行忽略，想当初作为小白的我真是傻傻分不清啊...）

![小程序导航栏](https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%88%AA%E6%A0%8F/%E5%AF%BC%E8%88%AA%E6%A0%8F%E8%AF%B4%E6%98%8E.jpg)
这个是微信官方文档上面的图片

### 默认导航栏

> 小程序有默认导航栏

（示例图当然是祭出天下第一的Zelda）

![小程序有默认导航栏](https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%88%AA%E6%A0%8F/%E9%BB%98%E8%AE%A4%E6%9C%89%E5%AF%BC%E8%88%AA%E6%A0%8F.jpg)

这就是默认导航栏的样子，大家应该很熟悉了，从别的页面跳转过来的时候左上角还会有一个返回的小箭头，这里就不放图了

> 小程序无默认导航栏

![小程序无默认导航栏](https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%88%AA%E6%A0%8F/%E6%97%A0%E5%AF%BC%E8%88%AA%E6%A0%8F.jpg)

无默认导航栏的时候就是页面占据了整个手机屏幕，包含手机状态栏（手机状态栏是啥，应该不用再介绍了...），做到了沉浸化，其实这样是比较有美感的，但相应的开发成本也就高些

> 如何去掉默认的导航栏？

把Page（页面）的`JSON`文件中的`navigationStyle`字段改为`custom`，也就是自定义的意思，默认是`default`，即有默认的导航栏，详情见 [微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html)
```json
{
  "navigationStyle": "custom"
}
```
要注意的是右上角的小程序胶囊是没法去掉的，无论你是不是自定义导航栏，它都会一直在那里

### 如何自定义导航栏

下面就开始进入我们今天的正题，首先给大家看一下最终效果

> 最终效果

![最终效果](https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%88%AA%E6%A0%8F/%E6%9C%80%E7%BB%88%E6%95%88%E6%9E%9C.JPG)

定义了两个按钮，返回上一页和返回首页，当然你也可以做个搜索框，或者做个下拉选什么的都是可以的，前提是不要太丑...

**1.开发思路**

我们刚刚说的导航栏其实可以拆解成两部分，上面一部分叫状态栏，下面一部分才是真正的导航栏

> 状态栏部分

![状态栏部分](https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%88%AA%E6%A0%8F/%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%8B%86%E8%A7%A31.jpg)

> 真正的导航栏部分

![真正的导航栏部分](https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%88%AA%E6%A0%8F/%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%8B%86%E8%A7%A32.jpg)

**2.获取状态栏高度**

所以要弄一个空的view占据状态栏的位置，不能让我们Page页面的内容跟系统状态栏重叠，微信官方提供了相关API让我们可以很方便的获取状态栏的高度 [`wx.getSystemInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfo.html)

> 代码示例

```js
wx.getSystemInfo({
  success (res) {
    console.log(res.statusBarHeight) // 单位px
  }
})
```

**3.计算导航栏高度**

状态栏解决了，然后就是导航栏了，我这里的思路是以小程序右上角的胶囊作参考，大致公式如下

```
获取胶囊上边界的坐标 top（左边原点在Page页面左上角）
获取胶囊的高 height
获取状态栏的高（上文已经提及） statusBarHeight
那么导航栏的高
customNavHeight = (top - statusBarHeight) * 2 + height
```

关于获取胶囊的坐标长宽等信息，微信官方也是提供了相关api [`wx.getMenuButtonBoundingClientRect`](https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html)

> 代码示例

```js
// 这是一个同步方法
const rect = wx.getMenuButtonBoundingClientRect()
const {
  // 上边界的坐标
  top,
  // 高
  height,
  // 宽
  width
} = rect
```

**4.问题**

然后这个问题似乎就完美解决了？**NoNoNo**
当我一顿操作完成之后，总感觉哪里不对劲，总感觉有点错位，然后我就祭出了PS大法

![ps](https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%88%AA%E6%A0%8F/ps.jpg)

在微信开发者工具上，我选择的模拟机型是iPhone 5，这是微信api获取到的信息

![API胶囊坐标](https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%88%AA%E6%A0%8F/API%E8%83%B6%E5%9B%8A%E5%9D%90%E6%A0%87.JPG)

然后再到PS中使用参考线验证（放心，截整个模拟的Page页面时，一个像素也没少）
![PS胶囊坐标](https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%88%AA%E6%A0%8F/PS%E8%83%B6%E5%9B%8A%E5%9D%90%E6%A0%87.JPG)

然后奇怪的事就发生了，右边界坐标和左边界坐标是一丁点儿没差，上边界和下边界坐标足足差了**2px！**（在ps中可以很方便的量出，不过不同机型估计误差可能还会不一样），怪不得刚刚我总感觉有点错位，事实上早就有人发现这个问题了，我只不过又踩了一遍坑，下面是从小程序官方论坛的截图
![getMenuButtonBoundingClientRect错误](https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%88%AA%E6%A0%8F/getMenuButtonBoundingClientRect%E9%94%99%E8%AF%AF.JPG)

没办法只能将刚刚的公式再改进一下，不过这里要注意的是，不同的机型误差应该是不同的，这里只能给出个大概值
```
customNavHeight = (top - statusBarHeight + 2) * 2 + height
```

### 总结
经过上面的教程，大家应该也差不多知道怎样自定义小程序导航栏了，不过里面也有些坑，想要精准的控制导航栏的高度几乎不可能，肯定是有些偏差，因此我觉得自定义导航栏可以用来做沉浸的背景，还是可以的，例如下面的喜茶首页，这样可以提升用户的体验，程序整体美感也有所提高

> 喜茶首页

![喜茶首页](https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%88%AA%E6%A0%8F/%E5%96%9C%E8%8C%B6.jpg)

但是如果想自定义一些按钮，跟小程序胶囊一起对齐的话，这样可能就比较难，要是你的产品经理问起来，你就只好把锅甩给微信了[狗头]，希望微信官方能早日修复这个问题吧

### 贴出代码

> index.wxml

```html
<view
  class="container"
  style="height: {{ windowHeight }}px;"
>
  <view class="container-top">
    <view
      class="custom-header"
      style="height: {{ statusBarHeight + navBarHeight }}px;"
    >
      <!-- 占据状态栏的高度 -->
      <view class="custom-header__status-bar" style="height: {{ statusBarHeight }}px;"></view>
      <view
        style="height: {{ navBarHeight }}px; line-height: {{ navBarHeight }}px;"
        class="u-flex u-p-l-30 u-p-r-30"
      >
        <view
          style="height: {{ menuButtonHeight }}px; line-height: {{ menuButtonHeight }}px; width: {{ menuButtonWidth }}px; border-radius: {{ menuButtonHeight / 2 }}px;"
          class="u-flex u-p-l-20 u-p-r-20 custom-header__opt-button"
        >
          <text class="iconfont icon-arrow-left u-flex-1" bind:tap="goBack"></text>
          <text class="iconfont iconvertical_line custom-header__opt-button-interval u-flex-1"></text>
          <text class="iconfont icon-home-fill u-flex-1" bind:tap="goHome"></text>
        </view>
      </view>
    </view>
  </view>
</view>
```

> index.js

```js
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
```

> index.wxss

```css
.container {
}
.container-top {
  widows: 100%;
  height: 400rpx;
  background: url(https://read-1252195440.cos.ap-guangzhou.myqcloud.com/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%8A%B6%E6%80%81%E6%A0%8F/%E5%A1%9E%E5%B0%94%E8%BE%BE%E5%A4%A7%E5%B8%88%E4%B9%8B%E5%89%91.jpg) center center / cover no-repeat;
}

.custom-header__opt-button {
  border: 1px #dcdcdc solid;
  /* border: 1px #FF0000 solid; */
}
.custom-header__opt-button .icon-arrow-left {
  color: #000000;
  text-align: center;
  font-weight: 600;
}
.custom-header__opt-button .icon-home-fill {
  color: #000000;
  text-align: center;
  font-weight: 600;
}
.custom-header__opt-button-interval {
  color: #dcdcdc;
  font-weight: 600;
  text-align: center;
}
.icon-arrow-left {
  vertical-align: middle;
}
```

还有一些文件没贴出来，大家有需要自行到 `github` 取哈

> 项目仓库地址

[项目仓库地址](https://github.com/xuxiake2017/custom-nav-bar.git)
