#!/usr/bin/env coffee
module.exports = ( grunt ) ->
    
    os = require('os')
    console.log( 'os.platform()' )
    console.log( os.platform() )
    
    grunt.config('command',{
        
        svnci:{
            cmd : 'svn ci -m '
        }
        
        svntag:{
            cmd : ''
        }
        
    })