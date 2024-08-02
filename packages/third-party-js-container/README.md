# @alistigo/third-party-js-container

Integrate any 3rd party JS Application on your website

This library should be used on the **host** application.

```ts
import { container } from '@alistigo/third-party-js-container';

container.require(
  'http://my-cdn.com/my3rdPartyJsApp.js',
  document.getElementById('my3rdPartyJsApp-viewport')
);
container.call('setup', 'my-credentials');
```

## (Soon) Load third-party-js-container from CDN

```html
<script src="https://cdn.alistigo.com/third-party-js-container/latest.min.js"></script>
<script type="text/javascript">
  const app = window.thirdPartyContainer.require('http://my-cdn.com/app.js');
  app.call('setup', 'my-credentials', cookie.value);
</script>
```

## Implementation choices

### API not using Proxy

We can't polyfill Proxy properly ...
So instead of:

```js
window.alistigo.setup(args);
```

You have to do:

```js
window.alistigo.call('setup', args);
```
