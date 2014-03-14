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
        new People( 1,'houzi','man' ),
        new People( 2,'houzi2','man' ),
        new People( 3,'houzi3','man' ),
        new People( 4,'houzi4','man' ),
        new People( 5,'houzi5','man' ),
        new People( 6,'houzi6','man' ),
        new People( 7,'houzi7','man' ),
        new People( 8,'houzi8','man' )
    );
    
    echo json_encode( $arr );

?>