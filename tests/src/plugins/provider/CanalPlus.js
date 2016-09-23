QUnit.test('CanalPlus Urls', function (assert) {
  var vi = {
    provider: 'canalplus',
    id: '1365175',
    mediaType: 'video'
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      embed: 'http://player.canalplus.fr/embed/?vid=1365175'
    },
    urls: [
      'http://player.canalplus.fr/embed/?vid=1365175',
      'http://www.canalplus.fr/humour/pid1784-les-guignols.html?vid=1365175'
    ]
  }];
  assertUrlTest(assert, tests);
});
