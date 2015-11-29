var inherits = require('util').inherits
  , marked = require('marked')

module.exports = JsxRenderer;

function JsxRenderer(){
  marked.Renderer.call(this)
}

inherits(JsxRenderer, marked.Renderer)

JsxRenderer.unescape = function unescape(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

JsxRenderer.prototype.codespan = function(text) {
  return '<code>{`' + JsxRenderer.unescape(text) + '`}</code>';
};

JsxRenderer.prototype.code = function (code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      return `
<pre>
  <code
    className="${lang}"
    dangerouslySetInnerHTML={{ __html: \`${out.replace(/"/g, '\\"')}\` }}
  />
</pre>
      `;
    }
  }

  return `
<pre>
  <code className="${lang}">
    ${escaped ? code : '{`' + escape(code) + '`}'}
  </code>
</pre>
  `
};


function escape(html) {
  return html.replace(/`/g, '&quot;');
}
