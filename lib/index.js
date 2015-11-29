'use strict';
var metadata = require('react-component-metadata');
var loaderUtils = require('loader-utils');
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var Renderer = require('./jsx-renderer');

marked.setOptions({
  xhtml: true,
  highlight: function(code, lang) {
    let prism = require('./prism-jsx');
    lang = lang && lang.indexOf('language-') === 0 ? lang.replace('language-', '') : lang;
    return prism.highlight(code, prism.languages[lang]);
  }
});


module.exports = function(contents) {
  var prefix = path.basename(this.resourcePath, '.md').toLowerCase() + '/';

  Renderer = this.options.renderer || Renderer;

  this.cacheable();

  return `
var React = require('react');

module.exports = React.createClass({
  displayName: '${prefix}',
  render: function() {
    return (
      <div {...this.props}>
        ${marked(contents, {
          renderer: new Renderer()
        })}
      </div>
    )
 }
});
`;
};
