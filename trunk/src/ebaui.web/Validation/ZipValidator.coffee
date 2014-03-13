###*
 *  邮政编码验证规则
 *  @public
 *  @class      ZipValidator
 *  @memberof   ebaui.web
 *  @extends    ebaui.web.Validator
 *  @param      {Array}    params     -     传递给验证器的外部参数
 *  @example
 *      &lt;input data-role="textbox" data-options="{ validators:['zip'] }"/&gt;
 ###
class ZipValidator extends Validator
    name      : 'zip'
    message   : 'Please enter a valid postal code.'
    
    ###*
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.ZipValidator
     ###
    validate  : ( value ) -> /^[1-9]\d{5}$/.test( value )

ebaui['web'].registerValidator( 'zip',ZipValidator )