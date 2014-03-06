class Captcha extends TextBox
    ###
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @method     _setupEvents
     ###
    _setupEvents: ( opts ) ->
        super( opts )
        me    = this
        $root = me._$root
        $root.on( 'click','[data-role="btn-reload"]',( event ) -> me.refresh() )

    ###
     *  数据源格式错误
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @member     {String}    _dataSourceInvalidException
     ###
    _serverDataInvalidException:'captcha code server response is invalid!!'

    ###
     *  数据源格式错误
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @member     {String}    _dataSourceInvalidException
     ###
    _dataSourceInvalidException:'the dataSource format is invalid, only remote dataSource supported!'

    ###
     *  加载验证码图片以及图片的字符串
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @method     _loadCaptcha
     ###
    _loadCaptcha:() ->
        me         = this
        dataSource = me.dataSource()
        isRemote   = me.isUsingRemoteData( dataSource )

        throw me._dataSourceInvalidException unless isRemote

        url      = dataSource.url
        postData = {}
        if me.isFunc( dataSource.data )
            postData = dataSource.data()
        else
            $.extend(postData, dataSource.data)

        now = ( new Date ).getTime()
        rnd = parseInt( Math.random() * 1000 )
        postData['t'] = '{0}_{1}'.replace( '{0}',now ).replace( '{1}',rnd )

        url += '?' + $.param( postData )
        me._$codeImg.attr( 'src',url )

    ###
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @method     _initControl
     ###
    _init: ( opts ) ->
        super( opts )
        ### 初始化控件自身的一系列属性 ###
        me                   = this
        config               = 'validationUrl'
        me._width            = opts['width'] ? 250
        me._height           = opts['height'] ? 21
        me._validateOnServer = opts['validateOnServer'] ? true
        ### 
        *   init validation url, by defualts, it is the same with dataSource 
        ###
        me._validationUrl    = opts[config] ? ''
        me._queryKey         = opts['queryKey'] ? 'verify'
        me._dataSource       = opts['dataSource'] ? ''
        ### 
        *   dom
        ###
        me._$codeImg         = $( '.eba-code-img',me._$root )
        me._$btnReload       = me._$codeImg.parent()

        ###
         *  if validateOnServer and you did not config remote validation rule 
         *  then add remote validation rule automatically
         ###
        me._configRemoteValidator( me._validateOnServer )

        ### load captcha code image from remote server ###
        me._loadCaptcha()

    ###
     *  刷新验证码
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @method     refresh
     *  @example
     *      ctrl.refresh();
     ###
    refresh:() -> this._loadCaptcha()

    _dataSource:''
    ###
     *  远程数据源
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @member     {Object}                dataSource
     *  @property   {String}                dataSource.url          - 服务端URL
     *  @property   {Object|Function}       dataSource.data         - 向服务器发起AJAX请求的时候，要发送给服务器的URL参数
     *  @example    <caption>get</caption>
     *      var src = ctrl.dataSource();
     *  @example    <caption>set</caption>
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
    dataSource: ( val ) ->
        me = this
        return me._dataSource unless val?
        me._dataSource = val

    ###
     *  初始化服务端验证
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @method     _configRemoteValidator
     ###
    _configRemoteValidator:( validateOnServer ) ->
        me = this
        ###
        *   init remote validator
        ###
        if validateOnServer and not me.hasValidator('remote')

            captchaPass = ( value, serverData ) ->
                            return false unless serverData
                            return false unless serverData['result']?
                            return parseInt( serverData['result'] ) == 1

            validatorConfig = 
                url  : me.validationUrl()
                token: me.queryKey()
                pass : captchaPass

            me._validators.push( new RemoteValidator( validatorConfig ) )
            
            return undefined

        me.removeValidator( 'remote' ) unless validateOnServer

    _validateOnServer:true
    ###
     *  开启服务端验证
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @member     {Boolean}                validateOnServer
     *  @default    false
     *  @example    <caption>get</caption>
     *      var src = ctrl.validateOnServer();
     *  @example    <caption>set</caption>
     *      ctrl.validateOnServer( true );
     ###
    validateOnServer:( val ) ->
        me = this
        return me._validateOnServer unless me.isBoolean( val )
        me._validateOnServer = val
        me._configRemoteValidator( val )

    _validationUrl:''
    ###
     *  验证码的服务端验证地址，默认和dataSource里面配置的url一样
     *  @public
     *  @instance
     *  @memberof   ebaui.web.Captcha
     *  @member     {String}                validationUrl
     *  @example    <caption>get</caption>
     *      var src = ctrl.validationUrl();
     *  @example    <caption>set</caption>
     *      ctrl.validationUrl( 'http:#' );
     ###
    validationUrl:( val )  ->
        me = this
        re = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        return me._validationUrl unless re.test( val )
        me._validationUrl = val

    _queryKey:'verify'
    ###
     *  控件进行验证的时候，要提交到验证服务器的url query parameter key
     *  @public
     *  @instance
     *  @default    'verify'
     *  @memberof   ebaui.web.Captcha
     *  @member     {String}                queryKey
     *  @example    <caption>get</caption>
     *      var src = ctrl.queryKey();
     *  @example    <caption>set</caption>
     *      ctrl.queryKey( '' );
     ###
    queryKey:( val ) ->
        me = this
        return me._queryKey unless not me.isEmpty( val )
        me._queryKey = val

ebaui.web.registerFormControl( 'Captcha',Captcha)
