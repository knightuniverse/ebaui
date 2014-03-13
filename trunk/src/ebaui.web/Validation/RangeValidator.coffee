###*
 *  控件值为Number类型的值范围
 *  @public
 *  @class      RangeValidator
 *  @memberof   ebaui.web
 *  @extends    ebaui.web.Validator
 *  @param      {Array}    params     -     传递给验证器的外部参数
 *  @example
 *      &lt;input data-role="textbox" data-options="{ validators:['rng'] }"/&gt;
 ###
class RangeValidator extends Validator
    name      : 'rng'
    _message  : 'Please enter a value between {0} ~ {1}.'
    message   : 'Please enter a value between {0} ~ {1}.'
    
    ###*
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.RangeValidator
     ###
    validate  : ( value ) -> 
        me      = this
        value   = parseFloat( value )
        isValid = false
        len     = me.parameters.length
        min     = me.parameters[0]
        max     = if len > 1 then me.parameters[1] else 0
        _msg    = me._message
        #   construct message
        me.message = _msg.replace('{0}',min)
                         .replace('{1}', if len > 1 then max else '' )

        #   if value is not a valid number such as int or float
        #   then return false
        return false unless /^\d+(\.\d+)?$/i.test( value.toString() )

        #   once I thought if you assign me validator, but you don't assign it's range 
        #   that means me validator is invalid itself
        return true if me.parameters.length is 0

        isValid = value > min
        if len > 1
            max     = me.parameters[1]
            isValid = isValid and (value < max)

        return isValid

ebaui['web'].registerValidator( 'rng',RangeValidator )