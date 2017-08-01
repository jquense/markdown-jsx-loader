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

## License

MIT © [Jason Quense &lt;monastic.panic@gmail.com&gt;]()
