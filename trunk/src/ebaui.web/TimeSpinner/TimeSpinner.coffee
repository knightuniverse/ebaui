class TimeSpinner extends FormField
    ###
     *  当前正在调整的input的索引
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Object}    _current
    ###
    _current: 'hour'
    ###
     *  控件要用到的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Object}    _rootCls
    ###
    _rootCls:
        disabled: 'eba-disabled'
        focused : 'eba-buttonedit-focus'
        readonly: 'eba-readonly'

    ###
     *  各个不同时间单位的最大值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Object}    _max
    ###
    _max :
        'hour'  : 23
        'minute': 59
        'second': 59

    ###
     *  各个不同时间单位的最小值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Object}    _min
    ###
    _min:
        'hour'  : 0
        'minute': 0
        'second': 0

    ###
     *  获取焦点
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _focus
    ###
    _focus : () ->
        me = this
        if me.enabled()
            me._updateCssFocused()
            $( "input[data-pos='#{me._current}']",me._$root ).focus()

    ###
     *  失去焦点
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _blur
    ###
    _blur : () ->
        me = this
        if me.enabled()
            me._updateCssFocused()
            $( "input[data-pos='#{me._current}']",me._$root ).blur()

    ###
     *  更新UI的宽度
     *  @private
     *  @instance
     *  @tutorial   timespinner_width
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateCssWidth
    ###
    _updateCssWidth: () ->
        me = this
        me._$root.width( me.width() )
        ###
        *   更新在不同的format格式下，UI界面显示要有所不同
        ###
        me._updateCssFormat()

    ###
     *  设置或者移除据聚焦样式或者失焦样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateCssFocused
    ###
    _updateCssFocused: () ->
        me    = this
        $root = me._$root
        cls   = me._rootCls['focused']
        if me.focused() then $root.addClass( cls ) else $root.removeClass( cls )

    ###
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateCssEnabled
    ###
    _updateCssEnabled:() ->
        me     = this
        cls    = me._rootCls
        dis    = 'disabled'
        foCls  = cls['focused']
        daCls  = cls['disabled']
        
        $root  = me._$root
        $input = $( 'input',$root )

        if me.enabled()
            $input.attr(dis,null)
            $root.removeClass( daCls )
        else
            $input.attr(dis,dis)
            $root.removeClass( foCls ).addClass( daCls )

    ###
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateCssEnabled
    ###
    _updateCssReadonly:() ->
        me     = this
        cls    = me._rootCls
        ro     = 'readonly'
        roCls  = cls[ro]
        
        $root  = me._$root
        $input = $( 'input',$root )
        $btn   = $( '.eba-buttonedit-buttons',$root )

        if me.readonly()
            $root.addClass( roCls )
            $btn.hide()
            $input.attr(ro,ro)
        else
            $root.removeClass( roCls )
            $input.attr(ro,null)
            $btn.show()

    ###
     *  更新在不同的format格式下，UI界面显示要有所不同
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateCssFormat
    ###
    _updateCssFormat:() ->
        me         = this
        $root      = me._$root
        len        = me.format().split( ':' ).length
        totalWidth = width = $root.width() - $( '.eba-buttonedit-button',$root ).outerWidth()
        
        ###
        *   我们约定
        *   hour minute second对应的index为0 1 2
        ###
        $inputs  = $( 'input',$root )
        $hour    = $inputs.eq(0)
        $minute  = $inputs.eq(1)
        $second  = $inputs.eq(2)
        $minuteP = $minute.parent()
        $secondP = $second.parent()

        #  calculate width
        switch len
            when 1
                $hour.width( width )
                $minuteP.hide()
                $secondP.hide()
            when 2
                width = totalWidth * 0.4
                $hour.width( width )
                $minute.width( width )
                $secondP.hide()
            when 3
                width = totalWidth * 0.3
                $hour.width( width )
                $minute.width( width )
                $second.width( width )

        return undefined

    ###
     *  更新value在界面的显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _updateAttrText
    ###
    _updateAttrText: () ->
        me      = this
        $inputs = $( 'input',me._$root )
        mo = new moment( me.value() )
        splited = mo.format( me.format() ).split( ':' )
        for i in [0..splited.length-1]
            $inputs.eq( i ).val( splited[i] )

    ###
     *  更新UI显示
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _render
    ###
    _render: () ->
        super()
        this._updateAttrText()

    ###
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _setValue
     *  @arg        {Date}       val    -   
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
    ###
    _setValue:( val, updateHtml = true, dispatchEvent = false, eventArgs = {} ) -> 
        return unless val?

        ### 
        *   在javascript里，date是一个引用类型的对象
        *   如果控件值如果value没有变化，则不应该更新控件的值；
        *   否则，更新控件的值
        ###
        me        = this
        return if me._value and me._value.getTime() is val.getTime()
        
        me._value = val
        $root     = me.uiElement()
        me._updateAttrText() if updateHtml is true
        me.triggerEvent( 'change',eventArgs ) if dispatchEvent is true

    ###
     *  单步调整
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     stepUp
     *  @arg        {String}    which     -   可选值有['hour','minute','second']
     *  @example    
     *      ctrl.stepUp();
    ###
    stepUp: ( pos,updateHtml = true, dispatchEvent = false, eventArgs = {} ) ->
        return unless pos

        me     = this
        $root  = me.uiElement()
        $input = $( "input[data-pos='#{pos}']",$root )

        max    = me._max[pos]
        val    = me.value().clone()

        old    = 0
        switch pos
            when "hour"   then old = val.getHours()
            when "minute" then old = val.getMinutes()
            when "second" then old = val.getSeconds()

        change = old + me["#{pos}Step"]()
        less   = change <  max

        if me.circular()
            change = if less then change else change - max
        else
            change = if less then change else max

        switch pos
            when "hour"   then val.setHours(change)
            when "minute" then val.setMinutes(change)
            when "second" then val.setSeconds(change)

        me._setValue( val,updateHtml,dispatchEvent,eventArgs )

    ###
     *  单步调整
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     stepDown
     *  @arg        {String}    which     -   可选值有['hour','minute','second']
     *  @example    
     *      ctrl.stepDown();
    ###
    stepDown: ( pos,updateHtml = true, dispatchEvent = false, eventArgs = {} ) ->
        return unless pos
        me     = this
        $root  = me.uiElement()
        $input = $( "input[data-pos='#{pos}']",$root )

        max    = me._max[pos]
        min    = me._min[pos]
        val    = me.value().clone()

        old    = 0
        switch pos
            when "hour"   then old = val.getHours()
            when "minute" then old = val.getMinutes()
            when "second" then old = val.getSeconds()

        change = old - me["#{pos}Step"]()
        great  = change >  min

        if me.circular()
            change = if great then change else max - Math.abs( change - min )
        else
            change = if great then change else min

        switch pos
            when "hour"   then val.setHours(change)
            when "minute" then val.setMinutes(change)
            when "second" then val.setSeconds(change)

        me._setValue( val,updateHtml,dispatchEvent,eventArgs )

    ###
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _setupEvents
    ###
    _setupEvents: ( opts ) ->
        me  = this
        $root = me._$root
        key   = ebaui.web.keyboard

        me.onEvent( 'change'    ,opts['onchange'] )
        me.onEvent( 'spinup'    ,opts['onspinup'] )
        me.onEvent( 'spindown'  ,opts['onspindown'] )

        $root.on( 'keydown','input',( event ) ->
            code = event.which
            ###
            *   backspace
            *   tab
            *   enter
            *   up arrow
            *   down arrow
            *   number
            ###
            event.preventDefault() unless code in [8,9,13,38,40] or key.isNumber( code )
        )

        $root.on( 'keyup','input',( event ) ->
            $target  = $( this )
            $inputs  = $( 'input',$root )
            enter    = key.isEnter( event.which )
            index    = $inputs.index( $target )
            len      = me.format().split(':').length
            goToNext = len > 1 and ( index < (len - 1) )

            if enter and goToNext
                $inputs.eq( index + 1 ).focus()
                return

            val = $target.val().toString()
            if not enter and goToNext
                #  如果这个input已经填满两位数，那么直接跳转到下一个input
                if val.length is 2
                    $inputs.eq( index + 1 ).focus()
                else if val.length > 2
                    $target.val( val.substr( 0,2 ) )
                    $inputs.eq( index + 1 ).focus()

                return

            ###
            *   当前已经是最后一个input的时候，
            *   如果输入超过两位数，那么直接截断
            ###
            $target.val( val.substr( 0,2 ) ) if val.length > 2
        )

        $root.on( 'focus','input',( event ) ->
            me._current = $(this).attr( 'data-pos' )
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
            me.stepUp(me._current,true,true,event)
            me.triggerEvent( 'spinup',event )
        )

        $root.on( 'click','.eba-buttonedit-down',( event ) ->
            me.stepDown(me._current,true,true,event)
            me.triggerEvent( 'spindown',event )
        )

    ###
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _init
    ###
    _init: ( opts ) ->
        super( opts )
        ### 
        *   初始化控件自身的一系列属性  
        ###
        me             = this
        me._width      = opts['width'] ? 150
        me._height     = opts['height'] ? 21
        me._format     = opts['format'] if opts['format']?
        me._hourStep   = opts['hourStep'] if opts['hourStep']?
        me._minuteStep = opts['minuteStep'] if opts['minuteStep']?
        me._secondStep = opts['secondStep'] if opts['secondStep']?
        ### 
        *   init value 
        ###
        mo = new moment( me._value )
        me._value = if me._value? and mo.isValid() then mo.toDate() else new Date

    ###
     *  控件是否可以获取焦点
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Boolean}   focusable
     *  @example    <caption>get</caption>
     *      #  false
     *      console.log( ctrl.focusable() );
    ###
    focusable:() -> true

    _format: 'HH:mm'
    ###
     *  时间格式化字符串,HH:mm或者HH:mm:ss
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @default    'HH:mm'
     *  @member     {String}        format
     *  @example    <caption>get</caption>
     *      format = ctrl.format();
     *  @example    <caption>set</caption>
     *      ctrl.format( 'HH:mm:ss' );
    ###
    format: ( val ) ->
        me = this
        return me._format unless val
        me._format = val.toString()
        ###
        *   更新在不同的format格式下，UI界面显示要有所不同
        ###
        me._updateCssFormat()

    ###
     *  获取或者设置timeSpinner值,同value属性一致
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {String}        data
     *  @example    <caption>get</caption>
     *      data = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( '19:20' );
    ###
    data: ( val ) -> 
        me = this
        return me._value unless me.isDate( val )
        me._setValue( val )

    ###
     *  获取或者设置timeSpinner值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {String}     value
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( '19:20' );
    ###
    value: ( val ) -> 
        me = this
        return me._value unless me.isDate( val )
        me._setValue( val )

    _circular: false
    ###
     *  获取或者设置是否允许循环调整时间
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Boolean}     circular
     *  @default    false   
     *  @tutorial   timespinner_circular
     *  @example    <caption>get</caption>
     *      value = ctrl.circular();
     *  @example    <caption>set</caption>
     *      ctrl.circular( true );
    ###
    circular: ( val ) -> 
        me = this
        return me._circular unless me.isBoolean( val )
        me._circular = val

    ###
     *  获取或者设置微调步进
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @method     _step
     *
     *  @example    <caption>get</caption>
     *      value = ctrl._step();
     *  @example    <caption>set</caption>
     *      ctrl._step( true );
    ###
    _step : ( which,val ) ->
        me   = this
        prop = "_#{which}"
        return me[prop] unless me.isNumber( val )
        me[prop] = val

    _hourStep: 1
    ###
     *  获取或者设置小时微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Number}     hourStep
     *  @default    1
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.hourStep();
     *  @example    <caption>set</caption>
     *      ctrl.hourStep( 2 );
    ###
    hourStep: ( val ) -> this._step( 'hourStep',val )

    _minuteStep: 10
    ###
     *  获取或者设置分钟微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Number}     minuteStep
     *  @default    10
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.minuteStep();
     *  @example    <caption>set</caption>
     *      ctrl.minuteStep( 20 );
    ###
    minuteStep: ( val ) -> this._step( 'minuteStep',val )

    _secondStep: 10
    ###
     *  获取或者设置秒微调步进
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TimeSpinner
     *  @member     {Number}     secondStep
     *  @default    10
     *  @tutorial   timespinner_steps
     *  @example    <caption>get</caption>
     *      value = ctrl.secondStep();
     *  @example    <caption>set</caption>
     *      ctrl.secondStep( 20 );
    ###
    secondStep : ( val ) -> this._step( 'secondStep',val )

ebaui['web'].registerFormControl( 'TimeSpinner',TimeSpinner )