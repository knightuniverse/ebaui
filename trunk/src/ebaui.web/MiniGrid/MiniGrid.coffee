class MiniGrid extends Control
    ###
     *  控件HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @member     {String}    _headerTmpl
     ###
    _headerTmpl : ''

    ###
     *  控件HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @member     {String}    _itemTmpl
     ###
    _itemTmpl : ''

    ###
     *  已经编译好的ListBox项HTML模板，后续会重复使用
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _compiledHeaderTmpl
     ###
    _compiledHeaderTmpl : $.noop

    ###
     *  已经编译好的ListBox项HTML模板，后续会重复使用
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _compiledItemTmpl
     ###
    _compiledItemTmpl : $.noop

    ###
     *  更新UI的宽度和高度
     *  @private
     *  @instance
     *  @memberof   Control
     *  @method     _doUpdateCssSize
     *  @arg        {String}    cssProp
     ###
    _doUpdateCssSize:( cssProp ) ->
        me      = this
        propVal = me[cssProp]()
        isNum   = me.isNumber( propVal )
        $root   = me._$root
        $view   = $('.eba-listbox-view'  ,$root)

        return undefined if isNum and propVal <= 0

        ###
        *   if width is string and width.length > 0
        ###
        if propVal
            result = me._cssUnitRE.exec( propVal )
            $view.css( cssProp,if result[1]? then propVal else ( propVal + 'px' ) )

        return undefined

    ###
     *  初始化DOM事件处理程序
     *  @private
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _setupEvents
     ###
    _setupEvents: ( opts ) ->
        me  = this
        $root = me._$root

        me.onEvent( 'selectrow' ,opts['onSelectRow'] )
        me.onEvent( 'selectall' ,opts['onSelectAll'] )
        me.onEvent( 'load'      ,opts['loadComplete'] )

        $root.on( 'change',':checkbox',( event ) ->
            $this       = $(this)
            value       = $this.val()
            checked     = $this.is(':checked')
            selectedCls = 'eba-listbox-item-selected'

            if value is 'selectall'
                if checked
                    #  in case of select all
                    $( ':checkbox[value!="selectall"]',$root ).prop('checked',true)
                    $( '.eba-listbox-view tr[data-index!=""]',$root ).addClass(selectedCls)
                    me.triggerEvent( 'selectall',event )
                else
                    #  in case of deselect all
                    me.resetSelection()
                    $( ".eba-listbox-view .#{selectedCls}",$root ).removeClass(selectedCls)
                    me.triggerEvent( 'selectall',event )
            else
                $grandParent = $this.parent().parent()
                if checked
                    $grandParent.addClass(selectedCls)
                    me.triggerEvent( 'selectrow',event )
                else
                    $grandParent.removeClass(selectedCls)
                    me.triggerEvent( 'selectrow',event )

            return undefined
        )

        return undefined

    ###
     *  判断是否使用本地数据源还是使用remote数据源
     *  ，因为我直接整合jqgrid的配置，并没有做过多的修改
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _isRemoteDataSource
     ###
    _isRemoteDataSource: () ->
        me         = this
        dataSource = me._data
        url        = me._url

        ###
        *  优先加载远程数据，然后才是本地数据
        ###
        return true if url
        return false if dataSource and me.isArray( dataSource )

        #  at last, it comes to an empty array as a local dataSource
        me._data = []

        return false

    ###
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _init
     ###
    _init: ( opts ) ->
        super( opts )
        me = this
        ###
        *   初始化控件自身的一系列属性
        ###
        me._width       = opts['width'] ? 400
        me._height      = opts['height'] ? 120
        me._url         = opts['url'] ? ''
        me._data        = opts['data'] ? []
        me._datatype    = opts['datatype'] ? 'local'
        me._colModel    = opts['colModel'] ? [{name:'id',label:'ID', width:150}, {name:'text', label:'Text',width:150}]
        me._autowidth   = opts['autowidth'] ? true
        me._multiselect = opts['multiselect'] ? true
        ###
        *   预编译html模板
        ###
        me._compiledHeaderTmpl = me.compileTmpl( me._headerTmpl )
        me._compiledItemTmpl   = me.compileTmpl( me._itemTmpl )

    ###
    *   _autowidth
    ###
    _autowidth:true

    ###
    *   local data array
    ###
    _data: []

    ###
    *   remote data source 
    ###
    _url:''

    ###
    *  xml 
    *  xmlstring 
    *  json 
    *  jsonstring 
    *  local 
    *  javascript 
    *  function 
    *  clientSide
    ###
    _datatype:'local'

    ###
    *   使用远程数据的时候，随着url一起提交到服务器的数据
    *   [{}]
    ###
    _postData:[]

    ###
    *   控件数据源对象的ID字段名
    ###
    _colModel:[{ name:'id', label:'ID', width:150 },{ name:'text', label:'Text', width:150 }]

    ###
    *   是否允许多选
    ###
    _multiselect: true

    ###
     *  加载控件数据
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _loadData
     ###
    _loadData:() ->
        me = this
        loadFromRemote = me._isRemoteDataSource()

        if loadFromRemote
            dataSource = me._url
            postData   = me._postData
            parameters = {}

            if postData
                for dataItem in postData
                    $.extend( parameters,dataItem )

            $.getJSON(dataSource, parameters, (serverData) -> 
                    me._items = serverData
                    me._finishLoading()
                    me.triggerEvent('load')
            )

        else
            me._items = me._data
            me._finishLoading()
            me.triggerEvent('load')
        
        return undefined

    _finishLoading:() ->
        me          = this
        $root       = me._$root
        colModel    = me._colModel
        headerHtml  = me._compiledHeaderTmpl(
            'headers' : colModel
        )

        itemsHtml   = me._compiledItemTmpl(
            'headers'  : colModel
            'rows'     : me.items()
            'autowidth': me._autowidth
        )

        if me._autowidth
            $( '.eba-listbox-headerInner',$root ).html( headerHtml )
            $( '.eba-listbox-items',$root ).html( itemsHtml )
        else
            $( '.eba-listbox-items',$root ).html( headerHtml + itemsHtml )

    ###
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     _render
     ###
    _render: () -> 
        me = this
        me._loadData()
        me._updateCssWidth()
        me._updateCssHeight()

    _items: []
    ###
     *  当前MiniGrid的数据源
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @member     items
     ###
    items: () -> this._items

    ###
     *  当前MiniGrid的已经选中的项目
     *  @private
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @member     selectedItems
     ###
    selectedItems: () ->

        me = this
        return [] unless me._items.length > 0

        idx   = []
        $root = me._$root
        $( ':checked',$root ).each( ( index,el ) ->
            $this = $( el )
            value = $this.val()
            if el.checked and value isnt "selectall"
                idx.push( parseInt( value ) )
        )

        items = me._items
        selected = []
        for index,i in idx
            selected.push( items[index] )

        return selected

    ###
     *  清空选中的项。如果有指定的数据行，则清空指定数据行的选中状态；
     *  否则，清空所有选中的数据行。
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     resetSelection
     *  @param      {String}        rowId
     ###
    resetSelection: ( rowId ) ->

        me               = this
        $root            = me._$root
        $checked         = $( ':checked' ,$root )
        $checkboxes      = $( ':checkbox',$root )

        checkedItemCount = $checked.size()
        allChecked       = checkedItemCount == me._items.length
        resetAll         = !me.isNumber( rowId )

        return unless checkedItemCount > 0

        if not resetAll

            if allChecked
                #  in case of checked all
                $checkboxes.get( 0 ).checked         = false
                $checkboxes.get( rowId + 1 ).checked = false
            else
                $checkboxes.get( rowId + 1 ).checked = false

            return undefined

        #  in case of reset all
        $( '.eba-listbox-item-selected',$root ).removeClass('eba-listbox-item-selected')
        $checked.prop( 'checked',false )

        return undefined

    ###
     *  选中指定的数据行
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     setSelection
     *  @param      {String}        rowId
     ###
    setSelection: ( rowId ) ->

        me       = this
        selector = 'tr[data-index="{0}"]'.replace( '{0}',rowId )
        $tr      = $( selector,me._$root )

        return undefined unless $tr.size() > 0

        $tr.find(':checkbox').get(0).checked = true
        $tr.addClass('eba-listbox-item-selected')
        me.triggerEvent( 'selectrow' )

    ###
     *  获取grid的配置
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     getGridParam
     *  @arg        {String}        name
     ###
    getGridParam:(name) ->
        me = this
        prop = '_' + name
        return me[prop]

    ###
     *  更新grid的配置   { data : [] }
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     setGridParam
     *  @param      {Object}        options
     ###
    setGridParam: ( parameters ) ->
        return unless parameters?
        me = this
        for key,value of parameters
            prop = '_' + key
            me[prop] = value

        return undefined

    ###
     *  使用grid配置重新加载grid
     *  @public
     *  @instance
     *  @memberof   ebaui.web.MiniGrid
     *  @method     reloadGrid
     ###
    reloadGrid: () -> this._render()

ebaui['web'].registerControl( 'MiniGrid',MiniGrid )