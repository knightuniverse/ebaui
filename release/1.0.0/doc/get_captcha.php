<?php

function getCode($num,$imgWidth,$imgHeight) { 

    $code = ""; 
    for ($i = 0; $i < $num; $i++) { 
        $code .= rand(0, 9); 
    }

    $file_name = "captcha_".$code."_{$imgWidth}_{$imgHeight}.png";
    $file_path = dirname(__FILE__)."/captcha_codes/".$file_name;
    $file_url = "captcha_codes/{$file_name}";
    //4位验证码也可以用rand(1000,9999)直接生成 
    //将生成的验证码写入session，备验证时用 
    $_SESSION["helloweba_num"] = $code; 
    //创建图片，定义颜色值 
    $im = imagecreate($imgWidth, $imgHeight); 
    $black = imagecolorallocate($im, 0, 0, 0); 
    $gray = imagecolorallocate($im, 200, 200, 200); 
    $bgcolor = imagecolorallocate($im, 255, 255, 255); 
    //填充背景 
    imagefill($im, 0, 0, $gray); 
 
    //画边框 
    imagerectangle($im, 0, 0, $imgWidth-1, $imgHeight-1, $black); 
 
    //随机绘制两条虚线，起干扰作用 
    $style = array ($black,$black,$black,$black,$black, 
        $gray,$gray,$gray,$gray,$gray 
    ); 
    imagesetstyle($im, $style); 
    $y1 = rand(0, $imgHeight); 
    $y2 = rand(0, $imgHeight); 
    $y3 = rand(0, $imgHeight); 
    $y4 = rand(0, $imgHeight); 
    imageline($im, 0, $y1, $imgWidth, $y3, IMG_COLOR_STYLED); 
    imageline($im, 0, $y2, $imgWidth, $y4, IMG_COLOR_STYLED); 
 
    //在画布上随机生成大量黑点，起干扰作用; 
    for ($i = 0; $i < 80; $i++) { 
        imagesetpixel($im, rand(0, $imgWidth), rand(0, $imgHeight), $black); 
    } 
    //将数字随机显示在画布上,字符的水平间距和位置都按一定波动范围随机生成 
    $strx = rand(3, 8); 
    for ($i = 0; $i < $num; $i++) { 
        $strpos = rand(1, 6); 
        imagestring($im, 5, $strx, $strpos, substr($code, $i, 1), $black); 
        $strx += rand(8, 12); 
    } 
    imagepng($im,$file_path);//输出图片 
    imagedestroy($im);//释放图片所占内存

    $captcha = array(
            "image" => $file_url,
            "code"  => $code,
        );

    return $captcha;
}

$captcha = getCode( 4,100,30 );

header( 'Content-Type: application/json' );  
echo json_encode( $captcha );

/* end of php */