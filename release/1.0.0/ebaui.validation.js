/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  Email地址验证规则
     *  @public
     *  @class      EmailValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      &lt;input data-role="button" data-options="{ validators:['email'] }"/&gt;
     *      &lt;input data-role="button" data-options="{ validators:['required','email'] }"/&gt;
     */
    function EmailValidator ( params,msg ) {

        var me        = this;
        me.message    = msg || '';
        me.parameters = params || [];

    };

    EmailValidator.prototype = {

        name      : 'email',
        parameters: [],
        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'Please enter a valid email address.'
         *  @member     {String}    message
         *  @memberof   EmailValidator
         */
        message   : 'Please enter a valid email address.',
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method      validate
         *  @param      {Object}    value      -      要进行验证的值
         *  @memberof   EmailValidator
         */
        validate  : function( value ){
            return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
        }

    };

    rules['email'] = EmailValidator;

})( jQuery,ebaui['web']['validationRules'] );
/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  Required验证规则
     *  @public
     *  @class      RequiredValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      &lt;input data-role="button" data-options="{ validators:['required'] }"/&gt;
     *      &lt;input data-role="button" data-options="{ validators:['required','rng'] }"/&gt;
     */
    function RequiredValidator ( params,msg ) {
        var me        = this;
        me.message    = msg || '';
        me.parameters = params || [];
    };

    RequiredValidator.prototype = {

        name      : 'required',
        parameters: [],
        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'This field is required.'
         *  @member     {String}    message
         *  @memberof   RequiredValidator
         */
        message   : 'This field is required.',
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method      validate
         *  @param      {Object}    value      -      要进行验证的值
         *  @memberof   RequiredValidator
         */
        validate  : function( value ){

            var toString = Object.prototype.toString;
            var t = toString.call( value );

            if( t == '[object String]' || t == '[object Array]' ){
                return value.length > 0;
            }else if( t == '[object Boolean]' || value === true || value === false ){
                return true;
            }
            
            return ( value ) ? true : false;
            
        }

    };

    rules['required'] = RequiredValidator;

})( jQuery,ebaui['web']['validationRules'] );
/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  Url地址验证规则
     *  @public
     *  @class      UrlValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      &lt;input data-role="button" data-options="{ validators:['url'] }"/&gt;
     *      &lt;input data-role="button" data-options="{ validators:['required','url'] }"/&gt;
     */
    function UrlValidator ( params,msg ) {
        var me        = this;
        me.message    = msg || '';
        me.parameters = params || [];
    };

    UrlValidator.prototype = {

        name      : 'url',
        parameters: [],
        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'Please enter a valid URL.'
         *  @member     {String}    message
         *  @memberof   UrlValidator
         */
        message   : 'Please enter a valid URL.',
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method      validate
         *  @param      {Object}    value      -      要进行验证的值
         *  @memberof   UrlValidator
         */
        validate  : function( value ){
            return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
        }

    };

    rules['url'] = UrlValidator;

})( jQuery,ebaui['web']['validationRules'] );
/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  控件文本值的长度验证规则，默认规则是[0,无穷大]
     *  @public
     *  @class      LengthValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      &lt;input data-role="button" data-options="{ validators:['len[0,100]'] }"/&gt;
     *      &lt;input data-role="button" data-options="{ validators:['required','len[0,100]'] }"/&gt;
     */
    function LengthValidator ( params,msg ) {

        var me        = this;
        me.message    = msg || '';
        me.parameters = params || [];

    };

    LengthValidator.prototype = {

        name      : 'len',

        parameters: [0],

        _parameterInvalidException:'Max length must be less than min length, please set a valid validator parameters.',

        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'Please enter a value between {0} and {1}.'
         *  @member     {String}    _originalMessage
         *  @memberof   LengthValidator
         */
        _originalMessage : 'Please enter a value between {0} and {1}.',

        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'Please enter a value between {0} and {1}.'
         *  @member     {String}    message
         *  @memberof   LengthValidator
         */
        message   : 'Please enter a value between {0} and {1}.',
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method      validate
         *  @param      {Object}    value      -      要进行验证的值
         *  @memberof   LengthValidator
         */
        validate  : function( value ){
            
            var me = this;
            //  once I thought if you assign this validator, but you don't assign it's range 
            //  that means this validator is invalid itself
            if( me.parameters.length == 0 ){
                return true;
            }

            var isValid = false;
            var len     = me.parameters.length;
            var max     = 0;
            var min     = me.parameters[0];

            if( len > 1 ){
                max = me.parameters[1];
            }

            if( min > max ){
                throw me._parameterInvalidException;
            }

            if( !value ){
                isValid = false;
            }else{
                var valueStr = value.toString();

                if( len > 1 && min != max ){
                    isValid = (valueStr.length > min) && (valueStr.length < max);
                }else if( len > 1 && min == max ){
                    isValid = valueStr.length == min;
                }else{
                    isValid = (valueStr.length > min);
                }
            }

            me.message = me._originalMessage.replace('{0}',min).replace('{1}',len > 1 ? max : '' );

            return isValid;

        }

    };

    rules['len'] = LengthValidator;

})( jQuery,ebaui['web']['validationRules'] );
/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  控件值为Number类型的值范围
     *  @public
     *  @class      RangeValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      &lt;input data-role="button" data-options="{ validators:['rng'] }"/&gt;
     *      &lt;input data-role="button" data-options="{ validators:['required','rng'] }"/&gt;
     */
    function RangeValidator ( params,msg ) {
        var me              = this;
        me.message          = msg || '';
        me._originalMessage = msg || '';
        me.parameters       = params || [];
    };

    RangeValidator.prototype = {

        name      : 'rng',

        parameters: [0],

        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'Please enter a value between {0} ~ {1}.'
         *  @member     {String}    _originalMessage
         *  @memberof   RangeValidator
         */
        _originalMessage : 'Please enter a value between {0} ~ {1}.',

        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'Please enter a value between {0} ~ {1}.'
         *  @member     {String}    message
         *  @memberof   RangeValidator
         */
        message   : 'Please enter a value between {0} ~ {1}.',
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method      validate
         *  @param      {Object}    value      -      要进行验证的值
         *  @memberof   RangeValidator
         */
        validate  : function( value ){

            var me = this;
            var value = parseFloat( value );
            var isValid = false;
            var len = me.parameters.length;
            var max = 0;
            var min = me.parameters[0];

            if( len > 1 ){
                max = me.parameters[1];
            }

            //  construct message
            me.message = me._originalMessage.replace('{0}',min);
            me.message = me.message.replace('{1}',len > 1 ? max : '' );

            //  if value is not a valid number such as int or float
            //  then return false
            var isNumbericRE = /^\d+(\.\d+)?$/i;
            if( isNumbericRE.test( value.toString() ) ){
                return isValid;
            }

            //  once I thought if you assign me validator, but you don't assign it's range 
            //  that means me validator is invalid itself
            if( me.parameters.length == 0 ){
                return true;
            }

            isValid = value > min;
            if( len > 1 ){
                max = me.parameters[1];
                isValid = isValid && (value < max);
            }

            return isValid;

        }

    };

    //  register validator
    rules['rng'] = RangeValidator;

})( jQuery,ebaui['web']['validationRules'] );
/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  身份证号码验证规则
     *  @public
     *  @class      IdentityValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      &lt;input data-role="button" data-options="{ validators:['id'] }"/&gt;
     *      &lt;input data-role="button" data-options="{ validators:['required','id'] }"/&gt;
     */
    function IdentityValidator ( params,msg ) {

        var me        = this;
        me.message    = msg || '';
        me.parameters = params || [];

    };

    IdentityValidator.prototype = {

        /**
         *  用于计算身份证校验码的系数
         *  @private
         *  @instance
         *  @member         {Array}    _factors
         *  @memberof       IdentityValidator
         */
        _factors  : [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2],

        /**
         *  身份证校验码算法过程，余数对应的校验码码表
         *  @private
         *  @instance
         *  @member         {Array}    _checkcode
         *  @memberof       IdentityValidator
         */
        _checkcode: ['1','0','X','9','8','7','6','5','4','3','2'],

        name      : 'id',

        parameters: [],
        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default        'Please enter a valid id number.'
         *  @member         {String}    message
         *  @memberof       IdentityValidator
         */
        message   : 'Please enter a valid id number.',
        
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method         validate
         *  @param          {Object}    value      -      要进行验证的值
         *  @memberof       IdentityValidator
         */
        validate  : function( value ){
            
            /*  @see {http://zhidao.baidu.com/question/202372140.html|javascript 正则判断是否是身份证 正则判断是否是手机号码 正则判断是否是汉字 并且大于3小于20.}   */
            var isValid = /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/.test( value );
            if( !isValid ){ return false; }

            var idString = value.toString();
            if( idString.length == 18 ){

                /*
                 *  @see {http://baike.baidu.com/view/5112521.htm|身份证校验码}
                 *  1、将前面的身份证号码17位数分别乘以不同的系数。第i位对应的数为[2^(18-i)]mod11。从第一位到第十七位的系数分别为：7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 ；
                 *  2、将这17位数字和系数相乘的结果相加；
                 *  3、用加出来和除以11，看余数是多少？；
                 *  4、余数只可能有0 1 2 3 4 5 6 7 8 9 10这11个数字。其分别对应的最后一位身份证的号码为1 0 X 9 8 7 6 5 4 3 2；
                 *  5、通过上面得知如果余数是2，就会在身份证的第18位数字上出现罗马数字的x。如果余数是10，身份证的最后一位号码就是2；
                 */
                var mod = 0,sum = 0;
                for( var i=0;i<17;i++ ){ sum += parseInt( idString[i] ) * this._factors[i]; }
                mod = sum % 11;
                isValid = isValid && ( this._checkcode[mod] == idString[17] );

            }

            return isValid;

        }

    };

    rules['id'] = IdentityValidator;

})( jQuery,ebaui['web']['validationRules'] );
/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  Email地址验证规则
     *  @public
     *  @class      ZipValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      &lt;input data-role="button" data-options="{ validators:['zip'] }"/&gt;
     *      &lt;input data-role="button" data-options="{ validators:['required','zip'] }"/&gt;
     */
    function ZipValidator ( params,msg ) {
        var me        = this;
        me.message    = msg || '';
        me.parameters = params || [];
    };

    ZipValidator.prototype = {

        name      : 'zip',
        parameters: [],
        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'Please enter a valid postal code.'
         *  @member     {String}    message
         *  @memberof   ZipValidator
         */
        message   : 'Please enter a valid postal code.',
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method     validate
         *  @param      {Object}    value      -      要进行验证的值
         *  @memberof   ZipValidator
         */
        validate  : function( value ){

            if( !value ){ return false; }

            return /^[1-9]\d{5}$/.test( value );

        }

    };

    rules['zip'] = ZipValidator;

})( jQuery,ebaui['web']['validationRules'] );
/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  电话号码验证规则
     *  @public
     *  @class      TelephoneValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      &lt;input data-role="button" data-options="{ validators:['tel'] }"/&gt;
     *      &lt;input data-role="button" data-options="{ validators:['required','tel'] }"/&gt;
     */
    function TelephoneValidator ( params,msg ) {
        var me        = this;
        me.message    = msg || '';
        me.parameters = params || [];
    };

    TelephoneValidator.prototype = {

        name      : 'tel',
        parameters: [],
        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'Please enter a valid telephone number.'
         *  @member     {String}    message
         *  @memberof   TelephoneValidator
         */
        message   : 'Please enter a valid telephone number.',
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method     validate
         *  @param      {Object}    value      -      要进行验证的值
         *  @memberof   TelephoneValidator
         */
        validate  : function( value ){
            if( !value ){ return false; }
            /* http://www.cnblogs.com/cxy521/archive/2008/06/05/1214624.html */
            return /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test( value );
        }

    };

    rules['tel'] = TelephoneValidator;

})( jQuery,ebaui['web']['validationRules'] );
/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  只允许中文字符的验证规则
     *  @public
     *  @class      OnlyCNValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      &lt;input data-role="button" data-options="{ validators:['cn'] }"/&gt;
     *      &lt;input data-role="button" data-options="{ validators:['cn','digit'] }"/&gt;
     */
    function OnlyCNValidator ( params,msg ) {
        var me        = this;
        me.message    = msg || '';
        me.parameters = params || [];
    };

    OnlyCNValidator.prototype = {

        name      : 'cn',
        parameters: [],
        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'Please only enter Chinese characters.'
         *  @member     {String}    message
         *  @memberof   OnlyCNValidator
         */
        message   : 'Please only enter Chinese characters.',
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method     validate
         *  @param      {Object}    value      -      要进行验证的值
         *  @memberof   OnlyCNValidator
         */
        validate  : function( value ){
            if( !value ){ return false; }
            /* /[^\x00-\xff]+/ GBK中匹配 */
            /* /[\u4e00-\u9fa5]+/ UTF8中匹配 */
            return /[\u4e00-\u9fa5]+/.test( value ) || /[^\x00-\xff]+/.test( value );
        }

    };

    rules['cn'] = OnlyCNValidator;

})( jQuery,ebaui['web']['validationRules'] );
/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  只允许输入整数的验证规则
     *  @public
     *  @class      DigitValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      &lt;input data-role="button" data-options="{ validators:['digit'] }"/&gt;
     *      &lt;input data-role="button" data-options="{ validators:['cn','digit'] }"/&gt;
     */
    function DigitValidator ( params,msg ) {

        var me        = this;
        me.message    = msg || '';
        me.parameters = params || [];

    };

    DigitValidator.prototype = {

        name      : 'digit',
        parameters: [],
        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'Please only enter digit characters.'
         *  @member     {String}    message
         *  @memberof   DigitValidator
         */
        message   : 'Please only enter digit characters.',
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method     validate
         *  @param      {Object}    value      -      要进行验证的值
         *  @memberof   DigitValidator
         */
        validate  : function( value ){
            if( value == null || value == undefined ){ return false; }
            return /\d+/.test( value.toString() );
        }

    };

    rules['digit'] = DigitValidator;

})( jQuery,ebaui['web']['validationRules'] );
/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  手机号码验证规则
     *  @public
     *  @class      MobileValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      &lt;input data-role="button" data-options="{ validators:['mobi'] }"/&gt;
     *      &lt;input data-role="button" data-options="{ validators:['required','mobi'] }"/&gt;
     */
    function MobileValidator ( params,msg ) {

        var me        = this;
        me.message    = msg || '';
        me.parameters = params || [];

    };

    MobileValidator.prototype = {

        name      : 'tel',
        parameters: [],
        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    'Please enter a valid telephone number.'
         *  @member     {String}    message
         *  @memberof   MobileValidator
         */
        message   : 'Please enter a valid mobilephone number.',
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method     validate
         *  @param      {Object}    value      -      要进行验证的值
         *  @memberof   MobileValidator
         */
        validate  : function( value ){
            if( !value ){ return false; }
            /* http://www.cnblogs.com/cxy521/archive/2008/06/05/1214624.html */
            /* http://www.cnblogs.com/bluestorm/archive/2013/05/22/3092898.html */
            return /^(?:13\d|15[89]|18[019])-?\d{5}(\d{3}|\*{3})$/.test( value );
        }

    };

    rules['mobi'] = MobileValidator;

})( jQuery,ebaui['web']['validationRules'] );
/**
 *  ebaui.validators
 *  @file 
 *  @author Monkey <knightuniverse@qq.com>
 */
;;(function( $,rules ){

    /**
     *  发送请求，把控件值发送到服务端进行验证，validator的每个参数都是字符串类型，使用$作为分隔符。
     *  其中，url，pass参数以及token参数是必须指定的。
     *  url指定服务端地址
     *  ，token指定控件的值要以什么样的参数名发送到服务端。
     *  ，pass参数是一个方法，实现根据服务端返回值，判断控件值是否合法。该方法有两个参数：value serverData
     *  @public
     *  @class      RemoteValidator
     *  @param      {Array}    params     -     传递给验证器的外部参数
     *  @example
     *      function captchaPass( value,serverData ){ 
     *          if( !serverData || serverData['result'] == null || serverData['result'] == undefined ){ return false; }
     *          return parseInt( serverData['result'] ) == 1;
     *      };
     *      &lt;input data-role="button" data-options="{ validators:['remote[\'url$http://192.168.102.159:8080/cas/captcha\',\'token$verify\',\'pass$captchaPass\']'] }"/&gt;
     */
    function RemoteValidator ( params,msg ) {

        var me        = this;
        me.message    = msg || '';

        if( !params || !params.length ){
            throw me._parameterInvalidException;
        }

        me.parameters = params;
        /* 解析参数，生成_ajaxConfig */
        for (var i = 0; i < params.length; i++) {

            var ajaxConfig   = me._ajaxConfig;
            var paramItem    = params[i];
            var keyValuePair = paramItem.split('$');

            for (var j = 0,l = keyValuePair.length; j < l; j++) {

                var pair  = keyValuePair[j];
                var key   = keyValuePair[0];
                var value = keyValuePair[1];

                switch( key ){

                    case 'url':
                        ajaxConfig['url'] = value;
                        break;
                    case 'dataType':
                        ajaxConfig['dataType'] = value;
                        break;
                    case 'token':
                        me._token = value;
                        ajaxConfig['data'][value] = '';
                        break;
                    case 'pass':
                        me._pass = eval( value );
                        break;
                    default:
                        ajaxConfig['data'][key] = value;
                        break;

                }

            };

        };

    };

    RemoteValidator.prototype = {

        name      : 'remote',

        /* 请求服务端进行验证的时候，控件值对应的参数名，e.g. http://aa.com?token=value */
        _token : '',

        /* ajax请求的配置 */
        _ajaxConfig : {
            url     : '',
            async   : false,
            dataType: 'json',
            /* 要提交到服务器的参数 */
            data    : {}
        },

        _isTmpl : function( str ){ return /<%=value%>/i.test( str ); },

        _pass:function( value,serverData ){ return false; },

        _parameterInvalidException:'Please set a valid validator parameters.',

        /* [ 'url:xxxx','' ] */
        parameters: [],
        /**
         *  错误提示信息
         *  @public
         *  @instance
         *  @default    ''
         *  @member     {String}    message
         *  @memberof   RemoteValidator
         */
        message   : '',
        /**
         *  执行验证
         *  @public
         *  @instance
         *  @method     validate
         *  @param      {Object}    value      -      要进行验证的值
         *  @memberof   RemoteValidator
         */
        validate  : function( value ){

            var self     = this;
            var _isValid = false;

            var extraAjaxConfig = {

                statusCode : {
                    404 : function( serverData,textStatus,jqXHR ){ _isValid = false; }
                },

                success : function( serverData ){
                    
                    if( typeof self._pass === 'function' ){
                        _isValid = self._pass( value,serverData );
                    }else{
                        _isValid = false;
                    }

                },

                error : function( jqXHR ){ self._isValid = false; }

            };

            /* 把占位符替换成控件的值 */
            var dataToServer = self._ajaxConfig.data;
            dataToServer[self._token] = value;
            dataToServer['t'] = (new Date).getTime();

            var conf = $.extend( {},self._ajaxConfig,extraAjaxConfig );
            $.ajax( conf );
            return _isValid;

        }

    };

    rules['remote'] = RemoteValidator;

})( jQuery,ebaui['web']['validationRules'] );