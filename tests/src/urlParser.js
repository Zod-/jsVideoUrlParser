QUnit.test("urlParser Object", function (assert) {
  "use strict";
  var parser = new URLParser();

  parser.bind({
    provider: 'foo',
    alternatives: ['bar'],
    parse: function (url) {
      return {
        url: url
      };
    },
    create: function (op) {
      return op;
    }
  });

  assert.notStrictEqual(parser.plugins.foo, undefined, 'Binding provider');
  assert.notStrictEqual(parser.plugins.bar, undefined, 'Binding alternative');

  assert.strictEqual(parser.parse('abc.def'), undefined, 'Undefined parse');
  assert.strictEqual(parser.parse('http://bar.def').provider, 'foo', 'Alternative parse');
  assert.strictEqual(parser.parse('https://abc.foo.def/ghi').provider, 'foo', 'Parse');

  var createObj1 = {
      videoInfo: {
        'provider': 'foo'
      },
      format: 'long'
    },
    createObj2 = {
      videoInfo: {
        'provider': 'foo'
      }
    },
    createObj3 = {
      videoInfo: {
        'provider': 'abc'
      }
    };
  assert.deepEqual(parser.create(createObj1), createObj1, 'Create');
  assert.strictEqual(parser.create(createObj2).format, 'short', 'Create short');
  assert.strictEqual(parser.create(createObj3), undefined, 'Undefined create');

  parser.bind({
    provider: 'abc'
  });

  assert.strictEqual(parser.parse('http://abc.com'), undefined, 'No .parse');
  assert.strictEqual(parser.create(createObj3), undefined, 'No .create');
});
