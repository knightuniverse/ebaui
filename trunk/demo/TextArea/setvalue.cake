<div data-role="panel" data-options="{ left : 0,top : 0 }">
    
<textarea id="area" name="" data-role="textarea" maxlength="40" placeholder="请输入备注" data-options="{
        onchange  : onch,
        width     : 300,
        height    : 300,
        validation: ['required'],
        messages  : { 'required':'this field is required' } }"></textarea>

</div>

<script>
function onch( sender,eventArgs ){
  console.log( 'textbox onchange' );
}

function loadPage(){
  var t = ebaui.get('#area');
  t.value( 'hello world!!' );
}
</script>