module.exports = ( grunt ) ->
    
    name    = grunt.config( "pkg" )["name"]
    version = grunt.config( "ver" )
    
    css = ['lib/jqUILayout/layout-default.css']
    cat = grunt.config('concat') ? {}

    cat["css"] = { files:{} } unless cat["css"]?
    cssname    = "ebaui.uilayout.css"
    cssfiles   = cat["css"]['files']

    cssfiles["build/css/#{cssname}"] = css
    cssfiles["release/#{version}/css/#{cssname}"] = css

    js = [
        'lib/jqUILayout/jquery.layout.js',
        'build/ebaui.web/UiLayout.js'
    ]

    filename = "ebaui.uilayout.js"
    cat["js"] = { files:{} } unless cat["js"]?
    cat["js"]['files'] = {} unless cat["js"]['files']?
    jsfiles   = cat["js"]['files']

    jsfiles["build/#{filename}"] = js
    jsfiles["release/#{version}/#{filename}"] = js

    grunt.config('concat',cat)