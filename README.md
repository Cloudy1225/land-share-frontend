# 闲置土地信息共享

微信小程序端



## 注意

### 关于WuxUI

我们使用的前端框架为[Wux UI](https://www.wuxui.com/#/introduce)，写代码时建议

- 在微信搜这个小程序预览
- 浏览器阅读文档https://www.wuxui.com/#/introduce
- 用微信开发者工具导入文件 **wux-ui-example**，（这个文件我会发群里）

**Attention**:

在 app.json 引入组件使用

```json
"usingComponents": {
    "wux-button": "wuxui-lib/button/index"
 }
```

在 page.json 引入组件使用

```json
"usingComponents": {
    "wux-button": "../../wuxui-lib/button/index"
}
```



### 关于git

- clone 到本地的master分支请不要修改，再本地创建自己的分支，名称为第一个首字母，如：

```bash
git branch lyh # 创建新分支
git checkout lyh # 切换新分支为当前分支
```

- push 请推送到自己的分支，合并到主分支将由小组成员讨论后再操作
- 务必在每次 commit 时添加必要的说明信息，说清楚你干了什么



### 关于代码

- 注释：js、wxml、wxss 等文件必须在关键处进行注释，json 文件本身不允许注释，但在书写时注意条理与排版。
- 命名：
  - 遵循 Java 命名规范，所有自定义命名均为类似情况：isEmpty，而不是 is_empty，尽量不要使用
  - 特殊情况如自定义组件的命名，使用 - ，如 custom-tab-bar

### 关于调试

学会用console.log()调试，但调试后请注释掉

面向百度调试就不说了，有解决不掉的在群里问一下，或许群友就踩过同样的坑，我们追求效率与质量。
