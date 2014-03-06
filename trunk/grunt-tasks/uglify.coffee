module.exports = ( grunt ) ->
    grunt.config('uglify',{
        release : 
            options : 
                mangle          : true
                compress        : true
                preserveComments: false

            files : 
                '../release/<%=pkg.version%>/<%=pkg.name%>.min.js'              : ['../release/<%=pkg.version%>/<%=pkg.name%>.js']
                '../release/<%=pkg.version%>/<%=pkg.name%>.templates.min.js'    : ['../release/<%=pkg.version%>/<%=pkg.name%>.templates.js']
                '../release/<%=pkg.version%>/<%=pkg.name%>.lib.min.js'          : ['../release/<%=pkg.version%>/<%=pkg.name%>.lib.js']
                '../release/<%=pkg.version%>/<%=pkg.name%>.uilayout.min.js'     : ['../release/<%=pkg.version%>/<%=pkg.name%>.uilayout.js']
                '../release/<%=pkg.version%>/<%=pkg.name%>.datagrid.min.js'     : ['../release/<%=pkg.version%>/<%=pkg.name%>.datagrid.js']
                '../release/<%=pkg.version%>/<%=pkg.name%>.treeview.min.js'     : ['../release/<%=pkg.version%>/<%=pkg.name%>.treeview.js']

    })