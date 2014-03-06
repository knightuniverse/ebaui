module.exports = ( grunt ) ->
    #  the build task will has two tasks : dev and release
    #  includes files in path
    #  {expand: true, src: ['build/demo/*.php'], dest: '../release/<%=pkg.version%>/doc/', filter: 'isFile',flatten: true}, 
    grunt.initConfig(
        pkg: grunt.file.readJSON("package.json")
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
    #   jasmine is a BDD test framework
    #   @see http://pivotal.github.io/jasmine/
    #   and we use a code coverage template mix-in for grunt-contrib-jasmine
    #   @see https://github.com/maenu/grunt-template-jasmine-istanbul
    grunt.loadNpmTasks('grunt-contrib-jasmine');
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
    #   loading grunt plugin:  grunt-contrib-htmlmin to minify your html template
    #   grunt.loadNpmTasks('grunt-contrib-htmlmin');
    #   loading grunt plugin:  grunt-contrib-copy
    #   https://github.com/gruntjs/grunt-contrib-copy
    grunt.loadNpmTasks('grunt-contrib-copy');

    # Default task(s).
    grunt.registerTask('default', [ 'coffee:build','coffee:tmpl','concat','copy:dev','demo' ]);