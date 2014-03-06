<input id="btn" data-role="button" data-options="{ 
  state   : 'success',
  iconCls : 'icon-plus',
  text    : '增加',
  enabled : false,
  onclick : onclick
}" />

<script>

function onclick(){
  console.log( 'on button click' );
};

</script>