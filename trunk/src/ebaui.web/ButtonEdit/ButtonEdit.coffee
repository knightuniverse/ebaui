class ButtonEdit extends TextBox
    ###
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @member     {Object}    _JQSelector
     ###
    _JQSelector:
        'input'      : '.eba-buttonedit-input'
        'placeholder': '.eba-placeholder-lable'
        'icon'       : '.eba-label-icon'
        'btnClose'   : '.eba-buttonedit-close'
        'btnToggle'  : '.eba-buttonedit-button'

    ###
     *  控件要用到的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {Object}    _rootCls
     ###
    _rootCls :
        disabled: 'eba-buttonedit-disabled'
        focused : 'eba-buttonedit-focus'
        readonly: 'eba-readonly'

    ###
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _updateCssReadonly
     ###
    _updateCssReadonly:() ->
        super()
        me         = this
        $root      = me.uiElement()
        $toggleBtn = me._$btnToggle
        
        if me.readonly()
            $toggleBtn.hide()
        else 
            $toggleBtn.show()

        me._updateCssCloseButton()

    ###
     *  更新UI的宽度
     *  @private
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
        *   $( 'span.eba-buttonedit-buttons',$root ).outerWidth() == 18
        *   bolderW = 2
        *   iconW   = 22
        *   btnsW   = 18
        ###
        #me._$formInput.width( numeric - 42 )
    
    ###
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _setupEvents
     ###
    _setupEvents: ( opts ) ->
        me                = this
        $root             = me._$root
        $input            = me._$formInput
        _JQSelector       = me._JQSelector
        
        phSelector        = _JQSelector.placeholder
        inputSelector     = _JQSelector.formInput
        btnToggleSelector = '.eba-buttonedit-button'
        btnCloseSelector  = _JQSelector.btnClose

        me.onEvent( 'keydown'   ,opts['onkeydown'] )
        me.onEvent( 'keyup'     ,opts['onkeyup'] )
        me.onEvent( 'enter'     ,opts['onenter'] )
        me.onEvent( 'focus'     ,opts['onfocus'] )
        me.onEvent( 'blur'      ,opts['onblur'] )
        me.onEvent( 'change'    ,opts['onchange'] )
        me.onEvent( 'btnclick'  ,opts['onbtnclick'] )
        me.onEvent( 'clsclick'  ,opts['onclsclick'] )

        ###  
            when your browser is IE7 ~ IE9, we create a label for textbox as placeholder 
            when you click on this label
            remove this label then focus in the input
        ###
        $root.on( 'click',phSelector,( eventArgs ) ->
            $(this).hide()
            me._$formInput.focus()
        )

        $root.on( 'click',btnToggleSelector,( eventArgs ) ->
            if me.enabled()
                me.triggerEvent( 'btnclick',eventArgs )
        )

        $root.on( 'click',btnCloseSelector,( eventArgs ) ->

            unless me.showClose() and me.enabled()
                return eventArgs.preventDefault()

            me.triggerEvent( 'clsclick',eventArgs )

        )

        ### 如果不允许手工输入文本，返回false，阻止文字输入 ###
        $root.on('keydown', inputSelector, ( eventArgs ) ->
            unless me.enabled() and me.allowInput()
                return eventArgs.preventDefault()

            code = eventArgs.which
            switch code
                when keyboard.isEnter( code )
                    me.triggerEvent( 'enter',eventArgs )
                else
                    me.triggerEvent( 'keydown',eventArgs )
        )

        $root.on('keyup', inputSelector, ( eventArgs ) ->
            ### 
            *   更新控件的值 
            ###
            val = $input.val()
            me.text( val )
            me._setValue( val,true,eventArgs )
            me.triggerEvent( 'keyup',eventArgs )
        )

        $root.on( 'focus',inputSelector,( eventArgs ) ->
            me._focused = true
            me._updateCssFocused()
            me.triggerEvent( 'focus',eventArgs )
        )

        $root.on( 'blur',inputSelector,( eventArgs ) ->
            me._focused = false
            me._updateCssFocused()
            me.triggerEvent( 'blur',eventArgs )
        )

        return undefined

    ###
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _init
     ###
    _init : ( opts ) ->
        super( opts )
        me             = this
        $root          = me._$root
        selectors      = me._JQSelector
        me._$btnToggle = $(selectors.btnToggle,$root)
        me._$btnClose  = $(selectors.btnClose,$root)

        ### 
        *   从TextBox会继承_iconCls属性，这属性在buttonEdit似乎没什么用
        ###
        me._iconCls    = ''

    ###
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
    _setValue:( val, dispatchEvent = false, eventArgs = {} ) -> 
        me = this

        ### 要更新的值必须和原来的值是不同的，否则直接返回 ###
        return if me._value is val

        ### 
        *   如果控件值如果value没有变化，则不应该更新控件的值；
        *   否则，更新控件的值
        ###
        return if me._value and me._value is val
        me._value = val
        if not val then me._showPlaceHolder() else me._hidePlaceHolder()

        ###
        *   如果允许触发事件，触发change事件
        ###
        me.triggerEvent( 'change',eventArgs ) if dispatchEvent is true

        #  触发控件验证
        if me.validateOnChange() then me.validate()

        return undefined

    _render:() ->
        super()
        me = this
        me._updateAttrText()
        me._updateCssCloseButton()

    _showClose: false
    ###
     *  获取或者设置是否显示关闭按钮
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {Boolean}   showClose
     *  @default    false
     *  @example    <caption>get</caption>
     *      // showCloseBtn == true
     *      showCloseBtn = buttonedit.showClose();
     *  @example    <caption>set</caption>
     *      buttonedit.showClose( true );
     *      buttonedit.showClose( false );
     ###
    showClose : ( val ) ->
        me = this
        return me._showClose unless me.isBoolean( val )
        me._showClose = val
        me._updateCssCloseButton()

    ###
     *  更新控件enable的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _updateCssEnabled
     ###
    _updateCssEnabled:() ->
        super()
        this._updateCssCloseButton()

    ###
     *  更新UI的input后面的x的icon
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _updateCssCloseButton
     ###
    _updateCssCloseButton:() ->
        me           = this
        $root        = me.uiElement()
        showCloseBtn = me.showClose()
        $closeBtn    = me._$btnClose
        rootCls      = 'eba-buttonedit-switch'

        ro        = me.readonly()
        enabled   = me.enabled()

        if ro or not enabled
            $closeBtn.css('display','none')
            $root.removeClass( rootCls )
            return

        if showCloseBtn
            $root.addClass( rootCls )
            $closeBtn.css('display','inline-block')
        else
            $closeBtn.css('display','none')
            $root.removeClass( rootCls )

    ###
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _updateAttrText
     ###
    _updateAttrText:() ->
        me = this
        txt = me.text()
        me._$formInput.val( txt )
        if txt then me._hidePlaceHolder() else me._showPlaceHolder()

    _text: ''
    ###
     *  获取或者设置buttonedit文本值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {String}    text
     *  @default    ''
     *  @example    <caption>get</caption>
     *      text = buttonedit.text();
     *  @example    <caption>set</caption>
     *      buttonedit.text( 'your text value' );
     ###
    text : ( val ) ->
        me = this
        return me._text unless me.isString( val ) and me._text isnt val
        me._text = val
        me._updateAttrText()

    ###
     *  获取或者设置表单控件值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {Object}    value
     *  @default    null
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( true );
     *      ctrl.value( false );
     ###
    value: ( val ) ->
        me = this 
        return me._value unless val?
        me._setValue( val )

    ###
     *  获取或者设置控件数据
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {Object}        data
     *  @example    <caption>get</caption>
     *      // { text : '' ,value : '' };
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      pair = { text : '' ,value : '' };
     *      ctrl.data( pair );
     ###
    data : ( val ) ->
        me         = this
        textField  = me.textField()
        valueField = me.valueField()
        isValid    = val and val[textField]? and val[valueField]?
        ### get ###
        return me._data unless isValid
        ### set ###
        me._data = val
        ### 更新text以及value ###
        me.text( val[textField] )
        me.value( val[valueField] )

    _valueField: 'value'
    ###
     *  控件数据源对象字段中，用于作为控件值的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {String}      valueField
     *  @default    'value'
     *  @example    <caption>get</caption>
     *      valueField = ctrl.valueField();
     *  @example    <caption>set</caption>
     *      ctrl.valueField( '' );
     ###
    valueField: ( val ) ->
        me = this
        return me._valueField if me.isEmpty( val )
        return me._valueField if me.isString( val )
        me._valueField = val

    _textField: 'text'
    ###
     *  控件数据源对象字段中，用于作为控件文本的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {String}      textField
     *  @default    'text'
     *  @example    <caption>get</caption>
     *      textField = ctrl.textField();
     *  @example    <caption>set</caption>
     *      ctrl.textField( '' );
     ###
    textField : ( val ) -> 
        me = this
        return me._textField if me.isEmpty( val )
        return me._textField if me.isString( val )
        me._textField = val

    _allowInput: true
    ###
     *  获取或者设置是否允许手工输入文本
     *  @public
     *  @instance
     *  @tutorial   buttonedit_allowInput
     *  @memberof   ebaui.web.ButtonEdit
     *  @member     {Boolean}    allowInput
     *  @default    true
     *  @example    <caption>get</caption>
     *      allowed = ctrl.allowInput();
     *  @example    <caption>set</caption>
     *      ctrl.allowInput( false );
     ###
    allowInput: ( val ) ->
        me = this
        return me._allowInput unless val?
        me._allowInput = val

ebaui['web'].registerFormControl( 'ButtonEdit',ButtonEdit )