<div data-role="panel" data-options="{ left : 0,top : 0 }">
    
<input id="cap" data-role="captcha" placeholder="请输入验证码" data-options="{ dataSource : { url : 'captcha_index.php' },maxLength:4,onchange:onch }" />

</div>

<script>
function onch( sender,eventArgs ){
  console.log( 'textbox onchange' );
}

function loadPage(){
  var t = ebaui.get('#cap');
  t.value( 'hello world!!' );
}
</script>