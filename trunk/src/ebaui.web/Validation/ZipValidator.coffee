###
 *  邮政编码验证规则
 *  @public
 *  @class      ZipValidator
 *  @param      {Array}    params     -     传递给验证器的外部参数
 *  @example
 *      &lt;input data-role="button" data-options="{ validators:['zip'] }"/&gt;
 *      &lt;input data-role="button" data-options="{ validators:['required','zip'] }"/&gt;
 ###
class ZipValidator extends Validator
    name      : 'zip'
    message   : 'Please enter a valid postal code.'
    validate  : ( value ) -> /^[1-9]\d{5}$/.test( value )

ebaui['web'].registerValidator( 'zip',ZipValidator )