<?php

if ($_FILES["ebauiUploadedFiles"]["error"] > 0){

    echo "Error: " . $_FILES["ebauiUploadedFiles"]["error"] . "<br>";

}else{

    $response = "Upload: " . $_FILES["ebauiUploadedFiles"]["name"] . "<br>"
                ."Type: " . $_FILES["ebauiUploadedFiles"]["type"] . "<br>"
                ."Size: " . ($_FILES["ebauiUploadedFiles"]["size"] / 1024) . " kB<br>"
                ."Stored in: " . $_FILES["ebauiUploadedFiles"]["tmp_name"];

    echo $response;

}

?>