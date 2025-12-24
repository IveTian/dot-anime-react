import { createRoot } from "react-dom/client";
import { useState, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { DotMatrix, DotShape, ScrambleText, DotFlow, DotFlowItem } from "../src";

// 动画与文字绑定配置
const animations: Record<string, DotFlowItem & { description: string }> = {
  pulse: {
    frames: [
      [24],
      [17, 23, 25, 31],
      [10, 16, 18, 24, 30, 32, 38],
      [3, 9, 11, 17, 23, 25, 31, 37, 39, 45],
      [10, 16, 18, 24, 30, 32, 38],
      [17, 23, 25, 31],
      [24],
    ],
    title: "Pulse",
    description: "心跳脉冲效果",
  },
  scan: {
    frames: [
      [0, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, 32, 33, 34],
      [35, 36, 37, 38, 39, 40, 41],
      [42, 43, 44, 45, 46, 47, 48],
    ],
    title: "Scanning",
    description: "扫描检测中",
  },
  wave: {
    frames: [
      [0, 7, 14, 21, 28, 35, 42],
      [1, 8, 15, 22, 29, 36, 43],
      [2, 9, 16, 23, 30, 37, 44],
      [3, 10, 17, 24, 31, 38, 45],
      [4, 11, 18, 25, 32, 39, 46],
      [5, 12, 19, 26, 33, 40, 47],
      [6, 13, 20, 27, 34, 41, 48],
    ],
    title: "Wave",
    description: "波浪流动效果",
  },
  loading: {
    frames: [
      [24],
      [23, 24, 25],
      [16, 17, 18, 23, 25, 30, 31, 32],
      [9, 10, 11, 16, 18, 23, 25, 30, 32, 37, 38, 39],
      [2, 3, 4, 9, 11, 16, 18, 23, 25, 30, 32, 37, 39, 44, 45, 46],
    ],
    title: "Loading",
    description: "加载进度中",
  },
  success: {
    frames: [
      [30],
      [23, 30, 37],
      [16, 23, 30, 37, 44],
      [9, 16, 23, 30, 37, 44],
      [2, 9, 16, 23, 30, 37, 44],
    ],
    title: "Success",
    description: "操作成功",
  },
  error: {
    frames: [
      [0, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 42, 48],
      [8, 12, 16, 20, 24, 28, 32, 36, 40],
      [16, 20, 24, 28, 32],
      [24],
      [16, 20, 24, 28, 32],
      [8, 12, 16, 20, 24, 28, 32, 36, 40],
      [0, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 42, 48],
    ],
    title: "Error",
    description: "发生错误",
  },
};

type AnimationKey = keyof typeof animations;

// DotFlow 用的 items
const flowItems: DotFlowItem[] = Object.values(animations).map(({ title, frames }) => ({
  title,
  frames,
}));

function App() {
  const [tab, setTab] = useState<"components" | "dotflow">("components");
  const [animation, setAnimation] = useState<AnimationKey>("pulse");
  const [active, setActive] = useState(true);
  const [shape, setShape] = useState<DotShape>("circle");
  const [dotSize, setDotSize] = useState(8);
  const [gap, setGap] = useState(3);
  const [interval, setIntervalValue] = useState(100);
  const [color, setColor] = useState("#00ffff");
  const [inactiveColor, setInactiveColor] = useState("#222222");
  const [frameIndex, setFrameIndex] = useState(0);

  // ScrambleText 配置
  const [scrambleDuration, setScrambleDuration] = useState(500);
  const [textColor, setTextColor] = useState("#00ffff");
  const [syncColor, setSyncColor] = useState(true);

  // DotFlow 配置
  const [flowIndex, setFlowIndex] = useState(0);
  const [flowAutoPlay, setFlowAutoPlay] = useState(0);
  const [flowDirection, setFlowDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [textSize, setTextSize] = useState(20);

  const currentAnimation = animations[animation];
  const effectiveTextColor = syncColor ? color : textColor;

  const code = useMemo(() => {
    if (tab === "dotflow") {
      return `import { DotFlow } from 'dot-anime-react';

const items = [
  { title: "Pulse", frames: [[24], [17,23,25,31], ...] },
  { title: "Scanning", frames: [[0,1,2,3,4,5,6], ...] },
  { title: "Wave", frames: [[0,7,14,21,28,35,42], ...] },
  { title: "Loading", frames: [[24], [23,24,25], ...] },
  { title: "Success", frames: [[30], [23,30,37], ...] },
  { title: "Error", frames: [[0,6,8,12,...], ...] },
];

export function Demo() {
  const [index, setIndex] = useState(${flowIndex});

  return (
    <DotFlow
      items={items}
      activeIndex={index}
      ${flowAutoPlay > 0 ? `autoPlay={${flowAutoPlay}}` : "// autoPlay={3000}"}
      direction="${flowDirection}"
      spacing={20}
      matrix={{
        dotSize: ${dotSize},
        gap: ${gap},
        shape: "${shape}",
        interval: ${interval},
        color: "${color}",
        inactiveColor: "${inactiveColor}",
      }}
      scramble={{
        duration: ${scrambleDuration},
      }}
      textSize={${textSize}}
      textColor="${effectiveTextColor}"
      textWeight={500}
      onChange={setIndex}
    />
  );
}`;
    }

    return `import { DotMatrix, ScrambleText } from 'dot-anime-react';

const animations = {
  pulse: { title: "Pulse", frames: [[24], ...] },
  scan: { title: "Scanning", frames: [...] },
  // ...
};

export function Demo() {
  const [current, setCurrent] = useState('${animation}');
  const anim = animations[current];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <DotMatrix
        sequence={anim.frames}
        dotSize={${dotSize}}
        gap={${gap}}
        shape="${shape}"
        interval={${interval}}
        color="${color}"
        inactiveColor="${inactiveColor}"
      />
      <ScrambleText
        text={anim.title}
        duration={${scrambleDuration}}
        style={{ color: "${effectiveTextColor}" }}
      />
    </div>
  );
}`;
  }, [tab, animation, dotSize, gap, shape, interval, color, inactiveColor, scrambleDuration, effectiveTextColor, flowIndex, flowAutoPlay, flowDirection, textSize]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Panel */}
      <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button
            onClick={() => setTab("components")}
            style={{
              padding: "10px 20px",
              background: tab === "components" ? color : "#1a1a1a",
              border: "none",
              borderRadius: 8,
              color: tab === "components" ? "#000" : "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            DotMatrix + ScrambleText
          </button>
          <button
            onClick={() => setTab("dotflow")}
            style={{
              padding: "10px 20px",
              background: tab === "dotflow" ? color : "#1a1a1a",
              border: "none",
              borderRadius: 8,
              color: tab === "dotflow" ? "#000" : "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            DotFlow
          </button>
        </div>

        {tab === "components" ? (
          <>
            <h1 style={{ marginBottom: 8, fontSize: 24 }}>DotMatrix + ScrambleText</h1>
            <p style={{ marginBottom: 24, color: "#666" }}>
              点阵动画与文字分开使用，自由组合
            </p>

            {/* Main Preview */}
            <div
              style={{
                background: "#111",
                padding: 32,
                borderRadius: 12,
                marginBottom: 32,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <DotMatrix
                  sequence={currentAnimation.frames}
                  shape={shape}
                  dotSize={dotSize}
                  gap={gap}
                  interval={interval}
                  active={active}
                  color={color}
                  inactiveColor={inactiveColor}
                  onFrameChange={setFrameIndex}
                />
                <div>
                  <ScrambleText
                    text={currentAnimation.title}
                    duration={scrambleDuration}
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: effectiveTextColor,
                      letterSpacing: "0.02em",
                      display: "block",
                    }}
                  />
                  <ScrambleText
                    text={currentAnimation.description}
                    duration={scrambleDuration + 100}
                    chars="·-—"
                    style={{
                      fontSize: 14,
                      color: "#666",
                      marginTop: 6,
                      display: "block",
                    }}
                  />
                </div>
              </div>
              <div style={{ marginTop: 16, color: "#444", fontSize: 12 }}>
                Frame {frameIndex + 1} / {currentAnimation.frames.length}
              </div>
            </div>

            {/* Animation Selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", marginBottom: 8, color: "#888", fontSize: 14 }}>
                选择动画（点击切换，观察文字 scramble 效果）
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(Object.keys(animations) as AnimationKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setAnimation(key)}
                    style={{
                      padding: "10px 16px",
                      background: animation === key ? color : "#1a1a1a",
                      border: animation === key ? "none" : "1px solid #333",
                      borderRadius: 8,
                      color: animation === key ? "#000" : "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <DotMatrix
                      sequence={animations[key].frames}
                      dotSize={3}
                      gap={1}
                      shape={shape}
                      interval={150}
                      color={animation === key ? "#000" : "#666"}
                      inactiveColor={animation === key ? "rgba(0,0,0,0.2)" : "#333"}
                    />
                    <span style={{ fontSize: 13 }}>{animations[key].title}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ marginBottom: 8, fontSize: 24 }}>DotFlow</h1>
            <p style={{ marginBottom: 24, color: "#666" }}>
              封装组件，自动绑定点阵与文字，支持自动轮播
            </p>

            {/* DotFlow Preview */}
            <div
              style={{
                background: "#111",
                padding: 32,
                borderRadius: 12,
                marginBottom: 32,
              }}
            >
              <DotFlow
                items={flowItems}
                activeIndex={flowIndex}
                autoPlay={flowAutoPlay > 0 ? flowAutoPlay : undefined}
                direction={flowDirection}
                spacing={20}
                matrix={{
                  dotSize,
                  gap,
                  shape,
                  interval,
                  color,
                  inactiveColor,
                }}
                scramble={{
                  duration: scrambleDuration,
                }}
                textSize={textSize}
                textColor={effectiveTextColor}
                textWeight={500}
                onChange={setFlowIndex}
              />
              <div style={{ marginTop: 20, color: "#444", fontSize: 12 }}>
                {flowAutoPlay > 0 ? `自动轮播中 (${flowAutoPlay}ms)` : "手动切换模式"}
              </div>
            </div>

            {/* DotFlow Selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", marginBottom: 8, color: "#888", fontSize: 14 }}>
                切换动画项
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {flowItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setFlowIndex(index)}
                    style={{
                      padding: "8px 16px",
                      background: flowIndex === index ? color : "#1a1a1a",
                      border: flowIndex === index ? "none" : "1px solid #333",
                      borderRadius: 6,
                      color: flowIndex === index ? "#000" : "#fff",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            {/* DotFlow Controls */}
            <div
              style={{
                padding: 20,
                background: "#111",
                borderRadius: 8,
                border: "1px solid #333",
                marginBottom: 24,
              }}
            >
              <h3 style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>
                DotFlow 配置
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 13 }}>
                    自动轮播: {flowAutoPlay > 0 ? `${flowAutoPlay}ms` : "关闭"}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={500}
                    value={flowAutoPlay}
                    onChange={(e) => setFlowAutoPlay(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 13 }}>
                    布局方向
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["horizontal", "vertical"] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setFlowDirection(d)}
                        style={{
                          padding: "6px 12px",
                          background: flowDirection === d ? "#444" : "#222",
                          border: "none",
                          borderRadius: 6,
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        {d === "horizontal" ? "水平" : "垂直"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 13 }}>
                    文字大小: {textSize}px
                  </label>
                  <input
                    type="range"
                    min={12}
                    max={36}
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Common Controls */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {tab === "components" && (
            <div>
              <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 13 }}>
                播放控制
              </label>
              <button
                onClick={() => setActive(!active)}
                style={{
                  padding: "8px 20px",
                  background: active ? "#333" : color,
                  border: "none",
                  borderRadius: 6,
                  color: active ? "#fff" : "#000",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {active ? "⏸ Pause" : "▶ Play"}
              </button>
            </div>
          )}

          <div>
            <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 13 }}>
              点形状
            </label>
            <div style={{ display: "flex", gap: 6 }}>
              {(["circle", "rounded", "square"] as DotShape[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  style={{
                    padding: "6px 12px",
                    background: shape === s ? "#444" : "#222",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 13 }}>
              点大小: {dotSize}px
            </label>
            <input
              type="range"
              min={4}
              max={16}
              value={dotSize}
              onChange={(e) => setDotSize(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 13 }}>
              点间距: {gap}px
            </label>
            <input
              type="range"
              min={0}
              max={8}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 13 }}>
              帧间隔: {interval}ms
            </label>
            <input
              type="range"
              min={30}
              max={300}
              value={interval}
              onChange={(e) => setIntervalValue(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 13 }}>
              点阵颜色
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{ width: 32, height: 32, border: "none", borderRadius: 4 }}
                />
                <span style={{ fontSize: 12, color: "#666" }}>活跃</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="color"
                  value={inactiveColor}
                  onChange={(e) => setInactiveColor(e.target.value)}
                  style={{ width: 32, height: 32, border: "none", borderRadius: 4 }}
                />
                <span style={{ fontSize: 12, color: "#666" }}>非活跃</span>
              </div>
            </div>
          </div>
        </div>

        {/* ScrambleText 配置区 */}
        <div
          style={{
            marginTop: 24,
            padding: 20,
            background: "#111",
            borderRadius: 8,
            border: "1px solid #333",
          }}
        >
          <h3 style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>
            ScrambleText 配置
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 13 }}>
                动画时长: {scrambleDuration}ms
              </label>
              <input
                type="range"
                min={100}
                max={1500}
                step={50}
                value={scrambleDuration}
                onChange={(e) => setScrambleDuration(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 13 }}>
                文字颜色
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    color: "#666",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={syncColor}
                    onChange={(e) => setSyncColor(e.target.checked)}
                    style={{ accentColor: color }}
                  />
                  同步点阵
                </label>
                {!syncColor && (
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    style={{ width: 32, height: 32, border: "none", borderRadius: 4 }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div
        style={{
          width: 520,
          borderLeft: "1px solid #333",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #333",
            color: "#888",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{tab === "dotflow" ? "DotFlow 示例" : "组合使用示例"}</span>
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            style={{
              padding: "4px 10px",
              background: "#222",
              border: "1px solid #444",
              borderRadius: 4,
              color: "#888",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Copy
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <Editor
            height="100%"
            language="typescript"
            theme="vs-dark"
            value={code}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 12,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              padding: { top: 16 },
              lineHeight: 18,
            }}
          />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
