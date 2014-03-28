module.exports = ( grunt ) ->
    #  the build task will has two tasks : dev and release
    #  includes files in path
    #  {expand: true, src: ['build/demo/*.php'], dest: '../release/<%=pkg.version%>/doc/', filter: 'isFile',flatten: true}, 
    grunt.initConfig(
        pkg: grunt.file.readJSON("package.json")
        ver: '1.0.1.5'
    );
    
    #  loading grunt task configs
    grunt.loadTasks('grunt-configs/');
    #   coffeescript supported
    #   https://github.com/gruntjs/grunt-contrib-coffee
    grunt.loadNpmTasks('grunt-contrib-coffee');
    #   loading grunt plugin:  grunt-contrib-less
    #   more info about this plugin, @see https://github.com/gruntjs/grunt-contrib-less
    #   more info about LESS, @see http://www.lesscss.net/article/home.html
    grunt.loadNpmTasks('grunt-contrib-less');
    #   loading grunt plugin:  grunt-contrib-concat
    #   use this to concat js and css files
    grunt.loadNpmTasks('grunt-contrib-concat');
    #   loading grunt plugin:  grunt-contrib-uglify
    grunt.loadNpmTasks('grunt-contrib-uglify');
    #   loading grunt plugin:  grunt-contrib-cssmin
    #   to minify your css
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    #   loading grunt plugin:  grunt-contrib-compress
    #   pack your js and css to a zip file
    grunt.loadNpmTasks('grunt-contrib-compress');
    #   loading grunt plugin:  grunt-contrib-copy
    #   https://github.com/gruntjs/grunt-contrib-copy
    grunt.loadNpmTasks('grunt-contrib-copy');
    #   run commands in grunt task
    #   https://www.npmjs.org/package/grunt-contrib-commands
    grunt.loadNpmTasks('grunt-contrib-commands');
    #   jsdoc
    grunt.loadNpmTasks('grunt-jsdoc');
    # Default task(s).
    grunt.registerTask('default', [ 'coffee:build','coffee:tmpl','concat','copy:dev','demo' ]);