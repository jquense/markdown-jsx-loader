'use strict';

var assert = require('assert');
var markdownJsxLoader = require('../src');
var fs = require('fs')

let read = () => fs.readFileSync(__dirname + '/test-file.md', 'utf8')

describe('markdown-jsx-loader', function () {
  let contents = read();

  let context

  beforeEach(() => context = {
    resourcePath: __dirname + '/test-file.md',
    options: {},
    cacheable: ()=>{}
  })

  it('should not break', function () {
    assert.ok(typeof markdownJsxLoader.call(context, contents) === 'string');
  });

  it('should use file as displayName', function () {
    assert.ok(markdownJsxLoader.call(context, contents)
      .match(/displayName\: 'TestFile'/gm)
    );
  });

  it('should use pre and post ambles', function () {
    context.options.markdownJsxLoader = {
      preamble: "// preample!!!",
      postamble: "// postamble!!!"
    }

    let results =  markdownJsxLoader.call(context, contents)

    assert.ok(results.match(/preample/gm));
    assert.ok(results.match(/postamble/gm));
  });
});
