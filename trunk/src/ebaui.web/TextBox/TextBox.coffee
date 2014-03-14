###*
*   @class      TextBox
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.FormField
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
*   @example
*       //  初始化方式一
*       var ns = ebaui.web;
*       var btn = new ns.TextBox( $( '' ),{ title:'',id:'',name:'' } );
*       //  初始化方式二
*       $( '' ).textbox( { title:'',id:'',name:'' } )
*       //  初始化方式三
*       &lt;input id="" title="" name="" data-role="textbox" data-options="{}" /&gt;
###
class TextBox extends FormField
    ###*
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Object}    _JQSelector
     ###
    _JQSelector:
        'input'      : '.eba-textbox-input'
        'placeholder': '.eba-placeholder-lable'

    ###*
     *  控件要用到的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Object}    _rootCls
     ###
    _rootCls : 
        disabled: 'eba-disabled'
        focused : 'eba-textbox-focus'
        readonly: 'eba-readonly'

    ###*
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _setupEvents
     ###
    _setupEvents : ( opts ) ->
        me          = this
        $root       = me._$root
        $input      = me._$formInput
        
        JQSelector  = me._JQSelector
        formInput   = JQSelector.input
        placeholder = JQSelector.placeholder
        
        keyboard    = ebaui['web'].keyboard

        ###
        *   绑定事件处理程序
        ###
        me.onEvent( 'keydown'   ,opts['onkeydown'] )
        me.onEvent( 'keyup'     ,opts['onkeyup'] )
        me.onEvent( 'enter'     ,opts['onenter'] )
        me.onEvent( 'focus'     ,opts['onfocus'] )
        me.onEvent( 'blur'      ,opts['onblur'] )
        me.onEvent( 'change'    ,opts['onchange'] )

        $root.on( 'keydown',formInput,( eventArgs ) -> 

            return eventArgs.preventDefault() unless me.enabled()

            code = eventArgs.which
            switch code
                when keyboard.isEnter( code )
                    me.triggerEvent( 'enter',eventArgs )
                else
                    me.triggerEvent( 'keydown',eventArgs )

        )

        ###
        *   切到中文輸入法后，输入文字将不会触发KeyPress事件，只有KeyDown，而且e.keyCode一律是229
        *       http://blog.darkthread.net/post-2011-04-26-keypress-event-under-ime.aspx
        *   另外，关于微软的IME标准，可以参考以下的链接
        *       http://www.cnblogs.com/freedomshe/archive/2012/11/30/ime_learning.html
        *       http://www.cnblogs.com/freedomshe/archive/2012/11/13/ime-resources.html
        ###
        $root.on( 'keyup',formInput,( eventArgs ) -> 
            #  更新控件的值
            me._setValue( $input.val(), false, true, eventArgs )
            #  总觉得应该把keyup事件处理程序放到后面去执行
            me.triggerEvent( 'keyup',eventArgs )
        )

        $root.on( 'focus',formInput,( eventArgs ) -> 
            me._focused = true
            me._updateCssFocused()
            me.triggerEvent( 'focus',eventArgs )
        )

        $root.on( 'blur',formInput,( eventArgs ) -> 
            me._focused = false
            me._updateCssFocused()
            me.triggerEvent( 'blur',eventArgs )
        )

        return undefined

    ###*
     *  聚焦
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     focus
     ###
    _focus: () ->
        me = this
        if me.enabled() and not me.readonly()
            me._updateCssFocused()
        me._$formInput.focus()
        return undefined

    ###*
     *  失焦
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _blur
     ###
    _blur: () ->
        me = this
        if me.enabled()
            me._updateCssFocused()
        me._$formInput.blur()
        return undefined

    ###*
     *  更新UI的宽度
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   Control
     *  @method     _updateCssWidth
     ###
    _updateCssWidth:() ->
        me        = this
        $root     = me.uiElement()

        propVal = me.width()
        isNum   = me.isNumber( propVal )
        return if isNum and propVal <= 0

        result  = me._cssUnitRE.exec( propVal )
        numeric = parseInt( result[1] )
        cssUnit = result[2]
        $root.css( 'width',if cssUnit? then propVal else ( propVal + 'px' ) )

        ###
        *   border : solid 1px #a5acb5;
        *   margin-right: 22px;
        *   bolderW = 2
        *   iconW   = 22
        ###
        #me._$formInput.width( numeric - 24 )

    ###*
     *  更新UI的高度
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   Control
     *  @method     _updateCssHeight
     ###
    _updateCssHeight:() ->
        me        = this
        $input    = me._$formInput
        $root     = me.uiElement()

        propVal = me.height()
        isNum   = me.isNumber( propVal )
        return if isNum and propVal <= 0

        result  = me._cssUnitRE.exec( propVal )
        numeric = parseInt( result[1] )
        cssUnit = result[2]
        $root.css( 'height',if cssUnit? then propVal else ( propVal + 'px' ) )

        ###
        *   border : solid 1px #a5acb5;
        *   margin-right: 22px;
        *   bolderH = 2
        ###
        val = $root.height() - 2
        $input.height( val )

        ###
        *   设置placeholder的line-height
        ###
        $label = $( me._JQSelector.placeholder,me._$root )
        $label.css("line-height","#{val}px") if $label.size() > 0

    ###*
     *  设置或者移除据聚焦样式或者失焦样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssFocused
     ###
    _updateCssFocused:() ->
        me      = this
        focused = me.focused()
        ro      = me.readonly()
        enabled = me.enabled()
        rootCls = me._rootCls
        $root   = me._$root

        if focused
            $root.addClass( rootCls['focused'] )
            if enabled and not !ro then me._hidePlaceHolder()
        else
            $root.removeClass( rootCls['focused'] )
            if enabled then me._showPlaceHolder()
        return undefined

    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _showPlaceHolder
     ###
    _showPlaceHolder:() ->
        me = this
        unless me._nativePlaceHolder
            val = $.trim( me._$formInput.val() )
            unless val
                $( me._JQSelector.placeholder,me._$root ).show()

    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _hidePlaceHolder
     ###
    _hidePlaceHolder:() ->
        me = this
        unless me._nativePlaceHolder
            $( me._JQSelector.placeholder,me._$root ).hide()

    ###*
     *  更新placeholder的文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssPlaceHolder
     ###
    _updateCssPlaceHolder:() ->
        me          = this
        placeholder = me.placeHolder()
        $root       = me.uiElement()
        $input      = me._$formInput
        return $input.attr( 'placeholder',placeholder ) if me._nativePlaceHolder

        lineHeight = $root.height() - 2
        $label = $( me._JQSelector.placeholder,$root )

        if $label.size() > 0
            ### udpate placebolder text ###
            $label.text( placeholder ).css( 'line-height',lineHeight )
        else
            ### create placeholder ###
            $label =  "<label for='' class='eba-placeholder-lable' style='line-height:#{lineHeight}px;'>#{placeholder}</label>"
            $input.after( $label )

        return undefined

    ###*
     *  更新控件enable的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssEnabled
     ###
    _updateCssEnabled:() ->
        me      = this
        rootCls = me._rootCls
        $root   = me._$root
        $input  = me._$formInput

        if me.enabled()
            $root.removeClass( rootCls['disabled'] )
            $input.attr( 'disabled',null )
        else
            $input.attr('disabled','disabled')
            $root.removeClass( rootCls['focused'] )
            $root.addClass( rootCls['disabled'] )

        return undefined

    ###*
     *  更新控件readonly的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssReadonly
     ###
    _updateCssReadonly:() ->
        me      = this
        ro      = me.readonly()
        rootCls = me._rootCls
        $root   = me._$root
        $input  = me._$formInput
        prop = 'readonly'

        if me.enabled() and ro
            $root.addClass( rootCls[prop] )
            $input.attr( prop,prop )
            return undefined

        unless ro
            $root.removeClass( rootCls[prop] )
            $input.attr( prop,null )

        return undefined

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _init
     ###
    _init : ( opts ) ->
        super( opts )
        
        me = this
        ###*
        *   初始化控件自身的一系列属性  
        ###
        me._width       = opts['width'] ? 150
        me._height      = opts['height'] ? 21
        me._maxLength   = opts['maxLength'] ? 0
        me._iconCls     = opts['iconCls'] ? ''
        me._placeHolder = opts['placeHolder'] if opts['placeHolder']

        ### by defaults,enterAsTab is true  ###
        me._enterAsTab = true

        ### dom shortcuts ###
        me._$formInput = $( me._JQSelector.input,me._$root )
        me._$formInput.attr( 'name',me.name() )

        ### 设置常量，是否原生支持placeholder ###
        me._nativePlaceHolder = $('html').attr( 'data-native' ) is 'placeholder'

        ### 设置控件的placeholder ###
        me._updateCssPlaceHolder()
        return undefined

    _updateAttrMaxLen:() ->
        me = this
        max = me.maxLength()
        me._$formInput.attr( 'maxlength', if max > 0 then max else null )

    _updateAttrValue:() ->
        me    = this
        value = me.value()
        unless me.isEmpty( value )
            me._$formInput.val( value )
            me._hidePlaceHolder()
        else
            me._$formInput.val( '' )
            me._showPlaceHolder()
            
        return undefined

    ###*
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _render
     ###
    _render : () ->
        super()
        me = this
        me._updateAttrMaxLen()
        me._updateAttrValue()
        me._updateCssIcon()

    ###*
     *  更新控件内部前面icon的相关样式属性
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssIcon
     ###
    _updateCssIcon : () ->
        me             = this
        $root          = me.uiElement()
        icon           = me.iconCls()
        borderCls      = 'eba-textbox-icon'
        borderSelector = '[class$="border"]'
        iconSelector   = '.eba-textbox-icon i'

        if icon
            $( borderSelector,$root).addClass(borderCls)
            $iconLabel = $( iconSelector,$root )
            if $iconLabel.size() > 0
                ### update icon class ###
                $iconLabel.attr('class',icon)
            else
                ### create icon label dom ###
                $( "<i class='#{icon}'></i>" ).insertBefore( me._$formInput )
        else
            ### if icon is null or empty, then remove icon dom ###
            $( iconSelector,$root).remove()
            $( borderSelector,$root).removeClass(borderCls)

        return undefined

    _iconCls : ''
    ###*
     *  获取或者设置button的icon图标CSS样式类
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {String}    TextBox
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #  iconCls == 'icon-add'
     *      iconCls = ctrl.iconCls();
     *  @example    <caption>set</caption>
     *      ctrl.iconCls( 'icon-add' );
     ###
    iconCls: ( val ) ->
        me = this
        return me._iconCls if $.trim( val ) is ''

        me._iconCls = val
        me._updateCssIcon()

        return undefined

    _maxLength : 0
    ###*
     *  获取或者设置文本域输入文本的最大长度，默认值是-1，不做任何限制
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Number}    maxLength
     *  @default    -1
     *  @example    <caption>get</caption>
     *      #  max == -1
     *      max = ctrl.maxLength();
     *  @example    <caption>set</caption>
     *      ctrl.maxLength( 100 );
     ###
    maxLength : ( val ) ->
        me = this
        unless me.isNumber( val )
            return me._maxLength
        
        old = me._maxLength
        ### max值小于等于0，表示input可输入的文本长度不做限制；否则，根据适当情况，考虑截断字符串 ###
        if 0 < val and val < old 
            text = me.value()
            me.value( text.substr( 0,val ) )

        me._maxLength = val
        me._$formInput.attr( 'maxlength',if val > 0 then val else null )

    ###*
     *  控件是否可以获取焦点
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.TextBox
     *  @member     {Boolean}   focusable
     *  @example    <caption>get</caption>
     *      #  false
     *      console.log( ctrl.focusable() );
     ###
    focusable:() -> true

    _placeHolder: ''
    ###*
     *  获取或者设置文本占位符
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {String}    placeHolder
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #  holder == ''
     *      holder = ctrl.placeHolder();
     *  @example    <caption>set</caption>
     *      ctrl.placeHolder( 'your text value' );
     ###
    placeHolder: ( val ) ->
        me   = this
        unless me.isString( val )
            return me._placeHolder

        me._placeHolder = val
        me._updateCssPlaceHolder()

    ###*
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _setValue
     *  @arg        {String}     val    -   
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
     ###
    _setValue:( val, updateHtml = true, dispatchEvent = false, eventArgs = {} ) -> 
        me = this

        ### max值小于等于0，表示input可输入的文本长度不做限制；否则，根据适当情况，考虑截断字符串 ###
        max = me.maxLength()
        if max > 0 and ( val.length > max ) then val = val.substr( 0,max )

        ###
        *   如果控件值如果value没有变化，则不应该更新控件的值；
        *   否则，更新控件的值
        ###
        return undefined if me._value is val

        ### 更新控件值 ###
        me._value = val
        me._$formInput.val( val ) if updateHtml is true
        if not val then me._showPlaceHolder() else me._hidePlaceHolder()

        ###
        *   如果允许触发事件，触发change事件
        ###
        me.triggerEvent( 'change',eventArgs ) if dispatchEvent is true

        #  触发控件验证
        if me.validateOnChange() then me.validate()

        return undefined

    ###*
     *  获取或者设置表单控件值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Object}    value
     *  @default    null
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( 'your text value' );
     ###
    value: ( val ) ->
        me = this
        return me._value unless val?
        me._setValue( val.toString() )

    ###*
     *  获取或者设置控件数据
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Object}        data
     *  @example    <caption>get</caption>
     *      #  { text : '' ,value : '' };
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      pair = { text : '' ,value : '' };
     *      ctrl.data( pair );
     ###
    data: ( val ) -> 
        me = this
        return me._value unless val?
        me._setValue( val.toString() )

ebaui['web'].registerFormControl( 'TextBox',TextBox )