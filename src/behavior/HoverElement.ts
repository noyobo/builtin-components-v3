import {LitElement, PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';
import timeout, {TimeoutInstance} from '../helpers/timeout';

const DEFAULT_HOVER_CLASS = 'none';

/**
 * 全局状态，内存中管理阻止 hover 状态向上传递
 *
 * @example
 * <view>
 *   <view>单击此元素触发 hover 状态， 父节点不会出现 hover </view>
 * </view>
 */
const HOVER_GLOBAL_STATUS = {stopPropagation: false};

export class HoverElement extends LitElement {
  @property({type: String, attribute: 'hover-class'})
  /** 指定按下去的样式类。当 hover-class="none" 时，没有点击态效果 */
  hoverClass = DEFAULT_HOVER_CLASS;
  /** 指定是否阻止本节点的祖先节点出现点击态 */
  @property({type: Boolean, attribute: 'hover-stop-propagation'})
  hoverStopPropagation = false;
  /** 按住后多久出现点击态，单位毫秒 */
  @property({type: Number, attribute: 'hover-start-time'})
  hoverStartTime = 20;
  /** 手指松开后点击态保留时间，单位毫秒 */
  @property({type: Number, attribute: 'hover-stay-time'})
  hoverStayTime = 70;

  _hoverStartTimeout: TimeoutInstance | undefined;
  _hoverStayTimeout: TimeoutInstance | undefined;
  _inHover = false;

  private _getHoverClass() {
    let hoverClass = this.hoverClass;
    hoverClass = hoverClass.trim();
    if (hoverClass == DEFAULT_HOVER_CLASS) {
      return null;
    } else {
      return hoverClass.split(/\s+/).filter(Boolean);
    }
  }

  private hoverTouchStart(event: TouchEvent) {
    const hoverClass = this._getHoverClass();
    if (
      HOVER_GLOBAL_STATUS.stopPropagation ||
      event.touches.length > 1 ||
      !hoverClass
    ) {
      return;
    }

    if (this.hoverStopPropagation) {
      HOVER_GLOBAL_STATUS.stopPropagation = true;
    }

    const hoverStartTime = this.hoverStartTime;

    this._hoverStartTimeout?.clear();
    this._hoverStayTimeout?.clear();

    this._hoverStartTimeout = timeout({
      interval: hoverStartTime,
      callback: () => {
        if (hoverClass) {
          this._inHover = true;
          this.classList.add(...hoverClass);
        }
      },
    });
  }

  private hoverTouchEnd() {
    if (this._hoverStartTimeout) {
      this._hoverStartTimeout.clear();

      this._hoverStayTimeout = timeout({
        interval: this.hoverStayTime,
        callback: () => {
          this._hoverReset();
        },
      });
    }
  }

  private _hoverReset() {
    const hoverClass = this._getHoverClass();
    if (hoverClass && this._inHover) {
      hoverClass.forEach((className: string) => {
        if (this.classList.contains(className)) {
          this.classList.remove(className);
        }
      });
    }

    this._inHover = false;
    HOVER_GLOBAL_STATUS.stopPropagation = false;
  }

  private hoverTouchMove() {
    this._hoverStartTimeout?.clear();
    this._hoverStayTimeout?.clear();
    this._hoverReset();
  }

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this.addEventListener('touchstart', this.hoverTouchStart, {passive: true});
    this.addEventListener('touchend', this.hoverTouchEnd, {passive: true});
    this.addEventListener('touchmove', this.hoverTouchMove, {passive: true});
    this.addEventListener('touchcancel', this.hoverTouchMove, {passive: true});
  }
}
