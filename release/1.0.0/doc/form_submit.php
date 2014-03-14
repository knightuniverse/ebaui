<?php
    $name = $_POST['name'];
    $pwd = $_POST['pwd'];
    echo json_encode( 'your name is '.$name.' and your pwd is '.$pwd );
?>