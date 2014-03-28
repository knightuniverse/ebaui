module.exports = ( grunt ) ->
    
    name    = grunt.config( 'pkg' )['name']
    version = grunt.config( 'ver' )
    
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
    cssfiles["release/#{version}/css/#{cssname}"] = css

    js = [
        'lib/jqGrid/js/i18n/grid.locale-cn.js',
        'lib/jqGrid/js/jquery.jqGrid.src.js',
        'lib/jqGrid/plugins/*.js',
        'build/ebaui.web/DataGrid.js'
    ]

    filename  = "ebaui.datagrid.js"
    cat["js"] = { files:{} } unless cat["js"]?
    cat["js"]['files'] = {} unless cat["js"]['files']?
    jsfiles   = cat["js"]['files']

    jsfiles["build/#{filename}"] = js
    jsfiles["release/#{version}/#{filename}"] = js

    grunt.config('concat',cat)