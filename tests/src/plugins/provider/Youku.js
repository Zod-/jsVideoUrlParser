var vk1 = 'http://static.youku.com/v1.0.0638/v/swf/';
QUnit.test('Youku Urls', function (assert) {
  var vi = {
    'provider': 'youku',
    'id': 'XMTQ3OTM4MzMxMg',
    'mediaType': 'video'
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      embed: 'http://player.youku.com/embed/XMTQ3OTM4MzMxMg',
      long: 'http://v.youku.com/v_show/id_XMTQ3OTM4MzMxMg',
      flash: 'http://player.youku.com/player.php/sid/XMTQ3OTM4MzMxMg/v.swf',
      static: vk1 + 'loader.swf?VideoIDS=XMTQ3OTM4MzMxMg'
    },
    urls: [
      'http://player.youku.com/embed/XMTQ3OTM4MzMxMg',
      'http://player.youku.com/player.php/sid/XMTQ3OTM4MzMxMg==/v.swf',
      'http://v.youku.com/v_show/id_XMTQ3OTM4MzMxMg',
      vk1 + 'loader.swf?VideoIDS=XMTQ3OTM4MzMxMg%3D%3D'
    ]
  }];

  assertUrlTest(assert, tests);
});
