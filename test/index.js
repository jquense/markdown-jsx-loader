import assert from 'assert';
import fs from 'fs';
import markdownJsxLoader from '../src';

let read = () => fs.readFileSync(__dirname + '/test-file.md', 'utf8')

describe('markdown-jsx-loader', function () {
  let contents = read();

  let context;

  beforeEach(() => context = {
    resourcePath: __dirname + '/test-file.md',
    loaderIndex: 0,
    query: {},
    cacheable: () => {}
  })

  it('should not break', function () {
    assert.ok(typeof markdownJsxLoader.call(context, contents) === 'string');
  });

  it('should use file as displayName', function () {
    assert.ok(markdownJsxLoader
      .call(context, contents)
      .match(/module\.exports\.displayName = 'TestFile';/gm)
    );
  });

  it('should use pre and post ambles', function () {
    const options = {
      preamble: '// preample!!!',
      postamble: '// postamble!!!'
    };
    context.query = options;

    const results =  markdownJsxLoader.call(context, contents)

    assert.ok(results.match(/preample/gm));
    assert.ok(results.match(/postamble/gm));
  });
});
