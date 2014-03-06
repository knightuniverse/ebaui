###
 *  发送请求，把控件值发送到服务端进行验证，validator的每个参数都是字符串类型，使用$作为分隔符。
 *  其中，url，pass参数以及token参数是必须指定的。
 *  url指定服务端地址
 *  ，token指定控件的值要以什么样的参数名发送到服务端。
 *  ，pass参数是一个方法，实现根据服务端返回值，判断控件值是否合法。该方法有两个参数：value serverData
 *  @public
 *  @class      RemoteValidator
 *  @param      {Array}    params     -     传递给验证器的外部参数
 *  @example
 *      function captchaPass( value,serverData ){ 
 *          if( !serverData || serverData['result'] == null || serverData['result'] == undefined ){ return false; }
 *          return parseInt( serverData['result'] ) == 1;
 *      };
 *      &lt;input data-role="button" data-options="{ validators:['remote[\'url$http://192.168.102.159:8080/cas/captcha\',\'token$verify\',\'pass$captchaPass\']'] }"/&gt;
 ###
class RemoteValidator extends Validator
    constructor:( params,msg ) ->
        me         = this
        me.message = msg ? ''
        throw me._parameterInvalidException unless params

        ### 解析参数，生成_ajaxConfig ###
        me.parameters = params
        ###
        *   $.type
        *
        *   Returns the sort of types we'd expect:
        *   type("")         # "string"
        *   type(new String) # "string"
        *   type([])         # "array"
        *   type(/\d/)       # "regexp"
        *   type(new Date)   # "date"
        *   type(true)       # "boolean"
        *   type(null)       # "null"
        *   type({})         # "object"
        ###
        paramsType = $.type( params )
        if paramsType is 'array'
            me._initFromParamsStr( params )
        else
            me._initFromParamsObj( params )

    name      : 'remote'

    ### 
    *   请求服务端进行验证的时候，
    *   控件值对应的参数名，e.g. http://aa.com?token=value 
    ###
    _token : ''

    _ajaxConfig:
        url     : ''
        async   : false
        dataType: 'json'
        ### 要提交到服务器的参数 ###
        data    : {}

    _isTmpl:( str ) -> /<%=value%>/i.test( str )

    _pass:( value,serverData ) -> false

    _parameterInvalidException:'Please set a valid validator parameters.'

    message:''

    _initFromParamsStr: ( params ) -> 
        me = this
        ajaxConfig   = me._ajaxConfig
        ### 
        *   解析参数，生成_ajaxConfig
        ###
        for paramItem, i in params
            keyValuePair = paramItem.split('$')

            for pair, j in keyValuePair
                pair  = keyValuePair[j]
                key   = keyValuePair[0]
                value = keyValuePair[1]

                switch key 
                    when 'url'      then ajaxConfig['url'] = value
                    when 'dataType' then ajaxConfig['dataType'] = value
                    when 'token' 
                        me._token = value
                        ajaxConfig['data'][value] = ''
                    when 'pass'     then me._pass = eval( value )
                    else
                        ajaxConfig['data'][key] = value

    _initFromParamsObj: ( params ) -> 
        me = this
        ajaxConfig   = me._ajaxConfig
        ### 
        *   解析参数，生成_ajaxConfig 
        ###
        for key,value of params
            switch key 
                when 'url'      then ajaxConfig['url'] = value
                when 'dataType' then ajaxConfig['dataType'] = value
                when 'token' 
                    me._token = value
                    ajaxConfig['data'][value] = ''
                when 'pass'     then me._pass = eval( value )
                else
                    ajaxConfig['data'][key] = value

    validate: ( value ) ->
        me       = this
        _isValid = false

        extraAjaxConfig = 
            statusCode : 
                404 : ( serverData,textStatus,jqXHR ) -> _isValid = false

            success : ( serverData ) ->
                
                isFunc = (typeof me._pass is 'function')
                _isValid = if isFunc then me._pass( value,serverData ) else false

            error : ( jqXHR ) -> me._isValid = false

        ### 把占位符替换成控件的值 ###
        data              = me._ajaxConfig.data
        data[me._token] = value
        data['t']         = (new Date).getTime()

        conf = $.extend( {},me._ajaxConfig,extraAjaxConfig )
        $.ajax( conf )

        return _isValid

ebaui['web'].registerValidator( 'remote',RemoteValidator )