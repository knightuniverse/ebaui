###*
*   @class      TreeView
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.Control
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
*   @example
*       //  初始化方式一
*       var ns = ebaui.web;
*       var btn = new ns.TreeView( $( '' ),{ title:'',id:'',name:'' } );
*       //  初始化方式二
*       $( '' ).checkbox( { title:'',id:'',name:'' } )
*       //  初始化方式三
*       &lt;input id="" title="" name="" data-role="checkbox" data-options="{}" /&gt;
###
ns = ebaui['web']
class TreeView extends ns.Control
    ###*
     *  把HTML占位符转换成为控件自身的HTML结构
     *  ，在这一个过程中，会使用style="width:XXpx;height:XXpx;"的初始化控件本身的width以及height属性
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.TreeView
     *  @method     _parseUi
     *  @param      {Object}    element HTML占位符
    ###
    _parseUi: ( element ) ->
        ###*
            创建控件顺序——获取初始化参数，初始化，绑定事件，输出控件样式
            _parseDataOptions
            _parseAttrOptions
            _parseUi
            _initControl
            _setupEvents
            _render

            self._$root.data( 'model',self );
        ###
        try
            me    = this
            $html = $( '<ul class="ztree"></ul>' )
            $( element ).replaceWith( $html )
            ###
            *  如果是Form表单控件，一般会有name属性
            *  反之没有
            ###
            $html.attr(
                'data-parsed': 'true'
            )

        catch e
            console.log( e )

        return $html

    ###*
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof       ebaui.web.TreeView
     *  @method         _render
    ###
    _render : () ->
        ###*
        *   do nothing, skip all behaviour in it's parent class
        ###
        me = this
        me._updateCssVisible()
        me._updateAttrTitle()
        me._updateAttrId()

    ###*
     *  拓展自身的方法或者属性
     *  @private
     *  @instance
     *  @memberof       ebaui.web.TreeView
     *  @method         _extendMe
    ###
    _extendMe: ( source ) ->
        me = this
        for item,property of source
            if not $.isFunction( property )
                me[item] = property
            else
                me[item] = (( name,value ) ->
                    fn = () -> value.apply( source,arguments )
                )( item,property )

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TreeView
     *  @method     _init
    ###
    _init:( opts ) ->
        super( opts )
        me = this
        ###*
        *   初始化控件自身的一系列属性  
        ###
        ds        = me._dataSource = opts['dataSource'] if opts['dataSource']?
        ztreeOpts = me._ztreeOpts  = opts['ztree'] if opts['ztree']?
        ###*
        *   当前只支持数组作为数据源
        *   后续要支持url作为数据源
        ###
        if ds and ds.length > 0
            $root = me._$root
            ins   = $.fn.zTree.init( $root, ztreeOpts, ds)
            me._extendMe( ins )

    ###*
    *   数据源
    *   可以是URL地址或者是一个javascript数组对象作为数据源
    *   dataSource : []
    ###
    _dataSource: []
    ###*
     *  一个javascript数组对象作为数据源,当前版本只支持本地数据源
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.ListBox
     *  @member     {Array}      dataSource
     *  @default    []
     *  @example    <caption>get</caption>
     *      src = ctrl.dataSource();
     *  @example    <caption>set</caption>
     *      //  本地数据
     *      ctrl.dataSource( [] );
    ###
    dataSource : ( val ) ->
        me   = this
        return me._dataSource unless me.isString( val ) or me.isArray(val)

        JQPlugin = $.fn.zTree
        ds       = me._dataSource
        if ds isnt val
            me._dataSource = ds = val
            JQPlugin.destroy(me.id())

            if val.length > 0
                ztree = me._ztreeOpts
                ins   = JQPlugin.init(me._$root, ztree,val)
                me._extendMe( ins )
    
    ###*
     *  清理treeview的全部结点
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TreeView
     *  @method     removeAllNodes
    ###   
    removeAllNodes:() ->
        me = this
        ###  ztree其实是返回了一个数组的引用，
         *  如果调用removeNode方法删除node的话，
         *  这个数组也是会跟着发生变化的
        ###
        rootNodes = me.getNodes().concat()
        for root,index in rootNodes then me.removeNode( root )
            
        me._dataSource = [] if me._dataSource.length > 0
        return undefined

    ###*
     *  默认的ztree配置
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TreeView
     *  @member     {Object}    _ztreeOpts
    ###
    _ztreeOpts:
        view:
            showLine      : false
            showTitle     : true
            showIcon      : false
            dblClickExpand: true
        data:
            simpleData:
                enable: true

    ###*
     *  获取或者设置ztree
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TreeView
     *  @member     {Object}    ztreeOptions
    ###
    ztreeOptions:( val ) ->
        me = this
        return me._ztreeOpts unless val?
        $.extend( me._ztreeOpts,val )
        #   @todo 应用新的配置到当前的ztree实例上

ns.registerControl( 'TreeView',TreeView )