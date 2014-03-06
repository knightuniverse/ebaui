<?php
    
    class People{

        var $id;
        var $name;
        var $sex;

        function __construct($id,$name,$sex){
            $this->id = $id;
            $this->name = $name;
            $this->sex = $sex;
        }

    }

    $arr = array(
        new People( 0,'houzi','man' ),
        new People( 1,'houzi2','man' ),
        new People( 2,'houzi3','man' ),
        new People( 3,'houzi4','man' )
    );

    echo json_encode($arr);