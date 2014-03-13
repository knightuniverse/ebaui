###*
*   @class      Tabs
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.Control
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
*   @example
*       //  初始化方式一
*       var ns = ebaui.web;
*       var btn = new ns.Tabs( $( '' ),{ title:'',id:'',name:'' } );
*       //  初始化方式二
*       $( '' ).tabs( { title:'',id:'',name:'' } )
*       //  初始化方式三
*       &lt;input id="" title="" name="" data-role="tabs" data-options="{}" /&gt;
###
class Tabs extends Control
    ###*
     *  
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @member         {jQuery}    -   contentRegion
    ###
    _$contentRegion : null
    
    ###*
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         _setupEvents
    ###
    _setupEvents:( opts ) ->
        me    = this
        $root = me.uiElement()

        $root.on( 'click','.eba-tab',( event ) ->
            tabIndex = $( '.eba-tab',$root ).index( this )
            return if tabIndex == -1
            me.activateTab( tabIndex )
        )

        $root.on( 'click','.eba-tab-close',( event ) ->
            #  close tab
            tabIndex = $( '.eba-tab',$root ).index( $( this ).parent() )
            return if tabIndex == -1
            me.closeTab( tabIndex )
        )

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         _init
    ###
    _init : ( opts ) ->
        super( opts )
        me = this
        ###*
        *   初始化控件自身的一系列属性
        *   contentRegion是必选参数
        ###
        me._home           = opts['home'] if opts['home']?
        me._contentRegion  = opts['contentRegion'] if opts['contentRegion']?
        me._$contentRegion = $( me._contentRegion )
        ###*
        *   如果指定的contentRegion里面没有ul，那么初始化的时候append一个新的ul
        *   我们的content的html格式是<li><iframe src=""></iframe></li>
        ###
        $region           = me._$contentRegion
        $region.append('<ul></ul>') if $( 'ul',$region ).size() is 0 
        ###*
        *   默认添加homeTab
        ###
        tab     = me._home
        isValid = if tab and tab['url'] then true else false
        if isValid
            tab['title']  = tab['title'] ? tab['url']
            me.addTab( tab )

    ###*
     *  私有变量，用来保存所有tab对象
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs 
     *  @member         {Array}         _tabs
    ###
    _tabs : [],

    ###*
     *  homeTab配置，homeTab是默认首页
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs 
     *  @member         {Object}         _homeTab
    ###
    _homeTab : null,

    ###*
     *  当前激活的tab选项卡的对应引用
     *  @private
     *  @instance
     *  @memberof       ebaui.web.Tabs 
     *  @member         {Tab}        _currentTab
    ###
    _currentTab : null,
    ###*
     *  设置或者获取当前激活的tab选项卡对象
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs 
     *  @member         {Tab}                           currentTab
     *  @example        <caption>get</caption>
     *      tab = console.log( ctrl.currentTab() );
     *  @example        <caption>set</caption>
     *      console.log( ctrl.currentTab( {Number|String|Function} ) );
    ###
    currentTab : ( tab ) ->
        me = this
        return me._currentTab unless tab?

        curr     = me._currentTab
        instance = me.getTab( tab )
        if curr and not curr.isClosed()
            curr.isActived( false )
        else
            ###
            *   当前tab已经关闭了，那么就移除其引用
            ###
            me._currentTab = null

        if instance
            instance.isActived( true )
            me._currentTab = instance

        return undefined

    ###*
     *  添加一个新的选项卡
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         addTab
     *  @param          {Tab}                           tab
    ###
    addTab : ( tab ) ->
        return unless tab?

        me = this
        tabIndex = me.indexOf( tab['url'] )
        return unless tabIndex is -1

        #  declare tab's index in tabs collection
        tabIndex = me._tabs.length
        #  new a Tab instance
        instance = new Tab( null,tab )
        #  add a new tab
        me._tabs.push( instance )
        
        #  append tab to dom
        $( 'ul',me._$root ).append( instance.headerDom() )
        #  append tab content to dom
        $( 'ul',me._$contentRegion ).append( instance.contentDom() )
        #  final activate me tab
        me.activateTab( tabIndex )

        return undefined

    ###*
     *  关闭选项卡
     *  ，tab参数如果是一个int对象,那么直接将参数作为索引查找tab
     *  ，tab参数如果是一个string对象，那么默认按照tab的url属性进行查找
     *  ，tab参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         closeTab
     *  @param          {Number|String|Function}        tab
    ###
    closeTab : ( tab ) ->
        me       = this
        tabIndex = me.indexOf( tab )
        return if tabIndex is -1

        #  set currentTab
        myTabs = me._tabs;
        lastIndex = if tabIndex is 0 then 1 else ( if tabIndex - 1 > 0 then tabIndex - 1 else 0 )
        lastIndex = myTabs.length - 1 if lastIndex > myTabs.length

        tabToClose = myTabs[tabIndex]
        currTab = me.currentTab()
        me.activateTab( lastIndex ) if currTab == tabToClose

        #  close tab and remove dom reference
        tabToClose.close()
        tabToClose = null
        #  remove tab instance from tabs collection
        myTabs.splice( tabIndex,1 )
        me._tabs = myTabs

    ###*
     *  关闭所有选项卡
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         closeAllTab
    ###
    closeAllTab : () ->
        me      = this
        keep    = []
        removal = []
        myTabs  = me._tabs
        #  iterate all tab instances
        for item,i in myTabs
            item = myTabs[i]
            if item.closable()
                removal.push( item )
            else
                keep.push( item )

        for rm,i in removal
            rm.close()

        #  release old tab collection
        me._tabs = keep
        me.activateTab(0) if keep.length > 0

        return undefined

    ###*
     *  关闭指定选项卡以外的所有选项卡
     *  ，but参数如果是一个int对象,那么直接but参数作为索引查找tab
     *  ，but参数如果是一个string对象，那么默认按照url属性进行查找
     *  ，but参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         closeAllTab
     *  @param          {Number|String|Function}        but
     *  @example
     *      ctrl.closeOtherTabs(0);
     *      ctrl.closeOtherTabs('tabname');
    ###
    closeOtherTabs:( but ) ->
        me = this
        tabIndex = me.indexOf( but )
        return if tabIndex is -1

        #  first activate the excluded tab
        me.activateTab( tabIndex )

        #  close other tabs
        tabs = me._tabs
        for item,i in tabs
            item.close() unless tabIndex is i

        #  maintains internal status
        excludeTab = me.getTab( tabIndex )
        me._tabs = [ excludeTab ]

        return undefined

    ###*
     *  获取选项卡对象
     *  ，tab参数如果是一个int对象,那么直接将参数作为索引查找tab
     *  ，tab参数如果是一个string对象，那么默认按照tab的url属性进行查找
     *  ，tab参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
     *  ，如果没有找到tab的实例，返回null
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         getTab
     *  @param          {Number|String|Function}        tab
     *  @returns        {Tab}
    ###
    getTab : ( tab ) ->
        me       = this
        tabIndex = me.indexOf( tab )
        return null if tabIndex is -1
        return me._tabs[tabIndex]

    ###*
     *  获取选项卡对象的索引
     *  ，如果isEqual参数是一个合法的索引，那么直接返回
     *  ，isEqual参数如果是一个string对象，那么默认按照tab的url属性进行查找
     *  ，isEqual参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         indexOf
     *  @param          {Number|String|Function}               isEqual or tab name
     *  @returns        {Number}
    ###
    indexOf : ( isEqual ) ->
        me   = this
        tabs = me._tabs
        size = tabs.length
        return -1 if me.isNull( isEqual ) or size is 0
        
        tabIndex = -1
        if me.isNumber( isEqual )
            tabIndex = parseInt( isEqual )
            tabIndex = -1 if isNaN( tabIndex ) or tabIndex < 0 or tabIndex >= size
            return tabIndex

        fn = null
        if me.isString( isEqual )
            ### 
            *   well, tab parameter is a instance of Tab class
            ###
            fn = ( tab ) -> tab['url']() is isEqual

        else if me.isFunc( isEqual )
            fn = isEqual
        else
            return -1

        for item,i in tabs
            if fn( item )
                tabIndex = i
                break

        return tabIndex

    ###*
     *  激活指定的选项卡
     *  ，tab参数如果是一个int对象,那么直接将参数作为索引查找tab
     *  ，tab参数如果是一个string对象，那么默认按照tab的url属性进行查找
     *  ，tab参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         activateTab
     *  @param          {Number|String|Function}        tab
    ###
    activateTab : ( tab ) ->
        me       = this
        tabIndex = me.indexOf( tab )
        return if tabIndex is -1
        me.currentTab( tabIndex )

    ###*
     *  刷新tab页面的内容
     *  ，tab参数如果是一个int对象,那么直接将参数作为索引查找tab
     *  ，tab参数如果是一个string对象，那么默认按照tab的url属性进行查找
     *  ，tab参数如果是一个function对象，那么会在查找的过程中，使用指定的函数作为判等条件
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs
     *  @method         refreshTab
     *  @param          {Number|String|Function}        tab
    ###
    refreshTab : ( tab ) ->
        me = this
        ### 
        *   if tab parameter was not been assigned,
        *   the current active tab will be refreshed
        ###
        if me.isNull( tab )
            currTab = me.currentTab()
            currTab.refresh() if currTab
            return

        tabInstance = me.getTab( tab )
        tabInstance.refresh() if tabInstance

    ###*
     *  调整tab内容区域的iframe的width以及height
     *  @public
     *  @instance
     *  @memberof       ebaui.web.Tabs 
     *  @method         resizeContent
    ###
    resizeContent:( size ) ->
        return unless size

        me = this
        return unless size['width']?

        $ifm = $( 'iframe',me._$contentRegion )
        $ifm.width(size['width'])
        $ifm.height(size['height'])

    _contentRegion:'.eba-tabs-body'
    ###*
     *  jquery选择器
     *  ，用来指定tab内容的区域
     *  ，控件content内容将会输出在这个地方
     *  @public
     *  @instance
     *  @readonly
     *  @default        .eba-tabs-body
     *  @memberof       ebaui.web.Tabs 
     *  @member         {String}            contentRegion
    ###
    contentRegion:() -> this._contentRegion

    _home:
        title   : ''
        url     : ''
        closable: false
    ###*
     *  默认首页，{ title:'',url:'' }，其中，url是必选项。
     *  如果没有指定title，则title默认为 Tab + tabIndex。
     *  @public
     *  @instance
     *  @readonly
     *  @memberof       ebaui.web.Tabs 
     *  @member         {Object}                        home
    ###
    home:( val ) -> this._home

ebaui['web'].registerControl( 'Tabs',Tabs )