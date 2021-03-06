###*
*   @class      Panel
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.Control
*   @author     monkey      <knightuniverse@qq.com>
*   @example
*       //  初始化方式一
*       var ns = ebaui.web;
*       var btn = new ns.Panel( $( '' ),{ title:'',id:'',name:'' } );
*       //  初始化方式二
*       $( '' ).panel( { title:'',id:'',name:'' } )
*       //  初始化方式三
*       &lt;input id="" title="" name="" data-role="panel" data-options="{}" /&gt;
###
class Panel extends Control

    ###*
     *  允许的button的state
     *  @private
     *  @instance
     *  @virtual
     *  @memberof   ebaui.web.Button
     *  @member     {String}    _availableState
     ###
    _availableState:/^(primary|info|success|warning|danger|inverse|\s+)$/i

    ###*
     *  panel的head的高度
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {Number}   _headHeight
     ###
    _headHeight: null

    ###*
     *  panel整体的高度
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {Number}   _ctrlHeight
     ###
    _ctrlHeight: null

    ###*
     *  控制当前panel是否展开body的变量
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {Boolean}   _expanded
     ###
    _expanded:true
    
    ###*
     *  把HTML占位符转换成为控件自身的HTML结构
     *  ，在这一个过程中，会使用style="width:XXpx;height:XXpx;"的初始化控件本身的width以及height属性
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _parseUi
     *  @param      {Object}    element HTML占位符
     ###
    _parseUi: ( element ) -> $( element )

    ###*
     *  控件HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {String}    _headerTmpl
    ###
    _headerTmpl:''

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         _init
     ###
    _init: ( opts ) ->
        super( opts )
        me = this
        ###
        *   by defaults, 
        *   panel's position css property will be 'relative' 
        ###
        me._buttons     = opts['buttons'] ? []
        me._iconCls     = opts['iconCls'] ? ''
        me._position    = opts['position'] ? 'relative'
        me._state       = opts['state'] ? ''
        me._hasBorder   = opts['hasBorder'] if opts['hasBorder']?

    _setupEvents: ( opts )->
        me = this
        me._$root.on( 'click',( eventArgs ) -> eventArgs.stopPropagation() )
        
    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _updateCssBorder
     ###
    _updateCssBorder:() ->
        me      = this
        $root   = me.uiElement()
        if me.hasBorder()
            $root.css( 'border',null )
        else
            $root.css( 'border','none' )

    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _updateCssButtons
     ###
    _updateCssButtons:() -> 
        me           = this
        $root        = me.uiElement()

        $header      = $( '.panel-head',$root )
        return unless $header.size() > 0

        buttons = me.buttons()
        ###
        *   if there is no button
        ###
        return if buttons.length is 0

        $buttons = $( 'div.action',$header )
        ###
        *   append dom element and bind event handles
        ###
        for btn in buttons
            btnIconCls = btn.iconCls
            if btnIconCls
                ###
                *   获取onclick的事件处理程序
                *   这边必须使用闭包来做，否则btn是一个对象引用，如果直接绑定btn.onclick，那么会引起这么一个问题：
                *       所有的click事件处理程序，都会引用最后一个btn配置的事件处理程序
                ###
                clickHandle = ( ( config ) -> 
                        fn = config.onclick
                        if typeof fn is "function"
                            return ( eventArgs ) -> fn( me,eventArgs )
                        return ( eventArgs ) -> 
                )(btn)
                $buttons.append( """<a class='btn-#{btnIconCls}' href='javascript:void(0);'><i class='#{btnIconCls}'></i></a>""" )
                $buttons.on( 'click', ".btn-#{btnIconCls}", clickHandle )

    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _updateCssTitle
     ###
    _updateCssHeader:() -> 
        me         = this
        $root      = me.uiElement()
        showHeader = me._couldShowHeader()
        
        $header = $( '.panel-head',$root )
        title   = me.title()
        iconCls = me.iconCls()
        
        ###
        if showHeader
            $root.addClass( 'panel' )
        else
            $root.removeClass( 'panel' )
        ###

        ###
        *   第一次_updateCssHeader的时候
        *   刚好没有满足出现header的条件，并且header并没有生成
        ###
        if $header.size() is 0 and not showHeader
            return;

        ###
        *   $header exists
        ###
        if $header.size() > 0
            if showHeader
                $header.show()
            else 
                $header.hide()
            return

        ###
        *   $header do not exist
        *   append html
        ###
        $root.prepend( me._headerTmpl )
        $header  = $( '.panel-head', $root )
        $buttons = $( 'div.action',$header )
        ###
        *   set panel title
        ###
        $( 'h5',$header ).text( title )
        ###
        *   set panel title icon
        ###
        $( 'div.caption',$header ).prepend( "<i class='#{iconCls}'></i>" ) if iconCls
        ###
        *   set panel actions
        ###
        me._updateCssButtons()
        ###
        *   panel的title以及border的颜色等
        ###
        me._updateCssStates()
        
    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _updateCssTitle
     ###
    _updateCssStates:() ->
        me       = this
        ###
        *   如果panel没有显示header的话，我觉得还是不要放上这个state好了
        ###
        return unless me._showHeader
        
        state    = $.trim(me.state())
        $root    = me.uiElement()
        cls      = $root.attr( 'class' ).replace(/panel-primary|panel-info|panel-success|panel-warning|panel-danger|panel-inverse/ig,'')
        stateCls = if state then "panel-#{state}" else ""
        $root.attr( 'class',"#{cls} #{stateCls}" ) if state
        
        return undefined

    ###*
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _render
     ###
    _render: () ->
        me    = this
        $root = me.uiElement()
        ###
        *   
        ###
        $root.addClass( 'panel' )
        ###
        *   first step
        *   wrap panel content with """ <div class="panel-body"></div> """
        ###
        $contents = $root.contents()
        $contents.wrapAll('<div class="panel-body"></div>')

        ###
        *   second
        *   judge if it's necessary to show panel header
        ###
        me._updateCssHeader()
        me._updateCssBorder()
        ###
        *   调用父类的_render方法
        ###
        super()
        ###
        *
        ###
        me._ctrlHeight = if me._height > 0 then me._height else $root.height()
        me._headHeight = $( '.panel-head',$root ).height()

    ###*
     *  是否显示panel header
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {Boolean}   _showHeader
     ###
    _showHeader: false

    ###*
     *  是否显示panel header
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @method     _couldShowHeader
     ###
    _couldShowHeader:()->
        ###
        *   如果你既没有填写title也没有icon更不指定任何的button放在panel的顶部
        *   那么直接不进行处理
        ###
        me             = this
        title          = me.title()
        iconCls        = me.iconCls()
        buttons        = me.buttons()
        me._showHeader = title.length > 0 or iconCls.length > 0 or buttons.length > 0
        return me._showHeader
    
    _state : ''
    ###*
     *  获取或者设置button的状态
     *  可选的值：
     *  
     *  primary
     *  info
     *  success
     *  warning
     *  danger
     *  inverse
     *  
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {String}    state
     *  @default    ''
     *  @example    <caption>get</caption>
     *      var state = ctrl.state();
     *  @example    <caption>set</caption>
     *      ctrl.state( '' );
     ###
    state:( val ) ->
        me   = this
        availableState = me._availableState
        return me._state if not availableState.test( val )

        me._state = val.toLowerCase()
        me._updateCssStates()

    ###*
     *  获取或者设置控件是否可见
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {String}   title
     *  @default    ''
     *  @example    <caption>get</caption>
     *      console.log( ctrl.title() );
     *  @example    <caption>set</caption>
     *      ctrl.title( 'pls type user name' )
     ###
    title:( val ) ->
        me    = this
        return me._title unless me.isString(val)

        me._title = val
        $root     = me.uiElement()
        if me._couldShowHeader()
            ###
            *   first we should make sure that header has been created before
            *   if header has been created before then it is no necessary to do it again
            *   else create header then update panel title
            ###
            me._updateCssHeader()
            ###
            *   update title
            ###
            $( '.panel-head h5', $root ).text( me._title ) if me._title


    _buttons:[]
    ###*
     *  panel标题栏的按钮
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @member         {Array}    buttons
     ###
    buttons:( val ) ->
        me = this
        return me._buttons unless me.isArray( val )

        ###
        *   remove all old buttons
        *   unbind all old button click handles
        ###
        old = me._buttons
        if old.length > 0
            $header  = $( '.panel-head', $root )
            $buttons = $( 'div.action',$header )
            ###
            *   off all event hanlds
            ###
            for btn in old
                btnIconCls = btn.iconCls
                $buttons.off( 'click',btnIconCls ) if btnIconCls

            ###
            *   empty dom elements
            ###
            $buttons.html( '' )

        me._buttons = val
        me._updateCssButtons()
        
    ###*
     *  获取或者设置是否显示边框
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Panel
     *  @member     {Boolean}   hasBorder
     *  @default    false
     *  @example    <caption>get</caption>
     *      //  hasBorder == true
     *      hasBorder = ctrl.hasBorder();
     *  @example    <caption>set</caption>
     *      ctrl.hasBorder( true );
     *      ctrl.hasBorder( false );
    ###
    _hasBorder: false
    hasBorder: (val) ->
        me = this
        return me._hasBorder unless me.isBoolean(val)
    
        me._hasBorder = val
        me._updateCssBorder()
        # todo 更新样式控件的样式

    _iconCls: ''
    ###*
     *  panel标题的icon样式类
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @member         {String}    iconCls
     ###
    iconCls: ( val ) ->
        me = this
        return me._iconCls unless val?
        me._iconCls = $.trim( val )
        if me._couldShowHeader()
            ###
            *   first we should make sure that header has been created before
            *   if header has been created before then it is no necessary to do it again
            *   else create header then update panel title
            ###
            me._updateCssHeader()
            ###
            *   update title
            ###
            $dom = $( 'div.caption',$header )
            if me._iconCls
                $dom.html( "<i class='#{me._iconCls}'></i>" ) 
            else
                $dom.html( "" )

    ###*
     *  显示或者关闭panel
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         toggle
     ###
    toggle:() ->
        me = this
        me.visible( not me.visible() )

    ###*
     *  显示panel
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         open
     ###
    open: () -> this.visible( true )

    ###*
     *  关闭panel
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         close
     ###
    close: () -> this.visible( false )

    ###*
     *  移动panel
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         move
     *  @arg            {Object}    pos - new position { top left }
     ###
    move: ( pos ) ->
        unless pos
            return

        me   = this
        opts = me.options

        if pos['top']? then me._top = pos['top']
        if pos['left']? then me._left = pos['left']

        me._$root.css(
            'top' : me._top,
            'left': me._left
        )
        return undefined

    ###*
     *  收起panel的内容区域
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         collapse
     ###
    collapse:() ->
        me           = this
        return unless me._expanded

        me._expanded = false
        $root        = me.uiElement()
        $body        = $( '.panel-body',$root )
        $root.animate( { height:me._headHeight },400,'swing',() -> 
            me.height( me._headHeight )
            $body.hide()
        )

    ###*
     *  展开panel的内容区域
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Panel
     *  @method         expand
     ###
    expand:() ->
        me           = this
        return if me._expanded

        me._expanded = true
        $root        = me.uiElement()
        $body        = $( '.panel-body',$root )
        $root.animate( { height:me._ctrlHeight },400,'swing',() -> 
            $body.show()
            me.height( me._ctrlHeight )
        )

ebaui['web'].registerControl( 'Panel',Panel )