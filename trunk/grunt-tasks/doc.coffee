#!/usr/bin/env coffee
module.exports = ( grunt ) ->
    
    name    = grunt.config( 'pkg' )['name']
    version = grunt.config( 'ver' )
    
    grunt.config('jsdoc',{
        release:
            src: ['README.md','build/ebaui.web/*.js']
            options: {
                'private'       : false
                'destination'   : "release/#{version}/doc"
                'template'      : 'doc/template/alivedise-docstrap'
            }
    })