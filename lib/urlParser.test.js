const UrlParser = require('./urlParser');

function Foo() {
  this.provider = 'foo';
  this.alternatives = ['bar'];
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
  };
}

Foo.prototype.parse = function(url) {
  return {url: url};
};

Foo.prototype.createLongUrl = function(vi, params) {
  return {videoInfo: vi, params: params};
};

test('register foo plugin', () => {
  const parser = new UrlParser();
  parser.bind(new Foo());

  expect(parser.plugins).toHaveProperty('foo');
});

test('parse invalid url', () => {
  const parser = new UrlParser();
  parser.bind(new Foo());

  expect(parser.parse('abc.def')).toBeUndefined();
});

test('parse urls handled by foo plugin', () => {
  const parser = new UrlParser();
  parser.bind(new Foo());

  expect(parser.parse('http://bar.def').provider).toBe('foo');
  expect(parser.parse('https://abc.foo.def/ghi').provider).toBe('foo');
  expect(parser.parse('//abc.foo.def/ghi').provider).toBe('foo');
});

test('create with known provider and format', () => {
  const parser = new UrlParser();
  parser.bind(new Foo());

  const obj = {
    videoInfo: {
      provider: 'foo',
    },
    format: 'long',
  };
  expect(parser.create(obj).videoInfo).toEqual(obj.videoInfo);
});

test('create with unknown format', () => {
  const parser = new UrlParser();
  parser.bind(new Foo());

  const obj = {
    videoInfo: {
      provider: 'foo',
    },
    format: 'abc',
  };
  expect(parser.create(obj)).toBeUndefined();
});

test('try to create with unknown provider', () => {
  const parser = new UrlParser();
  parser.bind(new Foo());

  const obj = {
    videoInfo: {
      provider: 'abc',
    },
  };
  expect(parser.create(obj)).toBeUndefined();
});

test('create with internal params', () => {
  const parser = new UrlParser();
  parser.bind(new Foo());

  const obj = {
    videoInfo: {
      provider: 'foo',
      params: {
        foo: 'bar',
      },
    },
    params: 'internal',
  };
  expect(parser.create(obj).params).toEqual(obj.videoInfo.params);
});

function NoPc() {
  this.provider = 'nopc';
  this.formats = {};
}

test('plugin with no parse', () => {
  const parser = new UrlParser();
  parser.bind(new NoPc());

  expect(parser.parse('http://abc.com')).toBeUndefined();
});

test('plugin with no create', () => {
  const parser = new UrlParser();
  parser.bind(new NoPc());

  const obj = {
    videoInfo: {
      provider: 'nopc',
    },
  };
  expect(parser.create(obj)).toBeUndefined();
});
