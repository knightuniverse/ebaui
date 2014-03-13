###*
*   @class      Validator
*   @classdesc
*   @memberof   ebaui.web
*   @author     monkey      <knightuniverse@qq.com>
###
class Validator
    ###*
     *  构造函数
     ###
    constructor:( params,msg ) ->
        me            = this
        me.message    = msg ? ''
        me.parameters = params ? []

    ###*
     *  validator验证的时候的参数
     ###
    parameters: []

    ###*
     *  执行验证
     *  @public
     *  @instance
     *  @method     validate
     *  @memberof   ebaui.web.Validator
     *  @param      {Object}    value      -      要进行验证的值
    ###
    validate:( value ) ->