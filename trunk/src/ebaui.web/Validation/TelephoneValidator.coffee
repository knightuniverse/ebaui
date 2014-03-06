###
 *  电话号码验证规则
 *  @public
 *  @class      TelephoneValidator
 *  @param      {Array}    params     -     传递给验证器的外部参数
 *  @example
 *      &lt;input data-role="button" data-options="{ validators:['tel'] }"/&gt;
 *      &lt;input data-role="button" data-options="{ validators:['required','tel'] }"/&gt;
 ###
class TelephoneValidator extends Validator
    name      : 'tel'
    message   : 'Please enter a valid telephone number.'
    validate  : ( value ) -> /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test( value )

ebaui['web'].registerValidator( 'tel',TelephoneValidator )