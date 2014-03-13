###*
 *  @class      ComboBox 
 *  @memberof   ebaui.web
 *  @extends    ebaui.web.Combo
 *  @param      {Object}    element     -   dom对象
 *  @param      {Object}    options     -   控件配置参数
 *  @example
 *      valueField默认值:value
 *      valueField默认值:text
 *      filterField默认值:text
 *
 *      data-options={
 *          text       : '',
 *          value      : null,
 *          idField    : 'id',
 *          textField  : 'text',
 *          filterField: 'text',
 *          valueField : 'value',
 *          dataSource : '' ,
 *          onchange   : $.noop
 *      }
 *
 *       //  初始化方式一
 *       var ns = ebaui.web;
 *       var btn = new ns.ComboBox( $( '' ),{ title:'',id:'',name:'' } );
 *       //  初始化方式二
 *       $( '' ).combobox( { title:'',id:'',name:'' } )
 *       //  初始化方式三
 *       &lt;input id="" title="" name="" data-role="combobox" data-options="{}" /&gt;
###
class ComboBox extends Combo
    ###*
     *  下拉菜单包含的控件对象，Combobox中就是一个ListBox
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     _panelContent
    ###
    _panelContent : null

    ###*
     *  创建并且初始化下拉菜单的listbox
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _initPanelContent
    ###
    _initPanelContent:() ->
        me      = this
        ns      = ebaui.web
        panel   = me._panel
        $panel  = panel.uiElement()
        ###
        *   width     : me.width() - 24
        *   是因为我们每个控件都有24px的icon
        ###
        listbox = new ns.ListBox( $( 'input',$panel ),{
            position   : null
            width      : me.width() - 24
            height     : 0
            idField    : me.idField()
            textField  : me.textField()
            valueField : me.valueField()
            dataSource : []
            onitemclick: ( sender,event ) ->
                #  更新控件的数据 
                selected = sender.selectedItems()
                ###
                *   data方法参数
                *       val,
                *       updateHtml = true,
                *       updatePopup = true, 
                *       dispatchEvent = false, 
                *       eventArgs = {}
                ###
                me.data( selected,true,false,true,event )
                ###
                *   如果是单选的情况
                *   那么在选中其中的一个项目之后
                *   就把下拉菜单收起来
                ###
                panel.close()
        } )

        me._panelContent = listbox

    ###*
     *  数据加载结束后的处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _finishLoading
    ###
    _finishLoading:() ->
        me      = this
        listbox = me._panelContent
        listbox.dataSource( me.items() )
        me._reposition()
        
    ###*
     *  加载combobox的数据
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _loadData
     *  @arg        {String}    txt             -   筛选下拉菜单数据的关键字
     *  @arg        {Boolean}   initRender      -   本次加载数据的过程，是否是发生在初始化输出的时候
    ###
    _loadData:( txt,initRender = false ) ->
        
        ###
        *   combobox目前只能单选
        *   多选的话，还是启用其他的控件吧
        *   这样会比较东西会比较容易实现
        ###
        me             = this
        dataSource     = me.dataSource()
        postData       = dataSource.data ? {}
        include        = me.filter()
        filterField    = me.filterField()
        isRemoteSource = me.isUsingRemoteData( dataSource )
        
        ###
        *   如果是初始化输出，并且这个时候控件已经有值了
        *   那么在输出的时候要更新控件的值，并且正确更新下拉菜单的值
        ###
        updateInitVal = ( initRender,panelData ) ->
            
            return unless initRender
            
            initVal = me.value()
            if initVal?
                txtField = me.textField()
                valField = me.valueField()
                for item, index in panelData
                    if item[valField] is initVal
                        me._text = item[txtField]
                        me._data = item
                        me._updateAttrText()
                        ###
                        *   更新下拉菜单的值
                        ###
                        me._panelContent.data( item )
                        break

        me._items = []
        if isRemoteSource
            
            ###
            *   加载远程数据
            ###
            remote   = dataSource.url
            postData = if me.isFunc( postData ) then postData() else postData ? {}
            postData[filterField] = txt if txt
            
            me._beforeLoading()
            $.post(
                remote,
                postData,
                (serverData, textStatus, jqXHR) ->
                    
                    me._items = serverData
                    me._finishLoading()
                    
                    ###
                    *   更新控件的初始化的值
                    ###
                    updateInitVal( initRender,serverData )
                    
                'json'
            )
            
        else
            ###
            *   加载本地数据
            ###
            me._beforeLoading()
            
            ###
            *   获取下拉菜单的数据
            ###
            if txt
                ###
                *   如果已经初始值，那么要先进行过滤
                ###
                dataItems = []
                for item, i in dataSource
                    dataItems.push( item ) if include( item,txt,filterField )
                me._items = dataItems
            else
                ###
                *   如果初始值为空，那么不进行过滤
                ###
                me._items = dataSource
                
            me._finishLoading()
            ###
            *   更新控件的初始化的值
            ###
            updateInitVal( initRender, me._items )

        return undefined

    ###*
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _setupEvents
    ###
    _setupEvents:( opts ) ->
        super( opts )

        #  初始化加载下拉菜单数据
        #  下拉菜单的数据应该是由combobox过滤以及筛选，然后赋值给下拉菜单控件
        #  我觉得，下载菜单的数据应该是在点击下来菜单的时候去加载数据
        me            = this
        $root         = me.uiElement()
        inputSelector = '.eba-buttonedit-input'

        me.onEvent( 'enter'     ,opts['onenter'] )
        me.onEvent( 'change'    ,opts['onchange'] )

        $root.on( 'keydown',inputSelector,( event ) ->
            ###
            *   如果不允许手工输入文本，返回false，阻止文字输入
            ###
            return event.preventDefault() if me.readonly()
            allowed = me.enabled() and me.allowInput()
            return event.preventDefault() unless allowed

            code    = event.which
            ###
            *   我们暂时只允许按下enter键    13
            *   ，小键盘的向上按键           38
            *   ，小键盘的向下按键           40
            ###
            switch code
                when 13,38,40 then allowed = true

            return event.preventDefault() unless allowed
        )

        $root.on( 'keyup',inputSelector,( event ) ->
            return event.preventDefault() if me.readonly() or not me.enabled()
            $input  = me._$formInput
            listbox = me._panelContent
            panel   = me._panel
            code    = event.which
            ### 
            *   小键盘的向下按键
            ###
            onDownArrow = (sender,event)  -> listbox.selectNext()

            ### 
            *   小键盘的向上按键
            ###
            onUpArrow = (sender,event) -> listbox.selectPrev()

            ### 
            *   enter键
            ###
            onEnter = (sender,event) ->
                if panel.visible()
                    ###
                    *  按下回车键选中下拉菜单的某一个项的时候，
                    *  下拉菜单的listbox控件也要选中这个项 
                    *   data方法参数
                    *       val,
                    *       updateHtml = true,
                    *       updatePopup = true, 
                    *       dispatchEvent = false, 
                    *       eventArgs = {}
                    ###
                    me.data( listbox.data(),true,false,true,event )
                    panel.close()
                    return

                me.triggerEvent( 'enter',event )

            ### 
            *   默认keyup事件处理程序
            ###
            defaults = (sender,event) ->
                ###
                 *  输入正常字符，进行过滤
                 *  如果使用远程数据，则发送AJAX请求去获取数据，然后把得到的数据赋值给this._dataItems变量； 
                 *  如果使用的是本地数据，则对dataSource进行filter操作，然后把结果值赋值给this._dataItems变量；
                 *  清零this._currDataItemIndex
                 *  UI加载并且显示this._dataItems
                ###
                _txt = $input.val()
                me.text( _txt )
                me._loadData( _txt )
                panel.open()

            ###
            *   我们暂时只允许按下enter键    13
            *   ，小键盘的向上按键           38
            *   ，小键盘的向下按键           40
            ###
            switch code
                when 13 then onEnter( me,event )
                when 38 then onUpArrow( me,event )
                when 40 then onDownArrow( me,event )
                else defaults( me,event )

        )

        return undefined

    ###*
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _render
     ###
    _render: () ->
        super()
        me = this
        ###
        *   加载数据
        ###
        me._loadData( null,true )

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _init
    ###
    _init: ( opts ) ->
        super( opts )
        me    = this
        $root = me._$root
        ###
         *  初始化控件自身的一系列属性
         *  过滤字段,使用remote 数据源的时候，发起请求时input值对应的url参数得KEY
         *  该参数默认等同于textField参数
        ###
        me._dataSource  = opts['dataSource'] ? []
        me._idField     = opts['idField'] ? 'id'
        me._textField   = opts['textField'] ? 'text'
        me._valueField  = opts['valueField'] ? 'value'
        me._filterField = if opts['filterField']? then opts['filterField'] else me._textField
        $root.addClass( 'eba-combobox eba-popupedit' )
        ###
        *   创建下拉菜单，并且进行初始化，设置数据源等
        ###
        me._initPanel()
        me._initPanelContent()

        return undefined

    _items: []
    ###*
     *  下拉菜单数据
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.Combo
     *  @member     {Array}  items
    ###
    items: () -> this._items

    ###*
     *  重置控件的数据
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @method     _cleanUp
    ###
    _cleanUp:() -> 
        me        = this
        me._text  = ''
        me._value = null
        me._data  = null
        return me._updateAttrText()

    ###*
     *  获取或者设置表单控件值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {Object}    value
     *  @default    null
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( {} );
    ###
    value:( val,updateHtml = true,updatePopup = true, dispatchEvent = false, eventArgs = {} ) ->
        me = this
        ###
        *   get
        ###
        return me._value unless val?

        ###
        *   set
        ###
        val = [val] unless me.isArray( val )
        return me._cleanUp() if val.length is 0

        ###
        *   如果控件值如果value没有变化，则不应该更新控件的值；
        *   否则，更新控件的值
        ###
        update = val[0]
        return if me._value is update

        index      = -1
        data       = null
        text       = ''
        textField  = me.textField()
        valueField = me.valueField()
        items      = me.items()
        for dataItem, i in items
            if dataItem[valueField] is update
                index = i
                data  = dataItem
                text  = dataItem[textField]
                break

        ###
        *   如果没有找到这个项，直接返回
        ###
        return if index == -1

        me._data  = data
        me._text  = text
        me._value = update

        ###
        *   更新文本值
        ###
        me._updateAttrText() if updateHtml is true

        ###
        *   更新控件下拉菜单的值
        ###
        me._panelContent.data(data) if updatePopup is true

        ###
        *   触发change事件
        ###
        me.triggerEvent( 'change',eventArgs ) if dispatchEvent is true

    ###*
     *  获取或者设置选中的项
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {Object}        data
     *  @default    null
     *  @example    <caption>get</caption>
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( {} );
    ###
    data: ( val,updateHtml = true,updatePopup = true, dispatchEvent = false, eventArgs = {} ) ->
        me = this
        return me._data unless val?

        val = [val] unless me.isArray( val )
        return me._cleanUp() if val.length is 0

        data       = val[0]
        items      = me.items()
        return unless data in items

        textField  = me.textField()
        valueField = me.valueField()

        ###
        *   如果控件值如果value没有变化，则不应该更新控件的值；
        *   否则，更新控件的值
        ###
        return if me._value is data[valueField]

        me._data   = data
        me._text   = data[textField]
        me._value  = data[valueField]

        ###
        *   更新文本值
        ###
        me._updateAttrText() if updateHtml is true

        ###
        *   更新控件下拉菜单的值
        ###
        me._panelContent.data(data) if updatePopup is true

        ###
        *   触发change事件
        ###
        me.triggerEvent( 'change',eventArgs ) if dispatchEvent is true

    _filterField:'text'
    ###*
     *  控件数据源对象字段中，用于筛选的对象字段名
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboBox
     *  @member     {String}      filterField
     *  @default    'text'
     *  @example    <caption>get</caption>
     *      filterField = ctrl.filterField();
     *  @example    <caption>set</caption>
     *      ctrl.filterField( '' );
    ###
    filterField: ( val ) ->
        me = this
        return me._filterField unless me.isString( val )
        me._filterField = val

    _dataSource:{}
    ###*
     *  下拉菜单选项的数据源，可以是URL地址或者是一个javascript数组对象作为数据源
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Combo
     *  @member     {Object|Array}          dataSource
     *  @property   {String}                dataSource.url          - 服务端URL
     *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
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
        me = this
        return me._dataSource unless val?
        me._dataSource = val

    _filter:( item,value,filterField ) -> item[filterField].indexOf( value ) > -1
    ###*
    *   使用array作为数据源时
    *   ，作为数据过滤的函数
    ###
    filter:( val ) ->
        me = this
        return me._filter unless me.isFunc( val )
        me._filter = val

ebaui['web'].registerFormControl( 'ComboBox',ComboBox )