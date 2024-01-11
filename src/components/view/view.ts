import {View} from './view.component';

export * from './view.component.js';

customElements.define('v-view', View);

declare global {
  interface HTMLElementTagNameMap {
    'v-view': View;
  }
}
