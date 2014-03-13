###*
*   IE下，Button有一个比较蛋疼的问题就是，当你按下回车键的时候
*   浏览器会触发Button的click事件
*   关于这个问题的解决方案，就是给button标签添加属性：type="button"
*   see http://tjvantoll.com/2013/05/22/why-are-enter-keypresses-clicking-my-buttons-in-ie/
###
###*
*   @class      Button
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.Control
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
*   @example
*       //  初始化方式一
*       var ns = ebaui.web;
*       var btn = new ns.Button( $( '' ),{ title:'',id:'',name:'' } );
*       //  初始化方式二
*       $( '' ).button( { title:'',id:'',name:'' } )
*       //  初始化方式三
*       &lt;input id="" title="" name="" data-role="button" data-options="{}" /&gt;
###
class Button extends Control
    ###*
     *  允许的button的state
     *  @private
     *  @instance
     *  @virtual
     *  @memberof   ebaui.web.Button
     *  @member     {String}    _availableState
     ###
    _availableState:/^(primary|info|success|warning|danger|inverse|link|\s+)$/i

    ###*
     *  更新控件enabled的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @method     _updateCssEnabled
     ###
    _updateCssEnabled:() ->
        me  = this
        $root = me.uiElement()
        cls = 'eba-button-disabled'
        enabled = me.enabled()
        op  = if enabled then 'removeClass' else 'addClass'
        $root[op](cls)
        $root.prop( 'disabled',not enabled )

    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @method     _updateAttrText
     ###
    _updateAttrText:() ->
        me  = this
        txt = me.text()
        me._$btnText.text( txt ) if txt
        undefined

    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @method     _updateAttrHref
     ###
    _updateAttrHref:() ->
        me   = this
        href = me.href()
        attrVal = if ( me.enabled() and href ) then href else 'javascript:void(0);'
        me._$root.attr( 'href',attrVal )
        undefined

    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @method     _updateAttrTarget
     ###
    _updateAttrTarget:() ->
        me     = this
        target = me.target()
        me._$root.attr( 'target',if target.length > 0 then target else null )
        undefined

    _updateCssStates:() ->
        me       = this
        state    = $.trim(me.state())
        $root    = me.uiElement()
        cls      = $root.attr( 'class' ).replace(/eba-button-primary|eba-button-info|eba-button-success|eba-button-warning|eba-button-danger|eba-button-inverse|eba-button-link/ig,'')
        stateCls = if state then "eba-button-#{state}" else ""
        $root.attr( 'class',"#{cls} #{stateCls}" ) if state
        return undefined

    _updateCssIcon:() ->
        me           = this
        $root        = me._$root
        iconPosition = me.iconPosition()
        iconHtml     = '<i class="{0}"></i>'.replace( '{0}',me.iconCls() )
        
        $( 'i',$root ).remove()

        if iconPosition isnt 'left'
            $root.append( iconHtml )
        else
            $root.prepend( iconHtml )
        undefined

    _render:() -> 
        super()
        me = this
        me._updateAttrText()
        me._updateCssIcon()
        me._updateAttrHref()
        me._updateAttrTarget()
        me._updateCssStates()

    _setupEvents:( opts ) ->

        me       = this
        $root    = me.uiElement()
        keyboard = ebaui['web'].keyboard

        me.onEvent( 'click',opts['onclick'] )

        $root.on( 'keydown',( eventArgs ) -> 
            enter = eventArgs.which is 13
            if me.enabled() and me.focused() and enter
                eventArgs.preventDefault()
                me.triggerEvent( 'click',eventArgs )
        )

        $root.on( 'click',( eventArgs ) -> 
            if me.enabled()
                eventArgs.preventDefault()
                me.triggerEvent( 'click',eventArgs )
        )

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   Button
     *  @method     _init
     ###
    _init:( opts ) ->
        super( opts )
        me               = this
        me._$btnText     = $('.eba-button-text ', me._$root)
        
        initState        = opts['state']
        me._state        = initState.toLowerCase() if me._availableState.test( initState )
        
        me._text         = opts['text'] ? ''
        me._href         = opts['href'] ? ''
        me._target       = opts['target'] ? 'blank'
        me._iconCls      = opts['iconCls'] ? ''
        me._iconPosition = opts['iconPosition'] ? 'left'
        me._enterAsTab   = opts['enterAsTab'] ? true

    _focus:() -> this._$root.focus()

    _blur:() -> this._$root.blur()

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
     *  link
     *  
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
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

        if not availableState.test( val )
            return me._state

        me._state = val.toLowerCase()
        me._updateCssStates()

    _text : 'button'
    ###*
     *  获取或者设置button文本值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {String}    text
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #text == 'text'
     *      var text = ctrl.text();
     *  @example    <caption>set</caption>
     *      ctrl.text( 'label' );
     ###
    text:( val ) ->
        me = this
        unless me.isString( val )
            return me._text

        me._text = val
        me._$btnText.text( val )

        undefined

    _href : ''
    ###*
     *  获取或者设置button超链接地址
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {String}    href
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #href == 'href'
     *      var href = ctrl.href();
     *  @example    <caption>set</caption>
     *      ctrl.href( 'http://xxx.com/xxx' );
     ###
    href:( val ) ->

        me = this
        unless me.isString( val )
            return me._href

        unless $.trim( val ).length is 0
            return me._href

        me._href = val
        me._updateAttrHref()

        undefined

    _target : 'blank'
    ###*
     *  获取或者设置在何处打开目标 URL
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {String}    target
     *  @default    '_blank'
     *  @example    <caption>get</caption>
     *      var target = ctrl.target();
     *  @example    <caption>set</caption>
     *      #_blank _parent _self _top 
     *      ctrl.target( '_blank' );
     ###
    target:( val ) -> 
        me = this
        re = /_parent|_blank|_self|_top/i

        unless re.test(val)
            return me._target

        me._target = val
        me._updateAttrTarget()

    ###*
     *  控件是否可以获取焦点
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.Button
     *  @member     {Boolean}   focusable
     *  @default    false
     *  @example    <caption>get</caption>
     *      #false
     *      console.log( ctrl.focusable() );
     ###
    focusable:() -> true

    _iconCls:''
    ###*
     *  获取或者设置button的icon图标CSS样式类
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {String}    iconCls
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #iconCls == 'icon-add'
     *      var iconCls = ctrl.iconCls();
     *  @example    <caption>set</caption>
     *      ctrl.iconCls( 'icon-add' );
     ###
    iconCls:( val ) -> 
        me = this
        if me.isEmpty( val ) 
            return me._iconCls

        me._iconCls = val
        me._updateCssIcon()

    _iconPosition : 'left'

    ###*
     *  获取或者设置button的icon图标位置，可选的值有：left right
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {String}    iconPosition
     *  @default    'left'
     *  @example    <caption>get</caption>
     *      #position == 'left'
     *      var position = ctrl.iconPosition();
     *  @example    <caption>set</caption>
     *      ctrl.iconPosition( 'left' );
     *      ctrl.iconPosition( 'right' );
     ###
    iconPosition:( val ) -> 
        me = this
        re = /left|right/i
        return me._iconPosition unless re.test(val)

        me._iconPosition = val
        me._updateCssIcon()

    _enterAsTab : true
    ###*
     *  获取或者设置表单控件是否允许按下enter键的时候，聚焦到下一个控件
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {Boolean}   enterAsTab
     *  @default    false
     *  @example    <caption>get</caption>
     *      var enterAsTab = ctrl.enterAsTab();
     *  @example    <caption>set</caption>
     *      ctrl.enterAsTab( true );
     ###
    enterAsTab:( val ) -> 
        me = this;
        return me._enterAsTab unless me.isBoolean( val )
        me._enterAsTab = val

ebaui['web'].registerControl( 'Button',Button )