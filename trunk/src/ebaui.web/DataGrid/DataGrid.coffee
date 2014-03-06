###
 *  @depend
 *      ztree,  @see http://www.ztree.me/v3/main.php
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
###
ns = ebaui['web']
class DataGrid extends ns.Control
  ###
   *  把HTML占位符转换成为控件自身的HTML结构
   *  ，在这一个过程中，会使用style="width:XXpx;height:XXpx;"的初始化控件本身的width以及height属性
   *  @private
   *  @virtual
   *  @instance
   *  @memberof   ebaui.web.TreeView
   *  @method     _parseUi
   *  @param      {Object}    element HTML占位符
  ###
  _parseUi: ( element ) -> $( element )

  ###
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

  ###
   *  拓展自身的方法或者属性
   *  @private
   *  @instance
   *  @memberof       ebaui.web.TreeView
   *  @method         _extendMe
  ###
  _extendMe : ( source ) ->
      me = this
      for item,property of source
          if not $.isFunction( property )
              me[item] = property
          else
              me[item] = (( name,value ) ->
                  fn = () -> value.apply( source,arguments )
              )( item,property )

  ###
   *  初始化控件，声明内部变量
   *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
   *  @private
   *  @instance
   *  @memberof ebaui.web.DataGrid
   *  @method _initControl
  ###
  _init:( opts ) ->
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
    me             = this
    $root          = me.uiElement()
    ns             = ebaui['web']
    id             = me.id()
    pager          = opts.pager
    pagerId        = "datagrid-pager-#{id}"
    me._jqGridOpts = opts['jqgrid'] if opts['jqgrid']?

    if pager?
      me._jqGridOpts['pager'] = pagerId
      $root.after(""" <div id="#{pagerId}"></div> """)

      me._$root.jqGrid( me._jqGridOpts )

      if pager.navGrid
        $('#' + id).jqGrid('navGrid', '#' + pagerId, {edit: true, add: true, del: true})
      if pager.controls?
        $pager = $("#" + "#{pagerId }_left")
        for ctrl,index in pager.controls
          $pager.append("<input id='pager-ctrl-#{index}' />")
          ins = new ns[ctrl.role]($('#pager-ctrl-' + index, $pager), ctrl.options)
    else me._$root.jqGrid( me._jqGridOpts )
    me._extendMe( $.jgrid )

  _jqGridOpts:
    datatype    : 'clientSide'
    mtype       : 'POST'
    rownumbers  : true
    rowList     : [5, 10,20,30]
    viewrecords : true
    multiselect : true
    multiboxonly: true
    loadComplete: (xhr) ->
    loadError   : (xhr,status,error) -> alert("数据加载失败[#{status}]#{error}")
    
  ###
   *  默认的jqGrid配置
   *  @private
   *  @instance
   *  @memberof   ebaui.web.DataGrid
   *  @member     {Object}    jqgridOptions
  ###
  jqGridOptions:( val ) ->
      me = this
      return me._jqGridOpts unless val?
      $.extend( me._jqGridOpts,val )
      #   @todo 应用新的配置到当前的jqgrid实例上

ns.registerControl( 'DataGrid',DataGrid )