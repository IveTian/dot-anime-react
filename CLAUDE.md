# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

dot-anime-react 是一个 React 组件库，发布为 npm 包，支持 CommonJS 和 ESM 两种模块格式。

## Commands

```bash
# 构建（生成 CJS、ESM 和类型声明文件）
npm run build

# 开发模式（监听文件变化）
npm run dev

# 启动 Demo 预览
npm run demo

# 代码检查
npm run lint
```

## Architecture

- **构建工具**: tsup（基于 esbuild）
- **输出格式**: CommonJS (`dist/index.cjs`) 和 ESM (`dist/index.js`)
- **类型声明**: `dist/index.d.ts`
- **源码入口**: `src/index.ts`
- **React 版本**: peer dependency 支持 React 16.8.0+
- **零外部依赖**: 不依赖 Tailwind CSS、shadcn/ui 或其他 CSS 框架

## Components

### DotMatrix

点阵动画组件，通过帧序列控制点的显示状态。

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| sequence | `number[][]` | 必填 | 每帧显示的点索引数组 |
| cols | `number` | 7 | 网格列数 |
| rows | `number` | 7 | 网格行数 |
| dotSize | `number` | 6 | 单个点尺寸(px) |
| gap | `number` | 2 | 点间距(px) |
| shape | `DotShape` | `rounded` | 形状：`circle` \| `square` \| `rounded` |
| radius | `number \| string` | - | 自定义圆角（优先级高于 shape） |
| interval | `number` | 100 | 帧间隔(ms) |
| active | `boolean` | true | 是否播放 |
| loop | `number` | -1 | 循环次数，-1为无限 |
| color | `string` | `#ffffff` | 活跃点颜色 |
| inactiveColor | `string` | `rgba(255,255,255,0.15)` | 非活跃点颜色 |
| bgColor | `string` | - | 容器背景色 |
| dotStyle | `CSSProperties` | - | 非活跃点样式（优先级高于 inactiveColor） |
| activeDotStyle | `CSSProperties` | - | 活跃点样式（优先级高于 color） |
| onFinish | `() => void` | - | 动画完成回调 |
| onFrameChange | `(index: number) => void` | - | 帧变化回调 |

**点索引计算**: 索引 = 行 × cols + 列（从0开始，左上角为0）

### ScrambleText

文字乱码切换效果组件，当 text 变化时以 scramble 效果过渡。

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | `string` | 必填 | 要显示的文字 |
| chars | `string` | `A-Z0-9` | 乱码字符集 |
| duration | `number` | 800 | 动画总时长(ms) |
| interval | `number` | 30 | 字符更新间隔(ms) |
| animate | `boolean` | true | 是否启用动画 |
| onComplete | `() => void` | - | 动画完成回调 |

### DotFlow

封装组件，将 DotMatrix 和 ScrambleText 绑定，支持自动轮播。

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | `DotFlowItem[]` | 必填 | `{ title, frames }` 数组 |
| activeIndex | `number` | - | 受控模式当前索引 |
| autoPlay | `number` | - | 自动轮播间隔(ms) |
| direction | `"horizontal" \| "vertical"` | `horizontal` | 布局方向 |
| spacing | `number` | 16 | 点阵与文字间距 |
| matrix | `DotMatrixConfig` | - | 点阵配置 |
| scramble | `ScrambleTextConfig` | - | 文字动画配置 |
| textStyle | `CSSProperties` | - | 文字样式 |
| onChange | `(index: number) => void` | - | 索引变化回调 |
