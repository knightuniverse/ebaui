module.exports = ( grunt ) ->
    grunt.config('cssmin',{
        release :
            options : 
                keepSpecialComments: 0
                
            files :
                '../release/<%=pkg.version%>/css/lib.default.min.css'           : ['../release/<%=pkg.version%>/css/lib.default.css'],
                '../release/<%=pkg.version%>/css/ebaui.form.min.css'            : ['../release/<%=pkg.version%>/css/ebaui.form.css'],
                '../release/<%=pkg.version%>/css/ebaui.uilayout.min.css'        : ['../release/<%=pkg.version%>/css/ebaui.uilayout.css'],
                '../release/<%=pkg.version%>/css/ebaui.datagrid.min.css'        : ['../release/<%=pkg.version%>/css/ebaui.datagrid.css'],
                '../release/<%=pkg.version%>/css/ebaui.treeview.min.css'        : ['../release/<%=pkg.version%>/css/ebaui.treeview.css'],
                '../release/<%=pkg.version%>/css/ebaui_default.min.css'         : ['../release/<%=pkg.version%>/css/ebaui_default.css']
    })