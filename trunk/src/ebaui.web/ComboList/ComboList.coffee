###
 *  ebaui.web.ComboList
 *  ，DEMO请查看 {@tutorial combolist_index}
 *  ，使用远程数据源的DEMO请看 {@tutorial combolist_remoteDataSource}
 *  ，手工更改数据源设置的DEMO请看{@tutorial combolist_setDataSource}
 *  @class      ComboList 
 *  @memberof   ebaui.web
 *  @extends    ebaui.web.Combo
 *  @param      {Object}    options     -   控件配置参数
 *  @param      {Object}    element     -   dom对象
 *  @example
 *      
 *      valueField默认值:value
 *      valueField默认值:text
 *      filterField默认值:text
 *
 *      data-options={ 
 *
 *      }
 *
 *      &lt;input id="" name="" data-role="combolist" data-options="{ }" /&gt;
 ###
class ComboList extends Combo
    ###
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ButtonEdit
     *  @method     _updateCssEnabled
    ###
    _updateCssEnabled:() ->
        me          = this
        $root       = me._$root
        $input      = me._$formInput
        
        cls         = me._rootCls
        disabledCls = cls['disabled']
        focusedCls  = cls['focused']

        if me.enabled()
            $root.removeClass( disabledCls )
        else
            $root.removeClass( focusedCls ).addClass( disabledCls )

    ###
     *  更新已经选中的文本列表
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @method     _updateAttrText
     *  @arg        {Array}     texts=[]
     *  @arg        {Boolean}   updateInput=false
    ###
    _updateAttrText:( texts = [],updateInput = true ) ->
        me     = this
        $input = me._$formInput
        if texts.length is 0
            $input.val('') if updateInput
            me._showPlaceHolder()
            return

        update = texts.join(';')
        $input.val( update ) if updateInput
        if me.isEmpty(update) then me._showPlaceHolder() else me._hidePlaceHolder()

    _gridConfig: null
    ###
     *  获取或者设置grid的配置文件
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @member     {Object}    _gridConfig
     *  @default    ''
     *  @example    <caption>get</caption>
     *      conf = ctrl.gridConfig();
     *  @example    <caption>set</caption>
     *      ctrl.gridConfig( 'your text value' );
    ###
    gridConfig:( val )->
        me = this
        return me._gridConfig unless val?
        me._gridConfig = val

    ###
     *  初始化内部控件MiniGrid的配置
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @method     _initPanelContent
    ###
    _initPanelContent: () ->
        me         = this
        ns         = ebaui.web
        panel      = me._panel
        $panel     = panel.uiElement()
        #  format for iniVal is 'aa,bb,cc'
        initVal    = me.value()
        textField  = me.textField()
        valueField = me.valueField()

        ###
        *   data方法参数
        *       val,
        *       updateGrid = true,
        *       dispatchEvent = false, 
        *       eventArgs = {}
        ###
        onSelectRowHandle  = ( sender,eventArgs ) -> 
            me.data( sender.selectedItems(),false,true,eventArgs )

        onSelectAllHandle  = ( sender,eventArgs ) -> 
            me.data( sender.selectedItems(),false,true,eventArgs )

        loadCompleteHandle = ( sender,eventArgs ) ->
            return unless initVal
            gridData = sender.items()
            for val, i in initVal
                for item,idx in gridData
                   sender.setSelection( idx ) if item[valueField] is val

        ###
        *   初始化mini grid
        ###
        config = me.gridConfig()
        #  init grid options
        config['onSelectRow']  = onSelectRowHandle
        config['onSelectAll']  = onSelectAllHandle
        config['loadComplete'] = loadCompleteHandle

        $.each(config['colModel'], (index, model) ->
             model['width'] = 150 unless model['width']
        )

        config['width'] = 400 unless config['width']
        config['height'] = 120 unless config['height']

        minigrid = new ns.MiniGrid( $( 'input',$panel ),config )
        me._panelContent = minigrid

    ###
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @method     _setupEvents
     ###
    _setupEvents:( opts )->
        super( opts )
        me = this
        me.onEvent( 'change'   ,opts['onchange'] )

    ###
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
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
        me._idField     = opts['idField'] ? 'id'
        me._textField   = opts['textField'] ? 'text'
        me._valueField  = opts['valueField'] ? 'value'

        defaultConfig = 
            autowidth : true
            #   default width
            width : 400
            #   default height
            height : 120
            #   
            url         : ''
            #   local data array
            data        : []
            #   xml 
            #   xmlstring 
            #   json 
            #   jsonstring 
            #   local 
            #   javascript 
            #   function 
            #   clientSide
            datatype    : "local"
            #   使用远程数据的时候，随着url一起提交到服务器的数据
            postData    : []
            #   控件数据源对象的ID字段名
            colModel    : [{name:'id',label:'ID',width:150},{name:'text',label:'Text',width:150}]
            #   是否允许多选
            multiselect : true
            onSelectRow : $.noop
            onSelectAll : $.noop
            loadComplete: $.noop

        if opts['grid']?
            me._gridConfig = $.extend( defaultConfig,opts['grid'] )
        else
            me._gridConfig = defaultConfig

        $root.addClass( 'eba-combobox eba-popupedit' ).attr( 'data-role','combolist' )
        #  创建下拉菜单，并且进行初始化，设置数据源等
        me._initPanel()
        #  init minigrid config
        me._initPanelContent()

    _render:()->
        super()
        #  input 始终禁用
        this._$formInput.prop('readonly',true)

    ###
     *  下拉菜单选项的数据源，可以是远程数据源URL配置对象或者是一个javascript数组对象作为数据源
     *  @public
     *  @instance
     *  @memberof   ebaui.web.TextBoxList
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
        return me._gridConfig unless val

        grid = me._panelContent
        grid.setGridParam(val) 
        #  reload grid data
        grid.reloadGrid()

    ###
     *  获取文本值
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.ComboList
     *  @member     {Array}    text
     *  @default    ''
     *  @example    <caption>get</caption>
     *      #  text == ['','']
     *      text = ctrl.text();
    ###
    text : ( val ) -> this._text

    ###
     *  重置控件的数据，以及显示的文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @method     _cleanUp
    ###
    _cleanUp:() ->
        me        = this
        #  reset all data
        me._data  = []
        me._text  = []
        me._value = []
        #  reset mini grid election
        grid = me._panelContent
        grid.resetSelection()
        #  reset text display
        me._updateAttrText([])

    ###
     *  更新控件的数据，以及panel中的DataGrid中选中的数据
     *  @private
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @method     _setValue
     *  @arg        {Array}     val
     *  @arg        {Boolean}   updateGrid   -   指示是否更新grid的内容
     *  @arg        {Boolean}   isLiteral    -   指示过滤函数的参数都是对象类型，还是直接量类型
    ###
    _setValue: ( val, isLiteral = true, updateGrid = true, dispatchEvent = false, eventArgs = {} ) ->
        me   = this
        val  = [val] unless me.isArray( val )

        if val.length is 0
            if me._value and me._value.length > 0 and dispatchEvent is true
                me.triggerEvent( 'change',eventArgs )
            me._cleanUp()
            return

        gridRowIds = []
        valueArray = []
        textArray  = []
        dataArray  = []
        grid       = me._panelContent
        textField  = me.textField()
        valueField = me.valueField()
        gridData   = grid.items()

        isEqual = ( source,target,literal ) ->
            if literal then (source == target) else (source == target[valueField])

        for valueItem,j in val
            for dataItem,rowId in gridData
                ###
                *   iterate through array or object
                ###
                if isEqual( dataItem[valueField],valueItem,isLiteral )
                    ### 
                    *   by this way
                    *   I can get values that real exist
                    ###
                    dataArray.push(dataItem)
                    valueArray.push( dataItem[valueField] )
                    textArray.push( dataItem[textField] )
                    gridRowIds.push( rowId )

        ###
        *   如果控件值如果value没有变化，则不应该更新控件的值；
        *   否则，更新控件的值
        ###
        return if me._value and me._value.join('') is valueArray.join('')

        #  update data property
        me._data = dataArray
        #  update text property
        me._text = textArray
        #  update control value 
        me._value = valueArray
        #  update minigrid selection
        if updateGrid
            grid.resetSelection()
            for rowId, i in gridRowIds then grid.setSelection( rowId )

        ###
        *   update text display
        ###
        me._updateAttrText( textArray )
        ###
        *   triggerEvent
        ###
        me.triggerEvent( 'change',eventArgs ) if dispatchEvent is true
        return undefined

    ###
     *  获取或者设置表单控件值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @member     {Object}    value
     *  @default    null
     *  @example    <caption>get</caption>
     *      value = ctrl.value();
     *  @example    <caption>set</caption>
     *      ctrl.value( [] );
    ###
    value: ( val, updateGrid = true, dispatchEvent = false, eventArgs = {} ) ->
        me = this
        return me._value unless val
        me._setValue( val,true,updateGrid,dispatchEvent,eventArgs )

    ###
     *  获取或者设置选中的项
     *  @public
     *  @instance
     *  @memberof   ebaui.web.ComboList
     *  @member     {Object}        data
     *  @default    null
     *  @example    <caption>get</caption>
     *      pair = ctrl.data();
     *  @example    <caption>set</caption>
     *      ctrl.data( [{ name : value },{ name : value }] );
    ###
    data: ( val, updateGrid = true,dispatchEvent = false, eventArgs = {} ) ->
        me = this
        return me._data unless val
        me._setValue( val,false,updateGrid,dispatchEvent,eventArgs )

ebaui['web'].registerFormControl( 'ComboList',ComboList )