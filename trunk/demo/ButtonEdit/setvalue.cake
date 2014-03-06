<div data-role="panel" data-options="{ left : 0,top : 0 }">

<input id="btnedit1" data-role="buttonedit" name="buttonEdit"
    data-options="{ 
        text       : '' ,
        value      : '',
        onchange   : onch,
        placeHolder:'asdfad'
    }" />

</div>

<script>
function onch( sender,eventArgs ){
  console.log( 'textbox onchange' );
}

function loadPage(){
  var t = ebaui.get('#btnedit1');
  t.value( 'hello world!!' );
}
</script>