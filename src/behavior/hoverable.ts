import { PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import timeout, { TimeoutInstance } from '../helpers/timeout';
import { BaseElement } from '../interinal/BaseElement';
import { Constructor } from '../interinal/interface';

const DEFAULT_HOVER_CLASS = 'none';

/**
 * 全局状态，内存中管理阻止 hover 状态向上传递
 *
 * @example
 * <view>
 *   <view hover-stop-propagation>单击此元素触发 hover 状态， 父节点不会出现 hover </view>
 * </view>
 */
const HOVER_GLOBAL_STATUS = { stopPropagation: false };

export declare class HoverableInterface {}

export const hoverable = <T extends Constructor<BaseElement>>(superClass: T): Constructor<HoverableInterface> & T => {
  class HoverableElement extends superClass {
    /** 指定按下去的样式类。当 hover-class="none" 时，没有点击态效果 */
    @property({ type: String, attribute: 'hover-class' })
    hoverClass = DEFAULT_HOVER_CLASS;

    /** 指定是否阻止本节点的祖先节点出现点击态 */
    @property({ type: Boolean, attribute: 'hover-stop-propagation' })
    hoverStopPropagation = false;

    /** 按住后多久出现点击态，单位毫秒 */
    @property({ type: Number, attribute: 'hover-start-time' })
    hoverStartTime = 20;

    /** 手指松开后点击态保留时间，单位毫秒 */
    @property({ type: Number, attribute: 'hover-stay-time' })
    hoverStayTime = 70;

    private _hoverStartTimeout: TimeoutInstance | undefined;
    private _hoverStayTimeout: TimeoutInstance | undefined;
    private _inHover = false;

    private _getHoverClass() {
      let hoverClass = this.hoverClass;
      hoverClass = hoverClass.trim();
      if (hoverClass == DEFAULT_HOVER_CLASS) {
        return null;
      } else {
        return hoverClass.split(/\s+/).filter(Boolean);
      }
    }

    private _hoverTouchStart(event: TouchEvent) {
      const self = this;
      const hoverClass = self._getHoverClass();
      if (HOVER_GLOBAL_STATUS.stopPropagation || event.touches.length > 1 || !hoverClass) {
        return;
      }

      if (self.hoverStopPropagation) {
        HOVER_GLOBAL_STATUS.stopPropagation = true;
      }

      const hoverStartTime = self.hoverStartTime;

      self._hoverStartTimeout?.clear();
      self._hoverStayTimeout?.clear();

      self._hoverStartTimeout = timeout({
        interval: hoverStartTime,
        callback: () => {
          if (hoverClass) {
            self._inHover = true;
            self.classList.add(...hoverClass);
          }
        },
      });
    }

    private _hoverTouchEnd() {
      const self = this;
      if (self._hoverStartTimeout) {
        self._hoverStartTimeout.clear();

        self._hoverStayTimeout = timeout({
          interval: self.hoverStayTime,
          callback: () => {
            self._hoverReset();
          },
        });
      }
    }

    private _hoverReset() {
      const self = this;
      const hoverClass = self._getHoverClass();
      if (hoverClass && self._inHover) {
        hoverClass.forEach((className: string) => {
          if (self.classList.contains(className)) {
            self.classList.remove(className);
          }
        });
      }

      self._inHover = false;
      HOVER_GLOBAL_STATUS.stopPropagation = false;
    }

    private _hoverTouchMove() {
      const self = this;
      self._hoverStartTimeout?.clear();
      self._hoverStayTimeout?.clear();
      self._hoverReset();
    }

    protected override firstUpdated(_changedProperties: PropertyValues) {
      super.firstUpdated(_changedProperties);
      const self = this;
      self.addEventListener('touchstart', self._hoverTouchStart, { passive: true });
      self.addEventListener('touchend', self._hoverTouchEnd, { passive: true });
      self.addEventListener('touchmove', self._hoverTouchMove, { passive: true });
      self.addEventListener('touchcancel', self._hoverTouchMove, { passive: true });
    }
  }
  return HoverableElement;
};
