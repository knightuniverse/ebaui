class IdentityValidator extends Validator
    ###
     *  用于计算身份证校验码的系数
     *  @private
     *  @instance
     *  @member         {Array}    _factors
     *  @memberof       IdentityValidator
     ###
    _factors  : [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2],

    ###
     *  身份证校验码算法过程，余数对应的校验码码表
     *  @private
     *  @instance
     *  @member         {Array}    _checkcode
     *  @memberof       IdentityValidator
     ###
    _checkcode: ['1','0','X','9','8','7','6','5','4','3','2'],

    name      : 'id',

    parameters: [],
    ###
     *  错误提示信息
     *  @public
     *  @instance
     *  @default        'Please enter a valid id number.'
     *  @member         {String}    message
     *  @memberof       IdentityValidator
     ###
    message   : 'Please enter a valid id number.',
    
    ###
     *  执行验证
     *  @public
     *  @instance
     *  @method         validate
     *  @param          {Object}    value      -      要进行验证的值
     *  @memberof       IdentityValidator
     ###
    validate  : ( value ) ->
        
        ###  
        *   @see {http://zhidao.baidu.com/question/202372140.html|javascript 正则判断是否是身份证 正则判断是否是手机号码 正则判断是否是汉字 并且大于3小于20.}
        ###
        isValid = /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/.test( value );
        return false unless isValid

        idString = value.toString();
        if idString.length is 18
            me = this
            ###
             *  @see {http://baike.baidu.com/view/5112521.htm|身份证校验码}
             *  1、将前面的身份证号码17位数分别乘以不同的系数。第i位对应的数为[2^(18-i)]mod11。从第一位到第十七位的系数分别为：7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 ；
             *  2、将这17位数字和系数相乘的结果相加；
             *  3、用加出来和除以11，看余数是多少？；
             *  4、余数只可能有0 1 2 3 4 5 6 7 8 9 10这11个数字。其分别对应的最后一位身份证的号码为1 0 X 9 8 7 6 5 4 3 2；
             *  5、通过上面得知如果余数是2，就会在身份证的第18位数字上出现罗马数字的x。如果余数是10，身份证的最后一位号码就是2；
             ###
            mod = 0
            sum = 0
            for i in [0..16]
                sum += parseInt( idString[i] ) * me._factors[i]

            mod = sum % 11
            isValid = isValid and ( me._checkcode[mod] is idString[17] )

        return isValid

ebaui['web'].registerValidator( 'id',IdentityValidator )