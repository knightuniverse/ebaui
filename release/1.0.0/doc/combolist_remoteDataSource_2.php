<?php
    
    class People{

        var $id;
        var $name;
        var $sex;
        var $note;

        function __construct($id,$name,$sex){
            $this->id = $id;
            $this->name = $name;
            $this->sex = $sex;

            $this->note = "asdfasdfasdf";
        }

    }

    $arr = array(
        new People( 99,'houzi99','man' ),
        new People( 100,'houzi100','man' )
    );
    
    echo json_encode( $arr );

?>