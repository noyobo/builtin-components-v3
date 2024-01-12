import { CSSResultGroup, html } from 'lit';
import { hoverable } from '../../behavior/hoverable.js';
import { BaseElement } from '../../interinal/BaseElement.js';
import { styles } from './view.styles.js';

/**
 * @summary View 视图容器
 * @documentation https://docs.nature-ui.com/components/view
 * @status stable
 * @since 2.0
 *
 * @slot - 默认内容
 */

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
  static override styles: CSSResultGroup = styles;

  override render() {
    return html`<slot></slot>`;
  }
}
