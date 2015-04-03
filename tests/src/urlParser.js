QUnit.test("urlParser Tests", function (assert) {
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
    defaultFormat: 'long',
    formats: {
      long: function (vi, params) {
        return {
          videoInfo: vi,
          params: params
        };
      }
    }
  });

  assert.notStrictEqual(parser.plugins.foo, undefined, 'Binding provider');
  assert.notStrictEqual(parser.plugins.bar, undefined, 'Binding alternative');

  assert.strictEqual(parser.parse('abc.def'), undefined, 'Undefined parse');
  assert.strictEqual(parser.parse('http://bar.def').provider, 'foo', 'Alternative parse');
  assert.strictEqual(parser.parse('https://abc.foo.def/ghi').provider, 'foo', 'Parse');
  assert.strictEqual(parser.parse('//abc.foo.def/ghi').provider, 'foo', 'Parse');

  var createObj1 = {
      videoInfo: {
        provider: 'foo'
      },
      format: 'long'
    },
    createObj2 = {
      videoInfo: {
        provider: 'foo'
      },
      format: 'abc'
    },
    createObj3 = {
      videoInfo: {
        provider: 'abc'
      }
    },
    createObj4 = {
      videoInfo: {
        provider: 'foo',
        params: {
          foo: 'bar'
        }
      },
      params: 'internal'
    };
  assert.deepEqual(parser.create(createObj1).videoInfo, createObj1.videoInfo, 'Create');
  assert.strictEqual(parser.create(createObj2), undefined, 'Create not existing format');
  assert.strictEqual(parser.create(createObj3), undefined, 'Create not existing provider');
  assert.deepEqual(parser.create(createObj4).params, createObj4.videoInfo.params, 'Create with internal params');

  parser.bind({
    provider: 'abc',
    formats: {}
  });

  assert.strictEqual(parser.parse('http://abc.com'), undefined, 'No .parse');
  assert.strictEqual(parser.create(createObj3), undefined, 'No .create');

  for (var plugin in urlParser.plugins) {
    if (urlParser.plugins.hasOwnProperty(plugin)) {
      assert.notStrictEqual(urlParser.plugins[plugin].defaultFormat, undefined, 'Defaultformat not undefined ' + plugin);
    }
  }
});
