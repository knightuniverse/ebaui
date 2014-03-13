###*
*   @private
*   @class      MainView
*   @classdesc  MainView，Calendar的主视图
*   @memberof   ebaui.web
*   @extends    ebaui.web.Control
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
###
class MainView extends Control
    _headerTmpl: ''
    ###*
     *  已经编译好的日历Week文本HTML模板
     *  ，'日', '一', '二', '三', '四', '五', '六'
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _compiledHeaderTmpl
     ###
    _compiledHeaderTmpl : $.noop

    _weekTmpl: ''
    ###*
     *  已经编译好的日历Week的HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _compiledWeekTmpl
     ###
    _compiledWeekTmpl : $.noop

    ###*
     *  日期文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Array}    _weeks
     ###
    _weeks:['S','M','T','W','T','F','S']

    ###*
     *  get weeks data
     *  @private
     *  @instance
     *  @memberof       ebaui.web.MainView
     *  @method         _genWeeksData
     *  @param          {Number}    year
     *  @param          {Number}    month   0 ~ 11
     *  @returns        {Array}     [year,month,date]
     ###
    _genWeeksData:( year, month )->

        lastDay = new Date(year, month + 1, 0).getDate()
        dates   = ( [year,month,item] for item in [1..lastDay] )

        #  分组group date by week
        week  = []
        weeks = []
        while dates.length > 0
            date = dates.shift()
            week.push(date)
            #  getDay() 方法可返回表示星期的某一天的数字。，返回值是 0（周日） 到 6（周六） 之间的一个整数。
            #  判断是否是星期天
            if new Date(date[0],date[1],date[2]).getDay() is 6
                weeks.push(week)
                week = []

        weeks.push(week) if week.length
        
        firstWeek = weeks[0]
        if firstWeek.length < 7

            while firstWeek.length < 7
                firstDate = firstWeek[0]
                date = new Date(firstDate[0],firstDate[1],firstDate[2]-1)
                firstWeek.unshift([date.getFullYear(), date.getMonth(), date.getDate()])

        else

            firstDate = firstWeek[0]
            week = []
            for i in [1..7]
                date = new Date(firstDate[0], firstDate[1], firstDate[2]-i)
                week.unshift([date.getFullYear(), date.getMonth(), date.getDate()])

            weeks.unshift(week)
        
        lastWeek = weeks[weeks.length-1]
        while lastWeek.length < 7
            lastDate = lastWeek[lastWeek.length-1]
            date = new Date(lastDate[0], lastDate[1], lastDate[2]+1)
            lastWeek.push([date.getFullYear(), date.getMonth(), date.getDate()])

        if weeks.length < 6
            lastDate = lastWeek[lastWeek.length-1]
            week = []
            for i in [1..7]
                date = new Date(lastDate[0], lastDate[1], lastDate[2]+i)
                week.push([date.getFullYear(), date.getMonth(), date.getDate()])

            weeks.push(week)
        
        return weeks

    _currentYear: null
    ###*
     *  当前显示的年份
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Number}    currentYear
     ###
    currentYear:() ->
        me = this
        return me._currentYear unless val?
        me._currentYear = val

    _currentMonth: null
    ###*
     *  当前显示的月份
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Number}    currentMonth
     ###
    currentMonth:() ->
        me = this
        return me._currentMonth unless val?
        me._currentMonth = val

    _currentDate: null
    ###*
     *  当前选中日期
     *  @pubic
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Number}    currentDate
     ###
    currentDate:( val ) -> 
        me = this
        return me._currentDate unless me.isDate( val )
        me._currentDate  = val
        me._currentYear  = val.getFullYear()
        me._currentMonth = val.getMonth()
        
        me._renderTitle()
        me._renderWeeks()

    _titleFormat : 'MMM YYYY'
    ###*
     *  当前标题的格式，比如是xxxx年xx月或者是Sep 2013之类的
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {String}    titleFormat
     ###
    titleFormat:( val ) -> 
        me = this
        return me._titleFormat unless val?
        me._titleFormat = val unless val

    _showButtons:false
    ###*
     *  是否显示按钮，目前只要显示两个按钮：今天 和 确定 按钮即可
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Boolean}    showButtons
    ###
    showButtons:( val ) ->
        me = this
        return me._showButtons unless me.isBoolean( val )

        me._showButtons = val
        $root           = me.uiElement()
        $btns           = $( '[data-inner-role="buttons"]',$root )
        if val then $btns.show() else $btns.hide()

        me._updateFooterCssVisible()
        return undefined

    _showSpinner:false
    ###*
     *  是否显示timeSpinner
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @member     {Boolean}    showSpinner
    ###
    showSpinner:( val ) ->
        me = this
        return me._showSpinner unless me.isBoolean( val )

        me._showSpinner = val
        $root           = me.uiElement()
        $spinner        = $( '[data-inner-role="spinner"]',$root )
        if val then $spinner.show() else $spinner.hide()

        me._updateFooterCssVisible()
        return undefined

    ###*
     *  输出calendar标题部分，比如2013年09月
     *  @private
     *  @instance
     *  @memberof       ebaui.web.MainView
     *  @method         _renderTitle
     *  @param          {Number}    year
     *  @param          {Number}    month   0 ~ 11
     ###
    _renderTitle : () ->
        me    = this
        $root = me._$root
        year  = me.currentYear()
        month = me.currentMonth()
        mo    = new moment( new Date( year,month,1 ) )
        title = mo.format( me.titleFormat() )
        $( '.eba-calendar-title',$root ).text( title )

    ###*
     *  输出calendar日期的表头
     *  ，['日', '一', '二', '三', '四', '五', '六']
     *  @private
     *  @instance
     *  @memberof       ebaui.web.MainView
     *  @method         _renderHeader
     ###
    _renderHeader: () ->
        me    = this
        $root = me.uiElement()
        html  = me._compiledHeaderTmpl( text : me._weeks )
        $( '[data-inner-role="header"]',$root ).html( html )

    ###*
     *  输出calendar的日期
     *  @private
     *  @instance
     *  @memberof       ebaui.web.MainView
     *  @method         _renderWeeks
     *  @param          {Date}      date，当前选中日期
     *  @param          {Number}    year，当前年份
     *  @param          {Number}    month，当前月份
     ###
    _renderWeeks : () ->
        me    = this
        $root = me.uiElement()
        date  = me.currentDate()
        year  = me.currentYear()
        month = me.currentMonth()
        weeks = me._genWeeksData( year,month )

        output = me._compiledWeekTmpl(
            year : year,
            month: month,
            value: [ date.getFullYear(),date.getMonth(),date.getDate() ],
            weeks: weeks
        )

        $( '.eba-calendar-days',$root ).remove()
        $( '[data-inner-role="footer"]',$root ).before( output )

    ###*
     *  只有当timespinner或者是button显示出来的时候，footer才显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _updateFooterCssVisible
     ###
    _updateFooterCssVisible:() ->
        me      = this
        showBtn = me.showButtons()
        showSpn = me.showSpinner()
        visible = ( showSpn or showBtn )
        $root   = me.uiElement()
        $spn    = $( '[data-inner-role="spinner"]',$root )
        $btns   = $( '[data-inner-role="buttons"]',$root )
        $footer = $( '[data-inner-role="footer"]',$root )

        if visible then $footer.show() else $footer.hide()
        if showBtn then $btns.show() else $btns.hide()
        if showSpn then $spn.show() else $spn.hide()

        return undefined

    ###*
     *  更新UI显示
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _render
     ###
    _render:() ->
        super()

        me = this
        me._renderTitle()
        me._renderHeader()
        me._renderWeeks()

        me._updateFooterCssVisible()

    ###*
     *  对当前月份或者年份，进行递增或者递减的操作
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _doIncrease
    ###
    _doRealStuff:( prop,incremental ) ->
        me        = this
        return unless me.enabled()

        if incremental then ++me[prop] else --me[prop]

        currDate  = me.currentDate()
        currYear  = me.currentYear()
        currMonth = me.currentMonth()

        me._renderTitle( currYear,currMonth )
        me._renderWeeks( currDate,currYear,currMonth )

    ###*
     *  切换到下一个月
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     nextMonth
    ###
    nextMonth:() -> this._doRealStuff( '_currentMonth',true )

    ###*
     *  切换到上一个月
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     nextMonth
    ###
    prevMonth:() -> this._doRealStuff( '_currentMonth',false )


    ###*
     *  切换到下一年
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     nextYear
    ###
    nextYear:() -> this._doRealStuff( '_currentYear',true )

    ###*
     *  切换到上一年
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     prevYear
    ###
    prevYear:() -> this._doRealStuff( '_currentYear',false )

    ###*
     *  选中日期
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     pickUp
     *  @arg        {Date}  date     -   要选中的日期
    ###
    pickUp: ( date ) ->
        return unless date?
        me          = this
        me.currentDate( date )
        return undefined

    ###*
     *  选中今天
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     pickUpToday
    ###
    pickUpToday: () -> this.pickUp( (new Date) )

    ###*
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _setupEvents
     ###
    _setupEvents: (opts) ->
        me    = this
        $root = me.uiElement()
        ###
        *   绑定事件处理程序
        ###
        me.onEvent( 'click'  ,opts['onclick'] )

        ###
        *   上一月
        *   下一月
        *   上一年
        *   下一年
        ###
        $root.on( 'click','.eba-calendar-monthPrev',( event ) -> me.prevMonth() )
        $root.on( 'click','.eba-calendar-monthNext',( event ) -> me.nextMonth() )
        $root.on( 'click','.eba-calendar-yearPrev',( event ) -> me.prevYear() )
        $root.on( 'click','.eba-calendar-yearNext',( event ) -> me.nextYear() )

        $root.on( 'click','.eba-calendar-date',( event ) ->
            ###
            *   日历控件上的日期点击事件触发
            ###
            if me.enabled()
                $this     = $(this)
                mo        = new moment($this.attr( 'data-value' ),'YYYY-M-D')
                currMonth = not $this.hasClass('eba-calendar-othermonth')
                ###
                *   显然，你只能选择当前月份的日期
                ###
                if currMonth
                    selected    = mo.toDate()
                    date        = me.currentDate()

                    date.setFullYear( selected.getFullYear() )
                    date.setMonth( selected.getMonth() )
                    date.setDate( selected.getDate() )

                    me.pickUp( date )
                    
                    ###
                    *   触发click事件
                    ###
                    me.triggerEvent( 'click',event )

        )

    ###*
     *  初始化控件，声明内部变量
     *  ，在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MainView
     *  @method     _init
     ###
    _init:( opts ) ->
        super( opts )

        me = this
        ### 
        *   初始化控件自身的一系列属性  
        ###
        init             = if opts['currentDate'] then opts['currentDate'] else new Date()
        me._currentDate  = init
        me._currentYear  = init.getFullYear()
        me._currentMonth = init.getMonth()
        me._showSpinner  = opts['showSpinner'] ? false
        me._showButtons  = opts['showButtons'] ? false
        ###
        *   预编译以后要用到的HTML模板
        ###
        me._compiledWeekTmpl   = me.compileTmpl( me._weekTmpl )
        me._compiledHeaderTmpl = me.compileTmpl( me._headerTmpl )
        
        me._height = '100%'

ebaui['web'].registerControl( 'MainView',MainView )