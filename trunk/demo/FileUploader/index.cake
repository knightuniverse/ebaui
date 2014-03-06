<h4>FileUploader DEMO 1</h4>
<pre>
    &lt;input id="fileuploader1" data-role="fileuploader" data-options="{ buttonText :'浏览文件',uploadUrl:'uploadhandle.php' }" /&gt;
</pre>

<h4>javascript</h4>
<pre>
function startUpload (argument) {
    var ctrl = ebaui.get( $( '#fileuploader1' ) );
    ctrl.startUpload();
}
</pre>

<input id="fileuploader1" data-role="fileuploader" data-options="{ buttonText :'浏览文件',uploadUrl:'uploadhandle.php' }" />

<br /><br />

<button onclick="startUpload()" value="upload">upload</button>
<script type="text/javascript">

function startUpload (argument) {
    var ctrl = ebaui.get( $( '#fileuploader1' ) );
    ctrl.startUpload();
}

</script>

<h4>FileUploader DEMO 2</h4>
<pre>
    &lt;input id="fileuploader2" data-role="fileuploader" data-options="{ buttonText :'浏览文件',uploadUrl:'uploadhandle.php',uploadOnSelect:true,onuploadsucc :onUploadSucc }" /&gt;
</pre>

<h4>javascript</h4>
<pre>
function onUploadSucc ( sender,eventArgs ) {
    // body...
    console.log( 'onUploadSucc' )
    console.log( ' fileuploader2 upload succ ' )
}
</pre>

<input id="fileuploader2" data-role="fileuploader" data-options="{ buttonText :'浏览文件',uploadUrl:'uploadhandle.php',uploadOnSelect:true,onuploadsucc :onUploadSucc }" />

<br /><br />

<script type="text/javascript">

function onUploadSucc ( sender,eventArgs ) {
    // body...
    console.log( 'onUploadSucc' )
    console.log( ' fileuploader2 upload succ ' )
    console.log( eventArgs );
}

</script>

<h4>FileUploader DEMO 3</h4>
<pre>
    &lt;input id="fileuploader3" data-role="fileuploader" data-options="{ buttonText :'浏览文件',uploadUrl:'uploadhandle_extra.php
',uploadOnSelect:true,onuploadsucc :onUploadSucc,extraParams : extra }" /&gt;
</pre>

<h4>javascript</h4>
<pre>

var extra = {
    'author' : 'monkey'
};

function onUploadSucc ( sender,eventArgs ) {
    // body...
    console.log( 'onUploadSucc' )
    console.log( ' fileuploader2 upload succ ' )
};

</pre>

<input id="fileuploader3" data-role="fileuploader" data-options="{ buttonText :'浏览文件',uploadUrl:'uploadhandle_extra.php',uploadOnSelect:true,onuploadsucc :onUploadSucc,extraParams : extra }" />

<br /><br />

<script type="text/javascript">

var extra = {
    'author' : 'monkey'
};

</script>