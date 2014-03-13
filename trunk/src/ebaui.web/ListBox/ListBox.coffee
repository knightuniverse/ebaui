###*
*   @class      ListBox
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.FormField
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
*   @example
*       //  初始化方式一
*       var ns = ebaui.web;
*       var btn = new ns.ListBox( $( '' ),{ title:'',id:'',name:'' } );
*       //  初始化方式二
*       $( '' ).listbox( { title:'',id:'',name:'' } )
*       //  初始化方式三
*       &lt;input id="" title="" name="" data-role="listbox" data-options="{}" /&gt;
###
class ListBox extends FormField
  ###*
   *  listbox列表项目的模板
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @member     {String}    _itemTmpl
  ###
  _itemTmpl: '',

  ###*
   *  已经编译好的ListBox项HTML模板，后续会重复使用
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     _compiledItemTmpl
  ###
  _compiledItemTmpl : $.noop,

  ###*
   *  显示listbox正在加载的样式
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     _loadMask
   *  @param      {Boolean}    loading
  ###
  _loadMask:() ->
    me    = this
    $root = me._$root
    html  = me._compiledItemTmpl({
        'loading'      : true
    })
    $( 'table.eba-listbox-items',$root ).html( html )

  ###*
   *  更新listbox列表项
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     _renderData
   *  @param      {Boolean}    loading
  ###
  _renderData:() ->
    me    = this
    $root = me._$root
    html  = me._compiledItemTmpl( {
      'loading'      : false
      'multi'        : me.multiSelect()
      'textField'    : me.textField()
      'valueField'   : me.valueField()
      'selectedItems': me.selectedItems()
      'dataItems'    : me.items()
    } )
    $( 'table.eba-listbox-items',$root ).html( html )

  ###*
   *  更新UI显示
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     _render
  ###
  _render: () ->
    me = this
    me._loadData()
    super()

  ###*
   *  初始化DOM事件处理程序
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     _setupEvents
  ###
  _setupEvents: ( opts ) ->
    me  = this
    $root = me._$root

    ###*
    * 绑定事件处理程序
    ###
    me.onEvent( 'itemclick'     ,opts['onitemclick'] )
    me.onEvent( 'loadfail'      ,opts['onloadfail'] )
    me.onEvent( 'load'          ,opts['onload'] )
    me.onEvent( 'loadcomplete'  ,opts['onloadcomplete'] )

    $root.on( 'click','tr.eba-listbox-item', ( eventArgs ) ->

      $target  = $(this)
      itemIdx  = parseInt( $target.attr( 'data-index' ) )

      ### 
      * ctrl + click then remove item
      ###
      if eventArgs.ctrlKey
        me.deselect( itemIdx )
      else
        me.select( itemIdx )

      me.triggerEvent( 'itemclick',eventArgs )

    )

  ###*
   *  初始化控件，声明内部变量
   *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     _init
  ###
  _init: ( opts ) ->
    me = this
    ### 
    *   初始化控件自身的一系列属性  
    ###
    me._width                = opts['width'] ? 150
    me._height               = opts['height'] ? 0
    me._dataSource           = opts['dataSource'] ? []
    me._idField              = opts['idField'] if opts['idField']?
    me._textField            = opts['textField'] if opts['textField']?
    me._valueField           = opts['valueField'] if opts['valueField']?
    ### 
    *   预编译模板  
    ###
    me._compiledItemTmpl = me.compileTmpl( me._itemTmpl )

  ###*
   *  控件是否可以获取焦点
   *  @public
   *  @instance
   *  @readonly
   *  @memberof   ebaui.web.ListBox
   *  @member     {Boolean}   focusable
   *  @example    <caption>get</caption>
   *      //  false
   *      console.log( ctrl.focusable() );
  ###
  focusable:() -> true
  
  ###*
   *  获取文本值
   *  @public
   *  @instance
   *  @readonly
   *  @memberof   ebaui.web.ListBox
   *  @member     {Array}    text
   *  @default    ''
   *  @example    <caption>get</caption>
   *      //  text == ''
   *      text = buttonedit.text();
  ###
  text: () ->
    me    = this
    toRet = []
    field = me.textField()
    data  = me.data()
    toRet = (item[field] for item in data)
    return toRet

  ###*
   *  获取或者设置表单控件值
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @member     {Object|Array}    value
   *  @default    null
   *  @example    <caption>get</caption>
   *      value = ctrl.value();
   *  @example    <caption>set</caption>
   *      ctrl.value( [] );
  ###
  value: ( val ) ->
    me = this
    ###*
    * get
    ###
    return me._value unless val
    ###
    unless val
      field = me.valueField()
      data  = me.data()
      toRet = (item[field] for item in data)
      return toRet
    ###

    ###*
    * set
    ###

    items = me.items()
    field = me.valueField()
    val   = [ val ] unless me.isArray( val )

    objArray = []

    for obj in items
      for value in val
        objArray.push( obj ) if value == obj[field]

    me.select( objArray )

    ###*
    val          = [ val ] unless me.isArray( val )
    selectedVal  = null
    selectedData = null
    field        = me.valueField()
    items        = me.items()
    multiSelect  = me.multiSelect()

    if not multiSelect
      for item,i in items
        if item[field] == val[0]
          selectedVal  = items[i]
          selectedData = item
          break

    else
      selectedVal  = []
      selectedData = []
      for item in items
        for value in val
          if value == item[field]
            selectedVal.push( value )
            selectedData.push( item )

    me._value = selectedVal
    me._data  = selectedData

    me.select( selectedData )
    ###

  ###*
   *  获取或者设置选中的项
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @member     {Array}        data
   *  @example    <caption>get</caption>
   *      pair = ctrl.data();
   *  @example    <caption>set</caption>
   *      ctrl.data( [] );
  ###
  data: ( val ) ->
    me = this
    ###*
    * get
    ###
    return me.selectedItems() unless val

    ###*
    * set
    ###

    me.select( val )

    ###
    val = [val] unless me.isArray( val )
    me.deselectAll() if val.length is 0

    selectedVal  = null
    selectedData = null
    items = me.items()
    field = me.valueField()

    if not me.multiSelect()
      for item,i in items
        itemValue = val[0][field]
        if item[field] == itemValue
          selectedVal  = itemValue
          selectedData = items[i]
          break
    else
      selectedVal  = []
      selectedData = []
      for item in items
        for value in val
          if value[field] == item[field]
            selectedVal.push( value[field] )
            selectedData.push( item )

    me._value = selectedVal
    me._data  = selectedData

    me.select( selectedData )
    ###

  ###*
   *  listBox项的集合
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @member     {Array}  _items
  ###
  _items : []

  ###*
   *  数据加载开始前的处理程序
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ComboBox
   *  @method     _beforeLoading
  ###
  _beforeLoading: () -> this._loadMask()

  ###*
   *  数据加载结束后的处理程序
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ComboBox
   *  @method     _finishLoading
  ###
  _finishLoading:() ->
    me = this
    ### 重置控件的状态 ###
    me._currItemIdx   = -1
    me._selectedItems = []
    ### 渲染数据 ###
    me._renderData()

  ###*
   *  加载listbox的列表数据
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     _loadData
   *  @param      {Function}  beforeLoad
   *  @param      {Function}  afterLoad
  ###
  _loadData:( beforeFn,afterFn ) ->
    me         = this
    dataSource = me.dataSource()
    remoteDate = me.isUsingRemoteData( dataSource )

    if remoteDate
      #  清空列表
      me._items         = []
      me._selectedItems = []

      toServer = {}
      if me.isFunc( dataSource.data )
        toServer = dataSource.data()
      else
        $.extend(toServer, dataSource.data)

      me._beforeLoading()
      $.ajax({
          url       : dataSource.url
          data      : toServer
          dataType  : 'json'
          error     : ( eventArgs ) -> me.triggerEvent( 'loadfail',eventArgs )
          success   : (serverData) ->
              me._items = serverData
              me._finishLoading()
              me.triggerEvent( 'load',serverData )
          complete  : ( eventArgs ) -> me.triggerEvent( 'loadcomplete',eventArgs )
      })

    else
      me._beforeLoading()
      me._items = dataSource
      me._finishLoading()

  ###*
   *  listBox项的集合
   *  @public
   *  @instance
   *  @readonly
   *  @memberof   ebaui.web.ListBox
   *  @member     {Array}  items
  ###
  items: () -> this._items

  ###*
   *  选中的项
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @member     {Array}  _selectedItems
  ###
  _selectedItems: []

  ###*
   *  获取选中的项
   *  @public
   *  @instance
   *  @readonly
   *  @memberof   ebaui.web.ListBox
   *  @member     {Array}  selectedItems
   *  @example    <caption>get</caption>
   *      //  [{ text : '' ,value : '' }];
   *      items = ctrl.selectedItems();
   *  @example    <caption>set</caption>
   *      ctrl.selectedItems( [] );
  ###
  selectedItems:() -> this._selectedItems

  ###*
   *  添加列表项
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     add
   *  @param      {Object|Array}     items
   *  @example    
   *      ctrl.add( [] );
   *  @tutorial listbox_addItems
  ###
  add: ( toAdd ) ->
    return unless toAdd?

    me = this
    toAdd = [ toAdd ] unless me.isArray( toAdd )
    if toAdd.length > 0
      me._items = me._items.concat( toAdd )
      me._renderData()

  ###*
   *  删除列表项
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     remove
   *  @param      {Object|Array}     items
   *  @example    
   *      ctrl.remove( [] );
   *  @tutorial listbox_removeItems
  ###
  remove: ( toRm ) ->
    return unless toRm?
    me = this
    toRm = [ toRm ] unless me.isArray( toRm )
    if toRm.length > 0

      valueField = me.valueField()
      for item, i in toRm
        for dataItem,j in me._items
          if dataItem[valueField] == item[valueField]
              me._items.splice( j,1 )
              break

      me._renderData()

  ###*
   *  更新列表中的项目
   *  @public 
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     update
   *  @param      {Object|Array}     items
   *  @example    
   *      ctrl.update( [] );
   *  @tutorial listbox_updateItems
  ###
  update: ( toUp ) ->
    return unless toUp?
    me   = this
    toUp = [ toUp ] unless me.isArray( toUp )

    if toUp.length > 0
        valueField = me.valueField()
        for item, i in toUp
          for dataItem, j in me._items
            if dataItem[valueField] == item[valueField]
              me._items[j] = item
              break

        me._renderData()

  ###*
   *  移动列表项
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     move
   *  @param      {Number}     source
   *  @param      {Number}     dist
   *  @example    
   *      ctrl.move( [] );
   *  @tutorial listbox_moveItems
  ###
  move: ( source,dist ) ->
    me = this;
    return unless me.isNumber( source ) and me.isNumber( dist )
    items = me._items
    temp  = items[source]
    items[source] = items[dist]
    items[dist] = temp

    me._renderData()

  ###*
   *  当前选中项目的index
   *  @private
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @member     _currItemIdx
  ###
  _currItemIdx:-1

  ###*
   *  选中前一个项目
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     select
   *  @example    
   *      ctrl.selectPrev();
  ###
  selectPrev:() ->
    me        = this
    currIdx   = me._currItemIdx
    dataItems = me.items()

    return unless dataItems and dataItems.length > 0
    return if currIdx - 1 < 0

    --currIdx
    me._currItemIdx = currIdx
    me.select( currIdx )
    me.highlight( currIdx )

  ###*
   *  选中前一个项目
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     select
   *  @example    
   *      ctrl.selectNext();
  ###
  selectNext: () ->
    me = this
    currIdx = me._currItemIdx
    dataItems = me.items()

    return unless dataItems and dataItems.length > 0
    return if currIdx + 1 >= dataItems.length

    ++currIdx
    me._currItemIdx = currIdx
    me.select( currIdx )
    me.highlight( currIdx )

  ###*
   *  选中项目
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     select
   *  @param      {Object|Array|Number}     items    -   数据对象，数据对象数组，或者索引index
   *  @example    
   *      ctrl.select( [] );
   *  @tutorial listbox_selectItems
  ###
  select: ( items ) ->
    ###*
    * 实际上data属性，返回的也是_selectedItems
    * 所以不要重复已经有的方法
    * data以及value属性的变更，我想应该是可以整合到select方法来实现的
    ###
    me = this
    return unless items?

    isNum     = me.isNumber( items )
    dataItems = me.items()
    return if isNum and not ( items >= 0 and items < dataItems.length )

    ###*
    *  如果参数是一个index选项，
    *  并且这个index在合理的范围内 
    ###
    items = [ dataItems[items]  ] if isNum
    items = [ items ] unless me.isArray( items )
    return unless items.length

    selectedVal  = me._value
    selectedData = me._selectedItems
    valueField   = me.valueField()
    if me.multiSelect()

      for source, i in items

        alreadySelected = false
        for item, j in selectedData
          if item[valueField] == source[valueField]
            alreadySelected = true
            break

        unless alreadySelected
          selectedVal.push( item[valueField] )
          selectedData.push( source )

    else
      selectedVal  = items[0][valueField]
      selectedData = items[0]

    me._value         = selectedVal
    me._selectedItems = selectedData
    me._renderData()

  ###*
   *  取消选中项目
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     deselect
   *  @param      {Object|Array}     items    -   数据对象，数据对象数组
   *  @example    
   *      ctrl.deselect( [] );
   *  @tutorial listbox_selectItems
  ###
  deselect: ( items ) ->
    me = this
    return unless items?

    isNum     = me.isNumber( items )
    dataItems = me.items()
    return if isNum and not (items >= 0 and items < dataItems.length)
    ###
    *  如果参数是一个index选项，
    *  并且这个index在合理的范围内 
    ###
    items = [ dataItems[items]  ] if isNum
    items = [ items ] unless me.isArray( items )
    return unless items.length

    selectedItems = me._selectedItems
    return if items.length <=0 or selectedItems.length <= 0

    valueField = me.valueField()
    for toRm, i in items

      for selected, j in selectedItems

        if selected[valueField] == toRm[valueField]
          selectedItems.splice( j,1 )
          break
    
    me._currItemIdx = -1
    me._renderData()

  ###*
   *  取消所有选中项目
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     deselectAll
  ###
  deselectAll:() ->
    me = this
    me._currItemIdx = -1
    me._selectedItems = []
    me._renderData()

  ###*
   *  高亮listbox的某条数据，但是不选中
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @method     highlight
   *  @param      {Number|Object}     target    -   索引值或者数据对象
   *  @example    
   *      ctrl.select( [] );
   *  @tutorial listbox_selectItems
  ###
  highlight:( target ) ->
    me = this
    return unless target?

    itemIndex = -1
    if me.isNumber( target )

      return if target >= me._items.length
      itemIndex = target

    else
      field = me.valueField()
      for item, i in me._items

        item = me._items[i]
        if target[field] and item[field] == target[field]
          itemIndex = i
          break

    $root = me._$root
    hoverCls = 'eba-listbox-item-hover'
    $( '.eba-listbox-item-hover',$root ).removeClass(hoverCls)
    if itemIndex > -1
      jq = ".eba-listbox-item:eq(#{itemIndex})"
      $( jq,$root ).addClass(hoverCls)

  ###*
   *  控件数据源对象的ID字段名
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @member     {String}      idField
   *  @default    'id'
   *  @example    <caption>get</caption>
   *      idField = ctrl.idField();
   *  @example    <caption>set</caption>
   *      ctrl.idField( '' );
  ###
  _idField:'id'
  idField : ( val ) ->
    me = this
    return me._idField unless me.isString( val )
    me._idField = val

  ###*
   *  控件数据源对象字段中，用于作为控件值的字段名
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @member     {String}      valueField
   *  @default    'value'
   *  @example    <caption>get</caption>
   *      valueField = ctrl.valueField();
   *  @example    <caption>set</caption>
   *      ctrl.valueField( '' );
  ###
  _valueField:'value'
  valueField :( val ) ->
    me = this
    return me._valueField unless me.isString( val )
    me._valueField = val
    me._renderData()

  ###*
   *  控件数据源对象字段中，用于作为控件文本的字段名
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @member     {String}      textField
   *  @default    'text'
   *  @example    <caption>get</caption>
   *      textField = ctrl.textField();
   *  @example    <caption>set</caption>
   *      ctrl.textField( '' );
  ###
  _textField:'text'
  textField : ( val ) ->
    me = this
    return me._textField unless me.isString( val )
    me._textField = val
    me._renderData()

  ###*
   *  数据源，可以是URL地址或者是一个javascript数组对象作为数据源
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @member     {String|Array}      dataSource
   *  @default    []
   *  @example    <caption>get</caption>
   *      src = ctrl.dataSource();
   *  @example    <caption>set</caption>
   *      //  本地数据
   *      ctrl.dataSource( [] );
   *
   *      //  服务端数据
   *      ctrl.dataSource( {
   *          url : 'http://xx.xx/xx?xx=xx',
   *          data : {}
   *      } );
   *
   *      //  服务端数据
   *      ctrl.dataSource( {
   *          url : 'http://xx.xx/xx?xx=xx',
   *          data : function(){ 
   *              // your logic
   *              return {};
   *          }
   *      } );
  ###
  _dataSource: {}
  dataSource: ( val ) ->
    me = this
    return me._dataSource unless val?

    me._dataSource = val
    me._loadData()

  _multiSelect:false
  ###*
   *  获取或者设置控件是否支持多选
   *  @public
   *  @instance
   *  @memberof   ebaui.web.ListBox
   *  @member     {Boolean}    multiSelect
  ###
  multiSelect : ( val )  ->
    me = this
    return me._multiSelect unless me.isBoolean( val )
    me._multiSelect = val

ebaui['web'].registerFormControl( 'ListBox',ListBox )