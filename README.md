# markdown-jsx-loader

Webpack loader that parses markdown as JSX

## Installation

```sh
$ npm install --save markdown-jsx-loader
```

## Usage

```js
{ loader: 'markdown-jsx', test: /\.jsx\.md$/ }
```

**Simple:**

```javascript
// webpack.config.js 

return {
  ...
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: 'markdown-jsx-loader'
          }
        ]
      }
    ]}
  }
  ...
}
```

**Advanced:**

The following example demonstrates how to adjust the markdown ([marked](https://github.com/chjj/marked)) and JSX renderer can be adjusted to include custom JSX components; in this case a component for icons called `Icon`.

```javascript
// webpack.config.js 

const marked = require('marked');
const mdRenderer = new marked.Renderer();

mdRenderer.heading = (text) => {
  return `
<h${level}>
  <Icon id='thumbs-up' />
  ${text}
</h${level + 1}>
  `;
};

const jsxRenderer = (contents, resourcePath, options) => (`
import React from 'react';
import Icon from 'path/to/component/from/md/Icon';

export default () => (<div>${contents}</div>);
`);

return {
  ...
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'markdown-jsx-loader',
            options: {
              renderer: mdRenderer,
              render: jsxRenderer
            }  
          }
        ]
      }
    ]
  }
  ...
}
```

### Notes

**HTML elements in Markdown:**

GitHub-flavored Markdown supports HTML elements, which can feature the `align` attribute. Unfortunately [JSX does not support `align`](https://facebook.github.io/react/docs/dom-elements.html#all-supported-html-attributes) and will throw a warning. You can either ignore the warning or customize the marked render to remove `align`. E.g.:

```javascript
// webpack.config.js 

const marked = require('marked');
const mdRenderer = new marked.Renderer();

mdRenderer.html = html =>
  mdRenderer.constructor.prototype.html(
    html.replace(/align=("|')[^"']*("|')/g, '')
  );

// (*) See note below.
mdRenderer.paragraph = paragraph =>
  mdRenderer.constructor.prototype.paragraph(
    paragraph.replace(/align=("|')[^"']*("|')/g, '')
  );

...
```

_Note:_ Marked is not perfect and seems to contain some bugs. One of them unfortunately is that HTML tags like `a` are not recognized as HTML but instead as a _paragraph_, therefore we have to add the `align`-replacer to both, _html_ and _paragraph_, transform functions.

You might run into more issues such as missing `tbody` elements when having custom HTML tables. It's therefore wise to keep the use of custom HTML elements to a minimum if possible.

## License

MIT © [Jason Quense &lt;monastic.panic@gmail.com&gt;]()
