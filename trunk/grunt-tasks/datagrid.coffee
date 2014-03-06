module.exports = ( grunt ) ->
    css = [
        'lib/jqGrid/css/jquery-ui-custom.css',
        'lib/jqGrid/css/ui.multiselect.css',
        'lib/jqGrid/css/ui.jqgrid.css'
    ]
    cat = grunt.config('concat') ? {}

    cat["css"] = { files:{} } unless cat["css"]?
    cssname    = "ebaui.datagrid.css"
    cssfiles   = cat["css"]['files']

    cssfiles["build/css/#{cssname}"] = css
    cssfiles["../release/#{grunt.config('pkg.version')}/css/#{cssname}"] = css

    js = [
        'lib/jqGrid/js/jquery.jqGrid.src.js',
        'lib/jqGrid/js/i18n/grid.locale-cn.js',
        'build/ebaui.web/DataGrid.js'
    ]

    filename  = "ebaui.datagrid.js"
    cat["js"] = { files:{} } unless cat["js"]?
    cat["js"]['files'] = {} unless cat["js"]['files']?
    jsfiles   = cat["js"]['files']

    jsfiles["build/#{filename}"] = js
    jsfiles["../release/#{grunt.config('pkg.version')}/#{filename}"] = js

    grunt.config('concat',cat)