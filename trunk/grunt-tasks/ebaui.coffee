module.exports = ( grunt ) ->
    base = [
                'Core'
            ,   'Web'
            ,   'Control'
            ,   'Validator'
            ,   'FormField'
            ].map( ( item ) -> "src/ebaui.web/#{item}.coffee" )

    controls = [
                    'Panel'
                ,   'Button'

                ,   'TextBox'
                ,   'TextArea'
                ,   'Password'
                ,   'ButtonEdit'
                ,   'Captcha'

                ,   'Combo'
                ,   'ListBox'
                ,   'MiniGrid'

                ,   'CheckBox'
                ,   'CheckBoxList'
                ,   'RadioList'
                ,   'Hidden'
                ,   'Label'
                ,   'Spinner'

                ,   'TimeSpinner'
                ,   'MainView'
                ,   'MonthView'
                ,   'Calendar'
                ,   'DateTimePicker'

                ,   'FileUploader'
                ,   'Dialog'

                ,   'ComboBox'
                ,   'ComboList'

                ,   'Tab'
                ,   'Tabs'

                ].map( ( item ) ->
                    return "src/ebaui.web/#{item}.coffee" if item is 'Combo'
                    return "src/ebaui.web/#{item}/#{item}.coffee"
                )

    tmpls = [
                'Intro'
            ,   'Panel'
            ,   'Button'

            ,   'TextBox'
            ,   'TextArea'
            ,   'Password'
            ,   'ButtonEdit'
            ,   'Captcha'

            ,   'ListBox'
            ,   'MiniGrid'

            ,   'CheckBox'
            ,   'CheckBoxList'
            ,   'RadioList'
            ,   'Hidden'
            ,   'Label'
            ,   'Spinner'
            ,   'TimeSpinner'

            ,   'MainView'
            ,   'MonthView'
            ,   'Calendar'

            ,   'FileUploader'

            ,   'ComboBox'
            ,   'ComboList'
            
            ,   'Tab'
            ,   'Tabs'

            ,   'Outro'
            ].map( ( item ) ->
                return "src/ebaui.web/#{item}.tmpl" if item is 'Intro' or item is 'Outro'
                return "src/ebaui.web/#{item}/#{item}.tmpl"
            )
    
    validation = [ 'src/ebaui.web/Validation/*.coffee' ]
    ebaui      = base.concat( validation,controls,['src/ebaui.web/Form.coffee'] )
    
    grunt.config('coffee',{
        build : 
            options: 
                sourceMap: false
                join     : false

            expand : true
            flatten: true
            src    : ['src/**/*.coffee']
            dest   : 'build/ebaui.web/'
            ext    : '.js'

        release:
            options: 
                sourceMap: false
                join     : true
            files:
                'build/ebaui.js' : ebaui
                '../release/<%=grunt.config("pkg.version")%>/ebaui.js' : ebaui
        tmpl:
            options:
                sourceMap: false
                join     : true
            files:
                'build/ebaui.templates.js' : tmpls
                '../release/<%=grunt.config("pkg.version")%>/ebaui.templates.js' : tmpls
    })