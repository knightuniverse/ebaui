###*
 *  手机号码验证规则
 *  @public
 *  @class      MobileValidator
 *  @memberof   ebaui.web
 *  @extends    ebaui.web.Validator
 *  @param      {Array}    params     -     传递给验证器的外部参数
 *  @example
 *      &lt;input data-role="textbox" data-options="{ validators:['required'] }"/&gt;
 ###
class MobileValidator extends Validator
    name    : 'mobi'
    message : 'Please enter a valid mobilephone number.'
    ###*
     *  执行验证
     *  @public
     *  @instance
     *  @method         validate
     *  @param          {Object}    value      -      要进行验证的值
     *  @memberof       ebaui.web.MobileValidator
     ###
    validate: ( value ) -> /^(?:13\d|15[89]|18[019])-?\d{5}(\d{3}|\*{3})$/.test( value )

ebaui['web'].registerValidator( 'mobi',MobileValidator )