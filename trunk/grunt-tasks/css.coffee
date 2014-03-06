module.exports = ( grunt ) ->
    ###
    *   CSS
    ###
    ui =  [
        'src/css/font-awesome.css',
        'src/css/font-awesome-ie7.css',
        'src/css/ebaui.css'
    ]

    lib = [
        'lib/loadmask/jquery.loadmask.css',
        'lib/vex/css/vex.css',
        'lib/vex/css/vex-theme-default.css'
    ]

    all = lib.concat( ui )
    
    task = grunt.config('concat') || {}

    task['css'] = 
        'options' : {}
        'files'   : 
            'build/css/lib.default.css'  : lib
            'build/css/ebaui.form.css'   : ui
            'build/css/ebaui_default.css': all

            '../release/<%=grunt.config("pkg.version")%>/css/lib.default.css': lib
            '../release/<%=grunt.config("pkg.version")%>/css/ebaui.form.css' : ui
            '../release/<%=grunt.config("pkg.version")%>/css/ebaui_default.css': all

    grunt.config('concat',task)