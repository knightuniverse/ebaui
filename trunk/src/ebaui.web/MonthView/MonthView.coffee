###*
*   @private
*   @class      MonthView
*   @classdesc  MonthView，Calendar的month视图，用来切换calendar当前的month以及year
*   @memberof   ebaui.web
*   @extends    ebaui.web.Control
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
###
class MonthView extends Control
    _monthsTmpl:''
    ###*
     *  已经编译好的日历Week文本HTML模板
     *  ，'日', '一', '二', '三', '四', '五', '六'
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _compiledMonthsTmpl
     ###
    _compiledMonthsTmpl : $.noop

    _yearsTmpl:''
    ###*
     *  已经编译好的日历Week文本HTML模板
     *  ，'日', '一', '二', '三', '四', '五', '六'
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _compiledYearsTmpl
     ###
    _compiledYearsTmpl : $.noop

    ###*
     *  月份文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @member     {Array}    _months
    ###
    _months:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    ###*
     *  menu界面，点击月份的时候触发
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _select
     *  @arg        {DOM}       chosen  - 当前点击的dom引用
     *  @arg        {String}    context - css 选择器
    ###
    _select:( chosen,context ) ->
        me      = this
        $root   = me.uiElement()
        $chosen = $(chosen)
        cls     = 'eba-calendar-menu-selected'
        ###
        *   如果当前点击的dom已经是选中状态，直接返回
        ###
        return if $chosen.hasClass(cls)

        $context = $(context,$root)
        ###
        *   menu界面的月份点击的时候触发
        *   移除上一个选中的项目的选中样式
        ###
        $( ".#{cls}",$context ).removeClass(cls)

        ###
        *   为当前选中项添加选中样式
        ###
        $chosen.addClass(cls)

        return undefined

    _renderMonths:() ->
        me     = this
        $root  = me.uiElement()
        output = me._compiledMonthsTmpl(
            currentMonth: me.currentMonth()
            months      : me._months 
        )
        $( '.eba-calendar-menu-months',$root ).html( output )

    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _renderYearRange
     ###
    _renderYears:( range ) ->
        me        = this
        $root     = me._$root
        currYear  = me.currentYear()
        currMonth = me.currentMonth()
        range     = [currYear..(currYear + 9)] unless range

        output    = me._compiledYearsTmpl(
            value : [ currYear,currMonth,1 ]
            years : range
        )

        $( '.eba-calendar-menu-years',$root ).html( output )

    ###*
     *  更新UI显示
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _render
     ###
    _render:() ->
        me = this
        me._renderMonths()
        me._renderYears()
        me._updateCssVisible()

    ###*
     *  menu界面，点击上一个十年或者下一个十年的时候触发
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Calendar
     *  @method     _switchYearRange
     *  @arg        {Number}       start
    ###
    _switchYearRange:( start ) ->
        me        = this
        start     = parseInt( start )
        menuYears = me._getMenuYears( start )
        me._renderMenu( menuYears,me._currYear,me._currMonth )

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _init
    ###
    _init:( opts ) ->
        super( opts )
        me = this
        ### 初始化控件自身的一系列属性  ###
        me._currentDate  = if opts['currentDate'] then opts['currentDate'] else new Date()
        ###
        *   预编译以后要用到的HTML模板
        ###
        me._compiledMonthsTmpl = me.compileTmpl( me._monthsTmpl )
        me._compiledYearsTmpl  = me.compileTmpl( me._yearsTmpl )
        
        me._height = '100%'

    ###*
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @method     _setupEvents
     ###
    _setupEvents: (opts) ->
        me    = this
        $root = me.uiElement()

        me.onEvent( 'apply' ,opts['onapply'] )
        me.onEvent( 'cancel',opts['oncancel'] )
        
        year        = '.eba-calendar-menu-year'
        month       = '.eba-calendar-menu-month'
        ok          = '.eba-calendar-okButton'
        cancel      = '.eba-calendar-cancelButton'

        $root.on( 'click','.eba-calendar-menu-prevYear',( event ) ->
            start = parseInt( $(this).attr( 'data-value' ) )
            me._renderYears( start )
        )

        $root.on( 'click','.eba-calendar-menu-nextYear',( event ) ->
            start = parseInt( $(this).attr( 'data-value' ) )
            me._renderYears( start )
        )

        $root.on( 'click',month,( event ) ->
            me._select( this,'.eba-calendar-menu-months' )
        )

        $root.on( 'click',year,( event ) -> 
            me._select( this,'.eba-calendar-menu-years' ) 
        )

        $root.on( 'click',cancel,( event ) -> 
            me.triggerEvent( 'cancel',event ) 
        )

        $root.on( 'click',ok,( event ) ->
            cls = '.eba-calendar-menu-selected'
            ###
            *   更新值
            ###
            $month           = $( ".eba-calendar-menu-months .#{cls}",$root )
            $year            = $( ".eba-calendar-menu-years .#{cls}",$root )
            me._currentYear  = parseInt( $year.attr( 'data-value' ) )
            me._currentMonth = parseInt( $month.attr( 'data-value' ) )
            ###
            *   触发事件
            ###
            me.triggerEvent( 'apply',event )
        )

    ###*
     *  当前显示的年份
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @member     {Number}    currentYear
     ###
    currentYear:( val ) ->
        me = this
        return me._currentDate.getFullYear() unless val?
        me._currentDate.setFullYear( val )
        me._renderYears()

    ###*
     *  当前显示的月份
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @member     {Number}    currentMonth
     ###
    currentMonth:( val ) ->
        me = this
        return me._currentDate.getMonth() unless val?
        me._currentDate.setMonth( val )
        me._renderMonths()

    _currentDate: null
    ###*
     *  当前选中日期
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MonthView
     *  @member     {Number}    currentDate
     ###
    currentDate:( val ) -> 
        me = this
        return me._currentDate unless me.isDate( val )

        me._currentDate  = val
        me._renderMonths()
        me._renderYears()

ebaui['web'].registerControl( 'MonthView',MonthView )