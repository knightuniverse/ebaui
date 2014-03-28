module.exports = ( grunt ) ->
    
    name    = grunt.config( "pkg" )["name"]
    version = grunt.config( "ver" )

    grunt.registerTask( 'demo','generate ui demos',() -> 
        ctrls = grunt.file.expand( {
            filter:'isDirectory'
            cwd : 'demo'
        },'*' )

        api = grunt.file

        for item in ctrls
            res = api.read( "demo/#{item}/res.inc" )
            layout = """
                <!DOCTYPE html>
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
                    <title>{{title}}</title>
                    {{res}}
                </head>
                <body>{{content}}</body>
                </html>
            """

            api.recurse("demo/#{item}/", ( abspath, rootdir, subdir, filename ) -> 
                cake = filename.substr( 0,filename.length - 5 )
                ext = filename.substring( filename.indexOf('.') )

                return if ext is ".inc"

                return layout = api.read( abspath ) if ext is ".layout"

                file    = "build/demo/#{item.toLowerCase()}_#{cake}.html"
                title   = "#{item} #{cake}"
                content = api.read( abspath )
                html    = layout.replace('{{title}}'    ,title)
                                .replace('{{res}}'      ,res)
                                .replace('{{content}}'  ,content)

                api.write( file,html )
            )

    )