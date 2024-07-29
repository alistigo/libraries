export function buildTargetDivNode(name: string): HTMLDivElement {
  const div = document.createElement('div');
  div.setAttribute('data-third-party-application', name);
  document.body.appendChild(div);
  return div;
}

export function buildIframe(
  name = 'super-iframe',
  disableSandboxing = false
): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('border', '0');
  iframe.setAttribute('cellspacing', '0');
  iframe.setAttribute('tabindex', '-1');
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('allowTransparency', 'true');
  iframe.setAttribute('importance', 'low');
  iframe.setAttribute('fetchpriority', 'low');
  iframe.setAttribute(
    'style',
    'border-style: none; opacity:0; visibility:none; width:0; height:0; display:none; position:absolute; overflow: hidden;'
  );
  if (!disableSandboxing) {
    iframe.setAttribute(
      'sandbox',
      'allow-scripts allow-same-origin allow-popups allow-top-navigation'
    );
  }

  iframe.setAttribute('allow', 'web-share');

  iframe.setAttribute('id', name);

  return iframe;
}
