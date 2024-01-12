import { Constructor } from '../interinal/interface';
import { BaseElement } from '../interinal/BaseElement';

export const mixinDebug = <T extends Constructor<BaseElement>>(superClass: T): T => {
  class DebugElement extends superClass {
    override connectedCallback() {
      console.log('connectedCallback', this);
      super.connectedCallback();
    }

    override disconnectedCallback() {
      console.log('disconnectedCallback', this);
      super.disconnectedCallback();
    }

    override attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
      console.log('attributeChangedCallback', this);
      super.attributeChangedCallback(attrName, oldVal, newVal);
    }
  }

  return DebugElement;
};
