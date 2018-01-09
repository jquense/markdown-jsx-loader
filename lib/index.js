'use strict';

var setCase = require('case');
var fs = require('fs');
var loaderUtils = require('loader-utils');
var marked = require('marked');
var path = require('path');
var Renderer = require('./JsxRenderer');

marked.setOptions({
  xhtml: true,
  highlight: function highlight(code, lang) {
    var prism = require('./prism-jsx');
    lang = lang && lang.indexOf('language-') === 0 ? lang.replace('language-', '') : lang;
    return prism.highlight(code, prism.languages[lang]);
  }
});

var defaultRender = function defaultRender(contents, resourcePath, options) {
  var prefix = setCase.pascal(path.basename(resourcePath, '.md').toLowerCase() + '/');

  return '\nvar React = require(\'react\');\n' + (options.preamble || '') + '\n\nmodule.exports = function () {\n  return (<div>' + contents + '</div>)\n};\n\nmodule.exports.displayName = \'' + prefix + '\';\n\n' + (options.postamble || '') + '\n';
};

module.exports = function (contents) {
  var options = loaderUtils.getOptions(this) || {};

  this.cacheable();

  var renderer = options.renderer || new Renderer();
  var render = options.render || defaultRender;

  return render(marked(contents, { renderer: renderer }), this.resourcePath, options);
};

module.exports.Renderer = Renderer;