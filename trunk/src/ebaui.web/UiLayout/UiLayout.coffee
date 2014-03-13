###*
 *  spacing的配置
 *  参考文档：http://layout.jquery-dev.net/documentation.cfm#Option_paneSelector
 *  
 *  HTML结构：
 *  pane
 *      ->  spacing
 *          ->  toggler
 *  toggler的配置
 *  关于toggler的更多信息，请参考文档：http://layout.jquery-dev.net/documentation.cfm#toggler
 *
 *  map to the following config 
 *
 *  togglerClass:           "toggler"   // default = 'ui-layout-toggler'
 *  togglerLength_open:     35          // WIDTH of toggler on north/south edges - HEIGHT on east/west edges
 *  togglerLength_closed:   35          // "100%" OR -1 = full height
 *  togglerTip_open:        "Close This Pane"
 *  togglerTip_closed:      "Open This Pane"
 *  hideTogglerOnSlide:     true        // hide the toggler when pane is 'slid open'
 *  togglerAlign_open:      "center"
 *  togglerAlign_closed:    "center"
 *      "left", "center", "right", "top", "middle", "bottom"
 *
 *  panes的配置
 *  关于content的更多信息，请参考文档：
 *      #   http://layout.jquery-dev.net/documentation.cfm#Option_paneSelector
 *      #   http://layout.jquery-dev.net/documentation.cfm#Panes
 *      #   http://layout.jquery-dev.net/documentation.cfm#Callback_Functions
 *      #   http://layout.jquery-dev.net/documentation.cfm#Option_paneSelector
 *
 *  map to the following config 
 *  #   default = 'ui-layout-pane'
 *  paneClass   : "ui-layout-pane"
 *  paneSelector: ".ui-layout-PANE"
 *  
 *  $(document).ready(function() {
 *     $("body").layout({
 *        # using custom 'ID' paneSelectors
 *        north__paneSelector:  "#north"
 *     ,  west__paneSelector:   "#west"
 *     ,  center__paneSelector: "#center"
 *     });   
 *  });
 *  content的配置
 *  关于content的更多信息，请参考文档：http://layout.jquery-dev.net/documentation.cfm#Option_contentSelector
 *
 *  map to the following config 
 *
 *  contentSelector:        ".content"  // inner div to auto-size so only it scrolls, not the entire pane!
 *  contentIgnoreSelector:  "span"      // 'paneSelector' for content to 'ignore' when measuring room for content
 *  
 *  custom buttons的配置
 *  关于toggler的更多信息，请参考文档：http://layout.jquery-dev.net/documentation.cfm#Option_buttonClass
 *  示例：outerLayout.addToggleBtn( "#tbarToggleNorth", "north" );
 *
 *  map to the following config 
 *
 *  buttonClass:            "button"    // default = 'ui-layout-button'
 *  
 *  特效的配置
 *  
 *  map to the following config 
 *
 *  fxName:                 "slide"     // none, slide, drop, scale
 *  fxSpeed_open:           400     normal
 *  fxSpeed_close:          400     normal
 *  fxSettings_open:        { easing: "easeInQuint" }
 *  fxSettings_close:       { easing: "easeOutQuint" }
 *  
 *  resizer的配置
 *  
 *  map to the following config 
 *
 *  resizerClass:           "resizer"   // default = 'ui-layout-resizer'
 *  resizerTip:             "Resize This Pane"
###

###*
layout:{
    size                  : "auto"
,   minSize               : 0
,   maxSize               : 0 
,   panes : {

        cls      : 'ui-layout-pane',
        west     : {

            size        : 'auto',
            initClosed  : false,
            closable    : true,
            slidable    : true,
            resizable   : true,
            paneSelector: '[data-role="layout-west"]',
            spacing     :{ open : 5,close : 5 },
            toggler       : { 
                cls  : 'ui-layout-toggler',
                hideOnSlide:     true,
                open :{ align:'center',tip: 'Close This Pane',length: 35 }, 
                close :{ align:'center',tip: 'Open This Pane',length: 35 } 
            }

        },
        east     : {

            size        : 'auto',
            initClosed  : false,
            closable    : true,
            slidable    : true,
            resizable   : true,
            paneSelector: '[data-role="layout-east"]',
            spacing     :{ open : 5,close : 5 },
            toggler       : { 
                cls  : 'ui-layout-toggler',
                hideOnSlide:     true,
                open :{ align:'center',tip: 'Close This Pane',length: 35 }, 
                close :{ align:'center',tip: 'Open This Pane',length: 35 } 
            }

        },
        north    : {

            size        : 'auto',
            initClosed    : false,
            closable      : true,
            slidable      : true,
            resizable     : true,
            paneSelector  : '[data-role="layout-north"]',
            spacing:{ open : 5,close : 5 },
            toggler       : { 
                cls  : 'ui-layout-toggler',
                hideOnSlide:     true,
                open :{ align:'center',tip: 'Close This Pane',length: 35 }, 
                close :{ align:'center',tip: 'Open This Pane',length: 35 } 
            }

        },
        south    : {

            size        : 'auto',
            initClosed  : false,
            closable    : true,
            slidable    : true,
            resizable   : true,
            paneSelector: '[data-role="layout-south"]',
            spacing     :{ open : 5,close : 5 },
            toggler       : {  
                cls  : 'ui-layout-toggler',
                hideOnSlide:     true,
                open :{ align:'center',tip: 'Close This Pane',length: 35 }, 
                close :{ align:'center',tip: 'Open This Pane',length: 35 } 
            }

        },
        center   : { 
            initClosed  : false,
            closable    : true,
            slidable    : true,
            resizable   : true,
            paneSelector: '[data-role="layout-center"]'

        }

    }

,   content : {
        // 'paneSelector' for content to 'ignore' when measuring room for content
        ignoreSelector: 'span',
        // inner div to auto-size so only it scrolls, not the entire pane!
        selector      : '[data-role="content"]'
    }

,   button:{
        cls : 'ui-layout-button'
    }

,   fx:{
    name : 'slide',
        open : { easing: "easeInQuint", duration : 400 },
        close: { easing: "easeOutQuint", duration : 400 }
    }

,   resizer : {
        cls : 'ui-layout-resizer',
        tip : 'Resize This Pane'
    }

,   paneEvents:{
        onhide_start  :  $.noop,
        onhide_end    :  $.noop,
        
        onshow_start  :  $.noop,
        onshow_end    :  $.noop,
        
        onopen_start  :  $.noop,
        onopen_end    :  $.noop,
        
        onclose_start :  $.noop,
        onclose_end   :  $.noop,
        
        onresize_start:  $.noop,
        onresize_end  :  $.noop
    }
}
###

###*
*   @class      UiLayout
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.Control
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
*   @example
*       //  初始化方式一
*       var ns = ebaui.web;
*       var btn = new ns.UiLayout( $( '' ),{ title:'',id:'',name:'' } );
*       //  初始化方式二
*       $( '' ).uilayout( { title:'',id:'',name:'' } )
*       //  初始化方式三
*       &lt;body data-role="uilayout" &gt;
*           &lt;div id="" data-role="layout-north" data-options="{}" &gt;&lt;/div&gt;
*           &lt;div id="" data-role="layout-west" data-options="{}" &gt;&lt;/div&gt;
*           &lt;div id="" data-role="layout-center" data-options="{}" &gt;&lt;/div&gt;
*       &lt;/body &gt;
###
ns = ebaui['web']
class UiLayout extends ns.Control
    ###*
     *  jQuery UI Layout插件实例
     *  @private
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @member     {Object}     _layoutPlugin
    ####
    _layoutPlugin:null

    ###*
     *  配置名映射规则
     *  @private
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @member     {Object}     _mapRules
    ####
    _mapRules:
        fx:
            name : 'fxName'
            open : 'fxSettings_open'
            close: 'fxSettings_close'

        button:
            cls : 'buttonClass'

        content:
            ignoreSelector: 'contentIgnoreSelector'
            selector      : 'contentSelector'

        toggler:
            hideOnSlide : 'hideTogglerOnSlide'
            open:
                tip   : 'togglerTip_open'
                length: 'togglerLength_open'
                align : 'togglerAlign_open' 
            close:
                tip   : 'togglerTip_closed'
                length: 'togglerLength_closed'
                align : 'togglerAlign_closed' 

        spacing:
            open : 'spacing_open',
            close: 'spacing_closed'

    ###*
     *  rulenames 指定需要重命名的属性集
     *  @private
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     _doRealMap
     *  @param      {String}    target      -   north/south/west/east/center
     *  @param      {Array}     rulenames  -    要进行映射的配置节
     *  @param      {Object}    origin      -   原始配置对象
     *  @return     {Object}
    ####
    _doRealMap: ( target,rulenames,origin ) ->
        me   = this
        dest = {}
        for name,i in rulenames
            rules = me._mapRules[name]
            ###*
            *   name应该是fx或者toggler等
            *   判断原配置对象是否有配置对应的值
            ###
            if origin[name]
                ###*
                *   对配置对象的每个属性进行映射
                ###
                for rule,subrules of rules
                    hasDefined = origin[name][rule]?
                    if not me.isString( subrules ) and hasDefined
                        ###*
                        *  主要这边是有三级的配置对象。
                        *  确实，配置对象的深度过大也是很头疼的问题。
                        *  然后把最深处的配置对象扁平化，成为只包含一级的配置对象
                        *  _mapRules:{
                        *      toggler:{
                        *          hideOnSlide : 'hideTogglerOnSlide',
                        *          open :{ 
                        *              tip: 'togglerTip_open',
                        *              length: 'togglerLength_open',
                        *              align:'togglerAlign_open' 
                        *          }
                        *      }
                        *  }
                        ###
                        for key,val of subrules then dest[val] = origin[name][rule][key]
                    else if hasDefined
                        dest[rules[rule]] = origin[name][rule]

                delete origin[name]

        $.extend( dest,origin )

    ###*
     *  映射ui layout的整体默认配置
     *  @private
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     _mapDefaultSection
     *  @return     {Object}
    ####
    _mapDefaultSection:( opts ) ->
        me = this
        ###*
         *  about the applyDefaultStyles cconfig
         *  When applyDefaultStyles is enabled, the layout will apply basic styles directly to resizers & buttons. This is intended for quick mock-ups, so that you can 'see' your layout immediately.
         *  to read more, @see http:#layout.jquery-dev.net/documentation.cfm#Option_applyDefaultStyles
        ###
        config = 
            name              : 'defaults'
            applyDefaultStyles: false
            defaults:
                size   :  "auto"
                minSize:  50

        ###*
        *   指定需要重命名的属性集
        ###
        rulenames = ['fx','button','content']

        for name, i in rulenames
            rules = me._mapRules[name]
            for rule,val of rules
                if opts[name]
                    #  propertye name after mapping
                    mapedProp = val
                    #  property value
                    propVal   = opts[name][rule]
                    #  save property and value
                    config['defaults'][mapedProp] = propVal

        panesOpts = opts['panes']
        paneCls   = panesOpts['cls']
        config['defaults']['paneClass'] = paneCls if panesOpts and paneCls
        
        return config

    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     _mapPane
     *  @return     {Object}
    ####
    _mapPanes:(opts) ->
        me = this
        ret = {}
        for pane in [ 'east','west','north','south','center' ]
            config = opts['panes'][pane]
            if config
                if pane is 'center'
                    ret[pane] = {}
                    for item,val of config then ret[pane][item] = val if item isnt 'toggler'
                else
                    ret[pane] = me._doRealMap( pane,['fx','toggler','spacing'],config )

        return ret

    ###*
     *  把ebaui.web.UiLayout自定义的JS配置类格式，转换成为jqUILayout插件所使用的JS配置格式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     _map
     *  @return     {Object}
    ####
    _map:( opts ) ->
        me       = this
        defaults = me._mapDefaultSection( opts )
        panes    = me._mapPanes( opts )
        return $.extend( {},defaults,panes )

    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @member     {Object}    _layoutOpts
    ####
    _layoutOpts:
        size                  : "auto"
        minSize               : 0
        maxSize               : 0 
        panes :
            cls      : 'ui-layout-pane'
            west     : 
                size        : 'auto'
                initClosed  : false
                closable    : true
                slidable    : true
                resizable   : true
                paneSelector: '[data-role="layout-west"]'
                spacing     :
                    open  : 5
                    close : 5
                toggler:
                    cls  : 'ui-layout-toggler',
                    hideOnSlide:     true,
                    open :
                        align :'center'
                        tip   : 'Close This Pane'
                        length: 35
                    close :
                        align :'center'
                        tip   : 'Open This Pane'
                        length: 35
            east: 
                size        : 'auto'
                initClosed  : false
                closable    : true
                slidable    : true
                resizable   : true
                paneSelector: '[data-role="layout-east"]'
                spacing     :
                    open : 5
                    close: 5
                toggler: 
                    cls  : 'ui-layout-toggler'
                    hideOnSlide:     true
                    open :
                        align :'center'
                        tip   : 'Close This Pane'
                        length: 35 
                    close : 
                        align :'center'
                        tip   : 'Open This Pane'
                        length: 35
            north:
                size          : 'auto'
                initClosed    : false
                closable      : true
                slidable      : true
                resizable     : true
                paneSelector  : '[data-role="layout-north"]'
                spacing:
                    open : 5
                    close: 5
                toggler       :
                    cls  : 'ui-layout-toggler'
                    hideOnSlide:true
                    open :
                        align :'center'
                        tip   : 'Close This Pane'
                        length: 35
                    close :
                        align :'center'
                        tip   : 'Open This Pane'
                        length: 35
            south:
                size        : 'auto',
                initClosed  : false,
                closable    : true,
                slidable    : true,
                resizable   : true,
                paneSelector: '[data-role="layout-south"]',
                spacing     :
                    open : 5
                    close: 5
                toggler       :
                    cls : 'ui-layout-toggler'
                    hideOnSlide: true
                    open :
                        align :'center'
                        tip   : 'Close This Pane'
                        length: 35
                    close :
                        align :'center'
                        tip   : 'Open This Pane'
                        length: 35
            center:
                initClosed  : false
                closable    : true
                slidable    : true
                resizable   : true
                paneSelector: '[data-role="layout-center"]'
        content : 
            # 'paneSelector' for content to 'ignore' when measuring room for content
            ignoreSelector: 'span',
            # inner div to auto-size so only it scrolls, not the entire pane!
            selector      : '[data-role="content"]'
        button:
            cls : 'ui-layout-button'
        
        fx:
            name : 'slide'
            open : 
                easing: "easeInQuint"
                duration : 400
            close: 
                easing: "easeInQuint"
                duration : 400
        resizer :
            cls : 'ui-layout-resizer'
            tip : 'Resize This Pane'
        paneEvents:
            onhide_start  :  $.noop,
            onhide_end    :  $.noop,
            onshow_start  :  $.noop,
            onshow_end    :  $.noop,
            onopen_start  :  $.noop,
            onopen_end    :  $.noop,
            onclose_start :  $.noop,
            onclose_end   :  $.noop,
            onresize_start:  $.noop,
            onresize_end  :  $.noop

    _getPanesConfig: ( opts ) ->
        me          = this
        $root       = me._$root
        defualts    = me._layoutOpts['panes']

        $westPane   = $( '[data-role="layout-west"]'   ,$root )
        $eastPane   = $( '[data-role="layout-east"]'   ,$root )
        $northPane  = $( '[data-role="layout-north"]'  ,$root )
        $southPane  = $( '[data-role="layout-south"]'  ,$root )
        $centerPane = $( '[data-role="layout-center"]' ,$root )

        if $westPane.size() > 0 
            westPaneConf = me._parseDataOptions( $westPane )
            $.extend(defualts['west'],westPaneConf)

        if $eastPane.size() > 0 
            eastPaneConf = me._parseDataOptions( $eastPane )
            $.extend(defualts['east'],eastPaneConf)

        if $northPane.size() > 0
            northPaneConf = me._parseDataOptions( $northPane )
            $.extend(defualts['north'],northPaneConf)

        if $southPane.size() > 0
            southPaneConf = me._parseDataOptions( $southPane )
            $.extend(defualts['south'],southPaneConf)

        if $centerPane.size() > 0
            centerPaneConf = me._parseDataOptions( $centerPane )
            $.extend(defualts['center'],centerPaneConf)

        return defualts

    ###*
     *  把HTML占位符转换成为控件自身的HTML结构
     *  @private
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     _parseUi
    ####
    _parseUi : ( element ) -> $( element )

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     _init
    ####
    _init: (opts) ->
        super( opts )
        me             = this
        me._layoutOpts = $.extend( {}, me._layoutOpts )
        #  get plugin config then init layout plugin
        panesConfig = me._getPanesConfig(opts)
        if opts['layout']?
            config       = $.extend(opts['layout']['panes'], panesConfig)
            layoutConfig = me._map(opts['layout'])
        else
            config       = $.extend(me._layoutOpts['panes'], panesConfig)
            layoutConfig = me._map(me._layoutOpts)

        me._layoutPlugin = me._$root.layout( layoutConfig )

    ###*
     *  A hash containing the dimensions of all the elements, including the layout container. Dimensions include borders and padding for: top, bottom, left, right, plus outerWidth, outerHeight, innerWidth, innerHeight.
     *  <br />获取当前uilayout的状态，包含uilayout容器的innerWidth，paddingLeft
     *  ，以及所有panes的top， bottom， left， right，outerWidth， outerHeight， innerWidth， innerHeight
     *  ，参数可选的值有container north east south west center
     *  ，默认返回uilayout所有的状态
     *  @public
     *  @instance
     *  @memberof       ebaui.web.UiLayout
     *  @member         {Object}    state
    ####
    state: ( pane ) ->
        me     = this
        plugin = me._layoutPlugin
        if plugin
            if /north|east|south|west|center|container/i.test( pane )
                return plugin.state[pane]
            else
                return plugin.state

    ###*
     *  pane objects( panes.north, panes.south, etc ).Each pane-element is in a jQuery wrapper.If a pane does not exist in the layout - for example no south-pane - then panes.south == false - instead of being a jQuery element.
     *  @public
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @member     {Object}     panes
    ####
    panes: () -> this._layoutPlugin.panes

    ###*
     *  get pane object
     *  @public
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     getPane
     *  @param      {String}    pane  -  north/south/west/east/center
    ####
    getPane : ( pane ) ->
        if /north|east|south|west|center/i.test( pane )
            return this._layoutPlugin.panes[pane]

    ###*
     *  显示或者隐藏指定区域
     *  @public
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     togglePane
     *  @param      {String}    pane  -  north/south/west/east/center
    ####
    togglePane:( pane ) ->
        me = this
        return unless /north|east|south|west|center/i.test( pane )
        me._layoutPlugin.toggle( pane )

    ###*
     *  展开指定区域
     *  @public
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     openPane
     *  @param      {String}    pane  -  north/south/west/east/center
    ####
    openPane:( pane ) ->
        me = this
        return unless /north|east|south|west|center/i.test( pane )
        me._layoutPlugin.open( pane )

    ###*
     *  缩起指定区域
     *  @public
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     closePane
     *  @param      {String}    pane  -  north/south/west/east/center
    ####
    closePane:( pane ) ->
        me = this
        return unless /north|east|south|west|center/i.test( pane )
        me._layoutPlugin.close( pane )

    ###*
     *  显示指定区域
     *  @public
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     showPane
     *  @param      {String}    pane  -  north/south/west/east/center
    ####
    showPane:( pane ) ->
        me = this;
        return unless /north|east|south|west|center/i.test( pane )
        me._layoutPlugin.show( pane )

    ###*
     *  隐藏指定区域
     *  @public
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     hidePane
     *  @param      {String}    pane  -  north/south/west/east/center
    ####
    hidePane:( pane ) ->
        me = this;
        return unless /north|east|south|west|center/i.test( pane )
        me._layoutPlugin.hide( pane )

    ###*
     *  对于north 和 south 这两个pane更新其outerHeight
     *  ，对于east 和 west 则更新outerWidth
     *  @public
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     sizePane
     *  @param      {String}    pane            -  north/south/west/east/center
     *  @param      {Number}    sizeInPixels    -  sizeInPixels
    ####
    sizePane : ( pane, sizeInPixels ) ->
        me = this
        if /north|east|south|west|center/i.test( pane )
            return me._layoutPlugin.sizePane( pane,sizeInPixels )

    ###*
     *  重新调整所有的pane，以便所有的pane能够适应容器元素的大小
     *  @public
     *  @instance
     *  @memberof   ebaui.web.UiLayout
     *  @method     resizeAllPanes
     *  @param      {String}    pane  -  north/south/west/east/center
    ####
    resizeAllPanes:() -> this._layoutPlugin.resizeAll()

ns.registerControl( 'UiLayout',UiLayout )