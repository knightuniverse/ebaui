class CheckBoxList extends FormField
    ###
     *  控件HTML模板
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {String}    _itemTmpl
    ###
    _itemTmpl: ''

    ###
     *  已经编译好的checkbox模板，使用underscore模板引擎，后续会重复使用
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _compiledItemTmpl
    ###
    _compiledItemTmpl: $.noop

    ###
     *  显示checkbox列表
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _renderItems
    ###
    _renderItems:() ->
        me        = this
        $root     = me.uiElement()
        dataItems = me.items()
        return if dataItems.length is 0

        html = me._compiledItemTmpl(
            'name'      : me.name()
            'controlID' : me.controlID()
            'textField' : me.textField()
            'valueField': me.valueField()
            'dataItems' : dataItems
        )

        $( 'tr',$root ).html( html )

    _items : []
    ###
     *  CheckBoxList数据源
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {Array}     _items
    ###
    items:() -> this._items

    ###
     *  数据加载开始前的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _beforeLoading
    ###
    _beforeLoading: () -> 

    ###
     *  数据加载结束后的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _finishLoading
    ###
    _finishLoading:() ->
        me = this
        ###
         *  首次输出UI界面的时候，应该检查初始值，看看是否有设置已经选中的项目
         *  如果有，那么应该在初始化的时候，自动勾选
        ###
        checkedVal = me.value()
        items      = me.items()
        valueField = me.valueField()

        if checkedVal and checkedVal.length > 0
            for value,j in checkedVal
                for dataItem,i in items
                    dataItem['checked'] = ( dataItem[valueField] is value )

        me._renderItems()

    ###
     *  加载数据源，加载成功后填充本地数据源_items
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _loadData
    ###
    _loadData:() ->

        me             = this
        dataSource     = me.dataSource()
        loadRemoteData = me.isUsingRemoteData( dataSource )

        if loadRemoteData
            #  use remote data source 
            toServer = if me.isFunc( data ) then data() else ( data ? {} )
            url      = dataSource.url
            data     = dataSource.data

            me._beforeLoading()
            $.getJSON( url,toServer ).done(( serverData ) ->
                #  显示加载中的样式
                me._items = serverData
                me._finishLoading()
            )

        else
            me._beforeLoading()
            #  use local data source 
            me._items = dataSource
            me._finishLoading()

        return undefined

    ###
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _render
    ###
    _render: () ->
        super()

        me = this
        ### load data then render CheckBoxList ###
        me._loadData( $.noop,() ->

            ###
             *  首次输出UI界面的时候，应该检查初始值，看看是否有设置已经选中的项目
             *  如果有，那么应该在初始化的时候，自动勾选
            ###
            checkedVal = me.value()
            items      = me.items()
            valueField = me.valueField()

            if checkedVal and checkedVal.length > 0
                for value,j in checkedVal
                    for dataItem,i in items
                        dataItem['checked'] = ( dataItem[valueField] is value )

            me._renderItems()

        )

        return undefined

    ###
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _setupEvents
    ###
    _setupEvents : (opts) ->
        me    = this
        $root = me._$root
        me.onEvent( 'change',opts['onchange'] )

        $root.on( 'change','input',( event ) ->
            me.triggerEvent( 'change',event )
        )

        return undefined

    ###
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _init
    ###
    _init: (opts) ->
        super( opts )
        me = this
        ### 初始化控件自身的一系列属性  ###
        me._dataSource = opts['dataSource'] ? ''
        me._valueField = opts['valueField'] ? 'value'
        me._textField  = opts['textField'] ? 'text'

        me._compiledItemTmpl = me.compileTmpl( me._itemTmpl )

    ###
     *  获取或者设置CheckBoxList的选中项
     *  ，参数格式示例：[{ text : '',value : '' }]
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {Array}        data
     *  @example    <caption>get</caption>
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( [] );
    ###
    data: ( val ) ->
        me = this
        # get #
        return me._data unless val? and me.isArray(val)

        ###
        *   set
        ###
        ctrlVal    = []
        valueField = me.valueField()
        for item, i in val
            ctrlVal.push( item[valueField] ) if item[valueField]?

        me._data = val
        me.value( ctrlVal )

        return undefined

    ###
     *  获取或者设置CheckBoxList的选中项
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {Array}     value
     *  @example    <caption>get</caption>
     *      pair = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( [1,2,3] );
    ###
    value : ( val ) ->
        me        = this
        $root     = me.uiElement()
        me._value = me._getValue()
        ###
        *   get value
        ###
        return me._value unless me.isArray( val )
        ###
        *   set value
        ###
        me._setValue( val )

    ###
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _getValue
    ###
    _getValue:() ->
        me    = this
        $root = me.uiElement()
        checkedItems = []
        $( 'input:checked',$root ).each(( idx,el ) ->
            checkedItems.push( $( el ).val() )
        )
        return checkedItems

    ###
     *  更新控件的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _setValue
     *  @arg        {String}     val    -   
     *  @arg        {Boolean}    updateHtml    -   是否更新控件UI的input标签的值
     *  @arg        {Boolean}    dispatchEvent    -   是否触发change事件
     *  @arg        {Object}     eventArgs    -   事件的eventArgs
    ###
    _setValue:( val, updateHtml = true, dispatchEvent = false, eventArgs = {} ) ->
        me = this
        ###
        *   如果控件值如果value没有变化，则不应该更新控件的值；
        *   否则，更新控件的值
        ###
        return if me._value and me._value.join('') is val.join('')

        me._value = val
        if updateHtml
            $('input:checked',$root).prop('checked', false)
            for item, i in val
                $( "input[value='#{item}']",$root ).prop('checked', true)

        if dispatchEvent is true
            me.triggerEvent( 'change',eventArgs )

    ###
     *  valueField以及textField属性访问器
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @method     _doFieldAccess
    ###
    _doFieldAccess:( name,val ) ->
        me = this
        prop = '_' + name
        return me[prop] unless me.isString( val )
        me[prop] = val

    _valueField: 'value'
    ###
     *  控件数据源对象字段中，用于作为控件值的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {String}      valueField
     *  @default    'value'
     *  @example    <caption>get</caption>
     *      valueField = ctrl.valueField();
     *  @example    <caption>set</caption>
     *      ctrl.valueField( '' );
    ###
    valueField : ( val ) -> this._doFieldAccess( 'valueField',val )

    _textField: 'text'
    ###
     *  控件数据源对象字段中，用于作为控件文本的字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {String}      textField
     *  @default    'text'
     *  @example    <caption>get</caption>
     *      textField = ctrl.textField();
     *  @example    <caption>set</caption>
     *      ctrl.textField( '' );
    ###
    textField : ( val ) -> this._doFieldAccess( 'textField',val )

    _dataSource: ''
    ###
     *  CheckBoxList选项的数据源，可以是远程数据源URL配置对象或者是一个javascript数组对象作为数据源
     *  @public
     *  @instance
     *  @memberof   ebaui.web.CheckBoxList
     *  @member     {Object|Array}          dataSource
     *  @property   {String}                dataSource.url          - 服务端URL
     *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
     *  @tutorial   texboxlist_local
     *  @tutorial   texboxlist_remote
     *  @example    <caption>get</caption>
     *      src = ctrl.dataSource();
     *  @example    <caption>set</caption>
     *      #  本地数据
     *      ctrl.dataSource( [] );
     *
     *      #  服务端数据
     *      ctrl.dataSource( {
     *          url : 'http:#xx.xx/xx?xx=xx',
     *          data : {}
     *      } );
     *
     *      #  服务端数据
     *      ctrl.dataSource( {
     *          url : 'http:#xx.xx/xx?xx=xx',
     *          data : function(){ 
     *              # your logic
     *              return {};
     *          }
     *      } );
    ###
    dataSource : ( val ) ->
        me = this;
        return me._dataSource unless val

        me._dataSource = val
        me._loadData($.noop,() -> me._renderItems() )

ebaui['web'].registerFormControl( 'CheckBoxList',CheckBoxList )