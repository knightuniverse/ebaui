###
*   depend on MainView and MonthView
*   所有原生JS对象的拓展代码，放在了web.coffee文件，
*   比如Date.prototype.clone
###

###
 *  控件全名 e.g. ebaui.web.Calendar
 *  控件描述
 *  @class      Calendar 
 *  @memberof   ebaui.web
 *  @extends    ebaui.web.FormElement
 *  @tutorial   calendar_index
 *  @param      {Object}    options     -   控件配置参数
 *  @param      {Object}    element     -   dom对象
 *  @example
 *      &lt;input data-role="calendar" data-options="{}"/&gt;
###
class Calendar extends FormField

    _timeSpinner: null
    ###
     *  timespinner控件
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {TimeSpinner}    _timeSpinner
     ###
    timeSpinner:() -> this._timeSpinner

    _todayButtonText:'Today'

    _todayButton: null
    ###
     *  选择今天按钮
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Button}    _todayButton
     ###
    todayButton:() -> this._todayButton

    _applyButtonText:'Done'
    _applyButton: null
    ###
     *  确定按钮
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Button}    _applyButton
     ###
    applyButton:() -> this._applyButton

    ###
     *  控件要用到的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Object}    _rootCls
     ###
    _rootCls :
        disabled: 'eba-calendar-disabled'
        selected: 'eba-calendar-selected'

    ###
     *  通过代码设置calendar.value属性的时候，如果传入错误的日期，抛出的异常提示信息
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {String}    _formatInvalidException
     ###
    _formatInvalidException : 'The date is invalid, please input a valid date!'

    ###
     *  更新控件enabled的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _updateCssEnabled
     ###
    _updateCssEnabled:() ->
        me    = this
        $root = me._$root
        cls   = me._rootCls['disabled']
        if me.enabled() then $root.removeClass( cls ) else $root.addClass( cls )

    _showButtons:false
    ###
     *  是否显示按钮，目前只要显示两个按钮：今天 和 确定 按钮即可
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Boolean}    showButtons
    ###
    showButtons:( val ) ->
        me = this
        return me._showButtons unless me.isBoolean( val )

        me._showButtons = val
        me._mainView.showButtons( val )
        me._initButtons() unless me._todayButton

    _showSpinner:false
    ###
     *  是否显示timeSpinner
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Boolean}    showSpinner
    ###
    showSpinner:( val ) ->
        me = this
        return me._showSpinner unless me.isBoolean( val )

        me._showSpinner = val
        me._mainView.showSpinner( val )
        ###
        *   当启用timeSpinner,并且还没有初始化的时候
        *   初始化timeSpinner
        ###
        me._initSpinner() if not me._timeSpinner? and val

    ###
     *  获取或者设置控件是否可用
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Boolean}   enabled
     *  @default    true
     *  @example    <caption>get</caption>
     *      //  true
     *      console.log( ctrl.enabled() );
     *  @example    <caption>set</caption>
     *      //  disable control
     *      ctrl.enabled( false )
     ###
    enabled:( val ) ->
        me = this
        return me._enabled unless me.isBoolean( val )

        me._enabled = val

        me._mainView.enabled( val )
        me._monthView.enabled( val )
        me._updateCssEnabled()

    _toggled: true
    ###
     *  显示或者隐藏  年份月份选择  界面
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _toggleViews
    ###
    _toggleViews:()->
        me      = this
        main    = me._mainView
        month   = me._monthView
        toggled = me._toggled

        if toggled
            main.visible(false)
            month.visible(true)
        else
            main.visible(true)
            month.visible(false)

        me._toggled = not toggled

    ###
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _setupEvents
     ###
    _setupEvents: (opts) ->
        me = this
        ###
        *   绑定事件处理程序
        ###
        me.onEvent( 'click' ,opts['onclick'] )

        mainView    = me._mainView
        monthView   = me._monthView
        ###
        *   
        ###
        mainView.onEvent( 'click',( sender,eventArgs ) ->
            val = sender.currentDate().clone()
            me._setValue( val,true,eventArgs )
        )

        ###
        *   
        ###
        monthView.onEvent('apply',( sender ) -> 
            date = me.value().clone()
            date.setFullYear( sender.currentYear() )
            date.setMonth( sender.currentMonth() )
            date.setDate(1)
            ###
            *   更新主视图数据
            ###
            mainView.currentDate(date)
            me._toggleViews()
        )

        monthView.onEvent('cancel',( sender ) -> 
            date = me.value().clone()
            ###
            *   回滚month的数据
            ###
            monthView.currentDate(date)
            me._toggleViews()
        )

    ###
     *  初始化timeSpinner控件
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _initSpinner
    ###
    _initSpinner:() ->
        me        = this
        ns        = ebaui['web']
        $viewRoot = me._mainView.uiElement()
        $context  = $( '[data-inner-role="spinner"]',$viewRoot )
        $el       = $( 'input',$context )

        spn = new ns.TimeSpinner( $el,{ 
            'position': ''
            'width'   : 120
            'value'   : me.value().clone()
        } )
        spn.onEvent( 'change',( sender,eventArgs ) -> 
            spnValue = spn.value()
            calValue = me.value().clone()
            calValue.setHours( spnValue.getHours() )
            calValue.setMinutes( spnValue.getMinutes() )
            ###
            *   update control's vlaue
            *   include mainView, monthView, timeSpinner
            ###
            me._setValue( calValue,true,eventArgs )
        )

        me._timeSpinner = spn

    ###
     *  初始化button控件
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _initButtons
    ###
    _initButtons:() ->
        me          = this
        ns          = ebaui['web']
        main        = me._mainView
        $viewRoot   = main.uiElement()
        $context    = $( '[data-inner-role="buttons"]',$viewRoot )
        
        $el         = $( '[data-inner-role="today"]',$context )
        todayButton = new ns.Button( $el,{ text:me._todayButtonText } )
        
        $el         = $( '[data-inner-role="apply"]',$context )
        applyButton = new ns.Button( $el,{ text:me._applyButtonText } )

        ###
        *   today按钮点击的时候，mainView只是选中了今天
        ###
        todayButton.onEvent( 'click',( button,eventArgs )  ->
            main.pickUpToday()
            me._setValue( main.currentDate(),true,eventArgs )
        )

        ###
        *   apply按钮点击的时候，选中mainview中选中的日期
        ###
        applyButton.onEvent( 'click',( button,eventArgs )  ->
            #me._setValue( main.currentDate(),true,eventArgs )
        )

        me._todayButton = todayButton
        me._applyButton = applyButton

    ###
     *  初始化控件，声明内部变量
     *  ，在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _init
     ###
    _init: ( opts ) ->
        super( opts )
        me            = this
        $root         = me.uiElement()
        ### 
        *   初始化控件自身的一系列属性  
        *   默认情况下
        *   calendar主界面是不会显示底部的按钮和time spinner的
        ###
        me._width     = opts['width'] ? 220
        me._height    = opts['height'] ? 0
        me._showSpinner = opts['showSpinner'] ? false
        me._showButtons = opts['showButtons'] ? false
        ###
        *   当opts['value'] == null的时候
        *   new moment( opts['value'] )会返回一个空对象:{}
        *   这个空对象没有任何属性和方法
        ###
        mo            = new moment( opts['value'] )
        initVal       = if opts['value']? and mo.isValid() then mo.toDate() else (new Date)

        ns            = ebaui['web']
        mainConfig    = 
            currentDate: initVal.clone()
            position   : ''
            showSpinner: me._showSpinner
            showButtons: me._showButtons

        monthConfig   = 
            position   : ''
            currentDate: initVal.clone()
            visible    : false

        me._mainView  = new ns.MainView( $( '[data-inner-role="mainview"]',$root ),mainConfig )
        me._monthView = new ns.MonthView( $( '[data-inner-role="monthview"]',$root ),monthConfig )

        ### 
        *   决定是否初始化timeSpinner或者是Buttons
        ###
        me._initSpinner(opts) if me._showSpinner
        me._initButtons(opts) if me._showButtons

        ### 
        *   设置控件初始值
        ###
        me._value     = initVal
        me._currYear  = initVal.getFullYear()
        me._currMonth = initVal.getMonth()

    ###
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _setValue
     *  @arg        {String}     val    -   控件的值
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
     ###
    _setValue:( val, dispatchEvent = false, eventArgs = {} ) -> 
        me = this
        mo = new moment( val )
        throw me._formatInvalidException unless mo.isValid()

        ###
        *   update subcontrol's vlaue
        *   include mainView, monthView, timeSpinner
        ###
        val = mo.toDate()
        
        ### 
        *   如果控件值如果value没有变化，则不应该更新控件的值；
        *   否则，更新控件的值
        ###
        return if me._value and me._value.getTime() is val.getTime()

        me._value = val.clone()
        me._mainView.currentDate( val.clone() )
        me._monthView.currentDate( val.clone() )
        me._timeSpinner.value( val.clone() ) if me.showSpinner()
        #   trigger 'onchange' event
        me.triggerEvent( 'change',eventArgs ) if dispatchEvent is true

        return undefined

    ###
     *  访问和设置calendar的值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Date}        data
     *  @example    <caption>get</caption>
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( new Date );
     ###
    data: ( val ) -> 
        me = this
        return me._value unless val
        me._setValue( val )

    ###
     *  访问和设置calendar的值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Date}     value
     *  @example    <caption>get</caption>
     *      pair = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( new Date );
     ###
    value : ( val ) -> 
        me = this
        return me._value unless val
        me._setValue( val )

    reset:() ->
        super()
        me = this
        ###
        *   我认为以后可以尝试加入一个新特性，就是reset直接充值到初始化状态
        *   而不是new Date这样
        *   因为初始的值是有可能其他值
        ###
        me.value( new Date() )

ebaui['web'].registerFormControl( 'Calendar',Calendar )