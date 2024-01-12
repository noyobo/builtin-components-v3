import {css, html} from 'lit';
import {HoverElement} from '../../behavior/HoverElement';

export class View extends HoverElement {
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
