
module.exports = ( grunt ) ->
    
    name    = grunt.config( 'pkg' )['name']
    version = grunt.config( 'ver' )
    
    grunt.config('compress',{
        release :
            
            options : 
                mode   : 'zip'
                archive: "release/#{name}-#{version}.zip"

            files : [{
                src : ['**']
                expand: true,
                cwd: 'release/#{version}/'
            }]

    });