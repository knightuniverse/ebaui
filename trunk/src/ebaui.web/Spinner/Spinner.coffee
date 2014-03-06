###
 *  控件全名 e.g. ebaui.web.Spinner
 *  控件描述
 *  @class      Spinner 
 *  @memberof   ebaui.web
 *  @extends    ebaui.web.FormElement
 *  @tutorial   spinner_index
 *  @param      {Object}    options     -   控件配置参数
 *  @param      {Object}    element     -   dom对象
 *  @example    
 *      &lt;input data-role="spinner" id="" name="" value="" data-options="{}"/&gt;
###
class Spinner extends FormField
    ###
     *  控件要用到的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {Object}    _rootCls
    ###
    _rootCls :
        disabled: 'eba-disabled'
        focused : 'eba-buttonedit-focus'
        readonly: 'eba-readonly'

    ###
     *  获取焦点
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _focus
     *  @todo       test
    ###
    _focus : () ->
        me = this
        if me.enabled() and not me.readonly()
            me._updateCssFocused()
            me._$formInput.focus()
            
    ###
     *  失去焦点
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _blur
     *  @todo       test
    ###
    _blur : () ->
        me = this
        if me.enabled()
            me._$formInput.blur()

    ###
     *  设置或者移除据聚焦样式或者失焦样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _updateCssFocused
    ###
    _updateCssFocused:() ->
        me = this
        cls = me._rootCls['focused']
        $root = me._$root
        if me.focused()
            $root.addClass( cls )
        else
            $root.removeClass( cls )

    ###
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _updateCssEnabled
    ###
    _updateCssEnabled:() ->
        me          = this
        $root       = me._$root
        rootCls     = me._rootCls
        $input      = me._$formInput
        focusCls    = rootCls['focused']
        disabledCls = rootCls['disabled']
        
        if me.enabled()
            $input.attr('disabled',null)
            $root.removeClass( disabledCls )
        else
            $input.attr('disabled','disabled')
            $root.removeClass( focusCls ).addClass( disabledCls )

    ###
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _updateCssReadonly
    ###
    _updateCssReadonly:() ->
        me     = this
        roCls  = me._rootCls['readonly']
        $root  = me._$root
        $btns  = $( '.eba-buttonedit-buttons',$root )
        $input = me._$formInput
        attr   = 'readonly'

        if me.readonly()
            $root.addClass( roCls )
            $btns.hide()
            $input.attr(attr,attr)
        else
            $root.removeClass( roCls )
            $input.attr(attr,null)
            $btns.show()

    ###
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _fixNumber
    ###
    _fixNumber:( val ) ->
        me = this
        val = me.value() unless val?
        places = me.decimalPlaces()
        fixed = if places < 0 then val.toString() else val.toFixed( places )
        return fixed

    ###
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _render
    ###
    _render: () ->
        super()
        me = this
        me._$formInput.val( me._fixNumber() )

    ###
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _setupEvents
    ###
    _setupEvents: ( opts ) ->
        me     = this
        $root  = me._$root
        $input = me._$formInput
        key    = ebaui.web.keyboard

        me.onEvent( 'focus'     ,opts['onfocus'] )
        me.onEvent( 'blur'      ,opts['onblur'] )
        me.onEvent( 'change'    ,opts['onchange'] )
        me.onEvent( 'spinup'    ,opts['onspinup'] )
        me.onEvent( 'spindown'  ,opts['onspindown'] )

        $root.on( 'keydown','input',( event ) -> 
            event.preventDefault() unless key.isNumber( event.which )
        )

        $root.on( 'keyup','input',( event ) ->
            ###
            *   upArrow   : 38
            *   downArrow : 40
            ###
            switch event.which
                when 38 then me.stepUp()
                when 40 then me.stepDown()
                else
                    me._setValue( $input.val(),false,true,event )
        )

        $root.on( 'focus','input',( event ) ->
            me._focused = true
            me._updateCssFocused()
            me.triggerEvent( 'focus',event )
        )

        $root.on( 'blur','input',( event ) ->
            me._focused = false
            me._updateCssFocused()
            me.triggerEvent( 'blur',event )
        )

        $root.on( 'click','.eba-buttonedit-up',( event ) ->
            me.stepUp( true,true,event )
            me.triggerEvent( 'spinup',event )
        )

        $root.on( 'click','.eba-buttonedit-down',( event ) ->
            me.stepDown( true,true,event )
            me.triggerEvent( 'spindown',event )
        )

    ###
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     _init
    ###
    _init: ( opts ) ->
        super( opts )
        ### 
        *   初始化控件自身的一系列属性  
        ###
        me             = this
        $root          = me._$root
        me._$formInput = $( 'input',$root )
        
        me._step       = opts['step'] ? 1
        me._min        = opts['min'] ? 0
        me._max        = opts['max'] ? 100
        me._width      = opts['width'] ? 150
        me._height     = opts['height'] ? 21
        #   check init value
        #   if init value is invalid then set it to 0
        initVal = if me.isNumber( opts['value'] ) then opts['value'] else 0
        me._setValue( initVal )

    ###
     *  控件是否可以获取焦点
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.Spinner
     *  @member     {Boolean}   focusable
     *  @example    <caption>get</caption>
     *      #   false
     *      console.log( ctrl.focusable() );
    ###
    focusable:() -> true

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
    _setValue:( val, updateHtml = true, dispatchEvent = false, eventArgs = {} ) -> 
        return unless val?

        me    = this
        val   = parseFloat( val )
        return if isNaN( val )
        
        max   = me.max()
        min   = me.min()
        val   = min if val < min
        val   = max if val > max
        fixed = me._fixNumber( val )
        ###
        *   格式化数据
        ###
        val   = parseFloat( fixed )

        ### 
        *   更新控件值 
        ###
        me._value = val
        me._$formInput.val( fixed ) if updateHtml

        ###
        *   如果允许触发事件，触发change事件
        ###
        me.triggerEvent( 'change',eventArgs ) if dispatchEvent is true

        ###
        *   触发控件验证
        ###
        if me.validateOnChange() then me.validate()

        return undefined

    ###
     *  获取或者设置spinner值,同value属性一致
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {String}        data
     *  @example    <caption>get</caption>
     *      data = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( '19:20' );
    ###
    data: ( val ) -> 
        me = this
        return me._value unless val?
        me._setValue( val )

    ###
     *  获取或者设置spinner值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {String}     value
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( '19:20' );
    ###
    value: ( val ) -> 
        me = this
        return me._value unless val?
        me._setValue( val )

    _step:1
    ###
     *  获取或者设置秒微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {Number}     step
     *  @default    1
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.step();
     *  @example    <caption>set</caption>
     *      ctrl.step( 20 );
    ###
    step:( val ) ->
        me = this
        return me._step unless me.isNumber( val )
        me._step = val

    ###
     *  
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     stepUp
     *  @example    
     *      ctrl.stepUp();
    ###
    stepUp:( updateHtml = true, dispatchEvent = false, eventArgs = {} ) ->
        me   = this
        max  = me.max()
        val  = me.value() + me.step()
        val = if val > max then max else val
        me._setValue( val, updateHtml, dispatchEvent, eventArgs )

    ###
     *  
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @method     stepDown
     *  @example    
     *      ctrl.stepDown();
    ###
    stepDown:( updateHtml = true, dispatchEvent = false, eventArgs = {} ) ->
        me  = this
        min = me.min()
        val = me.value() - me.step()
        val = if val < min then min else val
        me._setValue( val, updateHtml, dispatchEvent, eventArgs )

    _min:0
    ###
     *  获取或者设置秒微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {Number}     min
     *  @default    0
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.min();
     *  @example    <caption>set</caption>
     *      ctrl.min( 20 );
    ###
    min:( val ) ->
        me = this
        return me._min unless me.isNumber( val )
        me._min = val;

    _max:100
    ###
     *  获取或者设置秒微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {Number}     max
     *  @default    100
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.max();
     *  @example    <caption>set</caption>
     *      ctrl.max( 20 );
    ###
    max:( val ) ->
        me = this
        return me._max unless me.isNumber( val )
        me._max = val

    _decimalPlaces:0
    ###
     *  保留的小数点位数。默认值是-1，表示不作任何限制
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Spinner
     *  @member     {Number}     decimalPlaces
     *  @default    0
     *  @example    <caption>get</caption>
     *      decimalPlaces = ctrl.decimalPlaces();
     *  @example    <caption>set</caption>
     *      ctrl.decimalPlaces( 20 );
    ###
    decimalPlaces : ( val ) ->
        me = this
        return me._decimalPlaces unless me.isNumber( val )
        me._decimalPlaces = val

ebaui['web'].registerFormControl( 'Spinner',Spinner )