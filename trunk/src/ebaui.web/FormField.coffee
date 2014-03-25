###*
*   Today's browsers define focus() on HTMLElement, but an element won't actually take focus unless it's one of:
*   
*       1.  HTMLAnchorElement/HTMLAreaElement with an href
*       2.  HTMLInputElement/HTMLSelectElement/HTMLTextAreaElement/HTMLButtonElement but not with disabled (IE actually gives you an error if you try), 
*           and file uploads have unusual behaviour for security reasons
*       3.  HTMLIFrameElement (though focusing it doesn't do anything useful). Other embedding elements also, maybe, I haven't tested them all.
*       4.  Any element with a tabindex
*
*   see { http://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus }
*   
*   @class      FormField
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.Control
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
###
class FormField extends Control
    ###*
     *  控件当前验证状态
     *  @private
     *  @instance
     *  @default    ebaui.web.validationStates.none
     *  @memberof   ebaui.web.FormField
     *  @member     {Number}    _currentStatus
     ###
    _currentStatus:0

    ###*
     *  控件验证状态
     *  @private
     *  @instance
     *  @virtual
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}    _validationStatus
     ###
    _validationStatus :
        none   : 0
        ### 验证成功 ###
        success: 1
        ### 提醒 ###
        info   : 2
        ### 错误 ###
        error  : 3
        ### 警告 ###
        warning: 4
        ### 忙碌 ###
        busy   : 5

    ###*
     *  
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _updateCssReadonly
     ###
    _updateCssReadonly : $.noop

    ###*
     *  控件在所处的各个不同得validationState下对应的UI的CSS样式类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}    _statusCls
     ###
    _statusCls : ['','eba-success','eba-light','eba-error','eba-warning','eba-loading']

    ###*
     *  控件在所处的各个不同得validationState下对应的UI的icon类
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}    _statusIcon
     ###
    _statusIcon :
        'eba-success': 'icon-ok'
        'eba-light'  : 'icon-lightbulb'
        'eba-error'  : 'icon-remove-circle'
        'eba-warning': 'icon-warning-sign'
        'eba-loading': 'icon-spinner icon-spin'

    _init:( opts )-> 
        super( opts )
        me                   = this
        ### 
        *   其实我本人非常不愿意这么做，
        *   但是老大强烈要求控件的属性必须是absolute
        *   他想要依赖手工去指定控件的位置 ，
        *   而不愿意相信CSS就能搞定这个问题
        *   我个人是认为应该有一套CSS框架
        *   排版布局，通过这CSS框架去做，比如CSS框架提供一个grid系统
        *   利用这个grid系统去布局表单
        ###
        me._position         = opts['position'] ? 'absolute'
        ### 
        *   _error是一个验证失败的信息集合，
        *   这个对象的每一个属性对应一个validator，
        *   属性值则是validator验证失败时的提示信息
        ###
        me._error            = {}
        ### 
        *   初始化控件的value 
        ###
        me._value            = opts['value'] if opts['value']?
        me._readonly         = opts['readonly'] if opts['readonly']?
        me._enterAsTab       = opts['enterAsTab'] ? false
        me._validateOnChange = opts['validateOnChange'] ? false
        ### 
        *   初始化设置控件的validators 
        ###
        me._validators       = me._parseValidators( opts['validators'] )

        return undefined
        
    ###*
     *  将控件配置的验证规则，转化为相应的Javascript Validator对象
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _parseValidator
     ###
    _parseValidator : ( rule ) ->
        return null unless rule?

        result      = /([a-z_]+)(.*)/i.exec( rule )
        name        = result[1]
        param       = eval(result[2])
        ns          = ebaui['web']
        constructor = ns['validation'][name]
        
        return null unless constructor?

        validator = new constructor( param )

        return validator

    ###*
     *  将控件配置的验证规则，转化为相应的Javascript Validator对象
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _parseValidators
     ###
    _parseValidators : ( rules ) ->
        me = this
        return [] if not rules? or rules.length is 0

        returnValue = []
        for rule, i in rules
            validator = me._parseValidator( rule )
            if validator then returnValue.push( validator )

        return returnValue

    ###*
     *  显示控件的各个验证状态样式
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _doRenderStyleTip
     ###
    _doRenderStyleTip:( rootCls,tips ) ->
        me        = this
        tips      = tips ? ''
        $root     = me.uiElement()
        iconCls   = me._statusIcon[rootCls]
        $border   = $( '[class*="border"]',$root )
        #$icon     = $border.next('i[class^="icon"]')
        $icon     = $root.find('i[class^="icon"]')
        
        #  remove old validation class
        status    = me._validationStatus
        statusCls = me._statusCls

        for item of status
            $root.removeClass( statusCls[status[item]] )

        unless $root.hasClass( rootCls )
            $root.addClass( rootCls )

        if $icon.size() is 0
            #$border.after( """<i class='#{iconCls}' title='#{tips}'></i>""" )
            $root.append( """<i class='#{iconCls}' title='#{tips}'></i>""" )
        else
            $icon.attr(
                'class' : iconCls
                'title' : tips
            )

        return undefined

    ###*
     *  清除控件验证状态信息
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _resetStatus
     *  @param      {String}  tips          - tooltips消息
     ###
    _resetStatus:() -> 

        me      = this
        $root   = me._$root
        $border = $( '[class*="border"]',$root )
        $icon   = $border.next('i[class^="icon"]')
        cls     = me._statusCls

        for rootCls,i in cls
            if rootCls then $root.removeClass(rootCls)

        if $icon.size() > 0 then $icon.remove()

        return undefined

    ###*
     *  显示控件验证状态以及相应得消息
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _renderStyleTips
     *  @param      {Number}  state         - 控件验证状态
     *  @param      {String}  tips          - tooltips消息
     ###
    _renderStyleTips:( currentStatus,tips ) ->
        me        = this
        rootCls   = ''
        statusCls = me._statusCls
        status    = me._validationStatus

        switch currentStatus
            when status.success,status.info,status.error,status.warning,status.busy
                rootCls = statusCls[currentStatus]

        if not rootCls
            me._resetStatus( tips )
            return

        me._doRenderStyleTip( rootCls,tips )

    ###*
     *  更新验证后的样式信息
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _updateStyleValidationResult
     ###
    _updateStyleValidationResult:() ->
        me = this
        if me.isValid() then me.success( '' ) else me.error( me._getErrorMessage() )
        return undefined

    ###*
     *  更新表单控件中input的name属性
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _updateAttrName
     ###
    _updateAttrName:() ->
        me = this
        name = me.name()
        me._$formInput.attr( 'name',name ) if me._$formInput and name

    ###*
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _render
     ###
    _render: () ->
        super()
        me = this
        me._updateCssReadonly()
        me._updateAttrName()

    ###*
     *  重置控件，清空验证状态，控件值，恢复到控件原始状态
     *  @public
     *  @virtual
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     reset
     ###
    reset:() ->
        me          = this
        me._value   = null
        me._data    = null
        me._isValid = true
        me._error   = {}
        ### refresh ui ###
        me._render()

    ###*
     *  获取或者设置控件验证状态信息
     *  @public
     *  @instance
     *  @default    ebaui.web.validationStates.none
     *  @memberof   ebaui.web.FormField
     *  @method     tips
     *  @param      {Number}    state         - 控件验证状态
     *  @param      {String}    tips          - tooltips消息
     *  @example    <caption>get</caption>
     *       0,1,2,3,4
     *      详细的枚举值请查看ebaui.web.validationStates
     *      console.log( ctrl.tips() );
     *  @example    <caption>set</caption>
     *      设置info样式
     *      states = ebaui.web.validationStates;
     *      ctrl.tips( states.info,'info' )
     *      
     *      清除tips以及其样式
     *      states = ebaui.web.validationStates;
     *      ctrl.tips( states.none )
     ###
    tips:(status,tips = '') ->
        me = this;
        unless me.isNumber( status )
            return me._currentStatus
        
        if( status in [0..5] )
            me._currentStatus = status
            me._renderStyleTips( status,tips )

        return undefined

    ###*
     *  清除所有状态以及状态信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     clearTips
     *  @example
     *      ctrl.clearTips()
     ###
    clearTips:() -> @tips( @_validationStatus.none )

    ###*
     *  设置控件验证成功状态以及信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     success
     *  @param      {String}    tips          - tooltips消息
     *  @example
     *      ctrl.success( 'info' )
     ###
    success:( tips = '' ) -> @tips( @_validationStatus.success,tips )

    ###*
     *  设置控件提醒状态以及提醒信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     info
     *  @param      {String}    tips          - tooltips消息
     *  @example
     *      ctrl.info('info' )
     ###
    info:( tips = '' ) -> @tips( @_validationStatus.info,tips )

    ###*
     *  设置控件警告状态以及警告信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     warning
     *  @param      {String}    tips          - tooltips消息
     *  @example
     *      ctrl.warning( 'info' )
     ###
    warning: ( tips = '' ) -> @tips( @_validationStatus.warning,tips )

    ###*
     *  设置控件验证错误状态以及错误信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     error
     *  @param      {String}    tips          - tooltips消息
     *  @example
     *      ctrl.error( 'info' )
     ###
    error:( tips = '' ) -> @tips( @_validationStatus.error,tips )

    ###*
     *  设置当前控件的状态为忙碌，在控件后面添加一个菊花转
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     busy
     *  @param      {String}    tips          - tooltips消息
     *  @example
     *      ctrl.busy( 'i am busy now' )
     ###
    busy:( tips = '' ) -> @tips( @_validationStatus.busy,tips )

    ###*
     *  errorMessage是一个验证失败的信息集合，这个对象的每一个属性对应一个validator，属性值则是validator验证失败时的提示信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}    errorMessage
     *  @example
     *      var error = ctrl.errorMessage()
     ###
    errorMessage:() -> @._error

    ###*
     *  errorTips是一个验证失败的信息集合，这个对象的每一个属性对应一个validator，属性值则是validator验证失败时的提示信息
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}    errorTips
     *  @example
     *      var error = ctrl.errorTips()
     ###
    errorTips:() -> @._error
    
    ###*
     *  获取控件验证完成之后产生的错误信息字符串
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _join
     *  @arg        {Object}    error   -   错误hash表
     *  @returns    {String}
     *  @example    
     *      tips = ctrl._join( {} );
     ###
    _join:( error ) ->
        msg = []
        for key,value of error then msg.push( value )
        return msg.join("<br />")

    _validateOnChange : false
    ###*
     *  是否在控件的值发生改变的时候就触发验证
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Boolean}     validateOnChange
     *  @default    false
     *  @example    <caption>get</caption>
     *      console.log( ctrl.validateOnChange() );
     *  @example    <caption>set</caption>
     *      ctrl.validateOnChange( true );
     ###
    validateOnChange:( val ) ->
        me = this
        return me._validateOnChange unless me.isBoolean( val )
        me._validateOnChange = val
        return undefined

    _validators:[]
    ###*
     *  表单控件验证规则
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.FormField
     *  @member     {Array}     validators
     *  @example
     *      [
     *          { name : 'required',parameters : {},message : '',validate : function( value,parameters ){} }
     *      ]
     *      console.log( ctrl.validators );
     ###
    validators: () -> this._validators

    ###*
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     _indexOf
     *  @param      {String}        rule
     ###
    _indexOf: ( rule ) ->
        return -1 unless rule

        me         = this
        index      = -1
        validators = me._validators
        for validator,i in validators
            if validator['name'] is rule
                index = i
                break

        return index

    ###*
     *  判断指定的验证规则是否已经存在
     *  ，合法的rule参数应该是cn,digit,email等
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     hasValidator
     *  @param      {String}        rule
     ###
    hasValidator : ( rule ) -> this._indexOf( rule ) > -1

    ###*
     *  添加新的验证规则
     *  ，合法的rule参数应该是cn,digit,email等
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     addValidator
     *  @param      {String|Validator}        rule
     ###
    addValidator : ( rule ) -> 
        return unless rule

        me        = this
        if me.isString( rule )
            validator = me._parseValidator( rule )
            ### we do not have me kind of validator OR validator already exist, then return ###
            return if not validator or me.hasValidator( validator['name'] )
        else if rule instanceof Validator
            me._validators.push( rule ) unless me.hasValidator( validator['name'] )

        return undefined

    ###*
     *  移除一条表单验证规则
     *  ，合法的rule参数应该是cn,digit,email等
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     removeValidator
     *  @param      {String}        rule
     ###
    removeValidator : ( rule ) ->
        me    = this
        index = me._indexOf( rule )
        me._validators.splice( index,1 ) unless index is -1

    _data : null
    ###*
     *  获取或者设置控件数据
     *  @public
     *  @instance
     *  @virtual
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}        data
     ###
    data: $.noop

    _value: null
    ###*
     *  获取或者设置控件值
     *  @public
     *  @instance
     *  @virtual
     *  @memberof   ebaui.web.FormField
     *  @member     {Object}        value
     ###
    value: $.noop

    _enterAsTab : false
    ###*
     *  获取或者设置表单控件是否允许按下enter键的时候，聚焦到下一个控件
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Button
     *  @member     {Boolean}   enterAsTab
     *  @default    false
     *  @example    <caption>get</caption>
     *      var enterAsTab = ctrl.enterAsTab();
     *  @example    <caption>set</caption>
     *      ctrl.enterAsTab( true );
     ###
    enterAsTab:( val ) -> 
        me = this;
        return me._enterAsTab unless me.isBoolean( val )
        me._enterAsTab = val
        return undefined

    _readonly:false
    ###*
     *  获取或者设置表单控件是否只读
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @member     {Boolean}   readonly
     *  @default    false
     *  @example    <caption>get</caption>
     *      readonly = ctrl.readonly();
     *  @example    <caption>set</caption>
     *      ctrl.readonly( true );
     *      ctrl.readonly( false );
     ###
    readonly  : ( val ) ->
        me = this
        return me._readonly unless me.isBoolean( val )
        me._readonly = val
        me._updateCssReadonly()
        return undefined

    _isValid : true
    ###*
     *  获取控件值是否已经通过验证
     *  @public
     *  @instance
     *  @readonly
     *  @memberof   ebaui.web.FormField
     *  @default    true
     *  @member     {Boolean}   isValid
     *  @example    <caption>get</caption>
     *      //  isValid == true
     *      isValid = ctrl.isValid();
     ###
    isValid : () -> this._isValid

    ###*
     *  验证控件，返回控件值的验证结果
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FormField
     *  @method     validate
     *  @returns    {Boolean}
     ###
    validate : () ->
        me         = this
        validators = me.validators()
        return true if validators.length is 0
        ### display busy status ###
        me.busy()
        ### starting validation ###
        errorMsg = me._error
        value    = me.value()
        first    = validators[0]
        isValid  = first.validate( value,first.parameters )

        unless isValid
            errorMsg[first.name] = first.message

        for validator, i in validators
            isValid = isValid and validator.validate( value,validator.parameters )
            unless isValid
                errorMsg[validator.name] = validator.message

        ### 控件所有验证规则的验证结果 ###
        me._isValid = isValid
        ### 更新控件的错误提示样式 ###
        if isValid
            me.success( '' )
        else
            me.error( me._join( errorMsg ) )
            
        return isValid