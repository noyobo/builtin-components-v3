import { View } from './view.js';

import { fixture, assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { sleep } from '../../shared/sleep.js';

suite('view', () => {
  test('is defined', () => {
    const el = document.createElement('v-view');
    assert.instanceOf(el, View);
  });

  test('测试 hover-class 正常工作', async () => {
    const el = await fixture(html`<v-view hover-class="hover-a hover-b">hello</v-view>`);
    await expect(el).dom.to.equal('<v-view hover-class="hover-a hover-b">hello</v-view>');
    const style = window.getComputedStyle(el);
    await expect(style.display).to.equal('block');

    el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));

    // hover-start-time 生效
    await sleep(100);

    await expect(el.classList.value.trim()).to.equal('hover-a hover-b');
  });

  test('测试 hover-stop-propagation 正常工作', async () => {
    const el = await fixture(
      html`
        <v-view hover-class="hover-b">
          <v-view hover-stop-propagation hover-class="hover-a">hello</v-view>
        </v-view>
      `
    );
    const child = el.querySelector('v-view') as View;

    child.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
    await sleep(100);

    await expect(child.classList.value.trim()).to.equal('hover-a');
    await expect(el.classList.value.trim()).to.equal('');

    child.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
    await sleep(100);

    await expect(child.classList.value.trim()).to.equal('');
    await expect(el.classList.value.trim()).to.equal('');
  });

  test('测试 touch-move 正常工作', async () => {
    const el = await fixture(
      html`
        <v-view hover-class="hover-b">
          <v-view hover-stop-propagation hover-class="hover-a">hello</v-view>
        </v-view>
      `
    );
    const child = el.querySelector('v-view') as View;

    child.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
    await sleep(100);
    child.dispatchEvent(new TouchEvent('touchmove', { bubbles: true }));
    await sleep(100);

    await expect(child.classList.value.trim()).to.equal('');
  });
});
