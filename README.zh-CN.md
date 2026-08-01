# Brybry Pokemas Enhancer

[English](README.md) | 简体中文 | [日本語](README.ja.md)

一个使用原生 JavaScript 编写的 userscript，用于改善 `pokemon.brybry.ch` 的拍组页面。开发源码按职责拆分在 `src/` 中，用户最终只需安装仓库根目录生成的单文件脚本。

[安装 Brybry Pokemas Enhancer](https://raw.githubusercontent.com/charlie5188/brybry-pokemas-enhancer/main/brybry-enhancer.user.js)

> `brybry-enhancer.user.js` 是自动生成文件。请勿直接编辑；修改 `src/` 后运行 `npm run build`。

## 安装

### Safari

1. 从 App Store 安装 Userscripts for Safari。
2. 在 Safari 扩展设置中启用，并允许它访问 `pokemon.brybry.ch`。
3. 打开上方安装链接，将脚本添加到 Userscripts for Safari。
4. 打开或刷新 Brybry Pokemas 的拍组页面。

### Tampermonkey

1. 在支持的浏览器中安装 Tampermonkey。
2. 打开上方安装链接并确认安装。
3. 打开或刷新 Brybry Pokemas 的拍组页面。

仓库根目录中的生成文件是包含 metadata header 的完整 userscript。现有 Codex／Playwright 调试流程也可以继续把同一个文件直接注入线上页面，无需 userscript 管理器。

## 开发

需要 Node.js 20 或更高版本。

```sh
npm ci
npm run dev
```

`npm run dev` 会监听 `src/`，每次保存后自动重新生成根目录 userscript。

可用命令：

- `npm run build`：使用 esbuild 将源码、CSS 和数据打包为 `brybry-enhancer.user.js`。
- `npm run dev`：构建一次后进入 watch 模式。
- `npm run check`：在内存中重新构建，检查 metadata 位置、JavaScript 语法及已提交的生成文件是否为最新。
- `npm test`：`npm run check` 的别名。
- `npm run update:pomatools -- /path/to/pomatools.github.io`：从本地 PomaTools checkout 重新生成八种语言的缩写数据。

提交 Pull Request 前请运行：

```sh
npm run build
npm run check
```

请同时提交源码改动和重新生成的根目录 userscript。CI 会再次构建，并在生成文件不一致时失败。

## 项目结构

```text
src/
  index.js                 初始化与功能编排
  config.js                URL、存储键和共享配置
  i18n.js                  语言检测数据与界面文案
  state.js                 共享运行状态与默认值
  storage.js               筛选偏好与各拍组 Sync Grid 配置
  spoiler-protection.js    防剧透跳转、设置和敏感章节处理
  styles.css               所有注入样式
  styles.js                样式元素挂载
  data/
    index.js               Brybry 数据加载、索引和技能搜索文本
    pomatools-abbreviations/
      *-skills.json        各语言人工编写的 Sync Grid 技能缩写
      *-moves.json         各语言人工编写的招式缩写
  grid/
    index.js               格子文字、换行、响应式尺寸与 Tooltip
  picker/
    index.js               Dialog、筛选、排序与列表／图标视图
scripts/
  build.js                 确定性的 esbuild 构建流程与 watch 模式
  check.js                 生成文件、metadata 与语法检查
```

这些 JavaScript 文件按照 `scripts/build.js` 中声明的固定顺序组合，并共享同一个 userscript 运行作用域。项目不引入框架或运行时模块加载器。功能修改应放入职责最接近的源码文件，大型静态数据应放在 `src/data/`。

## 当前功能

- Sync Grid 格子最多显示四行响应式文字，字号上限 16px，并在需要时使用 PomaTools 缩写。
- Grid Tooltip 显示关联招式说明；Grid 尺寸响应窗口，并可按拍组记住配置。
- 双栏拍组选择器，支持图标／列表视图、多语言搜索、技能搜索、筛选和排序。
- 属性、定位、EX 定位、定位组合、弱点、初始星级、入手方式、Scout 类型、地方、Trainer Group 和超觉醒筛选。
- 可选的未实装拍组及 Grid 更新防剧透功能。
- 将 Sync Grid 章节移动到 Stats 之前。
- 使用原有存储键保存选择器偏好和各拍组 Sync Grid 配置。

拍组名称和筛选 metadata 始终读取 Brybry 当前数据，项目不维护独立的拍组数据库。

脚本遵循 Brybry 的内容语言 URL／Cookie，并支持同样的八种语言：英语、法语、德语、西班牙语、意大利语、日语、韩语和繁体中文。游戏术语及技能文本来自 Brybry，人工编写的 Grid 缩写来自 PomaTools。

当前缩写快照生成自 PomaTools commit `47943a730951580152bae7fa3d223c9ac97f80b1`。

## 许可证与署名

项目源码使用 [MIT License](LICENSE)。生成的 PomaTools 缩写数据不包含在该许可证中；来源与署名请参阅 [NOTICE.md](NOTICE.md)。

这是一个非官方的玩家项目。Pokémon、Pokémon Masters EX 及相关名称与素材归各自权利人所有。本项目与 Pokémon、DeNA、Nintendo、Creatures、GAME FREAK、Brybry 或 PomaTools 均无隶属关系，也未获得其官方认可。
