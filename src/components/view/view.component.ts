import { css, html } from 'lit';
import { hoverable } from '../../behavior/hoverable.js';
import { BaseElement } from '../../interinal/BaseElement.js';

export class View extends hoverable(BaseElement) {
  /**
   * 为什么 slot 要 all: inherit; display: contents; ?
   * 考虑如下例子
   *  <view>
   *    <div style="borer-radios: inherit">1</div>
   *  </view>
   *
   *  div 的属性继承，在 view 的 slot 会被隔离， 导致 div 的属性无法继承
   */
  static override styles = css`
    :host {
      display: block;
    }
    :host slot {
      all: inherit;
      display: contents;
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}
