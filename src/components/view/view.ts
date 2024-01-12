import { View } from './view.component';

export * from './view.component.js';

View.define('v-view', View);

declare global {
  interface HTMLElementTagNameMap {
    'v-view': View;
  }
}
