QUnit.test('Long Urls', function (assert) {
  var vi = {
    provider: 'wistia',
    id: 'lpu6bgplle',
    mediaType: 'video',
    channel: 'appboss',
    params: {
      start: 30
    }
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      long: 'https://appboss.wistia.com/medias/lpu6bgplle',
      embed: 'https://fast.wistia.com/embed/iframe/lpu6bgplle',
      embedjsonp: 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp'
    },
    urls: [
      'https://appboss.wistia.com/medias/lpu6bgplle',
    ]
  }, {
    videoInfo: cloneObject(vi),
    formats: {
      long: 'https://appboss.wistia.com/medias/lpu6bgplle?wtime=30',
      embed: 'https://fast.wistia.com/embed/iframe/lpu6bgplle?wtime=30',
      embedjsonp: 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp',
    },
    urls: [
      'https://appboss.wistia.com/medias/lpu6bgplle?wtime=30s'
    ]
  }];
  delete tests[0].videoInfo.params;
  assertUrlTest(assert, tests);
});

QUnit.test('Embed Urls', function (assert) {
  var vi = {
    provider: 'wistia',
    id: 'lpu6bgplle',
    mediaType: 'embedvideo',
    params: {
      start: 30
    }
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      embed: 'https://fast.wistia.com/embed/iframe/lpu6bgplle',
      embedjsonp: 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp'
    },
    urls: [
      'https://fast.wistia.com/embed/iframe/lpu6bgplle',
      'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp',
      'https://content.wistia.com/customer-stories/bizzabo?wvideo=lpu6bgplle',
      'https://wistia.com/blog/soapbox-videos-for-the-holidays?wvideo=lpu6bgplle',
      'https://wistia.com/library/how-to-look-good-on-a-webcam?wvideo=lpu6bgplle',
      'https://wistia.com/solutions/sales?wvideo=lpu6bgplle'
    ]
  }, {
    videoInfo: cloneObject(vi),
    formats: {
      embed: 'https://fast.wistia.com/embed/iframe/lpu6bgplle?wtime=30',
      embedjsonp: 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp',
    },
    urls: [
      'https://fast.wistia.com/embed/iframe/lpu6bgplle?wtime=30'
    ]
  }];
  delete tests[0].videoInfo.params;
  assertUrlTest(assert, tests);
});