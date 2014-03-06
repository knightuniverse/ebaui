<div id="cal" data-role="calendar" title="calendar" data-options="{ 
  value : '2013-09-12',
  onclick:onclick 
}" ></div>

<script type="text/javascript">
function  onclick (argument) {
    if( console && console.log ){
        console.log( 'onclick' )
    }
}

function loadPage(){
  var t = ebaui.get('#cal');
  t.value( new Date( '2012-10-10' ) );
}
</script>