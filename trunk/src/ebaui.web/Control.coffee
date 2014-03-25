#!/bin/env bash
# ebaui.web.Control
ArrayProto     = Array.prototype
slice          = ArrayProto.slice
nativeForEach  = ArrayProto.forEach

ObjectProto    = Object.prototype
toString       = ObjectProto.toString
###*
*   @class      Control
*   @classdesc
*   @memberof   ebaui.web
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
###
class Control
    constructor:( element,options ) ->
        me       = this
        dataOpts = me._parseDataOptions( element )
        attrOpts = me._parseAttrOptions( element )
        opts     = $.extend({},dataOpts, attrOpts)
        opts     = $.extend({},opts,options) if options
        ###
        *   _eventHandlers是一个实例属性
        *   _eventHandlers如果放在类prototype上，则所有的类的实例会共享这个属性
        *   这样将会导致所有的实例的事件处理程序完全一样，失去了多态
        *   实际上，这涉及到了JS的写时复制机制: http://blog.baiwand.com/?post=209
        ###
        me._eventHandlers = {}
        me._controlID     = ebaui.guid()
        me._$root         = me._parseUi( element )

        me._init( opts )
        me._setupEvents( opts )
        me._render()

        ###
        *   在某些特定场景下，有些class类并不一定会有$root这个属性
        *   非常明显的一个例子就是Tabs控件
        *   Tabs应该说是一个控件集合
        *   控件里每一个对象都是Tab控件对象
        *   Tab控件对象是没有_$root属性的
        ###
        me._$root.data( 'model',me ) if me._$root?
        
        return undefined

    ###*
     *  控件ID
     *  @private
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    _controlID
     ###
    _controlID : undefined

    ###*
     *  
     *  @private
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    _namespace
     ###
    _namespace : ''

    ###*
     *  
     *  @private
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    _controlFullName
     ###
    _controlFullName : ''

    ###*
     *  控件HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    _rootTmpl
     ###
    _rootTmpl : ''

    ###*
     *  CSS长度单位的正则表达式匹配
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {RegExp}    _cssUnitRE
     ###
    _cssUnitRE:/^(\d+)(%|in|cm|mm|em|ex|pt|pc|px)?$/

    ###*
     *  更新UI的宽度和高度
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _doUpdateCssSize
     *  @arg        {String}    cssProp
     ###
    _doUpdateCssSize:( cssProp ) ->
        me        = this
        $root     = me._$root
        return unless $root?

        propVal = me[cssProp]()
        isNum   = me.isNumber( propVal )
        return if isNum and propVal <= 0

        result  = me._cssUnitRE.exec( propVal )
        cssUnit = result[2]
        $root.css( cssProp,if cssUnit? then propVal else ( propVal + 'px' ) )
        return undefined

    ###*
     *  更新UI的宽度
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssWidth
     ###
    _updateCssWidth:() -> this._doUpdateCssSize( 'width' )

    ###*
     *  更新UI的高度
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssHeight
     ###
    _updateCssHeight:() -> this._doUpdateCssSize( 'height' )

    ###*
     *  更新UI的位置，top或者是left
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssOffset
     ###
    _updateCssOffset:( cssProp )->

        me    = this
        $root = me._$root
        return unless $root?

        val = me[cssProp]()
        $root.css( cssProp,val + 'px' ) if not isNaN( val ) and val isnt 0

    ###*
     *  更新UI的位置top
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssTop
     ###
    _updateCssTop:() -> this._updateCssOffset( 'top' )

    ###*
     *  更新UI的位置left
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssLeft
     ###
    _updateCssLeft:() -> this._updateCssOffset( 'left' )

    ###*
     *  更新UI的position属性
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssPosition
     ###
    _updateCssPosition:() ->

        me    = this
        $root = me._$root
        return unless $root?

        position = me.position()
        cssVal = if not me.isEmpty( position ) then position else null
        $root.css( 'position',cssVal )

        return undefined

    ###*
     *  更新UI的title属性
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateAttrTitle
     ###
    _updateAttrTitle:()->

        me    = this
        $root = me._$root
        return unless $root?

        title = me._title
        $root.attr( 'title',title ) unless me.isEmpty(title)

        return undefined

    ###*
     *  初始化DOM事件处理程序
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _setupEvents
     ###
    _setupEvents : $.noop

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _init
     ###
    _init : ( opts ) ->
        return unless opts?
        me             = this
        me._id         = opts['id'] ? ''
        me._title      = opts['title'] ? ''
        me._name       = opts['name'] ? ''
        
        me._width      = opts['width'] ? 0
        me._height     = opts['height'] ? 0
        me._top        = opts['top'] ? 0
        me._left       = opts['left'] ? 0
        me._position   = opts['position'] ? ''
        
        me._visible    = opts['visible'] ? true
        me._enabled    = opts['enabled'] ? true
        me._focused    = opts['focused'] ? false

    ###*
     *  获取焦点
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _focus
     ###
    _focus : $.noop

    ###*
     *  失去焦点
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _blur
     ###
    _blur : $.noop

    ###*
     *  更新控件enabled的UI样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssEnabled
     ###
    _updateCssEnabled:$.noop

    ###*
     *  设置或者移除据聚焦样式或者失焦样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateCssFocused
     ###
    _updateCssFocused:$.noop

    ###*
     *  更新控件visible的UI样式
     *  @private
     *  @instance
     *  @memberof    ebaui.web.Control
     *  @method     _updateCssVisible
     ###
    _updateCssVisible:() ->
        me    = this
        $root = me._$root
        return unless $root?
        
        method = if me.visible() then 'show' else 'hide'
        $root[method]()

        return undefined

    ###*
     *  把HTML占位符转换成为控件自身的HTML结构
     *  ，在这一个过程中，会使用style="width:XXpx;height:XXpx;"的初始化控件本身的width以及height属性
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _parseUi
     *  @param      {Object}    element HTML占位符
     ###
    _parseUi:( element ) ->
        ###
            创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
            _parseDataOptions
            _parseAttrOptions
            _parseUi
            _init
            _setupEvents
            _render

            self._$root.data( 'model',self );
        ###
        return null unless element?

        me = this
        return if me._rootTmpl.length is 0

        $el      = $( element )
        $html    = $( me._rootTmpl ).attr('data-parsed','true')
        $el.replaceWith( $html )

        return $html

    ###*
     *  把html标签定义的data-options字符串转换成javascript对象
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _parseDataOptions
     *  @param      {Object}    element
     ###
    _parseDataOptions:( element )->
        ###
            创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
            _parseDataOptions
            _parseAttrOptions
            _parseUi
            _init
            _setupEvents
            _render

            self._$root.data( 'model',self );
        ###
        me      = this
        $el     = $( element )
        options = {}
        
        return options if $el.size() is 0

        attr = $el.attr('data-options')
        if attr

            first = attr.substring(0,1)
            last  = attr.substring(attr.length-1)

            if first isnt '{'
                attr = '{' + attr

            if last isnt '}'
                attr = attr + '}' 

            options = ( new Function( 'return ' + attr ) )()

        return options

    ###*
     *  获取w3c中，html标签本身就支持的属性配置<br />
     *  ebaui框架中，html标签本身就支持的属性直接编写在html标签内，而不会放在data-option里面进行配置
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _parseAttrOptions
     *  @param      {Object}    element HTML占位符
     ###
    _parseAttrOptions:( element ) ->
        ###
            创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
            _parseDataOptions
            _parseAttrOptions
            _parseUi
            _init
            _setupEvents
            _render

            self._$root.data( 'model',self );
        ###

        $el   = $(element)
        id    = $el.attr( 'id' ) ? ''
        name  = $el.attr( 'name' ) ? ''
        title = $el.attr( 'title' ) ? ''

        options      = 
            'id'   : id
            'name' : name
            'title': title

        return options

    ###*
     *  更新$root的id属性
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _updateAttrId
     ###
    _updateAttrId:() ->
        me = this
        id = me.id()
        me._$root.attr('id', id) unless me.isEmpty( id )

    ###*
     *  更新UI显示
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     _render
     ###
    _render:()->
        ###
            创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
            _parseDataOptions
            _parseAttrOptions
            _parseUi
            _init
            _setupEvents
            _render

            self._$root.data( 'model',self );
        ###
        me = this
        me._updateCssWidth()
        me._updateCssHeight()
        me._updateCssPosition()
        me._updateCssTop()
        me._updateCssLeft()
        me._updateCssEnabled()
        me._updateCssVisible()

        me._updateAttrTitle()
        me._updateAttrId()

        return undefined

    ###*
     *  获取控件类所属命名空间
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    namespace
     *  @example    <caption>get</caption>
     *      console.log( ctrl.namespace() );
     ###
    namespace:() -> this._namespace

    ###*
     *  获取包含命名空间在内的控件全名
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    controlFullName
     *  @example    <caption>get</caption>
     *      console.log( ctrl.controlFullName() );
     ###
    controlFullName:() -> this._controlFullName

    _id : ''
    ###*
     *  获取控件html标签的ID
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    id
     *  @example    <caption>get</caption>
     *      console.log( ctrl.id() );
     ###
    id:() -> this._id

    _enabled : true
    ###*
     *  获取或者设置控件是否可用
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Boolean}   enabled
     *  @default    true
     *  @example    <caption>get</caption>
     *      console.log( ctrl.enabled() );
     *  @example    <caption>set</caption>
     *      ctrl.enabled( false )
     ###
    enabled:( val ) ->
        me = this
        return me._enabled unless me.isBoolean( val )
        me._enabled = val
        me._updateCssEnabled()

    _title : ''
    ###*
     *  获取或者设置控件是否可见
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}   title
     *  @default    ''
     *  @example    <caption>get</caption>
     *      console.log( ctrl.title() );
     *  @example    <caption>set</caption>
     *      ctrl.title( 'pls type user name' )
     ###
    title:( val ) ->
        me = this;
        return me._title unless me.isString val
        me._title = val
        me._updateAttrTitle()

        undefined

    _name : ''
    ###*
     *  表单的name属性
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}   name
     *  @default    ''
     *  @example    <caption>get</caption>
     *      console.log( ctrl.name() );
     *  @example    <caption>set</caption>
     *      ctrl.name( '' )
     ###
    name:( val ) ->
        me = this;
        return me._name unless me.isString val

        me._name = val
        undefined

    _visible : true
    ###*
     *  获取或者设置控件是否可见
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Boolean}   visible
     *  @default    true
     *  @example    <caption>get</caption>
     *      console.log( ctrl.visible() );
     *  @example    <caption>set</caption>
     *      ctrl.visible( false )
     ###
    visible:( val ) ->
        me = this
        return me._visible unless me.isBoolean val

        me._visible = val
        me._updateCssVisible()
        undefined

    ###*
     *  控件是否可以获取焦点
     *  @public
     *  @instance
     *  @virtual
     *  @readonly
     *  @memberof   ebaui.web.Control
     *  @member     {Boolean}   focusable
     *  @default    false
     *  @example    <caption>get</caption>
     *      console.log( ctrl.focusable() );
     ###
    focusable:() -> false

    _focused : false
    ###*
     *  获取或者设置控件是否已经得到焦点
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Boolean}   focused
     *  @default    false
     *  @example    <caption>get</caption>
     *      console.log( ctrl.focused() );
     *  @example    <caption>set</caption>
     *      ctrl.focused( false );
     ###
    focused:( val ) ->
        me = this;
        return me._focused unless me.isBoolean val

        me._focused = val
        method = if val then '_focus' else '_blur'
        me[method]()
        me._updateCssFocused()

    _width : 0
    ###*
     *  获取或者设置控件宽度
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Number}    width
     *  @default    null
     *  @example    <caption>get</caption>
     *      console.log( ctrl.width() );
     *  @example    <caption>set</caption>
     *      ctrl.width( 100 );
     ###
    width:( val ) ->
        me = this;
        return me._width unless me.isNumber val

        me._width = val
        me._updateCssWidth()
        undefined

    _height : 0
    ###*
     *  获取或者设置控件高度
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Number}    height
     *  @default    null
     *  @example    <caption>get</caption>
     *      console.log( ctrl.height() );
     *  @example    <caption>set</caption>
     *      ctrl.height( 100 );
     ###
    height:( val ) ->
        me = this;
        return me._height unless me.isNumber val

        me._height = val
        me._updateCssHeight()
        undefined

    _top : 0
    ###*
     *  获取或者设置控件的位置top
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Number}    top
     *  @default    null
     *  @example    <caption>get</caption>
     *      console.log( ctrl.top() );
     *  @example    <caption>set</caption>
     *      ctrl.top( 100 );
     ###
    top:( val ) ->
        me = this;
        return me._top unless me.isNumber val

        me._top = val
        me._updateCssTop()
        undefined

    _left : 0
    ###*
     *  获取或者设置控件的位置left
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Number}    left
     *  @default    null
     *  @example    <caption>get</caption>
     *      console.log( ctrl.left() );
     *  @example    <caption>set</caption>
     *      ctrl.left( 100 );
     ###
    left:( val ) ->
        me = this;
        return me._left unless me.isNumber val

        me._left = val
        me._updateCssLeft()
        undefined

    _position : ''
    ###*
     *  position设置
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    position
     *  @default    'static'
     *  @example    <caption>get</caption>
     *      console.log( ctrl.position() );
     *  @example    <caption>set</caption>
     *      ctrl.position( 'relative' );
     ###
    position:( val ) ->

        me = this
        re = /^(absolute|fixed|relative|static|inherit|\s*)$/
        return me._position if not re.test( val )

        me._position = $.trim( val )
        me._updateCssPosition()
        return undefined

    ###*
     *  获取控件ID
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {String}    controlID
     *  @example    <caption>get</caption>
     *      console.log( ctrl.controlID() );
     ###
    controlID:() -> this._controlID

    ###*
     *  获取控件关联的HTML DOM对象的jQuery包装
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @member     {Object}    uiElement
     *  @example    <caption>get</caption>
     *      console.log( ctrl.uiElement() );
     ###
    uiElement:() -> this._$root

    ###*
     *  绑定控件事件处理程序
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     onEvent
     *  @arg        {String}        event
     *  @arg        {Function}      fn
     *  @example    
     *      ctrl.onEvent()
     ###
    onEvent:() ->

        me = this
        parameters = ArrayProto.slice.apply( arguments )
        len = parameters.length
        return unless len is 2

        event    = parameters[0]
        fn       = parameters[1]
        return if not me.isFunc fn

        handlers = me._eventHandlers[event]
        if not handlers or handlers.length is 0
            me._eventHandlers[event] = [ fn ]
        else
            handlers.push( fn )

        return undefined

    ###*
     *  移除事件处理程序，如果第二个参数fn没有指定，那么将会移除所有指定event的事件处理程序
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     offEvent
     *  @arg        {String}        event
     *  @arg        {Function}      [fn]
     *  @example    
     *      ctrl.offEvent()
     ###
    offEvent:( event,fn ) -> 
        me = this
        unless event
            me._eventHandlers = {}
            return undefined

        handlers = me._eventHandlers[event]
        return unless handlers and handlers.length > 0

        if fn
            for item, i in handlers
                if item is fn
                    ### remove this event handler ###
                    me._eventHandlers[event].splice( i,1 )
                    break
        else
            ### remove all ###
            me._eventHandlers[event] = []
        return undefined

    ###*
     *  触发控件的事件处理程序
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     triggerEvent
     *  @arg        {String}        event
     *  @arg        {Object}        [args]
     *  @example    
     *      ctrl.triggerEvent()
     ###
    triggerEvent:( event,args ) ->

        return unless event?
        return if /^\s+$/.test( event )

        me         = this
        handlers   = me._eventHandlers[event]
        return if not handlers or handlers.length is 0

        for func, i in handlers then func( me,args )
        return undefined

    keys:( obj ) ->

        me = this
        throw new TypeError('Invalid object') unless me.isObject obj

        keys = []
        for key of obj
            if obj.hasOwnProperty( key ) then keys.push(key)

        return keys

    ###*
     *  编译HTML模板
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     compileTmpl
     *  @arg        tmpl
     *  @arg        data
     *  @example
     *      console.log( ctrl.compileTmpl( '' ) );
    ###
    compileTmpl:( text, data ) ->
        render = () ->
        noMatch = /(.)^/
        settings = {
            evaluate    : /<%([\s\S]+?)%>/g,
            interpolate : /<%=([\s\S]+?)%>/g,
            escape      : /<%-([\s\S]+?)%>/g
        }
        escapes = {
            "'":      "'",
            '\\':     '\\',
            '\r':     'r',
            '\n':     'n',
            '\t':     't',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        }
        escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g

        # Combine delimiters into one regular expression via alternation.
        matcher = new RegExp([
          (settings.escape || noMatch).source,
          (settings.interpolate || noMatch).source,
          (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g')

        # Compile the template source, escaping string literals appropriately.
        index = 0
        source = "__p+='"
        text.replace(matcher, (match, escape, interpolate, evaluate, offset) ->
            source += text.slice(index, offset).replace(escaper, (match) -> '\\' + escapes[match] )
            if escape
                source += "'+\n((__t=(" + escape + "))==null?'':ebaui.escape(__t))+\n'"
  
            if interpolate
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"
  
            if evaluate
                source += "';\n" + evaluate + "\n__p+='"
  
            index = offset + match.length
  
            return match
        )
        source += "';\n"

        # If a variable is not specified, place data values in local scope.
        source = 'with(obj||{}){\n' + source + '}\n' unless settings.variable
        
        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n"

        try 
            render = new Function(settings.variable || 'obj', source)
        catch e
            e.source = source
            throw e

        return render(data) if data
        
        template = (data) -> render.call(this, data)

        # Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}'

        return template

    ###*
     *  forEach
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     each
     *  @arg        obj
     *  @arg        iterator
     *  @arg        context
     ###
    each:( obj, iterator, context ) ->

        me      = this;
        breaker = {}

        return unless obj?

        if nativeForEach and obj.forEach is nativeForEach
            obj.forEach(iterator, context)
        else if obj.length is +obj.length

            for item,i in obj
                if iterator.call(context, item, i, obj) is breaker then return

        else

          keys = me.keys(obj);
          for item,i in keys
            if iterator.call(context, item, i, obj) is breaker then return

    ###*
     *  检查一个变量是否是空的。
     *  遇到以下情形，我们认为这个变量是空的：
     *  "" (an empty string)
     *  ，0 (0 as an integer)
     *  ，0.0 (0 as a float)
     *  ，null
     *  ，undefined
     *  ，false
     *  ，[](an empty array)
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isEmpty
     *  @arg        val
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isEmpty( '' ) );
     ###
    isEmpty:( val ) ->
        return true unless val?

        me = this
        if me.isBoolean val then return val
        if me.isString val or me.isArray val then return val.length is 0
        if me.isNumber val then return val isnt 0

        return true

    ###*
     *  判断一个变量是否是null值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isNull
     *  @arg        val
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isNull( null ) );
     ###
    isNull:( val ) -> val is null or val is undefined

    ###*
     *  判断一个变量是否是RegExp类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isRegExp
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isRegExp() );
     ###
    isRegExp:( val ) -> toString.call( val ) is '[object RegExp]'

    ###*
     *  判断一个变量是否是Date类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isDate
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isDate() );
     ###
    isDate:( val ) -> toString.call( val ) is '[object Date]'

    ###*
     *  判断一个变量是否是Object类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isObject
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isObject() );
     ###
    isObject:( val ) -> val is Object(val)

    ###*
     *  判断一个变量是否是Function类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isFunc
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isFunc() );
     ###
    isFunc:( val ) -> toString.call(val) == '[object Function]'

    ###*
     *  判断一个变量是否是String类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isString
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isString() );
     ###
    isString:( val ) -> toString.call(val) == '[object String]'

    ###*
     *  判断一个变量是否是数值类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isNumber
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isNumber() );
     ###
    isNumber:( val ) -> toString.call(val) == '[object Number]'

    ###*
     *  判断一个变量是否是Array类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isArray
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isArray() );
     ###
    isArray:( val ) -> toString.call(val) == '[object Array]'

    ###*
     *  判断一个变量是否是Boolean类型
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isBoolean
     *  @arg        obj
     *  @return     {Boolean}
     *  @example
     *      console.log( ctrl.isBoolean() );
     ###
    isBoolean:( val ) -> val is true or val is false or toString.call(val) is '[object Boolean]'

    ###*
     *  判断是否使用远程数据源
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     isUsingRemoteData
     *  @param      {Object|Array}          dataSource              - 如果dataSource是一个数组对象，则认为采用本地数据作为数据源；反之，如果dataSource包含了url属性，data属性（可选），怎认为是使用远程数据源
     *  @property   {String}                dataSource.url          - 服务端URL
     *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
     ###
    isUsingRemoteData:( dataSource ) -> 
        throw 'dataSource can not be null!' if not dataSource

        me = this;
        return false if me.isArray( dataSource )
        return true if me.isObject( dataSource ) and dataSource['url']
        return false

    ###*
     *  移除所有事件监听，注销控件
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Control
     *  @method     destroy
     *  @example    
     *      ctrl.destroy();
     *  @todo       暂时还没有任何相关实现
     ###
    destroy:() -> 

ebaui.web.Control = Control