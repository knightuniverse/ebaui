###*
*   @class      DigitValidator
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.Validator
*   @author     monkey      <knightuniverse@qq.com>
*   @example
*      &lt;input data-role="textbox" data-options="{ validators:['digit'] }"/&gt;
###
class DigitValidator extends Validator
    name      : 'digit'
    ###*
     *  错误提示信息
     *  @public
     *  @instance
     *  @default    'Please only enter digit characters.'
     *  @member     {String}    message
     *  @memberof   DigitValidator
     ###
    message   : 'Please only enter digit characters.'
    ###*
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @param      {Object}    value      -      要进行验证的值
     *  @memberof   ebaui.web.DigitValidator
     ###
    validate: ( value ) -> /\d+/.test( value )

ebaui['web'].registerValidator( 'digit',DigitValidator )