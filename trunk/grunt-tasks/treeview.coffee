module.exports = ( grunt ) ->
    
    name    = grunt.config( 'pkg' )['name']
    version = grunt.config( 'ver' )
    
    css = [ 'lib/jqZtree/css/default.css' ]
    cat = grunt.config('concat') ? {}

    cat["css"] = { files:{} } unless cat["css"]?
    cssname    = "ebaui.treeview.css"
    cssfiles   = cat["css"]['files']

    cssfiles["build/css/#{cssname}"] = css
    cssfiles["release/#{version}/css/#{cssname}"] = css

    js = [
        'lib/jqZtree/jquery.ztree.all-3.5.js',
        'build/ebaui.web/TreeView.js'
    ]

    filename  = "ebaui.treeview.js"
    cat["js"] = { files:{} } unless cat["js"]?
    cat["js"]['files'] = {} unless cat["js"]['files']?
    jsfiles   = cat["js"]['files']

    jsfiles["build/#{filename}"] = js
    jsfiles["release/#{version}/#{filename}"] = js

    grunt.config('concat',cat)