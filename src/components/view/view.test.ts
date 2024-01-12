import { View } from './view.js';

import { fixture, assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { sleep } from '../../shared/sleep.js';

suite('my-element', () => {
  test('is defined', () => {
    const el = document.createElement('v-view');
    assert.instanceOf(el, View);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<v-view hover-class="hover">hello</v-view>`);
    await expect(el).dom.to.equal('<v-view hover-class="hover">hello</v-view>');
    const style = window.getComputedStyle(el);
    await expect(style.display).to.equal('block');

    el.dispatchEvent(new TouchEvent('touchstart'));

    // hover-start-time 生效
    await sleep(100);

    await expect(el.classList.value.trim()).to.equal('hover');
  });
});
