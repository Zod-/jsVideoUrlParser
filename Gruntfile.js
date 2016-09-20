module.exports = function (grunt) {
  'use strict';

  var srcDir = 'src/';
  var testDir = 'tests/';
  var testSrcDir = testDir + srcDir;
  var providerDir = 'plugins/provider/';
  var outputFile = 'dist/jsVideoUrlParser.js';
  var minOutputFile = 'dist/jsVideoUrlParser.min.js';
  var testOutputFile = testDir + 'test.js';
  var header = srcDir + 'header.js';
  var footer = srcDir + 'footer.js';
  var dist = [header];
  var src = [srcDir + 'plugins/*.js', srcDir + 'urlParser.js'];
  var srcOldLength = src.length;
  var test = [
    srcDir + 'plugins/*.js',
    srcDir + 'urlParser.js',
    testSrcDir + '*.js',
    testSrcDir + 'plugins/*.js'
  ];
  var provider = {
    '--dailymotion': ['Dailymotion.js'],
    '--youtube': ['YouTube.js'],
    '--vimeo': ['Vimeo.js'],
    '--twitch': ['Twitch.js'],
    '--canalplus': ['CanalPlus.js'],
    '--youku': ['Youku.js'],
    '--coub': ['Coub.js'],
    '--template': ['Template.js']
  };

  grunt.option.flags().forEach(function (flag) {
    flag = flag.toLowerCase();
    if (provider.hasOwnProperty(flag)) {
      src.push(srcDir + providerDir + provider[flag]);
      test.push(testSrcDir + '' + providerDir + provider[flag]);
    }
  });

  //add all files when no flags were found
  if (src.length === srcOldLength) {
    src.push(srcDir + providerDir + '*.js');
    test.push(testSrcDir + providerDir + '*.js');
    //ignore template files
    src.push('!' + srcDir + providerDir + 'Template.js');
    test.push('!' + testSrcDir + providerDir + 'Template.js');
  }

  dist = dist.concat(src);
  dist.push(footer);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: dist,
        dest: outputFile,
      },
      test: {
        options: {
          banner: '(function(){\n\'use strict\';\n',
          footer: '\n})();'
        },
        src: test,
        dest: testOutputFile,
      }
    },
    uglify: {
      build: {
        src: outputFile,
        dest: minOutputFile
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      afterconcat: [outputFile, testOutputFile],
      other: ['Gruntfile.js']
    },
    qunit: {
      all: [testDir + 'index.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['concat', 'jshint', 'qunit', 'uglify']);
  grunt.registerTask('dist', ['concat:dist', 'uglify']);
  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('build', ['concat']);
};
