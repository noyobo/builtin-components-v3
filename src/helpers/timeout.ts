type TimeoutOptions = {
  /** 时间间隔 */
  interval: number;
  /** 回调 */
  callback: { (this: TimeoutOptions): void };
};

export type TimeoutInstance = TimeoutOptions & {
  /** 首次调用时间 */
  startTime: number;
  /** 当前调用时间 */
  invokeTime: number;
  /** 待取消的关键帧 */
  cancelFrame: number;
  /** 取消当前关键帧 */
  clear: () => void;
};

export default function timeout(t: number | TimeoutOptions, options?: TimeoutInstance): TimeoutInstance {
  if (!options) {
    options = t as TimeoutInstance;
    options.startTime = Date.now();
    options.cancelFrame = window.requestAnimationFrame(function (t) {
      timeout(t, options);
    });
    options.clear = () => {
      window.cancelAnimationFrame((options as TimeoutInstance).cancelFrame);
    };
    return options;
  }

  options.invokeTime = Date.now();

  if (options.invokeTime - options.startTime >= options.interval) {
    options.callback.call(options);
  } else {
    options.cancelFrame = window.requestAnimationFrame(function (t) {
      timeout(t, options);
    });
  }

  return options;
}
