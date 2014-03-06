class Combo extends ButtonEdit
    ###
     *  下拉菜单的弹出框
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @member     _panel
    ###
    _panel : null

    ###
     *  下拉菜单包含的控件对象，Combobox中就是一个ListBox
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @member     _panelContent
    ###
    _panelContent : null

    ###
     *  获取或者设置文本占位符
    ###
    _placeHolder: ''

    ###
     *  更新valueField textField等配置，同时要同步到_panelContent控件里
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _doFieldAccess
     *  @arg        {String}
    ###
    _doFieldAccess:( field,val,sync = true ) ->
        me           = this
        prop         = '_' + field
        panelContent = me._panelContent
        return me[prop] unless me.isString( val )

        me[prop] = val
        #  同步更新popup的设置
        panelContent[field]( val ) if sync and panelContent[field]

    _idField: 'id'
    ###
     *  控件数据源对象的ID字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {String}      idField
     *  @default    'id'
     *  @example    <caption>get</caption>
     *      idField = ctrl.idField();
     *  @example    <caption>set</caption>
     *      ctrl.idField( '' );
    ###
    idField: ( val ) -> this._doFieldAccess( 'idField',val )

    _textField:'text'
    ###
     *  控件数据源对象字段中，用于作为控件文本的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {String}      textField
     *  @default    'text'
     *  @example    <caption>get</caption>
     *      textField = ctrl.textField();
     *  @example    <caption>set</caption>
     *      ctrl.textField( '' );
    ###
    textField:( val ) -> this._doFieldAccess( 'textField',val )

    _valueField:'value'
    ###
     *  控件数据源对象字段中，用于作为控件值的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {String}      valueField
     *  @default    'value'
     *  @example    <caption>get</caption>
     *      valueField = ctrl.valueField();
     *  @example    <caption>set</caption>
     *      ctrl.valueField( '' );
    ###
    valueField:( val ) -> this._doFieldAccess( 'valueField',val )

    ###
     *  数据加载开始前的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _beforeLoading
    ###
    _beforeLoading: () -> 

    ###
     *  数据加载结束后的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _finishLoading
    ###
    _finishLoading:() ->

    ###
     *  加载数据
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _loadData
    ###
    _loadData:() ->

    ###
     *  构建下来菜单容器
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @method     _initPanel
    ###
    _initPanel:() ->
        me     = this
        ctrlId = me.id()
        $root  = me.uiElement()
        $popup = $( '<div data-options="{ visible:false,position: \'absolute\' }" style="display:none;"><input /></div>' ).appendTo( document.body )
        ###
        *   18是表单控件外围status的icon宽度
        ###
        me._panel = new ebaui.web.Panel($popup,{
            id      : 'panel-' + me.id()
            width   : 0
            height  : 0
        })

    ###
     *  调整下拉菜单的位置
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @method     _reposition
    ###
    _reposition:() ->
        me     = this
        panel  = me._panel
        return unless panel.visible()

        $root       = me.uiElement()
        $popup      = panel.uiElement()
        rootPos     = $root.offset()
        popupHeight = $popup.outerHeight()
        scrollTop   = $(document).scrollTop()

        top  = rootPos.top + $root.outerHeight()
        if top + popupHeight > $(window).height() + scrollTop
            top = rootPos.top - popupHeight

        panel.move(
            'top' : top
            'left': rootPos.left
        )

        return undefined

    ###
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @method     _setupEvents
    ###
    _setupEvents:( opts ) ->
        me          = this
        panel       = me._panel
        input       = '.eba-buttonedit-input'
        placeholder = '.eba-placeholder-lable'
        $root       = me.uiElement()
        $panelRoot  = panel.uiElement()

        me.onEvent( 'focus'     ,opts['onfocus'] )
        me.onEvent( 'blur'      ,opts['onblur'] )

        $panelRoot.on( 'click', ( event ) -> event.stopPropagation() )

        ###
         *  downArrow button click
        ###
        $root.on( 'click', '.eba-buttonedit-button', ( event ) ->
            event.stopPropagation()
            if me.enabled() and not me.readonly()
                panel.toggle()
                me._reposition()
        )

        ###
         *  focus && blur
        ###
        $root.on( 'focus',input,( eventArgs ) -> 
            me._focused = true
            me._updateCssFocused()
            me.triggerEvent( 'focus',eventArgs )
        )

        $root.on( 'blur',input,( eventArgs ) -> 
            me._focused = false
            me._updateCssFocused()
            me.triggerEvent( 'blur',eventArgs )
        )

        ###  
            when your browser is IE7 ~ IE9, we create a label for textbox as placeholder 
            when you click on this label
            remove this label then focus in the input
        ###
        $root.on( 'click',placeholder,( eventArgs ) -> 
            $(this).hide()
            $input = me._$formInput
            $input.focus() if $input
        )

        ###
         *  在document上注册一个click事件，当触发这个事件的时候，会自动收起下拉菜单
        ###
        $( document ).on( 'click',( event ) -> panel.close())

        ###
         *  windows的窗口位置改变的时候，下拉菜单的位置应该跟着移动
        ###
        $(window).resize( () -> me._reposition() )