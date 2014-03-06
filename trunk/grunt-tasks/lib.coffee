module.exports = ( grunt ) ->
    ###
    *   javascript
    ###
    lib = [
        'lib/jquery.min.js',
        'lib/json2.js',
        'lib/moment.js',
        'lib/jqUI/jquery-ui.js',
        'lib/loadmask/jquery.loadmask.js',

        'lib/SWFUpload/swfupload.js',
        'lib/SWFUpload/plugins/swfupload.cookies.js',
        'lib/SWFUpload/plugins/swfupload.queue.js',
        'lib/SWFUpload/plugins/swfupload.speed.js',
        'lib/SWFUpload/plugins/swfupload.swfobject.js',

        'lib/vex/vex.js',
        'lib/vex/vex.dialog.js'
    ]

    datagrid = [ 'lib/jqGrid/js/jquery.jqGrid.src.js','src/ebaui.DataGrid.js' ]
    treeview = [ 'lib/jqZtree/jquery.ztree.all-3.5.js','src/ebaui.TreeView.js' ]

    cat = grunt.config('concat') ? {}
    cat["js"] = { files:{} } unless cat["js"]?
    cat["js"]['files'] = {} unless cat["js"]['files']?
    jsfiles   = cat["js"]['files']

    jsfiles['build/ebaui.lib.js'] = lib
    jsfiles["../release/#{grunt.config('pkg.version')}/ebaui.lib.js"] = lib

    grunt.config('concat',cat)