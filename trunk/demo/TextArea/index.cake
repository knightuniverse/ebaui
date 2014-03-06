<textarea id="area" data-role="textarea" data-options="{
        onenter   : onEnter,
        onkeyup   : onKeyup,
        width     : 300,
        height    : 300,
        validation: ['required'],
        placeHolder : 'textarea',
        messages  : { 'required':'this field is required' } }"></textarea>
        
<button onclick="onValidateBtnClick()">validate</button>

<script type="text/javascript">

function onEnter (sender,evt) {
    // body...
    alert( 'textbox on enter' );
}

function onKeyup(){
    console.log( 'textbox onKeyup' )
}

function onValidateBtnClick(){
    var t = ebaui.getById( 'area' );
    t.validate();
};

</script>
