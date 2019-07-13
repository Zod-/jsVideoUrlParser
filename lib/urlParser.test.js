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
  return {
    url: url,
  };
};

Foo.prototype.createLongUrl = function(vi, params) {
  return {
    videoInfo: vi,
    params: params,
  };
};

test('UrlParser: undefined', () => {
  expect(new UrlParser().parse('https://')).toBe(undefined);
  expect(new UrlParser().parse('asdasd')).toBe(undefined);
  expect(new UrlParser().parse()).toBe(undefined);
  expect(new UrlParser().create()).toBe(undefined);
  expect(new UrlParser().create({})).toBe(undefined);
  expect(new UrlParser().create({ videoInfo: 'asd' })).toBe(undefined);
  expect(new UrlParser().create({ videoInfo: {} })).toBe(undefined);
});

test('UrlParser: register foo plugin', () => {
  const parser = new UrlParser();
  parser.bind(new Foo());

  expect(parser.plugins).toHaveProperty('foo');
});

test('UrlParser: parse invalid url', () => {
  const parser = new UrlParser();
  parser.bind(new Foo());

  expect(parser.parse('abc.def')).toBeUndefined();
});

test('UrlParser: parse urls handled by foo plugin', () => {
  const parser = new UrlParser();
  parser.bind(new Foo());

  expect(parser.parse('http://bar.def').provider).toBe('foo');
  expect(parser.parse('https://abc.foo.def/ghi').provider).toBe('foo');
  expect(parser.parse('//abc.foo.def/ghi').provider).toBe('foo');
});

test('UrlParser: create with known provider and format', () => {
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

test('UrlParser: create with unknown format', () => {
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

test('UrlParser: try to create with unknown provider', () => {
  const parser = new UrlParser();
  parser.bind(new Foo());

  const obj = {
    videoInfo: {
      provider: 'abc',
    },
  };
  expect(parser.create(obj)).toBeUndefined();
});

test('UrlParser: create with internal params', () => {
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

test('UrlParser: plugin with no parse', () => {
  const parser = new UrlParser();
  parser.bind(new NoPc());

  expect(parser.parse('http://abc.com')).toBeUndefined();
});

test('UrlParser: plugin with no create', () => {
  const parser = new UrlParser();
  parser.bind(new NoPc());

  const obj = {
    videoInfo: {
      provider: 'nopc',
    },
  };
  expect(parser.create(obj)).toBeUndefined();
});