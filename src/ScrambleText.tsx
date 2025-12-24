import { useEffect, useRef, useState, CSSProperties, HTMLAttributes } from "react";

export interface ScrambleTextConfig {
  /** 要显示的文字 */
  text: string;
  /** 乱码字符集，默认为大写字母和数字 */
  chars?: string;
  /** 动画总时长(ms)，默认 800 */
  duration?: number;
  /** 每个字符的更新间隔(ms)，默认 30 */
  interval?: number;
  /** 是否启用动画，默认 true */
  animate?: boolean;
  /** 动画完成回调 */
  onComplete?: () => void;
}

export type ScrambleTextProps = ScrambleTextConfig &
  Omit<HTMLAttributes<HTMLSpanElement>, "children">;

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function ScrambleText({
  text,
  chars = DEFAULT_CHARS,
  duration = 800,
  interval = 30,
  animate = true,
  onComplete,
  style,
  ...restProps
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const prevTextRef = useRef(text);
  const frameRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // 如果文字没变或不需要动画，直接显示
    if (text === prevTextRef.current || !animate) {
      setDisplayText(text);
      prevTextRef.current = text;
      return;
    }

    const targetText = text;
    const startTime = Date.now();
    const totalSteps = Math.ceil(duration / interval);

    // 清除之前的定时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    frameRef.current = 0;

    timerRef.current = setInterval(() => {
      frameRef.current++;
      const progress = Math.min((Date.now() - startTime) / duration, 1);

      // 计算当前应该显示多少个正确字符
      const revealedCount = Math.floor(progress * targetText.length);

      // 构建显示文字
      let result = "";
      for (let i = 0; i < targetText.length; i++) {
        if (i < revealedCount) {
          // 已揭示的字符
          result += targetText[i];
        } else if (targetText[i] === " ") {
          // 空格保持不变
          result += " ";
        } else {
          // 随机乱码字符
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(result);

      // 动画完成
      if (progress >= 1) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setDisplayText(targetText);
        prevTextRef.current = targetText;
        onComplete?.();
      }
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, chars, duration, interval, animate, onComplete]);

  // 初始渲染时直接显示文字
  useEffect(() => {
    prevTextRef.current = text;
  }, []);

  const textStyle: CSSProperties = {
    fontFamily: "monospace",
    whiteSpace: "pre",
    ...style,
  };

  return (
    <span {...restProps} style={textStyle}>
      {displayText}
    </span>
  );
}
