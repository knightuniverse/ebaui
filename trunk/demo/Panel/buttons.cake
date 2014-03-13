<div id="panel" data-role="panel" title="hello" data-options="{ iconCls:'icon-search',buttons:actions,width:400,height:300 }">
  <p>adsfadsfadsf</p>
  <p>adfasdf adsfasdf</p>
  <p>adsfasdf asdfasdfasdf asdfasdfasd adsfasdf</p>
</div>

<script>

var down = function(){ 
  var c = ebaui.get('#panel');c.expand();
};

var up = function(){ 
  var c = ebaui.get('#panel');c.collapse();
};

var actions = [

  {
    iconCls:'icon-caret-down',
    onclick:down
  },
  
  {
    iconCls:'icon-caret-up',
    onclick:up
  }
  
];

</script>