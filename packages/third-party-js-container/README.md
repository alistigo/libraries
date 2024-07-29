# Third-party-js-loader

Integrate any 3rd party JS Application on your website

Example, integrating an App that will be loaded at a particular DOM position.
You can already communicate with the app using regular JS calls.

```html
<script type="text/javascript">
  /*** 3rd-party-js-loader-embed.min.js ***/
  window.my3rdPartyJsApp = window.thirdPartyContainer.require(
    'http://my-cdn.com/my3rdPartyJsApp.js',
    document.getElementById('my3rdPartyJsApp-viewport')
  );
  window.my3rdPartyJsApp.call('setup', 'my-credentials');
</script>

<div id="my3rdPartyJsApp-viewport" />
```

## Example for alist

```html
<script type="text/javascript">
  /*** 3rd-party-js-loader-embed.min.js ***/
  window.alist = window.thirdPartyContainer.require(
    'http://my-cdn.com/alist.js',
    document.getElementById('alist-viewport')
  );
  window.alist.call('setup', 'my-credentials', cookie.value); // JWT comes from user session and should be refreshed
</script>

<div id="alist-viewport" />

<button onClick="window.alist.add('http://a-url.com')">Add to a list</button>
```

## API

```js
3rdPartyJsLoader.require(
  url,
  node = undefined, // if undefined -> add it at the end of the body
  options = {
    viewport: {
      editableCss: true,
    }
  }
)
```

## Implementation choices

### API not using Proxy

We can't polyfill Proxy properly ...
So instead of:

```js
window.alist.setup(args);
```

You have to do:

```js
window.alist.call('setup', args);
```
