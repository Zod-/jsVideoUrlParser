QUnit.test("Vimeo URLs", function (assert) {
  "use strict";
  var vi = {
      'provider': 'vimeo',
      'id': '97276391',
      'mediaType': 'video'
    },
    tests = [{
      videoInfo: cloneObject(vi),
      createdUrl: 'https://vimeo.com/97276391',
      urls: ['https://vimeo.com/97276391',
        'https://vimeo.com/channels/staffpicks/97276391'
      ]
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://vimeo.com/96186586',
      urls: ['https://vimeo.com/album/2903155/video/96186586']
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://vimeo.com/97688625',
      urls: ['https://vimeo.com/groups/shortfilms/videos/97688625']
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://vimeo.com/24069938',
      urls: ['http://vimeopro.com/staff/frame/video/24069938']
    }];

  tests[1].videoInfo.id = '96186586';
  tests[2].videoInfo.id = '97688625';
  tests[3].videoInfo.id = '24069938';
  assertUrlTest(assert, tests);
});
