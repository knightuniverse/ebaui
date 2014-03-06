class Tab extends Control
    _headerTmpl: ''
    ###
     *  dom对象引用
     *  @private
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {Object}    _$header
    ###
    _$header: null

    _contentTmpl: ''
    ###
     *  dom对象引用
     *  @private
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {Object}    _$header
    ###
    _$content: null

    ###
     *  更新选项卡的icon
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Tab
     *  @method     _updateCssIcon
    ###
    _updateCssIcon:() ->
        me = this
        iconCls = me.iconCls()
        cls = 'eba-tab-icon '
        cls += iconCls if iconCls
        $( '.eba-tab-icon',me._$header ).attr('class',cls)

    ###
     *  更新选项卡的关闭按钮
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Tab
     *  @method     _updateCssClosable
    ###
    _updateCssClosable: () ->
        me        = this
        closable  = me.closable()
        $root     = me.headerDom()
        $btnClose = $('span.eba-tab-close',$root)
        size      = $btnClose.size()

        if not closable and size > 0
            $btnClose.remove()
            return
        ###
        if closable and size is 0
            $root.append('<span class="eba-tab-close"></span>')
            return
        ###

        return undefined

    ###
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Tab
     *  @method     _updateAttrTitle
    ###
    _updateAttrTitle:() ->
        me = this
        $('.eba-tab-text',me._$header).text( me.title() )

    ###
     *  tab的header dom对象
     *  @private
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {Object}    headerDom
    ###
    headerDom : () -> this._$header

    ###
     *  tab的content dom对象
     *  @private
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {Object}    contentDom
    ###
    contentDom: () -> this._$content

    _title:''
    ###
     *  tab的标题
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {String}    title
    ###
    title: ( val ) ->
        me = this
        return me._title unless val?
        me._title = val
        me._updateAttrTitle()

    _url:''
    ###
     *  tab内容的URL
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {String}    url
    ###
    url:( val ) ->
        me = this
        return me._url unless val?
        me._url = val
        me.refresh()

    _closable:true
    ###
     *  获取或者设置tab是否可以关闭
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {String}    closable
    ###
    closable :( val ) ->
        me = this
        return me._closable unless val?
        me._closable = val
        me._updateCssClosable()

    _iconCls:''
    ###
     *  tab的icon
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {String}    iconCls
    ###
    iconCls: ( val ) ->
        me = this
        return me._iconCls unless val?
        me._iconCls = val
        me._updateCssIcon()

        return undefined

    _isActived : false
    ###
     *  tab是否激活
     *  @public
     *  @instance
     *  @default        false
     *  @memberof       eabui.web.Tab
     *  @member         {Boolean}    isActived
    ###
    isActived: ( val ) ->
        me = this
        return if me.isClosed()
        return me._isActived if typeof val isnt 'boolean'

        cls           = 'eba-tab-active'
        $header       = me._$header
        $content      = me._$content
        me._isActived = val
        if val
            $header.addClass(cls)
            $content.show()
        else
            $header.removeClass(cls)
            $content.hide()

        return undefined

    ###
     *  刷新tab页面的内容
     *  ，tab参数如果是一个int对象,那么直接将参数作为索引查找tab
     *  ，tab参数如果是一个string对象，那么默认按照tab的title属性进行查找
     *  ，tab参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         refreshTab
     *  @param          {Number|String|Function}        tab
    ###
    refresh:() ->
        me = this
        return me.isClosed()

        timestamp = ( new Date ).getTime()
        url = me.url()
        url += if ( url.indexOf( '?' ) is -1 ) then ("?t=#{timestamp}") else ( "&t=#{timestamp}" )
        $( 'iframe',me._$content ).attr( 'src',url )

    _closed : false
    ###
     *  指示该选项卡是否已经被关闭了
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @member         {Boolean}   isClosed
    ###
    isClosed:() -> this._closed

    ###
     *  关闭选项卡
     *  @public
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @method         close
    ###
    close: () ->
        me = this;
        #  unbind event handlers
        $( 'iframe',me._$content ).off( 'load' );
        #  mark，表示这个tab已经关闭了
        me._closed = true;
        #  remove dom from dom tree
        me._$header.remove();
        me._$content.remove();
        #  release dom reference
        delete me._$header;
        delete me._$content;

    _render:() ->
        me = this
        me._updateAttrTitle()
        me._updateCssClosable()
        me._updateCssIcon()

    ###
     *  初始化
     *  @private
     *  @instance
     *  @memberof       eabui.web.Tab
     *  @method         _init
    ###
    _init: ( opts ) ->
        me = this
        ### 
        *   初始化控件自身的一系列属性  
        ###
        me._iconCls   = opts['iconCls'] ? ''
        me._url       = opts['url'] ? ''
        me._title     = opts['title'] ? me._url
        me._closable  = opts['closable'] ? true
        me._isActived = opts['isActived'] ? false

        ### 
        *   render header
        ###
        me._$header   = $( me._headerTmpl )
        ### 
        *   render content
        ###
        html = me._contentTmpl.replace( '{0}',me.url() )
        me._$content  = $( html )

    ###
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         _setupEvents
    ###
    _setupEvents:( opts ) ->
        me       = this
        $header  = me._$header
        $content = me._$content

        ###
        *   绑定事件处理程序
        ###
        me.onEvent( 'load'   ,opts['onload'] )

        ### 
        *   mouseenter
        *   https://developer.mozilla.org/en-US/docs/DOM/DOM_event_reference/mouseenter
        *
        *   当鼠标移到tab选项卡的时候，要添加关闭按钮
        *   当鼠标移出tab选项卡的时候，要删除关闭按钮
        *   <span class="eba-tab-close"></span>
        *   span.eba-tab-close的click事件，由tabs集合负责处理
        *   单个tab对象，不应该处理自己的关闭事件，应该是由容器来统一负责移除，添加的操作
        ###
        $header.on( 'mouseenter',( eventArgs ) -> 
            $btn = $( 'span.eba-tab-close',$header )
            if me.closable() and $btn.size() is 0
                $btn = $( '<span class="eba-tab-close"></span>' )
                $header.append( $btn )
        )

        $header.on( 'mouseleave',( eventArgs ) -> 
            $btn = $( 'span.eba-tab-close',$header )
            $btn.remove()
        )

        ###
        *   触发iframe的load事件
        ###
        $( 'iframe',$content ).on('load',( eventArgs ) -> me.triggerEvent( 'load',eventArgs ) )

ebaui['web'].registerControl( 'Tab',Tab )