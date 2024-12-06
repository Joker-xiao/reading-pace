# ReadingPace - 智能阅读节奏助手

ReadingPace 是一款智能的 Chrome 扩展，专注于提供网页阅读时间估算和阅读进度追踪，让您的网上阅读体验更加愉悦和高效。它就像您的私人阅读节奏教练，帮助您更好地把控阅读时间和进度。

## 🌟 主要特性

### 智能识别
- 自动识别文章页面
- 支持主流博客和文章平台
- 智能分析页面结构和内容
- 仅在有效文章页面显示

### 阅读时间估算
- 智能计算文章字数
- 自定义阅读速度设置
- 支持中英文混合内容
- 实时更新预计阅读时间

### 进度追踪
- 实时显示阅读进度条
- 计算剩余阅读时间
- 直观的进度百分比
- 阅读完成庆祝动画

### 交互设计
- 可拖动的悬浮显示框
- 优雅的半透明效果
- 鼠标悬停自动显示
- 不影响正常阅读体验

## 💻 安装方法

1. 下载源代码
   ```bash
   git clone https://github.com/yourusername/reading-pace.git
   cd reading-pace
   ```

2. 在Chrome中加载插件
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择插件源代码文件夹

## 🚀 使用说明

### 基本功能
- 插件会自动识别文章页面并显示阅读信息
- 显示框默认位于页面右上角
- 可通过拖动顶部手柄移动位置
- 鼠标移开后自动半透明

### 自定义设置
- 点击显示框中的速度设置调整阅读速度
- 设置范围：1-1000字/分钟
- 设置会自动保存
- 支持实时预览效果

### 阅读进度
- 滚动页面时自动更新进度
- 显示当前阅读百分比
- 预估剩余阅读时间
- 阅读完成时触发庆祝效果

## 🛠 技术实现

### 核心功能
- 文章识别算法
- 阅读进度计算
- 字数统计优化
- 交互动画效果

### 代码结构
- manifest.json: 插件配置文件
- content.js: 核心功能实现
- README.md: 项目说明文档
- 开发记录.md: 开发过程记录

## 📝 注意事项

- 文章识别基于智能算法，可能存在误判
- 阅读时间仅供参考，因人而异
- 建议根据个人阅读习惯调整速度
- 最低字数要求：500字

## 🔜 未来计划

- [ ] 添加深色/浅色主题
- [ ] 支持阅读历史记录
- [ ] 提供更多统计数据
- [ ] 优化文章识别算法
- [ ] 添加国际化支持

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 📄 开源协议

本项目采用 MIT 协议开源。