import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }
  :host slot {
    all: inherit;
    display: contents;
  }

  :host([hidden]) {
    display: none !important;
  }
`;
