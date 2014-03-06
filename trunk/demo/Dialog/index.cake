<script type="text/javascript">

function showAlertDialog () {
    // body...
    ebaui.alert("hello world!!");
}

function showConfirmDialog(){
    // body...
    ebaui.confirm({
        message : 'hello this is confirm message',
        callback: function( value ){
            console.log( ' confirm value is ' + ( value ? 'true' : 'false' ) );
        }
    });
}

function showPromptDialog(){
    // body...
    ebaui.prompt({
        title      : '提示',
        message    : 'hello this is prompt message',
        placeholder: 'prompt placeholder',
        callback   : function( value ){
            console.log( value );
            console.log( ' prompt value is ' + ( value ? 'true' : 'false' ) );
        }
    });
};

function openDialog () {
//    ebaui.win( { url:'dialog_index_ifm.html',title:'baidu' } )
ebaui.win( { url:'http://www.baidu.com',title:'baidu' } )
}

function onbefore(){
    console.log( 'onbefore' );
};

function onafter(){
    console.log( 'onafter' );
};

function closeDialog(){
    var dia = ebaui.get('#qq');
    dia.close();
};

function vali(){
    var form = ebaui.get('#form_x');
    console.log( form.validate() );
};

</script>

<input data-role="button" title="button" data-options="{ text : 'alert',width:100,onclick : showAlertDialog }" />

<br /><br />

<input data-role="button" title="button" data-options="{ text : 'confirm',width:100,onclick : showConfirmDialog }" />

<br /><br />

<input data-role="button" title="button" data-options="{ text : 'prompt',width:100,onclick : showPromptDialog }" />

<br /><br />

<input data-role="button" title="button" data-options="{ text : 'open dialog',width:100,onclick : openDialog }" />