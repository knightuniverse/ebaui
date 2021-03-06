module.exports = ( grunt ) ->
    
    name    = grunt.config( "pkg" )["name"]
    version = grunt.config( "ver" )
    
    grunt.config("copy",{
        dev : 
            files: [
                #   includes files in path and its subdirs
                {expand: true, src: ["src/css/images/**"], dest: "build/css/images/",filter: "isFile",flatten: true},
                #   awesome font-icon, @see http://www.bootcss.com/p/font-awesome/
                {expand: true, src: ["src/css/fonts/**"], dest: "build/css/fonts/",filter: "isFile",flatten: true},
                #   jquery loadmask
                {expand: true, src: ["lib/loadmask/images/**"], dest: "build/css/images/",filter: "isFile",flatten: true},
                #   jquery ztree
                {expand: true, src: ["lib/jqZtree/css/img/**"], dest: "build/css/images/ztree/",filter: "isFile",flatten: true},
                #   jqgrid
                {expand: true, src: ["lib/jqGrid/css/images/**"], dest: "build/css/images/jqgrid/",filter: "isFile",flatten: true}
            ]

        release : 
            files: [
                #   includes files in path and its subdirs
                {expand: true, src: ["src/css/images/**"], dest: "release/#{version}/css/images/",filter: "isFile",flatten: true},
                #   awesome font-icon,@see http://www.bootcss.com/p/font-awesome/
                {expand: true, src: ["src/css/fonts/**"], dest: "release/#{version}/css/fonts/",filter: "isFile",flatten: true},
                #   ebaui images
                {expand: true, src: ["lib/loadmask/images/**"], dest: "release/#{version}/css/images/",filter: "isFile",flatten: true},
                #   jquery ztree
                {expand: true, src: ["lib/jqZtree/css/img/**"], dest: "release/#{version}/css/images/ztree/",filter: "isFile",flatten: true},
                #   jqgrid
                {expand: true, src: ["lib/jqGrid/css/images/**"], dest: "release/#{version}/css/images/jqgrid/",filter: "isFile",flatten: true},
                #   font awsome
                {expand: false, src: ["doc/fontawsome/**"], dest: "release/#{version}/",filter: "isFile",flatten: true}
            ]
    })