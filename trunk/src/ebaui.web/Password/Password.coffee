class Password extends TextBox

    _init:( opts ) ->
        super( opts )
        ### password 的长度不做任何限制 ###
        this._maxLength = 0

ebaui['web'].registerFormControl( 'Password',Password )