module.exports = ( grunt ) ->
    
    name    = grunt.config( "pkg" )["name"]
    version = grunt.config( "ver" )
    
    grunt.config("uglify",{
        release : 
            options : 
                mangle          : true
                compress        : true
                preserveComments: false

            files : 
                "release/<%=grunt.config( 'ver' ) %>/ebaui.min.js"              : ["release/#{version}/#{name}.js"]
                "release/<%=grunt.config( 'ver' ) %>/ebaui.templates.min.js"    : ["release/#{version}/#{name}.templates.js"]
                "release/<%=grunt.config( 'ver' ) %>/ebaui.lib.min.js"          : ["release/#{version}/#{name}.lib.js"]
                "release/<%=grunt.config( 'ver' ) %>/ebaui.uilayout.min.js"     : ["release/#{version}/#{name}.uilayout.js"]
                "release/<%=grunt.config( 'ver' ) %>/ebaui.datagrid.min.js"     : ["release/#{version}/#{name}.datagrid.js"]
                "release/<%=grunt.config( 'ver' ) %>/ebaui.treeview.min.js"     : ["release/#{version}/#{name}.treeview.js"]

    })