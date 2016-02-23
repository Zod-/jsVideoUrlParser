QUnit.test("CanalPlus URLs", function (assert) {
  "use strict";
  var vi = {
      'provider': 'canalplus',
      'id': '1365175',
      'mediaType': 'video'
    },
    tests = [{
      videoInfo: cloneObject(vi),
      formats: {
        embed: 'http://player.canalplus.fr/embed/?vid=1365175'
      },
      urls: ['http://player.canalplus.fr/embed/?param=cplus&vid=1365175']
    }];

  assertUrlTest(assert, tests);
});
