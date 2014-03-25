###*
*   native class extension
###
Date.prototype.clone = () ->
    timestamp = this.getTime()
    return new Date( timestamp )

###*
*  @namespace  ebaui.web
*  @author     Monkey <knightuniverse@qq.com>
###
web = 
    baseUrl     : '/'
    controls    : []
    formControls: []
    
    _bridge:( name,cls ) ->
        $.fn[ name ] = ( options ) ->
            this.each( ( idx,el ) ->

                $el = $(el);
                if $el.attr( 'data-parsed' ) isnt 'true'
                    ins = new cls( el,options )
            )
        return undefined
    
    ###*
     *  
     *  @private
     *  @static
     *  @method     _doRegister
     *  @memberof   ebaui.web
     *  @arg        {Boolean}       isFormField
     *  @arg        {String}        name
     *  @arg        {Function}      cls
     ###
    _doRegister:( isFormField,name,cls ) -> 
        return unless name
        return unless cls

        me       = this
        me[name] = cls

        cls::['_namespace']         = 'ebaui.web'
        cls::['_controlFullName']   = 'ebaui-web-' + name

        JQPlugin = name.toLowerCase()
        me._bridge( JQPlugin,cls )
        me.controls.push( JQPlugin )
        me.formControls.push( JQPlugin ) if isFormField

        return undefined

    ###* 
     *  注册成为一个UI控件
     *  @public
     *  @static
     *  @method     registerControl
     *  @memberof   ebaui.web
     *  @param      {String}    name        - 控件名
     ###
    registerControl : ( name,cls ) -> this._doRegister( false,name,cls )

    ###* 
     *  注册成为一个Form表单UI控件
     *  @public
     *  @static
     *  @method     registerControl
     *  @memberof   ebaui.web
     *  @param      {String}    name        - 控件名
     ###
    registerFormControl:( name,cls ) -> this._doRegister( true,name,cls )

    ###*
     *  注入一个html模板
     *  @public
     *  @static
     *  @method     injectTmpl
     *  @memberof   ebaui.web
     *  @arg        {String}    name        - 控件名
     *  @arg        {String}    prop        - 模板的属性名
     *  @arg        {String}    tmpl        - html模板字符串
     ###
    injectTmpl:( name,prop,tmpl ) ->
        me       = this
        ctrl = me[name]
        if ctrl?
            ctrl::[prop] = tmpl
        return undefined

    ###*
     *  注入负数个html模板
     *  @public
     *  @static
     *  @method     injectTmpls
     *  @memberof   ebaui.web
     *  @arg        {String}    name        - 控件名
     *  @arg        {Object}    map         - 哈希表，格式为 -> 模板的属性名 : html模板字符串
     ###
    injectTmpls:( name,map ) -> 

        unless map?
            return
        me   = this
        ctrl = me[name]
        if ctrl?
            for prop, tmpl of map
                ctrl::[prop] = tmpl

        return undefined

    ###*
     *  自动初始化所有WEB控件。其实所有的控件最后都有一个对应的jquery插件方法，初始化的时候就是调用这个插件方法去实例化一个控件。
     *  @public
     *  @static
     *  @method     parseControls
     *  @memberof   ebaui.web
     ###
    parseControls : ( context ) ->
        controls = this.controls
        for control,i in controls
            control   = controls[i]
            selector  = '[data-role="' + control + '"]'
            $elements = $( selector,context )
            if $elements.size() > 0 and $elements[control]
                $elements[control]()
        return undefined

    ###*
     *  加载PC端HTML模板信息，并且自动初始化每一个UI控件
     *  @public
     *  @static
     *  @method     parseUi
     *  @memberof   ebaui.web
     *  @param      {String}    上下文CSS选择器
     ###
    parseUi : ( context ) -> @parseControls( context ? document )

    ###*
     *  表单控件验证规则的构造器工厂，默认提供required,email,url等验证规则  <br />
     *  关于如何启用验证规则请参考 {@tutorial form_index}  <br />
     *  关于拓展当前控件规则请参考 {@tutorial extend_validation}  <br />
     *  @public
     *  @member     {Object}    validation
     *  @memberof   ebaui.web
     *  @property   {RequiredValidator}     required        -       required验证规则构造函数
     *  @property   {EmailValidator}        email           -       email地址验证规则构造函数
     *  @property   {UrlValidator}          url             -       url地址验证规则构造函数
     *  @property   {UrlValidator}          captcha         -       认证码验证规则构造函数
     ###
    validation:{}

    ###*
     *  获取validator的构造器
     *  @public
     *  @static
     *  @method     getValidator
     *  @memberof   ebaui.web
     *  @param      {String}    上下文CSS选择器
     ###
    getValidator:( ruleName ) -> 
        return null unless ruleName
        return this.validation[ruleName]

    ###*
     *  向系统注册一个新的表单验证规则
     *  @public
     *  @static
     *  @method     registerValidator
     *  @memberof   ebaui.web
     *  @param      {String}    上下文CSS选择器
     ###
    registerValidator:( ruleName,constructor ) ->
        return unless ruleName and typeof constructor is 'function'
        this.validation[ruleName] = constructor

    ###*
     *  获取ebaui.web.Form对象实例
     *  @public
     *  @static
     *  @memberof   ebaui.web
     *  @method     getForm
     *  @param      {String}    selector    -   表单的CSS选择器
     *  @param      {String}    [context]   -   上下文对象
     *  @return     form对象实例
    ###
    getForm:( selector,context ) ->
        $dom = $( selector,context )
        model = $dom.data('model')
        return model if model

        $dom.form()
        return $dom.data( 'model' )

    _envCheck:() ->
        ### 判断是否原生就支持placeholder ###
        if ( "placeholder" of document.createElement( "input" ) )
            $('html').attr( 'data-native','placeholder' )

    _baseUrlCheck:() ->
        me = this
        RE = /(.*)\/(ebaui\.js|ebaui(-\d\.\d\.\d)?\.js|ebaui(-\d\.\d\.\d)?\.min\.js)(.*)$/
        scripts = document.getElementsByTagName('script')
        for item in scripts
            src = item.src
            if RE.test( src )
                matched = RE.exec( src )
                prefix = matched[1]
                prefix += '/' if prefix.substring( prefix.length - 1,prefix.length ) != '/'
                me.baseUrl = prefix
                break

    ###*
     *  框架是否已经初始化过了
     *  @private
     *  @static
     *  @member     {Boolean}   _inited
     *  @memberof   ebaui.web
     ###
    _inited: false

    init:() ->
        me = this
        return if me._inited

        $( () ->

            return if me._inited
            ###
            *   浏览器环境监测
            *   构建baseUrl
            ###
            me._envCheck()
            me._baseUrlCheck()
            ###
            *   转换所有的ui控件
            ###
            me.parseUi()
            ###
            *   page生命周期事件
            ###
            trigger = ( eventHandle ) ->
                fn = window[eventHandle]
                fn() if $.type(fn) is 'function'

            trigger( 'initPage' )

            $(window).on( 'load'   ,( eventArgs ) -> trigger( 'loadPage' ) )
            $(window).on( 'unload' ,( eventArgs ) -> trigger( 'unloadPage' ) )
            ###
            *   初始化结束
            ###
            me._inited = true
            
        )
        
ebaui['web']    = web

###*
*   keyboard
*   @static
*   @memberof   ebaui.web
###
keyboard = 
    ###*
     *  判断键盘输入是否是enter键
     *  @public
     *  @static
     *  @method     isEnter
     *  @memberof   ebaui.keycodes
     ###
    isEnter:( keycode ) -> keycode is 13

    ###*
     *  判断键盘输入是否是数字
     *  @public
     *  @static
     *  @method     isNumber
     *  @memberof   keyboard
     ###
    isNumber:( code ) -> 
        unless typeof code is 'number'
            return false
        return ( code in [96..105] or code in [48..57] )

web['keyboard'] = keyboard

###
*   框架初始化
###
web.init()