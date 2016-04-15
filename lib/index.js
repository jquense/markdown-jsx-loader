'use strict';
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var setCase = require('case');
var Renderer = require('./JsxRenderer');

marked.setOptions({
  xhtml: true,
  highlight: function highlight(code, lang) {
    var prism = require('./prism-jsx');
    lang = lang && lang.indexOf('language-') === 0 ? lang.replace('language-', '') : lang;
    return prism.highlight(code, prism.languages[lang]);
  }
});

function defaultRender(contents, resourcePath, options) {
  var prefix = setCase.pascal(path.basename(resourcePath, '.md').toLowerCase() + '/');

  return '\nvar React = require(\'react\');\n' + (options.preamble || '') + '\n\nmodule.exports = React.createClass({\n  displayName: \'' + prefix + '\',\n  render: function() {\n    return (\n      <div {...this.props}>\n        ' + contents + '\n      </div>\n    )\n }\n});\n\n' + (options.postamble || '') + '\n';
}

module.exports = function (contents) {
  var options = this.options.markdownJsxLoader || {};

  this.cacheable();

  Renderer = options.renderer || this.options.renderer || Renderer;

  var render = options.render || defaultRender;

  return render(marked(contents, {
    renderer: new Renderer()
  }), this.resourcePath, options);
};

module.exports.Renderer = Renderer;