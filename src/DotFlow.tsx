import { CSSProperties, HTMLAttributes, useState, useEffect } from "react";
import { DotMatrix, DotMatrixConfig } from "./DotMatrix";
import { ScrambleText, ScrambleTextConfig } from "./ScrambleText";

export interface DotFlowItem {
  /** 显示的标题文字 */
  title: string;
  /** 动画帧序列 */
  frames: number[][];
}

export interface DotFlowConfig {
  /** 动画项列表 */
  items: DotFlowItem[];
  /** 当前激活的索引 */
  activeIndex?: number;
  /** 自动轮播间隔(ms)，不设置则不自动轮播 */
  autoPlay?: number;
  /** 布局方向 */
  direction?: "horizontal" | "vertical";
  /** 点阵与文字的间距 */
  spacing?: number;
  /** DotMatrix 配置 */
  matrix?: Omit<DotMatrixConfig, "sequence">;
  /** ScrambleText 配置 */
  scramble?: Omit<ScrambleTextConfig, "text">;
  /** 文字大小 */
  textSize?: number | string;
  /** 文字颜色 */
  textColor?: string;
  /** 文字粗细 */
  textWeight?: number | string;
  /** 字间距 */
  letterSpacing?: number | string;
  /** 文字样式（优先级最高） */
  textStyle?: CSSProperties;
  /** 索引变化回调 */
  onChange?: (index: number) => void;
}

export type DotFlowProps = DotFlowConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange">;

export function DotFlow({
  items,
  activeIndex: controlledIndex,
  autoPlay,
  direction = "horizontal",
  spacing = 16,
  matrix,
  scramble,
  textSize,
  textColor,
  textWeight,
  letterSpacing,
  textStyle,
  onChange,
  style,
  ...restProps
}: DotFlowProps) {
  const [internalIndex, setInternalIndex] = useState(0);

  // 支持受控和非受控模式
  const isControlled = controlledIndex !== undefined;
  const currentIndex = isControlled ? controlledIndex : internalIndex;

  const currentItem = items[currentIndex] || { title: "", frames: [[]] };

  // 自动轮播
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      if (!isControlled) {
        setInternalIndex(nextIndex);
      }
      onChange?.(nextIndex);
    }, autoPlay);

    return () => clearInterval(timer);
  }, [autoPlay, items.length, currentIndex, isControlled, onChange]);

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: direction === "horizontal" ? "row" : "column",
    alignItems: "center",
    gap: spacing,
    ...style,
  };

  const mergedTextStyle: CSSProperties = {
    fontSize: textSize ?? 16,
    fontWeight: textWeight ?? 500,
    color: textColor ?? matrix?.color ?? "#ffffff",
    ...(letterSpacing !== undefined && { letterSpacing }),
    ...textStyle,
  };

  return (
    <div {...restProps} style={containerStyle}>
      <DotMatrix
        sequence={currentItem.frames}
        {...matrix}
      />
      <ScrambleText
        text={currentItem.title}
        {...scramble}
        style={mergedTextStyle}
      />
    </div>
  );
}
