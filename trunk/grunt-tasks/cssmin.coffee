module.exports = ( grunt ) ->
    
    name    = grunt.config( 'pkg' )['name']
    version = grunt.config( 'ver' )
    
    grunt.config('cssmin',{
        release :
            options : 
                keepSpecialComments: 0
                
            files :
                "release/<%=grunt.config( 'ver' )%>/css/lib.default.min.css"           : ["release/#{version}/css/lib.default.css"],
                "release/<%=grunt.config( 'ver' )%>/css/ebaui.form.min.css"            : ["release/#{version}/css/ebaui.form.css"],
                "release/<%=grunt.config( 'ver' )%>/css/ebaui.uilayout.min.css"        : ["release/#{version}/css/ebaui.uilayout.css"],
                "release/<%=grunt.config( 'ver' )%>/css/ebaui.datagrid.min.css"        : ["release/#{version}/css/ebaui.datagrid.css"],
                "release/<%=grunt.config( 'ver' )%>/css/ebaui.treeview.min.css"        : ["release/#{version}/css/ebaui.treeview.css"],
                "release/<%=grunt.config( 'ver' )%>/css/ebaui_default.min.css"         : ["release/#{version}/css/ebaui_default.css"]
    })