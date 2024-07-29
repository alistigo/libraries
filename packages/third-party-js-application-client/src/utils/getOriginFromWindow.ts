export default function getOriginFromWindow(window: Window): string {
  if (window.location.origin === 'null') {
    return '*';
  }
  return window.location.origin;
}
