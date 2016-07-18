QUnit.test('Coub Urls', function (assert) {
  'use strict';
  var vi = {
      'provider': 'coub',
      'id': 'by7sm',
      'mediaType': 'video'
    },
    tests = [{
      videoInfo: cloneObject(vi),
      formats: {
        embed: '//coub.com/embed/by7sm',
        long: 'https://coub.com/view/by7sm',
      },
      urls: [
        '//coub.com/embed/by7sm',
        'https://coub.com/view/by7sm'
      ]
    }];

  assertUrlTest(assert, tests);
});
