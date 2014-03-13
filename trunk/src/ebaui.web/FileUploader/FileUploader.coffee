###*
*   @class      FileUploader
*   @classdesc
*   @memberof   ebaui.web
*   @extends    ebaui.web.FormField
*   @author     monkey      <knightuniverse@qq.com>
*   @param      {Object}    element     -   dom对象
*   @param      {Object}    options     -   控件配置参数
*   @example
*       //  初始化方式一
*       var ns = ebaui.web;
*       var btn = new ns.FileUploader( $( '' ),{ title:'',id:'',name:'' } );
*       //  初始化方式二
*       $( '' ).fileuploader( { title:'',id:'',name:'' } )
*       //  初始化方式三
*       &lt;input id="" title="" name="" data-role="fileuploader" data-options="{}" /&gt;
###
class FileUploader extends FormField
    ###*
     *  内部上传控件实例
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @member     {SWFUpload}    _uploader
    ###
    _uploader:null

    ###*
     *  uploadUrl是必须有值的属性，如果该属性为空，抛出此异常
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    _uploadUrlEmptyException
    ###
    _uploadUrlEmptyException:'the uploadUrl property can not be null or empty!',

    ###*
     *  更新UI的按钮文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     _updateAttrBtnText
    ###
    _updateAttrBtnText:() ->
        me    = this
        txt   = me.buttonText()
        $root = me.uiElement()
        $( '.eba-buttonedit-button',$root ).text( txt )

    ###*
     *  更新UI显示
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     _render
    ###
    _render: () ->
        super()
        this._updateAttrBtnText()

    ###*
     *  初始化DOM事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.TextBox
     *  @method     _setupEvents
     ###
    _setupEvents : ( opts ) ->
        me          = this
        me.onEvent( 'start'     ,opts['onstart'] )
        me.onEvent( 'progress'  ,opts['onprogress'] )
        me.onEvent( 'error'     ,opts['onerror'] )
        me.onEvent( 'succ'      ,opts['onsucc'] )
        me.onEvent( 'complete'  ,opts['oncomplete'] )

    ###*
     *  返回swfUploader的事件处理程序
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     _getEvtHandlers
    ###
    _getEvtHandlers: () ->
        me   = this
        uper = me._uploader
        ###*
        fileinfo = {
            averageSpeed: 0,
            creationdate: Thu Aug 22 2013 09:35:25 GMT+0800 (China Standard Time),
            currentSpeed: 0,
            filestatus: -1,
            id: "SWFUpload_0_0",
            index: 0,
            modificationdate: Thu Aug 22 2013 08:38:53 GMT+0800 (China Standard Time),
            movingAverageSpeed: 0,
            name: "bg-scrollbar-thumb-y.png",
            percentUploaded: 0,
            post: Object,
            size: 2567,
            sizeUploaded: 0,
            timeElapsed: 0,
            timeRemaining: 0,
            type: ".png"
        }
        ###
        evtHandles = {
            upload_start_handler : ( fileinfo ) ->

                #   disable the swfupload
                uper.setButtonDisabled( true )
                me.triggerEvent( 'start', {
                    'file' : fileinfo
                })

            upload_progress_handler : ( fileinfo,complete,total ) ->

                me.triggerEvent( 'progress', {
                    'file'         : fileinfo,
                    'bytesComplete': complete,
                    'totalBytes'   : total
                })

            upload_error_handler : ( fileinfo,errorCode,message ) ->
                #   enable the swfupload
                uper.setButtonDisabled( false )
                me.triggerEvent( 'error', {
                    'file'    : fileinfo
                    'errorMsg': message
                })

            upload_success_handler: ( fileinfo,data,response) ->
                #   enable the swfupload
                uper.setButtonDisabled( false )
                me.triggerEvent( 'succ', {
                    'file'          : fileinfo
                    'serverData'    : data
                    'serverResponse': response
                })

            upload_complete_handler : (fileinfo) ->
                me.triggerEvent( 'complete', {
                    'file' : fileinfo
                })

            file_dialog_start_handler: () ->
                #  clear queue
                uper.cancelQueue()

            file_queued_handler : ( fileinfo ) ->
                #  display file path
                me._$formInput.val( fileinfo.name )

            file_queue_error_handler : ( fileinfo,errorCode,message ) ->
                switch errorCode
                    when SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT then 
                    when SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE then 
                    when SWFUpload.QUEUE_ERROR.INVALID_FILETYPE then 
                    when SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED then 

            file_dialog_complete_handler : ( fileSelectedCount,fileQueuedCount,fileQueueLength ) ->
                #  todo
                uper.startUpload() if me.uploadOnSelect()
        }

        return evtHandles

    _swf:
        use_query_string        : false,
        requeue_on_error        : true,
        http_success            : [201, 202],
        assume_success_timeout  : 0,
        file_types_description  : "",
        
        debug                   : false,
        debug_handler           : $.noop,
        
        prevent_swf_caching     : false,
        preserve_relative_urls  : false,
        
        #  button text && style setting
        button_text             : '',
        button_image_url        : '',
        button_text             : '',
        button_text_style       : '',
        button_text_left_padding: 3,
        button_text_top_padding : 2,
        button_action           : SWFUpload.BUTTON_ACTION.SELECT_FILES,
        button_disabled         : false,
        button_cursor           : SWFUpload.CURSOR.HAND,
        button_window_mode      : SWFUpload.WINDOW_MODE.TRANSPARENT

    ###*
     *  初始化控件，声明内部变量
     *  在初始化控件的时候，控件options对象已经初始化完成，html模板也已经转换完成。
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     _init
    ###
    _init: ( opts ) ->
        me  = this
        ###*
        *   初始化控件自身的一系列属性  
        ###
        me._uploadUrl     = opts['uploadUrl'] ? ''
        throw me._uploadUrlEmptyException unless me._uploadUrl

        super( opts )
        $root             = me.uiElement()
        libBaseUrl        = ebaui['web'].baseUrl
        ###*
        *   初始化控件自身的一系列属性  
        ###
        me._width         = opts['width'] ? 150
        me._height        = opts['height'] ? 21
        me._extraParams   = opts['extraParams'] ? {}
        me._fileType      = opts['fileType'] ? '*.jpg;*.gif;*.png'
        me._fileSizeLimit = opts['fileSizeLimit'] ? '10MB'
        me._filePostName  = opts['filePostName'] ? 'ebauiUploadedFiles'
        me._buttonText    = opts['buttonText'] if opts['buttonText']

        me._$formInput = $( 'input',$root )
        btnID     = me.controlID()+'$span'
        offset    = $root.offset()
        swpHtml = """
                    <div><span id="#{btnID}" 
                            style="position:'absolute';
                                    top:#{offset.top}px;
                                    left:#{offset.left}px;
                                    width:#{$root.width()}px;
                                    height:#{$root.height()}px;"></span>
                    </div>
                  """
        $swp = $(swpHtml).appendTo( document.body )

        customer = 
            button_placeholder_id: btnID
            flash_url            : "#{libBaseUrl}lib/SWFUpload/Flash/swfupload.swf",
            post_params          : me.extraParams()
            file_post_name       : me._filePostName
            file_types           : me._fileType
            file_size_limit      : me._fileSizeLimit
            upload_url           : me._uploadUrl
            file_queue_limit     : 0
            file_upload_limit    : 0
            button_width         : '100%'
            button_height        : '100%'

        evtHandles   = me._getEvtHandlers()
        settings     = $.extend( me._swf,customer,evtHandles )
        uper = me._uploader = new SWFUpload( settings )

        for name,value of me._extraParams
                uper.addPostParam( name,value )

    ###*
     *  开始上传文件
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     startUpload
     *  @param      {Object}    file
    ###
    startUpload: ( file ) ->
        uper = this._uploader
        uper.startUpload( file ) if uper

    ###*
     *  添加POST提交的参数
     *  @public
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @method     addPostParam
     *  @param      {String}    name
     *  @param      {String}    value
    ###
    addPostParam: (name, value) ->
        uper = this._uploader
        uper.addPostParam( name,value ) if uper and name and value

    _uploadUrl:''
    ###*
     *  服务端上传文件处理地址
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    uploadUrl
    ###
    uploadUrl: ( val ) ->
        me = this
        return me._uploadUrl unless me.isString( val )
        me._uploadUrl = val

    _buttonText:'浏览...'
    ###*
     *  按钮的文本
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    buttonText
    ###
    buttonText: ( val ) ->
        me = this
        return me._buttonText unless me.isString( val )

        me._buttonText = val
        me._updateAttrBtnText()

        uper = me._uploader
        uper.setButtonText( val ) if uper

    _uploadOnSelect:false
    ###*
     *  文件选择后即上传
     *  @private
     *  @instance
     *  @memberof   ebaui.web.FileUploader
     *  @member     {Boolean}    uploadOnSelect
    ###
    uploadOnSelect: ( val ) ->
        me = this
        return me._uploadOnSelect unless me.isBoolean( val )
        me._uploadOnSelect  = val

    _fileType:'*.jpg;*.gif;*.png'
    ###*
     *  允许上传的文件类型,使用";"分割，默认只允许上传图片
     *  @private
     *  @instance
     *  @default    '*.jpg;*.gif;*.png'
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    fileType
    ###
    fileType: ( val ) ->
        me = this
        return me._fileType unless me.isString( val )
        me._fileType = val
        uper = me._uploader
        uper.setFileTypes( val ) if uper

    _fileSizeLimit:'10MB'
    ###*
     *  上传文件大小限制，默认文件大小上限是10MB
     *  @private
     *  @instance
     *  @default    '10MB'
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    fileSizeLimit
    ###
    fileSizeLimit: ( val ) ->
        me = this
        return me._fileSizeLimit unless me.isString( val )

        #  This applies to all future files that are queued. 
        #  The file_size_limit parameter will accept a unit. 
        #  Valid units are B, KB, MB, and GB. The default unit is KB.
        me._fileSizeLimit = val
        uper = me._uploader
        uper.setFileSizeLimit( val ) if uper

    _filePostName:'ebauiUploadedFiles'
    ###*
     *  文件提交到服务端的时候，post的key值，比如在asp.net你可以使用Request.Files[filePostName]进行访问
     *  @private
     *  @instance
     *  @default    'ebauiUploadedFiles'
     *  @memberof   ebaui.web.FileUploader
     *  @member     {String}    fileSizeLimit
    ###
    filePostName: ( val ) ->
        me = this
        return me._filePostName unless me.isString( val )

        me._filePostName = val
        uper = me._uploader
        uper.setFilePostName( val ) if uper

    _extraParams:{}
    ###*
     *  通过POST额外上传到服务器的参数
     *  @private
     *  @instance
     *  @default    {}
     *  @memberof   ebaui.web.FileUploader
     *  @member     {Object}    extraParams
    ###
    extraParams: ( val ) ->
        me = this
        return me._extraParams unless val?

        ###*
        *   This applies to all future files that are queued. 
        *   The file_size_limit parameter will accept a unit. 
        *   Valid units are B, KB, MB, and GB. The default unit is KB.
        ###
        uper = me._uploader
        old  = me._extraParams
        if uper
            if old
                for name, value of old 
                    uper.removePostParam( name )

            if val
                for name,value of val
                    uper.addPostParam( name,value )

        me._extraParams = val

ebaui['web'].registerFormControl( 'FileUploader',FileUploader )