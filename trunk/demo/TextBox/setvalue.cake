<div data-role="panel" data-options="{ left : 0,top : 0 }">
    
<input id="txt" data-role="textbox" name="textbox" data-options="{
        placeHolder:'文本框...',
        maxLength : 0,
        iconCls : 'icon-user',
        onchange: onch,
        validators:['required'],
        messages : { 'required':'this field is required' } }" />

</div>

<script>
function onch( sender,eventArgs ){
  console.log( 'textbox onchange' );
}

function loadPage(){
  var t = ebaui.get('#txt');
  t.value( 'hello world!!' );
}
</script>