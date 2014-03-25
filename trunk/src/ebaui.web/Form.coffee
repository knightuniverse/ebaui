###*
*   @class      Form
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.Control
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
###
class Form extends Control
    ###*
     *  所有form表单控件类。在form控件初始化的时候，会自动加载当前DOM上下文中的这个集合内的控件到作为表单的一个字段
     *  @private
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {Array}     _formControls
    ###
    _formControls : () -> ebaui.web.formControls

    ###*
     *  所有form表单控件类。在form控件初始化的时候，会自动加载当前DOM上下文中的这个集合内的控件到作为表单的一个字段
     *  @private
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {Array}     _ctrlJQSelector
    ###
    _ctrlJQSelector: '[data-ns="web.form"]'

    ###*
     *  表单是否通过验证
     *  @private
     *  @instance
     *  @memberof ebaui.web.Form
     *  @member {Boolean}   _isValid
    ###
    _isValid  : true
    
    _readonly : null
    ###*
     *  表单是否通过验证
     *  @public
     *  @instance
     *  @default    null
     *  @memberof   ebaui.web.Form
     *  @member     {Boolean}   readonly
     *  @example    <caption>get</caption>
     *      var form        = ebaui.get('#formId');
     *      var isReadonly  = form.readonly();
     *  @example    <caption>set</caption>
     *      var form = ebaui.get('#formId');
     *      form.readonly( true );
    ###
    readonly : ( val ) ->
        me = this
        return me._readonly unless me.isBoolean( val )
    
        me._readonly = val
        me.eachField( ( field ) ->
            field['readonly']( val ) if field['readonly']
        )
        return undefined

    ###*
     *  遍历form控件内所有的表单控件
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     eachField
     *  @param      {Function}  iterator - 迭代器
     *  @example
     *      var form = ebaui.get('#formId');
     *      //  表单控件筛选条件
     *      var fitCondition = function( field ){
     *          //  some conditions to filter out form fields
     *      }; 
     *      form.eachField( function( field ){
     *          if( fitCondition( field ) ){
     *              //  设置表单控件的属性
     *              field.enabled( false );
     *              //  some other code
     *          }
     *      } );
    ###
    eachField:(iterator) ->
        fields = this.fields()
        for field in fields then iterator( field )
        return undefined

    ###*
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     _render
    ###
    _render : () -> 
        me = this
        id = me.id()
        me._$root.attr('id', id) unless me.isEmpty( id )
        me._updateCssVisible()
        
        if me._readonly isnt null
            me.eachField( ( field ) ->
                field['readonly']( me._readonly ) if field['readonly']
            )

    ###*
     *  把HTML占位符转换成为控件自身的HTML结构
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     _parseUi
     *  @param      {Object}    element HTML占位符
    ###
    _parseUi : ( element ) -> $( element )

    _setupEvents: (opts) ->
        me         = this
        $root      = me._$root
        JQSelector = me._ctrlJQSelector
        $doms      = $( JQSelector,$root )
        len        = $doms.size()

        ###
        $root.on( 'keypress',( event ) -> 
            event.preventDefault() if event.which is 13
        )
        ###

        $root.on( 'keyup',( event ) ->
            $target  = $(event.target).parents( JQSelector,$root ).eq(0)
            index    = $doms.index( $target )
            enter    = event.which is 13
            ctrl     = ebaui.get( $target )

            return unless ctrl? and ctrl.enterAsTab and ctrl.enterAsTab() and enter

            ###
            *   定位下一个控件
            ###
            nextCtrl = null
            if index + 1 is len-1
                item = ebaui.get( $doms.eq( index + 1 ) )
                itemIsFocusable = item and item.focusable and item.focusable()
                nextCtrl = item  if itemIsFocusable
            else
                for i in [index+1..len-1]
                    item = ebaui.get( $doms.eq( i ) )
                    itemIsFocusable = item and item.focusable and item.focusable()
                    if itemIsFocusable
                        nextCtrl = item
                        break

            if nextCtrl?
                ctrl.focused( false )
                nextCtrl.focused( true )
        )

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     _initControl
    ###
    _init: (opts) ->
        super( opts )
        me         = this
        ### 
        *   初始化控件自身的一系列属性  
        ###
        me._action        = opts['action'] ? ''
        me._method        = opts['method'] ? 'GET'
        me._acceptCharset = opts['acceptCharset'] ? ''
        me._enctype       = opts['enctype'] if opts['enctype']

        ###
        *   init fields
        ###
        $root      = me._$root
        JQSelector = me._ctrlJQSelector
        controls   = me._formControls()

        $doms      = $( JQSelector,$root )
        len        = $doms.size()
        formFields = []

        $doms.each(( index,el ) ->
            ctrl = ebaui.get( el );
            if ctrl and ctrl.value
                formFields.push( ctrl )
                ###
                *   设置当前控件的按下tab之后的下一个要聚焦的控件
                ###

                ###
                for j in [index + 1..len-1]
                    next = ebaui.get( $doms.eq( j ) )
                    if next and next.focusable()
                        ctrl['__nextTab__'] = next
                        break
                ###
        )

        me._fields = formFields
        ###
        *   初始化表单，是否整个表单都是readonly的
        ###
        me._readonly = opts['readonly'] ? null

    _fields:[]
    ###*
     *  获取form表单内的控件集合
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {Array}     fields
     *  @example    <caption>get</caption>
     *      // get controls of a form instance
     *      var controls = form.fields();
    ###
    fields  : () -> this._fields

    ###*
     *  获取form表单内的控件集合
     *  @public
     *  @readonly
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {Array}     elements
     *  @example    <caption>get</caption>
     *      // get controls of a form instance
     *      var controls = form.elements();
    ###
    elements:() -> this._fields

    ###*
     *  获取或者设置form表单数据，支持使用JSON字符串
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {Object}    data
     *  @tutorial   form_data
     *  @example    <caption>get</caption>
     *      // 获取form表单数据
     *      var data = form.data();
     *  @example    <caption>set</caption>
     *      // 设置form表单数据
     *      form.data({ name : 'hou',password : '123' });
    ###
    data: ( data ) ->
        me = this
        if not data
            #  get data
            formData = {}
            me.eachField( ( field ) ->
                return unless field['data']
                name           = field.name()
                data           = field.data()
                formData[name] = data
            )

            return formData

        #  set data
        formData = if me.isString( data ) then ebaui.fromJSON( data ) else data
        me.eachField( ( field ) ->
            name      = field.name()
            fieldData = formData[name]
            field.data( fieldData ) if fieldData
        )

        return undefined
    
    ###*
     *  更新表单的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     _setFormValue
    ###
    _setFormValue:( formValue )->
        me = this
        ###
        *   set value
        ###
        formValue = ebaui.fromJSON( formValue ) if me.isString( formValue )
        
        me.eachField( ( field ) ->
            name = field.name()
            val  = formValue[name]
            
            return unless val?
            ###
            *   如果控件是checkobox或者是radiobutton，当值和控件值一致的时候，选中选项
            ###
            if field['checked'] and field.value() is val
                field['checked']( true )
            else unless field['checked']
                field.value( val )
        )

        return undefined
    
    ###*
     *  获取表单的值
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     _getFormValue
    ###
    _getFormValue:()->
        me = this
        formVal = {}
        me.eachField( ( field ) ->
            return unless field['value']

            name = field.name()
            return unless name

            val = field.value()
            ###
            *   如果不是checkbox控件
            ###
            unless field['checked']
                ###
                *   如果控件的值是数组
                ###
                if me.isArray( val )
                    formVal[name] = val.join(',')
                else
                    formVal[name] = val
                return

            ###
            *   如果是checkbox控件
            ###
            if field['checked'] and field['checked']()
                formVal[name] = val
                return
        )

        return formVal

    ###*
     *  获取或者设置表单的各个控件的值
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {Object}    value
     *  @tutorial   form_data
     *  @example    <caption>get</caption>
     *      // 获取form表单数据
     *      var value = form.value();
     *  @example    <caption>set</caption>
     *      // 设置form表单数据
     *      form.value({ name : 'hou',password : '123' });
    ###
    value:( formValue ) ->
        me = this
        return me._getFormValue() unless formValue?
        me._setFormValue( formValue )

    _action:''
    ###*
     *  获取或者设置表单数据提交地址
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {String}    action
     *  @example    <caption>get</caption>
     *      var action = form.action();
     *  @example    <caption>set</caption>
     *      form.action( url );
    ###
    action:( val ) ->
        me  = this
        val = $.trim( val )
        return me._action unless val.length > 0
        me._action = val

    _method:'GET'
    ###*
     *  获取或者设置表单数据提交方法，可能的值为："GET"或者"POST"
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {String}    method
     *  @example    <caption>get</caption>
     *      var action = form.method();
     *  @example    <caption>set</caption>
     *      form.method( method );
    ###
    method : ( val ) ->
        me = this
        return me._method unless /get|post/i.test( val )
        me._method = val.toUpperCase()

    _acceptCharset:'uft-8'
    ###*
     *  <pre>
     *  服务器处理表单数据所接受的字符集。
     *  常用的字符集有：
     *      UTF-8 - Unicode 字符编码
     *      ISO-8859-1 - 拉丁字母表的字符编码
     *  </pre>
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {String}    acceptCharset
     *  @example    <caption>get</caption>
     *      var charset = form.acceptCharset();
     *  @example    <caption>set</caption>
     *      form.acceptCharset( charset );
    ###
    acceptCharset: ( val ) ->
        me = this
        val = $.trim( val )
        return me._acceptCharset unless val.length > 0
        me._acceptCharset = val

    _enctype:'application/x-www-form-urlencoded'
    ###*
     *  <pre>
     *  规定表单数据在发送到服务器之前应该如何编码
     *  常用的值有：
     *  
     *  application/x-www-form-urlencoded
     *      在发送前编码所有字符（默认
     *  multipart/form-data 
     *      不对字符编码。
     *      在使用包含文件上传控件的表单时，必须使用该值。
     *  text/plain  
     *      空格转换为 "+" 加号，但不对特殊字符编码。
     *  </pre>
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @member     {String}    enctype
     *  @example    <caption>get</caption>
     *      var enctype = form.enctype();
     *  @example    <caption>set</caption>
     *      form.enctype( MIME_type );
    ###
    enctype: ( val ) ->
        me = this
        val = $.trim( val )
        return me._enctype unless val.length > 0
        me._enctype = val

    ###*
     *  验证表单
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     validate
     *  @tutorial   form_data
     *  @return     {Boolean}
    ###
    validate: () ->
        me = this
        fields = me.fields()
        return true if fields.length is 0

        len     = fields.length
        isValid = fields[0].validate()

        if len > 1
            for field,i in fields
                isValid = ( fields[i].validate() ) and isValid

        me._isValid = isValid
        return isValid

    ###*
     *  重置表单
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     reset
     *  @tutorial   form_data
     *  @example
     *      form.reset();
    ###
    reset: () ->
        this.eachField( ( field ) -> field.reset() if field['reset'] )

    ###*
     *  提交表单
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Form
     *  @method     submit
     *  @tutorial   form_submit
     *  @param      {Object}    [settings]              -   更详细的文档，请参考{@link http://api.jquery.com/jQuery.ajax/|jQuery.ajax()}
     *  @prop       {Object}    settings.data           -   要提交到服务器的额外的数据
     *  @prop       {String}    settings.dataType       -   服务端响应的数据格式，默认是自动判断(xml, json, script, or html)
     *  @prop       {Function}  settings.success        -   表单提交成功后的回调函数
     *  @prop       {Function}  settings.error          -   表单提交失败的回调函数
     *  @prop       {Function}  settings.beforeSend     -   表单提交之前触发的回调函数
     *  @prop       {Function}  settings.complete       -   无论表单是否提交成功，总是触发这个回调函数
    ###
    submit:( settings ) ->

        me       = this
        action   = me.action()
        isGET    = me.method() is 'GET'
        toSubmit = me.value()

        #  data,dataType,success
        if settings and settings.data
            toSubmit = $.extend( toSubmit,settings.data )
            delete settings.data

        ajaxConf = $.extend({
            type: if isGET then 'GET' else 'POST'
            url : action
            data: toSubmit
        }, settings)

        $.ajax(ajaxConf)


ebaui.web.registerControl( 'Form',Form );