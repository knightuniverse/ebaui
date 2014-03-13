###*
 *  电话号码验证规则
 *  @public
 *  @class      TelephoneValidator
 *  @memberof   ebaui.web
 *  @extends    ebaui.web.Validator
 *  @param      {Array}    params     -     传递给验证器的外部参数
 *  @example
 *      &lt;input data-role="textbox" data-options="{ validators:['tel'] }"/&gt;
 ###
class TelephoneValidator extends Validator
    name      : 'tel'
    message   : 'Please enter a valid telephone number.'
    
    ###*
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.TelephoneValidator
     ###
    validate  : ( value ) -> /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test( value )

ebaui['web'].registerValidator( 'tel',TelephoneValidator )