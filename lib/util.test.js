const {
  getTime,
  getQueryParams,
  combineParams,
} = require('./util');

const s = 1,
  m = 60 * s,
  h = 60 * m,
  d = 24 * h,
  w = 7 * d;

test('getTime: undefined', () => {
  expect(getTime()).toBe(0);
});

test('getTime: asd', () => {
  expect(getTime('asd')).toBe(0);
});

test('getTime: 1w', () => {
  expect(getTime('1w')).toBe(w);
});

test('getTime: 1d', () => {
  expect(getTime('1d')).toBe(d);
});

test('getTime: 1h', () => {
  expect(getTime('1h')).toBe(h);
});

test('getTime: 1m', () => {
  expect(getTime('1m')).toBe(m);
});

test('getTime: 1s', () => {
  expect(getTime('1s')).toBe(s);
});

test('getTime: 1', () => {
  expect(getTime('1')).toBe(s);
});

test('getTime: 01:00:00:00:00', () => {
  expect(getTime('01:00:00:00:00')).toBe(w);
});

test('getTime: 01:00:00:00', () => {
  expect(getTime('01:00:00:00')).toBe(d);
});

test('getTime: 01:00:00', () => {
  expect(getTime('01:00:00')).toBe(h);
});

test('getTime: 01:00', () => {
  expect(getTime('01:00')).toBe(m);
});

test('getTime: 0:01', () => {
  expect(getTime('0:01')).toBe(s);
});

test('getTime: 00:01', () => {
  expect(getTime('00:01')).toBe(s);
});

test('getTime: 1w1d1h1m1s', () => {
  expect(getTime('1w1d1h1m1s')).toBe(w + d + h + m + s);
});

test('getTime: 01:01:01:01:01', () => {
  expect(getTime('01:01:01:01:01')).toBe(w + d + h + m + s);
});

test('getTime: 30w1m', () => {
  expect(getTime('30w1m')).toBe(30 * w + m);
});

test('getTime: 30:00:00:01:00', () => {
  expect(getTime('30:00:00:01:00')).toBe(30 * w + m);
});

test('getTime: 100', () => {
  expect(getTime('100')).toBe(100 * s);
});

test('getTime: 4m30s', () => {
  expect(getTime('4m30s')).toBe(4 * m + 30 * s);
});

test('getTime: 04:30', () => {
  expect(getTime('04:30')).toBe(4 * m + 30 * s);
});

test('getTime: 04m30', () => {
  expect(getTime('04m30')).toBe(4 * m + 30 * s);
});

test('getTime: 04m30s', () => {
  expect(getTime('04m30s')).toBe(4 * m + 30 * s);
});

test('getTime: 1h30m25s', () => {
  expect(getTime('1h30m25s')).toBe(h + 30 * m + 25 * s);
});

test('getTime: 1:30:25', () => {
  expect(getTime('1:30:25')).toBe(h + 30 * m + 25 * s);
});

test('getTime: 1h30m25', () => {
  expect(getTime('1h30m25')).toBe(h + 30 * m + 25 * s);
});

test('getTime: 1h30m25s25s', () => {
  expect(getTime('1h30m25s25s')).toBe(h + 30 * m + 25 * s + 25 * s);
});

test('getTime: 1h30m25s25', () => {
  expect(getTime('1h30m25s25')).toBe(h + 30 * m + 25 * s + 25 * s);
});

test('getTime: 1h30m25s25s1h1w', () => {
  expect(getTime('1h30m25s25s1h1w')).toBe(h + 30 * m + 25 * s + 25 * s + h + w);
});

test('getQueryParams: undefined ', () => {
  expect(getQueryParams(undefined)).toEqual({});
});

test('getQueryParams: [] ', () => {
  expect(getQueryParams([])).toEqual({});
});

test('getQueryParams: no params', () => {
  expect(getQueryParams('http://foo.bar/test')).toEqual({});
});

test('getQueryParams: ?foo=bar', () => {
  expect(getQueryParams('http://foo.bar/test?foo=bar')).toEqual({
    foo: 'bar',
  });
});

test('getQueryParams: ?foo=bar&', () => {
  expect(getQueryParams('http://foo.bar/test?foo=bar&')).toEqual({
    foo: 'bar',
  });
});

test('getQueryParams: #foo=bar', () => {
  expect(getQueryParams('http://foo.bar/test#foo=bar')).toEqual({
    foo: 'bar',
  });
});

test('getQueryParams: #foo', () => {
  expect(getQueryParams('http://foo.bar/test#foo')).toEqual({
    foo: '',
  });
});

test('getQueryParams: multiple params', () => {
  expect(getQueryParams('http://foo.bar/test?foo=bar&faz=baz')).toEqual({
    foo: 'bar',
    faz: 'baz',
  });
  expect(getQueryParams('http://foo.bar/test?foo=bar&faz=baz#fiz=biz')).toEqual({
    foo: 'bar',
    faz: 'baz',
    fiz: 'biz',
  });
  expect(getQueryParams('http://foo.bar/test?foo=bar&faz=baz#fiz')).toEqual({
    foo: 'bar',
    faz: 'baz',
    fiz: '',
  });
});

test('combineParams: undefined', () => {
  expect(combineParams(undefined)).toBe('');
});

test('combineParams: {}', () => {
  expect(combineParams({})).toBe('');
});

test('combineParams: {foo:\'bar\'}', () => {
  expect(combineParams({
    params: {
      foo: 'bar',
    },
  })).toEqual('?foo=bar');
});

test('combineParams: {foo:\'bar\',faz:\'baz\'}', () => {
  expect(combineParams({
    params: {
      foo: 'bar',
      faz: 'baz',
    },
  })).toEqual('?faz=baz&foo=bar');
});

test('combineParams: {foo: \'bar\',faz: \'baz\',fiz: \'biz\'}', () => {
  expect(combineParams({
    params: {
      foo: 'bar',
      faz: 'baz',
      fiz: 'biz',
    },
  })).toEqual('?faz=baz&fiz=biz&foo=bar');
});

test('combineParams: {foo:\'bar\'} w/ hasParams', () => {
  expect(combineParams({
    hasParams: true,
    params: {
      foo: 'bar',
    },
  })).toEqual('&foo=bar');
});

test('combineParams: {foo:\'bar\',faz:\'baz\'} w/ hasParams', () => {
  expect(combineParams({
    hasParams: true,
    params: {
      foo: 'bar',
      faz: 'baz',
    },
  })).toEqual('&faz=baz&foo=bar');
});

test('combineParams: {foo: \'bar\',faz: \'baz\',fiz: \'biz\'} w/ hasParams', () => {
  expect(combineParams({
    hasParams: true,
    params: {
      foo: 'bar',
      faz: 'baz',
      fiz: 'biz',
    },
  })).toEqual('&faz=baz&fiz=biz&foo=bar');
});