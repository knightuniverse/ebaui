class OnlyCnValidator extends Validator
    name      : 'cn'
    ###
     *  错误提示信息
     *  @public
     *  @instance
     *  @default    'Please only enter Chinese characters.'
     *  @member     {String}    message
     *  @memberof   OnlyCNValidator
     ###
    message   : 'Please only enter Chinese characters.'
    ###
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   OnlyCnValidator
     ###
    validate: ( value ) ->
        ### 
        *   /[^\x00-\xff]+/ GBK中匹配 
        *   /[\u4e00-\u9fa5]+/ UTF8中匹配
        ###
        return /[\u4e00-\u9fa5]+/.test( value ) or /[^\x00-\xff]+/.test( value )

ebaui['web'].registerValidator( 'cn',OnlyCnValidator )