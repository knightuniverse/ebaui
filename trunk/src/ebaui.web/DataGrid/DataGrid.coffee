###*
*   @class      DataGrid
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.Control
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
*   @example
*       //  初始化方式一
*       var ns = ebaui.web;
*       var btn = new ns.DataGrid( $( '' ),{ title:'',id:'',name:'' } );
*       //  初始化方式二
*       $( '' ).datagrid( { title:'',id:'',name:'' } )
*       //  初始化方式三
*       &lt;table id="" title="" name="" data-role="datagrid" data-options="{}" &gt;&lt;/table&gt;
###
ns = ebaui['web']
class DataGrid extends ns.Control
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
    _parseUi: (element) -> $(element)
  
    ###*
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof       ebaui.web.TreeView
     *  @method         _render
    ###
    _render: () ->
        me = this
        me._updateCssVisible()
        me._updateAttrTitle()
  
    ###*
     *  拓展自身的方法或者属性
     *  @private
     *  @instance
     *  @memberof       ebaui.web.TreeView
     *  @method         _extendMe
    ###
    _extendMe: (source) ->
        me = this
        for key,property of source
            if not $.isFunction(property)
                me[key] = property
            else
                me[key] = ((name, value) ->
                    fn = () ->  value.apply(source, arguments))(key, property)
  
    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof ebaui.web.DataGrid
     *  @method _initControl
    ###
    _init: (opts) ->
        ###
            opts = {
                  jqgrid : {  }
                  pager  : {
                      enabled : true
                      controls:[ { role: 'Button',options:{ id:'',name:'',value:'' } } ]
                  }
            }
        ###
        super(opts)
        me              = this
        $root           = me.uiElement()
        ns              = ebaui['web']
        id              = me.id()
        pager           = opts.pager
        pagerId         = "datagrid-pager-#{id}"
        me._jqGridOpts  = $.extend({}, me._jqGridOpts, opts['jqgrid']) if opts['jqgrid']?
        
        ###
        *   change logs:
        *   
        *   2014-03-25  侯剑波
        *       重新排版代码
        *       
        ###
        
        if pager?
            me._jqGridOpts['pager'] = pagerId
            $root.after(""" <div id="#{pagerId}"></div> """)
        
        ###
        *   jgGrid会自动生成dom id，这个id，默认是以gbox_作前缀
        ###
        grid      = me._$root.jqGrid(me._jqGridOpts)
        me._$root = $( "#gbox_#{id}" )
        
        ###
        *   navGrid
        ###
        if pager? and pager.navGrid
            $("##{id}").jqGrid('navGrid', "##{pagerId}", {edit: true, add: true, del: true})
        
        ###
        *   pager bar ui controls
        ###
        pagerBarCtrls = pager.controls
        if pager? and pagerBarCtrls? and pagerBarCtrls.length > 0
            $pager = $( "##{pagerId }_left" )
            for ctrl,index in pagerBarCtrls
                $pager.append("<input id='pager-ctrl-#{index}' />")
                ins = new ns[ctrl.role]($('#pager-ctrl-' + index, $pager), ctrl.options)
        
        ###
        *   使用jqgrid的对象实例，去拓展this对象
        ###
        me._extendMe( grid )
      
    _jqGridOpts:
        idPrefix        : ''
        datatype        : 'json'
        mtype           : 'POST'
        rownumbers      : true
        rowNum          : 20
        rowList         : [5, 10, 20, 30]
        viewrecords     : true
        multiselect     : false
        multiboxonly    : true
        loadComplete    : (xhr) ->
            result = $(this).getUserDataItem('result')
            if result isnt 1 and $(this).getGridParam('datatype') isnt 'local'
                alert('加载失败[' + $(this).getUserDataItem('msg') + ']')
                
        loadError       : (xhr, status, error) ->
            alert('获取错误[' + status + ']' + error)
  
    ###*
     *  默认的jqGrid配置
     *  @private
     *  @instance
     *  @memberof   ebaui.web.DataGrid
     *  @member     {Object}    jqgridOptions
    ###
    jqGridOptions: (val) ->
        me = this
        return me._jqGridOpts unless val?
        $.extend(me._jqGridOpts, val)
        #   @todo 应用新的配置到当前的jqgrid实例上

ns.registerControl('DataGrid', DataGrid)