import {
  useCallback,
  useEffect,
  useRef,
  useState,
  CSSProperties,
  HTMLAttributes,
} from "react";

/** 点的形状预设 */
export type DotShape = "circle" | "square" | "rounded";

export interface DotMatrixConfig {
  /** 每帧显示的点索引数组 */
  sequence: number[][];
  /** 网格列数，默认 7 */
  cols?: number;
  /** 网格行数，默认 7 */
  rows?: number;
  /** 单个点的尺寸(px)，默认 6 */
  dotSize?: number;
  /** 点之间的间距(px)，默认 2 */
  gap?: number;
  /** 点的形状：circle | square | rounded，默认 rounded */
  shape?: DotShape;
  /** 自定义圆角（优先级高于 shape） */
  radius?: number | string;
  /** 帧间隔时间(ms)，默认 100 */
  interval?: number;
  /** 是否播放，默认 true */
  active?: boolean;
  /** 循环次数，-1 表示无限循环，默认 -1 */
  loop?: number;
  /** 活跃点颜色 */
  color?: string;
  /** 非活跃点颜色 */
  inactiveColor?: string;
  /** 容器背景色 */
  bgColor?: string;
  /** 非活跃点的样式（优先级高于 inactiveColor） */
  dotStyle?: CSSProperties;
  /** 活跃点的样式（优先级高于 color） */
  activeDotStyle?: CSSProperties;
  /** 动画完成回调 */
  onFinish?: () => void;
  /** 帧变化回调 */
  onFrameChange?: (frameIndex: number) => void;
}

export type DotMatrixProps = DotMatrixConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "children">;

const DEFAULT_DOT_STYLE: CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.15)",
};

const DEFAULT_ACTIVE_STYLE: CSSProperties = {
  backgroundColor: "#ffffff",
};

const SHAPE_RADIUS: Record<DotShape, string> = {
  circle: "50%",
  square: "0",
  rounded: "2px",
};

export function DotMatrix({
  sequence,
  cols = 7,
  rows = 7,
  dotSize = 6,
  gap = 2,
  shape = "rounded",
  radius,
  interval = 100,
  active = true,
  loop = -1,
  color,
  inactiveColor,
  bgColor,
  dotStyle,
  activeDotStyle,
  onFinish,
  onFrameChange,
  style,
  ...restProps
}: DotMatrixProps) {
  const totalDots = cols * rows;
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set());

  const frameRef = useRef(0);
  const loopCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const borderRadius = radius !== undefined
    ? (typeof radius === "number" ? `${radius}px` : radius)
    : SHAPE_RADIUS[shape];

  const mergedDotStyle: CSSProperties = {
    ...DEFAULT_DOT_STYLE,
    borderRadius,
    ...(inactiveColor && { backgroundColor: inactiveColor }),
    ...dotStyle,
    width: dotSize,
    height: dotSize,
  };

  const mergedActiveStyle: CSSProperties = {
    ...mergedDotStyle,
    ...DEFAULT_ACTIVE_STYLE,
    ...(color && { backgroundColor: color }),
    ...activeDotStyle,
  };

  const containerStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
    gap: `${gap}px`,
    width: "fit-content",
    ...(bgColor && { backgroundColor: bgColor }),
    ...style,
  };

  const renderFrame = useCallback(
    (frameIndex: number) => {
      const frame = sequence[frameIndex];
      if (!frame) return;
      setActiveIndices(new Set(frame));
      onFrameChange?.(frameIndex);
    },
    [sequence, onFrameChange]
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    frameRef.current = 0;
    loopCountRef.current = 0;
    if (sequence.length > 0) {
      renderFrame(0);
    }
  }, [sequence, renderFrame]);

  useEffect(() => {
    if (!active || sequence.length === 0) {
      clearTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      const nextFrame = (frameRef.current + 1) % sequence.length;

      if (nextFrame === 0) {
        loopCountRef.current++;
        if (loop !== -1 && loopCountRef.current >= loop) {
          clearTimer();
          onFinish?.();
          return;
        }
      }

      frameRef.current = nextFrame;
      renderFrame(nextFrame);
    }, interval);

    return clearTimer;
  }, [active, sequence, interval, loop, renderFrame, clearTimer, onFinish]);

  return (
    <div {...restProps} style={containerStyle}>
      {Array.from({ length: totalDots }, (_, i) => (
        <div
          key={i}
          style={activeIndices.has(i) ? mergedActiveStyle : mergedDotStyle}
        />
      ))}
    </div>
  );
}
