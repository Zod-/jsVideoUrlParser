QUnit.test("TimeString Parser", function (assert) {
  "use strict";
  var s = 1,
    m = 60 * s,
    h = 60 * m,
    d = 24 * h,
    w = 7 * d,
    testPairs = {
      '1w': w,
      '1d': d,
      '1h': h,
      '1m': m,
      '1s': s,
      '1': s,
      '1w1d1h1m1s': w + d + h + m + s,
      '30w1m': 30 * w + m,
      '100': 100 * s,
      '4m30s': 4 * m + 30 * s,
      '04m30': 4 * m + 30 * s,
      '04m30s': 4 * m + 30 * s,
      '1h30m25s': h + 30 * m + 25 * s,
      '1h30m25': h + 30 * m + 25 * s,
      '1h30m25s25s': h + 30 * m + 25 * s + 25 * s,
      '1h30m25s25': h + 30 * m + 25 * s + 25 * s,
      '1h30m25s25s1h1w': h + 30 * m + 25 * s + 25 * s + h + w
    };

  for (var timeString in testPairs) {
    if (testPairs.hasOwnProperty(timeString)) {
      assert.equal(getTime(timeString), testPairs[timeString],
        timeString + ' === ' + testPairs[timeString]);
    }
  }
});

QUnit.test("GetQueryParams Tests", function (assert) {
  "use strict";
  assert.deepEqual(getQueryParams(undefined), {}, 'Undefined argument');
  assert.deepEqual(getQueryParams([]), {}, 'Not a string argument');
  assert.deepEqual(getQueryParams('http://foo.bar/test'), {}, 'No params');
  assert.deepEqual(getQueryParams('http://foo.bar/test?foo=bar'), {
    foo: 'bar'
  }, '?foo=bar');
  assert.deepEqual(getQueryParams('http://foo.bar/test?foo=bar&'), {
    foo: 'bar'
  }, '?foo=bar&');
  assert.deepEqual(getQueryParams('http://foo.bar/test#foo=bar'), {
    foo: 'bar'
  }, '#foo=bar');
  assert.deepEqual(getQueryParams('http://foo.bar/test#foo'), {
    foo: ''
  }, '#foo');
  assert.deepEqual(getQueryParams('http://foo.bar/test?foo=bar&faz=baz'), {
    foo: 'bar',
    faz: 'baz'
  }, '?foo=bar&faz=baz');
  assert.deepEqual(getQueryParams('http://foo.bar/test?foo=bar&faz=baz#fiz=biz'), {
    foo: 'bar',
    faz: 'baz',
    fiz: 'biz'
  }, '?foo=bar&faz=baz#fiz=biz');
  assert.deepEqual(getQueryParams('http://foo.bar/test?foo=bar&faz=baz#fiz'), {
    foo: 'bar',
    faz: 'baz',
    fiz: ''
  }, '?foo=bar&faz=baz#fiz');
});

QUnit.test("CombineParams Tests", function (assert) {
  "use strict";
  assert.equal(combineParams(undefined), '', 'Undefined argument');
  assert.equal(combineParams({}), '', 'No params object');

  assert.equal(combineParams({
    params: {
      foo: 'bar'
    }
  }), '?foo=bar', "{foo:'bar'}");
  assert.equal(combineParams({
    params: {
      foo: 'bar',
      faz: 'baz'
    }
  }), '?faz=baz&foo=bar', "{foo:'bar',faz:'baz'}");
  assert.equal(combineParams({
    params: {
      foo: 'bar',
      faz: 'baz',
      fiz: 'biz'
    }
  }), '?faz=baz&fiz=biz&foo=bar', "{foo: 'bar',faz: 'baz',fiz: 'biz'}");

  assert.equal(combineParams({
    hasParams: true,
    params: {
      foo: 'bar'
    }
  }), '&foo=bar', "{foo:'bar'}");
  assert.equal(combineParams({
    hasParams: true,
    params: {
      foo: 'bar',
      faz: 'baz'
    }
  }), '&faz=baz&foo=bar', "{foo:'bar',faz:'baz'}");
  assert.equal(combineParams({
    hasParams: true,
    params: {
      foo: 'bar',
      faz: 'baz',
      fiz: 'biz'
    }
  }), '&faz=baz&fiz=biz&foo=bar', "{foo: 'bar',faz: 'baz',fiz: 'biz'}");
});
