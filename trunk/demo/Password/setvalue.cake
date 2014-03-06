<div data-role="panel" data-options="{ left : 0,top : 0 }">
    
<input id="txt" data-role="password" name="password" data-options="{
        maxLength : 0,
        iconCls : 'icon-user',
        onchange: onch,
        validators:['required'],
        messages : { 'required':'this field is required' } }" />

</div>

<script>
function onch( sender,eventArgs ){
  console.log( 'password onchange' );
}
/*
function loadPage(){
  var t = ebaui.get('#txt');
  t.value( 'password hello' );
}*/
</script>