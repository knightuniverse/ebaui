#!/usr/bin/env coffee
module.exports = ( grunt ) ->
    grunt.config('jsdoc',{
        
        release : 
            src: [ 'build/ebaui.js','build/ebaui.datagrid.js','build/ebaui.treeview.js' ]
            options: {
                destination: 'doc'
            }
            
    })