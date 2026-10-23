<?php
header('Content-Type: application/json; charset=utf-8');

$conn = mysqli_connect('localhost','matstanash2','12AA@@test','matstanash1');

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}


$action = $_POST['ACTION'] ?? '';

if ($action === 'GITT') {

    $id = $_POST['ID'] ?? '';

    if (empty($id) || !is_numeric($id)) {
        mysqli_close($conn);
        echo json_encode([
            'success' => false,
            'message' => 'المعرّف ID مطلوب ويجب أن يكون رقماً'
        ]);
        exit;
    }

    $stmt = mysqli_prepare(
        $conn, 
        'SELECT foundation1user FROM services1foundation WHERE id = ? LIMIT 1'
    );

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, 'i', $id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $foldername);
        $has_data = mysqli_stmt_fetch($stmt);

        mysqli_stmt_close($stmt);
        mysqli_close($conn);

        if ($has_data) {
            $tabernow = rand(1,9);
            $taber = $tabernow + rand(2,5);

            $fileinb = dirname(__DIR__);
            $foldername = $fileinb.'/services1/ServicesFolder/folder1data2'.$foldername;
            $file1 = $foldername.'/reservations11.json'; 
            $file2 = $foldername.'/nunowreservation22.json'; 

            // if (!file_exists($file2)) {
            //     echo json_encode([
            //         'success' => false,
            //         'message' => 'خطأ في الاستعلامuuuu'
            //     ]);
            //     exit;
            // } 

            if (!file_exists($file2)) {
                echo json_encode([
                    'success' => false,
                    'message' => 'خطأ في الاستعلامuuuu'
                ]);
                exit;
            } 

            $jsonText = file_get_contents($file2);
            $data = json_decode($jsonText,true);

            $t1 = $data['nownumber']['numreservition'];
            $t2 = $data['waitnumber']['numreservition'];

            echo json_encode([
                                'success' => true,
                                'tabernow' => $t1,
                                'taber' => $t2 ,
                                'data' => $data 
                            ], JSON_UNESCAPED_UNICODE);

        } else {
            echo json_encode([
                'success' => false,
                'message' => 'لم يتم العثور على السجل'
            ]);
        }
    } else {
        mysqli_close($conn);
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الاستعلام'
        ]);
    }
    exit;
}    



if ($action === 'SITT') {

    $id = $_POST['ID'] ?? '';
    $iduser = $_POST['IDUSER'] ?? '';
    
    if (empty($id) || !is_numeric($id)) {
        mysqli_close($conn);
        echo json_encode([
            'success' => false,
            'message' => 'المعرّف ID مطلوب ويجب أن يكون رقماًsit'
        ]);
        exit;
    }
    if (empty($iduser) || !is_numeric($iduser)) {
        mysqli_close($conn);
        echo json_encode([
            'success' => false,
            'message' => 'المعرّف ID مطلوب ويجب أن يكون رقماً11'
        ]);
        exit;
    }

    $stmt = mysqli_prepare(
        $conn, 
        'SELECT foundation1user FROM services1foundation WHERE id = ? LIMIT 1'
    );

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, 'i', $id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $foldername);
        $has_data = mysqli_stmt_fetch($stmt);

        mysqli_stmt_close($stmt);
        mysqli_close($conn);

        if ($has_data) { 

            $fileinb = dirname(__DIR__);
            $foldername = $fileinb.'/services1/ServicesFolder/folder1data2'.$foldername;
              
            $file = $foldername.'/reservations11.json';  
            $file2 = $foldername.'/nunowreservation22.json';  

            if (file_exists($file2)) {

                $jsonText = file_get_contents($file2);
                $data = json_decode($jsonText,true);
                if ($data['waitnumber']['id'] !== (int)$iduser ){
                    $data['waitnumber']['id'] = (int)$iduser;
                    $data['waitnumber']['numreservition'] = (int)$data['waitnumber']['numreservition'] + 1;
                    $updatedJson = json_encode($data,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                    file_put_contents($file2,$updatedJson); 
    
                    }
                
                echo json_encode([
                'success' => false,
                'message' => 'لم يتم العثور على 455544السجل'
                ]);
            } 
            else{
                echo json_encode([
                'success' => false,
                'message' => 'لم يتم العثور 111على السجل'
                ]);
            }

        } else {
            echo json_encode([
                'success' => false,
                'message' => 'لم يتم العثور على السجل'
            ]);
        }
    } else {
        mysqli_close($conn);
        echo json_encode([
            'success' => false,
            'message' => 'خطأ في الاستعلام'
        ]);
    }
    exit;

}
    

   








?>