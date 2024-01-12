import {View} from './view.js';

import {fixture, assert, expect} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('my-element', () => {
  test('is defined', () => {
    const el = document.createElement('v-view');
    assert.instanceOf(el, View);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<v-view>hello</v-view>`);
    await expect(el).dom.to.equal('<v-view>hello</v-view>');
    const style = window.getComputedStyle(el);
    await expect(style.display).to.equal('block');

    el.dispatchEvent(new Event('touchstart'));

    await expect(el.classList.value.trim()).to.equal('hover');
  });
});
