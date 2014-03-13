#!/usr/bin/env coffee
module.exports = ( grunt ) ->
    grunt.config('jsdoc',{
        release:
            src: ['build/ebaui.web/*.js']
            options: {
                'private'       : false
                'destination'   : "../release/#{grunt.config('pkg')['version']}/doc"
                'template'      : 'doc/template/alivedise-docstrap'
            }
    })