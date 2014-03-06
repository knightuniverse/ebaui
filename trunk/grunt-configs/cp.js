// Generated by CoffeeScript 1.7.1
module.exports = function(grunt) {
  return grunt.config('copy', {
    dev: {
      files: [
        {
          expand: true,
          src: ['src/css/images/**'],
          dest: 'build/css/images/',
          filter: 'isFile',
          flatten: true
        }, {
          expand: true,
          src: ['src/css/fonts/**'],
          dest: 'build/css/fonts/',
          filter: 'isFile',
          flatten: true
        }, {
          expand: true,
          src: ['lib/loadmask/images/**'],
          dest: 'build/css/images/',
          filter: 'isFile',
          flatten: true
        }, {
          expand: true,
          src: ['lib/jqZtree/css/img/**'],
          dest: 'build/css/images/ztree/',
          filter: 'isFile',
          flatten: true
        }, {
          expand: true,
          src: ['lib/jqGrid/css/images/**'],
          dest: 'build/css/images/jqgrid/',
          filter: 'isFile',
          flatten: true
        }
      ]
    },
    release: {
      files: [
        {
          expand: true,
          src: ['src/css/images/**'],
          dest: '../release/<%=pkg.version%>/css/images/',
          filter: 'isFile',
          flatten: true
        }, {
          expand: true,
          src: ['src/css/fonts/**'],
          dest: '../release/<%=pkg.version%>/css/fonts/',
          filter: 'isFile',
          flatten: true
        }, {
          expand: true,
          src: ['lib/loadmask/images/**'],
          dest: '../release/<%=pkg.version%>/css/images/',
          filter: 'isFile',
          flatten: true
        }, {
          expand: true,
          src: ['lib/jqZtree/css/img/**'],
          dest: '../release/<%=pkg.version%>/css/images/ztree/',
          filter: 'isFile',
          flatten: true
        }, {
          expand: true,
          src: ['lib/jqGrid/css/images/**'],
          dest: '../release/<%=pkg.version%>/css/images/jqgrid/',
          filter: 'isFile',
          flatten: true
        }
      ]
    }
  });
};
