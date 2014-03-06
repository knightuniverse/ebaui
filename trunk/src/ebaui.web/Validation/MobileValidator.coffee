###
 *  手机号码验证规则
 *  @public
 *  @class      MobileValidator
 *  @param      {Array}    params     -     传递给验证器的外部参数
 *  @example
 *      &lt;input data-role="button" data-options="{ validators:['mobi'] }"/&gt;
 *      &lt;input data-role="button" data-options="{ validators:['required','mobi'] }"/&gt;
 ###
class MobileValidator extends Validator
    name    : 'mobi'
    message : 'Please enter a valid mobilephone number.'
    validate: ( value ) -> /^(?:13\d|15[89]|18[019])-?\d{5}(\d{3}|\*{3})$/.test( value )

ebaui['web'].registerValidator( 'mobi',MobileValidator )