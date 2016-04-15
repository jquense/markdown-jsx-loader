'use strict';

var inherits = require('util').inherits,
    marked = require('marked');

module.exports = JsxRenderer;

function JsxRenderer() {
  marked.Renderer.call(this);
}

inherits(JsxRenderer, marked.Renderer);

JsxRenderer.unescape = function unescape(html) {
  return html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
};

JsxRenderer.prototype.codespan = function (text) {
  return '<code>{`' + JsxRenderer.unescape(text) + '`}</code>';
};

JsxRenderer.prototype.code = function (code, lang, escaped) {
  if (lang && this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      return '\n<pre>\n  <code\n    className="' + lang + '"\n    dangerouslySetInnerHTML={{ __html: `' + out.replace(/"/g, '\\"') + '` }}\n  />\n</pre>\n      ';
    }
  }

  return '\n<pre>\n  <code className="' + lang + '">\n    ' + (escaped ? code : '{`' + escape(code) + '`}') + '\n  </code>\n</pre>\n  ';
};

function escape(html) {
  return html.replace(/`/g, '&quot;');
}