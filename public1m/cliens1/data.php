<?php
header('Content-Type: application/json; charset=utf-8');

$conn = mysqli_connect('localhost','matstanash2','12AA@@test','matstanash1');

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$newaccont = $_POST['NEWACCONNT'] ?? '';

if ($newaccont === 'false') {
    $Username = $_POST['USERNAME'] ?? '';
    $Password = $_POST['PASSWORD'] ?? '';

    $date = mysqli_query($conn, "SELECT * FROM data1users");
    $query = mysqli_fetch_array($date, MYSQLI_ASSOC);

    while ($query) {
        if (($query['username1'] === $Username || $query['email1'] === $Username) && $query['password1'] === $Password) {
            $folder = "the_accounts/uploads_".$query['username1'].$query['username1'];

            mysqli_close($conn);
            echo json_encode(['success' => true, 'message' => 'Login successful','iduser'=> $query['id'], 'folder' => $folder]);
            exit;
        }
        $query = mysqli_fetch_array($date, MYSQLI_ASSOC);
    }
    
    mysqli_close($conn);
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    exit;
}

if ($newaccont === 'true') {
    $NUsername = $_POST['NUSERNAME'] ?? '';
    $NEmail = $_POST['NEMAIL'] ?? '';
    $NPassword = $_POST['NPASSWORD'] ?? '';

    $date = mysqli_query($conn, "SELECT * FROM data1users");
    $query = mysqli_fetch_array($date, MYSQLI_ASSOC);

    while ($query ) {
        if ($query['username1'] === $NUsername || $query['email1'] === $NEmail) {
            mysqli_close($conn);
            echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
            exit;
        }
        $query = mysqli_fetch_array($date, MYSQLI_ASSOC);
    }

    $insert = mysqli_query($conn, "INSERT INTO data1users (username1,email1,password1) VALUES ('$NUsername','$NEmail','$NPassword')");
    mysqli_close($conn);
    
    $folder = "the_accounts/uploads_".$NUsername.$NUsername; 
    if(!is_dir($folder)){
        if (mkdir($folder, 0755, true)){}
        else{}
    }

    $taberfile = $folder . '/reservations11.json';

    $taberJson = []; // ضع بياناتك هنا داخل هذه المصفوفة

    if (!is_dir($folder)) {
        echo json_encode(['success' => false, 'message' => 'User folder does not exist']);
        exit;
    }

    // تحويل المصفوفة إلى نص JSON
    $jsonContent = json_encode($taberJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    // حفظ البيانات في $taberfile
    if (file_put_contents($taberfile, $jsonContent) !== false) {
        echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to write file']);
    }
    exit;
    


    if ($insert) {
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed']);
    }
    exit;
}

// معالجة حفظ تحميل الإعدادات - Handle settings save/load
$action = $_POST['ACTION'] ?? '';

if ($action === 'SAVE_SETTINGS') {
    $folder = $_POST['FOLDER'] ?? '';
    $settingsJson = $_POST['SETTINGS'] ?? '';
    
    if (empty($folder) || empty($settingsJson)) {
        echo json_encode(['success' => false, 'message' => 'Folder or settings data missing']);
        exit;
    }
    
    $settingsFile = $folder . '/settings.json';
    
    // التحقق من وجود المجلد - Check if folder exists
    if (!is_dir($folder)) {
        echo json_encode(['success' => false, 'message' => 'User folder does not exist']);
        exit;
    }
    
    // كتابة الملف - Write JSON file
    if (file_put_contents($settingsFile, $settingsJson) !== false) {
        echo json_encode(['success' => true, 'message' => 'Settings saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to write settings file']);
    }
    exit;
}

if ($action === 'LOAD_SETTINGS') {
    $folder = $_POST['FOLDER'] ?? '';
    
    if (empty($folder)) {
        echo json_encode(['success' => false, 'message' => 'Folder parameter missing']);
        exit;
    }
    
    $settingsFile = $folder . '/settings.json';
    
    // التحقق من وجود الملف - Check if file exists
    if (file_exists($settingsFile)) {
        $settingsJson = file_get_contents($settingsFile);
        echo json_encode(['success' => true, 'settings' => $settingsJson]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No saved settings found']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid request']);
?>

<!-- id	username1	password1	email1	gps	 -->