<div data-role="panel" data-options="{ left : 0,top : 0 }">

<input id="cbx" data-role="checkbox" name="cbx"
    data-options="{
      value      :  'hello',
      onchange   :  onch,
      placeHolder: 'asdfad'
    }" />

</div>

<script>
function onch( sender,eventArgs ){
  console.log( 'checkbox onchange' );
}

function loadPage(){
  var t = ebaui.get('#cbx');
  t.checked( true )
  console.log( 'checkbox value is ' + t.value() )
}
</script>