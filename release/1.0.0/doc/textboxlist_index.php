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
        new People( 1,'houzi','man' ),
        new People( 2,'houzi2','man' ),
        new People( 3,'houzi3','man' ),
        new People( 4,'houzi4','man' )
    );

    $name = $_GET['name'];
    $result = array();

    foreach( $arr as $item ){

        if( strpos($item->name,$name) !== false ){
            array_push( $result,$item );
        }

    }
    
    echo json_encode($result);

?>