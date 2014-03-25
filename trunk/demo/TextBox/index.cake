<div data-role="panel" data-options="{ left : 10,top : 10 }">
    
<input id="t" data-role="textbox" name="textbox" data-options="{
        maxLength   : 4,
        height      : 42,
        placeHolder : 'monkey',
        iconCls     : 'icon-user',
        validators  : ['required'],
        messages    : { 'required':'this field is required' },
        onchange    : onch
}" />

</div>

<div data-role="panel" data-options="{ left : 10,top : 100 }">

<input data-role="textbox" name="textbox" data-options="{
        readonly    : true,
        placeHolder : 'monkey',
        validators  : ['required'],
        messages    : { 'required':'this field is required' }}" />

</div>

<div data-role="panel" data-options="{ left : 10,top : 300 }">

<input id="tbx3" data-role="textbox" name="textbox" placeholder="monkey 3..."  data-options="{
        height      : 200,
        placeHolder : 'monkey',
        validators  : ['required','rng[100]'],
        messages    : { 'required':'this field is required' }}" />

</div>

<script>

function onch(){
  console.log( 'textbox onchange' );
};

</script>