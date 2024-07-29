/* eslint-disable no-restricted-globals */
export default function getWindowHost(): Window {
  return window.parent || window;
}
