###
 *  Required验证规则
 *  @public
 *  @class      RequiredValidator
 *  @param      {Array}    params     -     传递给验证器的外部参数
 *  @example
 *      &lt;input data-role="button" data-options="{ validators:['required'] }"/&gt;
 *      &lt;input data-role="button" data-options="{ validators:['required','rng'] }"/&gt;
 ###
class RequiredValidator extends Validator
    name      : 'required'
    message   : 'This field is required.'
    validate  : ( value ) ->

        toString = Object.prototype.toString
        t = toString.call( value )
        
        return value.length > 0 if t is '[object String]' or t is '[object Array]'
        return true if t is '[object Boolean]' or value is true or value is false 
        return if value then true else false

ebaui['web'].registerValidator( 'required',RequiredValidator )