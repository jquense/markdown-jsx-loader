'use strict';
var metadata = require('react-component-metadata');
var loaderUtils = require('loader-utils');
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var setCase = require('case')
var Renderer = require('./JsxRenderer');

marked.setOptions({
  xhtml: true,
  highlight: function(code, lang) {
    let prism = require('./prism-jsx');
    lang = lang && lang.indexOf('language-') === 0 ? lang.replace('language-', '') : lang;
    return prism.highlight(code, prism.languages[lang]);
  }
});

function defaultRender(contents, resourcePath, options) {
  let prefix = setCase.pascal(path.basename(resourcePath, '.md').toLowerCase() + '/');

  return `
var React = require('react');
${options.preamble || ''}

module.exports = React.createClass({
  displayName: '${prefix}',
  render: function() {
    return (
      <div {...this.props}>
        ${contents}
      </div>
    )
 }
});

${options.postamble || ''}
`;
}

module.exports = function(contents) {
  var options = this.options.markdownJsxLoader || {}

  this.cacheable();

  Renderer = options.renderer || this.options.renderer || Renderer;

  var render = options.render || defaultRender

  return render(marked(contents, {
    renderer: new Renderer()
  }), this.resourcePath, options)
}

module.exports.Renderer = Renderer
