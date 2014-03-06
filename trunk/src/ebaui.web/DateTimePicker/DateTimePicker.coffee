###
 *  ebaui.web.DateTimePicker
 *  @class      DateTimePicker 
 *  @memberof   ebaui.web
 *  @extends    ebaui.web.Combo
 *  @tutorial   datetimepicker_index
 *  @param      {Object}    options     -   控件配置参数
 *  @param      {Object}    element     -   dom对象
 *  @example    
 *      &lt;input value="2013-10-08 16:07" data-role="datetimepicker" data-options="{}"/&gt;
###
class DateTimePicker extends Combo

    _showSpinner:false
    ###
     *  是否显示timeSpinner
     *  @public
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @member     {Boolean}    showSpinner
    ###
    showSpinner:( val ) ->
        me = this
        return me._showSpinner unless me.isBoolean( val )

        me._showSpinner = val
        me._panelContent.showSpinner( val )

    _showButtons:true
    ###
     *  是否显示按钮，目前只要显示两个按钮：今天 和 确定 按钮即可
     *  @public
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @member     {Boolean}    showButtons
    ###
    showButtons:( val ) ->
        me = this
        return me._showButtons unless me.isBoolean( val )

        me._showButtons = val
        me._panelContent.showButtons( val )

    _format:'YYYY-MM-DD HH:mm'
    ###
     *  日期时间格式化字符串
     *  @see        {http://momentjs.com/docs/}
     *  @public
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @default    'YYYY-MM-DD HH:mm'
     *  @member     {String}        dateTimeFormat
     *  @example    <caption>get</caption>
     *      var format = ctrl.dateTimeFormat();
     *  @example    <caption>set</caption>
     *      ctrl.dateTimeFormat( 'HH:mm' );
    ###
    format:( val ) ->
        me = this
        return me._format unless val?

        me._format = val
        ###
        *   _text是从buttonEdit继承下来的属性
        *   _updateAttrText是从buttonEdit继承下来的方法
        ###
        me._text   = mo.format( val )
        me._updateAttrText()

    ###
     *  通过代码设置calendar.value属性的时候，如果传入错误的日期，抛出的异常提示信息
     *  @private
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @member     {String}    _formatInvalidException
    ###
    _formatInvalidException : 'The date is invalid, please input a valid date!'

    ###
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @method     _setValue
     *  @arg        {String}     val    -   控件的值
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
    ###
    _setValue:( val, updateHtml = true, updatePopup = true, dispatchEvent = false, eventArgs = {} ) ->
        me = this
        mo = new moment( val )
        throw me._formatInvalidException unless mo.isValid()

        ### 
        *   如果控件值如果value没有变化，则不应该更新控件的值；
        *   否则，更新控件的值
        ###
        return if me._value and val.getTime() is me._value.getTime()

        me._value = val
        ###
        *   update sub control's value
        ###
        me._panelContent.value( val.clone() ) if updatePopup is true
        ###
        *   update text
        *   _text是从buttonEdit继承下来的属性
        *   _updateAttrText是从buttonEdit继承下来的方法
        ###
        me._text  = mo.format( me.format() )
        me._updateAttrText() if updateHtml is true
        ###
        *   trigger 'onchange' event
        ###
        me.triggerEvent( 'change',eventArgs ) if dispatchEvent is true

    ###
     *  创建并且初始化下拉菜单的listbox
     *  @private
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @method     _initPanelContent
    ###
    _initPanelContent: () ->
        me          = this
        ns          = ebaui.web
        panel       = me._panel
        $panel      = panel.uiElement()
        showSpinner = me.showSpinner()
        showButtons = me.showButtons()

        cal = new ns.Calendar( $( 'input',$panel ),{
            'width'      : 260
            'value'      : me.value().clone()
            'showSpinner': showSpinner
            'showButtons': showButtons
            'position'   : ''
        } )

        cal.onEvent( 'change',( sender,eventArgs ) ->
            ###
            *   _setValue方法参数
            *       val,
            *       updateHtml = true,
            *       updatePopup = true, 
            *       dispatchEvent = false, 
            *       eventArgs = {}
            ###
            val = sender.value().clone()
            me._setValue( val,true,false,true,eventArgs )
        )

        cal._todayButton.onEvent( 'click',( sender,eventArgs ) -> 
            panel.close()
        )

        cal._applyButton.onEvent( 'click',( sender,eventArgs ) -> 
            panel.close()
        )

        me._panelContent = cal

    ###
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @method     _setupEvents
     ###
    _setupEvents:( opts ) ->
        super(opts)
        me          = this
        me.onEvent( 'change'    ,opts['onchange'] )

    ###
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.DateTimePicker
     *  @method     _initControl
    ###
    _init: ( opts ) ->
        super( opts )
        me    = this
        ###
        *  初始化控件自身的一系列属性
        ###
        mo              = new moment( opts['value'] )
        initVal         = if opts['value']? and mo.isValid() then mo.toDate() else (new Date)
        
        me._value       = initVal
        me._format      = opts['format'] if opts['format']?
        me._showSpinner = opts['showSpinner'] if opts['showSpinner']?
        me._showButtons = opts['showButtons'] if opts['showButtons']?
        
        mo              = new moment( initVal )
        me._text        = mo.format( me._format )
        ###
        *   创建下拉菜单，并且进行初始化，设置数据源等
        ###
        me._initPanel()
        me._initPanelContent()

    reset:() ->
        super()
        this.value( new Date() )

ebaui['web'].registerFormControl( 'DateTimePicker',DateTimePicker )