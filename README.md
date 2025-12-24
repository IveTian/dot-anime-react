<div align="center">

# 🔲 dot-anime-react

**Lightweight React dot matrix animation components**

[![npm version](https://img.shields.io/npm/v/dot-anime-react.svg?style=flat-square)](https://www.npmjs.com/package/dot-anime-react)
[![npm downloads](https://img.shields.io/npm/dm/dot-anime-react.svg?style=flat-square)](https://www.npmjs.com/package/dot-anime-react)
[![bundle size](https://img.shields.io/bundlephobia/minzip/dot-anime-react?style=flat-square)](https://bundlephobia.com/package/dot-anime-react)
[![license](https://img.shields.io/npm/l/dot-anime-react.svg?style=flat-square)](https://github.com/nicepkg/dot-anime-react/blob/main/LICENSE)

[Features](#features) · [Installation](#installation) · [Quick Start](#quick-start) · [Components](#components) · [API](#api-reference)

</div>

---

## Features

- 🎯 **Zero Dependencies** — Pure React implementation, no external libraries
- 🪶 **Lightweight** — Less than 3KB gzipped
- 🎨 **Highly Customizable** — Colors, shapes, sizes, and timing all configurable
- 📦 **TypeScript Ready** — Full type definitions included
- 🔄 **Frame-based Animation** — Simple and intuitive animation format
- ⚡ **Performant** — Optimized rendering with minimal re-renders

## Installation

```bash
npm install dot-anime-react
```

```bash
yarn add dot-anime-react
```

```bash
pnpm add dot-anime-react
```

## Quick Start

```tsx
import { DotMatrix } from 'dot-anime-react';

const sequence = [
  [24],
  [17, 23, 25, 31],
  [10, 16, 18, 24, 30, 32, 38],
  [17, 23, 25, 31],
  [24],
];

function App() {
  return <DotMatrix sequence={sequence} />;
}
```

That's it! The component renders a 7×7 dot grid and animates through the frames automatically.

---

## Components

### DotMatrix

The core component for rendering dot matrix animations.

```tsx
<DotMatrix
  sequence={sequence}
  cols={7}
  rows={7}
  dotSize={8}
  gap={3}
  shape="circle"
  interval={100}
  color="#00ffff"
  inactiveColor="#222"
/>
```

#### Understanding Frame Sequences

Each frame is an array of dot indices to activate. Index is calculated as `row × cols + column`:

```
7×7 Grid Layout:
 0  1  2  3  4  5  6
 7  8  9 10 11 12 13
14 15 16 17 18 19 20
21 22 23 24 25 26 27
28 29 30 31 32 33 34
35 36 37 38 39 40 41
42 43 44 45 46 47 48
```

#### Shape Options

```tsx
<DotMatrix shape="circle" />   // ● Round dots
<DotMatrix shape="square" />   // ■ Square dots
<DotMatrix shape="rounded" />  // ▢ Rounded squares (default)
<DotMatrix radius={4} />       // Custom border radius
```

#### Animation Control

```tsx
const [playing, setPlaying] = useState(true);

<DotMatrix
  sequence={sequence}
  active={playing}           // Play/pause
  loop={3}                   // Loop count (-1 for infinite)
  onFrameChange={(i) => {}}  // Frame change callback
  onFinish={() => {}}        // Animation complete callback
/>
```

#### Custom Styling

```tsx
<DotMatrix
  dotStyle={{ opacity: 0.3 }}
  activeDotStyle={{
    backgroundColor: '#0ff',
    boxShadow: '0 0 8px #0ff',
  }}
  bgColor="#000"
/>
```

---

### ScrambleText

Text scramble transition effect, perfect for status labels.

```tsx
import { ScrambleText } from 'dot-anime-react';

<ScrambleText
  text="Loading"
  duration={800}
  interval={30}
  chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  onComplete={() => console.log('done')}
/>
```

When `text` prop changes, the component animates through random characters before settling on the new text.

---

### DotFlow

A compound component combining DotMatrix and ScrambleText with auto-rotation support.

```tsx
import { DotFlow } from 'dot-anime-react';

const items = [
  { title: "Loading", frames: [[24], [17,23,25,31], [24]] },
  { title: "Success", frames: [[30], [23,30,37], [16,23,30,37,44]] },
  { title: "Error",   frames: [[0,6,42,48], [8,12,36,40]] },
];

// Uncontrolled with auto-play
<DotFlow items={items} autoPlay={3000} />

// Controlled mode
const [index, setIndex] = useState(0);
<DotFlow items={items} activeIndex={index} onChange={setIndex} />
```

#### Configuration

```tsx
<DotFlow
  items={items}
  direction="horizontal"  // or "vertical"
  spacing={16}
  matrix={{ dotSize: 8, shape: "circle", color: "#0ff" }}
  scramble={{ duration: 500 }}
  textSize={18}
  textColor="#0ff"
  textWeight={600}
/>
```

---

## API Reference

### DotMatrix Props

| Prop | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| `sequence` | `number[][]` | **required** | Animation frames (array of active dot indices) |
| `cols` | `number` | `7` | Grid columns |
| `rows` | `number` | `7` | Grid rows |
| `dotSize` | `number` | `6` | Dot size in pixels |
| `gap` | `number` | `2` | Gap between dots in pixels |
| `shape` | `"circle" \| "square" \| "rounded"` | `"rounded"` | Dot shape preset |
| `radius` | `number \| string` | — | Custom border radius (overrides shape) |
| `interval` | `number` | `100` | Frame duration in ms |
| `active` | `boolean` | `true` | Play/pause animation |
| `loop` | `number` | `-1` | Loop count (-1 = infinite) |
| `color` | `string` | `"#ffffff"` | Active dot color |
| `inactiveColor` | `string` | `"rgba(255,255,255,0.15)"` | Inactive dot color |
| `bgColor` | `string` | — | Container background |
| `dotStyle` | `CSSProperties` | — | Base dot styles |
| `activeDotStyle` | `CSSProperties` | — | Active dot styles (highest priority) |
| `onFrameChange` | `(index: number) => void` | — | Frame change callback |
| `onFinish` | `() => void` | — | Animation complete callback |

> Also accepts all `HTMLDivElement` attributes except `children`

### ScrambleText Props

| Prop | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| `text` | `string` | **required** | Target text |
| `chars` | `string` | `A-Z0-9` | Character set for scramble effect |
| `duration` | `number` | `800` | Animation duration in ms |
| `interval` | `number` | `30` | Character update interval in ms |
| `animate` | `boolean` | `true` | Enable/disable animation |
| `onComplete` | `() => void` | — | Animation complete callback |

> Also accepts all `HTMLSpanElement` attributes except `children`

### DotFlow Props

| Prop | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| `items` | `{ title: string, frames: number[][] }[]` | **required** | Animation items |
| `activeIndex` | `number` | — | Controlled mode index |
| `autoPlay` | `number` | — | Auto-rotation interval in ms |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction |
| `spacing` | `number` | `16` | Gap between matrix and text |
| `matrix` | `DotMatrixConfig` | — | DotMatrix props |
| `scramble` | `ScrambleTextConfig` | — | ScrambleText props |
| `textSize` | `number \| string` | `16` | Text font size |
| `textColor` | `string` | — | Text color (inherits from matrix.color) |
| `textWeight` | `number \| string` | `500` | Text font weight |
| `letterSpacing` | `number \| string` | — | Text letter spacing |
| `textStyle` | `CSSProperties` | — | Custom text styles |
| `onChange` | `(index: number) => void` | — | Index change callback |

> Also accepts all `HTMLDivElement` attributes except `children` and `onChange`

---

## TypeScript

Full type definitions are included:

```tsx
import type {
  DotMatrixProps,
  DotMatrixConfig,
  DotShape,
  ScrambleTextProps,
  ScrambleTextConfig,
  DotFlowProps,
  DotFlowConfig,
  DotFlowItem,
} from 'dot-anime-react';
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](./LICENSE) © dot-anime-react
