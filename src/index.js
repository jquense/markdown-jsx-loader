'use strict';

const setCase = require('case');
const fs = require('fs');
const loaderUtils = require('loader-utils');
const marked = require('marked');
const path = require('path');
const Renderer = require('./JsxRenderer');

marked.setOptions({
  highlight: function(code, lang) {
    const prism = require('./prism-jsx');
    lang = lang && lang.indexOf('language-') === 0 ? lang.replace('language-', '') : lang;
    return prism.highlight(code, prism.languages[lang]);
  }
});

function defaultRender(contents, resourcePath, options) {
  const prefix = setCase.pascal(path.basename(resourcePath, '.md').toLowerCase() + '/');

  return `
var React = require('react');
${options.preamble || ''}

module.exports = function () {
  return (<div>${contents}</div>)
});

module.exports.displayName = '${prefix}';

${options.postamble || ''}
`;
}

module.exports = function(contents) {
  const options = loaderUtils.getOptions(this) || {};

  this.cacheable();

  const renderer = options.renderer || new Renderer();
  const render = options.render || defaultRender;

  return render(marked(contents, { renderer }), this.resourcePath, options)
}

module.exports.Renderer = Renderer
