import * as CSS from 'csstype';

export interface Viewport {
  size?: ViewportSize;
  visible: boolean;
  type: ViewportPositionTypes;
  withDebug: boolean;
}

export enum ViewportPositionTypes {
  inline = 'inline',
  floating = 'floating',
  fullscreen = 'fullscreen',
}

export interface ViewportSize {
  width: CSS.Property.Width<string>;
  height: CSS.Property.Height<string>;
}

export interface FloatingViewport extends Viewport {
  top?: CSS.Property.Top<number>;
  left?: CSS.Property.Left<number>;
  right?: CSS.Property.Right<number>;
  bottom?: CSS.Property.Bottom<number>;
}

export const defaultViewportSize: ViewportSize = {
  width: 'auto',
  height: 'auto',
};

export const defaultInlineViewport: Viewport = {
  size: defaultViewportSize,
  visible: true,
  type: ViewportPositionTypes.inline,
  withDebug: false,
};

export const defaultFloatingViewport: FloatingViewport = {
  type: ViewportPositionTypes.floating,
  size: defaultViewportSize,
  visible: true,
  left: '0',
  top: '0',
  withDebug: false,
};
