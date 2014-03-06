###
 *  控件文本值的长度验证规则，默认规则是[0,无穷大]
 *  @public
 *  @class      LengthValidator
 *  @param      {Array}    params     -     传递给验证器的外部参数
 *  @example
 *      &lt;input data-role="button" data-options="{ validators:['len[0,100]'] }"/&gt;
 *      &lt;input data-role="button" data-options="{ validators:['required','len[0,100]'] }"/&gt;
 ###
class LengthValidator extends Validator
    name      : 'len'
    _parameterInvalidException:'Max length must be less than min length, please set a valid validator parameters.'
    ###
     *  错误提示信息
     *  @public
     *  @instance
     *  @default    'Please enter a value between {0} and {1}.'
     *  @member     {String}    message
     *  @memberof   LengthValidator
     ###
    _message  : 'Please enter a value between {0} and {1}.'
    message   : 'Please enter a value between {0} and {1}.'
    validate: ( value ) ->

        return false unless value

        me = this
        ###
        *   once I thought if you assign this validator, 
        *   but you don't assign it's range 
        *   that means this validator is invalid itself
        ###
        return true if me.parameters.length is 0

        isValid = false
        len     = me.parameters.length
        min     = me.parameters[0]
        max     = if len > 1 then me.parameters[1] else 0

        throw me._parameterInvalidException if min > max

        value = value.toString()
        if len > 1 and min != max
            isValid = ( (value.length > min) and (value.length < max) )
        else if len > 1 and min == max 
            isValid = (value.length == min)
        else 
            isValid = (value.length > min)

        me.message = me._message.replace('{0}',min)
                                .replace('{1}', if len > 1 then max else '' )
        return isValid

ebaui['web'].registerValidator( 'len',LengthValidator )