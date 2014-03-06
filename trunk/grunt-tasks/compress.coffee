
module.exports = ( grunt ) ->
    grunt.config('compress',{
        release : 
            options : 
                mode   : 'zip'
                archive: '../release/<%=pkg.name%>-<%=pkg.version%>.zip'

            files : [{
                src : ['**']
                expand: true,
                cwd: '../release/<%=pkg.version%>/'
            }]

    });