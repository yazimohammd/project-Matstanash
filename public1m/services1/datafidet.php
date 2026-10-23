<?php
header('Content-Type: application/json; charset=utf-8');

$conn = mysqli_connect('localhost','matstanash2','12AA@@test','matstanash1');

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

if (($_POST['ACTION'] ?? '') === 'LOGIN') {
    
    $username = trim($_POST['USERNAME'] ?? '');
    $password = $_POST['PASSWORD'] ?? '';

    // 2. تحديد الأعمدة المطلوبة من جدول services1foundation
    $login = mysqli_prepare(
        $conn, 
        'SELECT id, foundation1user, foundation1name FROM services1foundation WHERE foundation1user = ? AND password1 = ? LIMIT 1'
    );

    // 3. تمرير المدخلات للبدء بالحماية من SQL Injection
    mysqli_stmt_bind_param($login, 'ss', $username, $password);
    mysqli_stmt_execute($login);

    // 4. ربط الأعمدة بالمتغيرات (بالترتيب تماماً كما في استعلام SELECT)
    mysqli_stmt_bind_result($login, $fetched_id, $fetched_user, $fetched_name);

    // 5. جلب السطر والتحقق مما إذا كان المستخدم موجوداً
    $has_user = mysqli_stmt_fetch($login);

    mysqli_stmt_close($login);
    mysqli_close($conn);

    // 6. طباعة استجابة JSON
    if ($has_user) {
        echo json_encode([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'id'      => $fetched_id,      // يحتوي على قيمة id
            'user'    => $fetched_user,    // يحتوي على قيمة foundation1user
            'name'    => $fetched_name     // يحتوي على قيمة foundation1name
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'اسم المستخدم أو كلمة المرور غير صحيحة'
        ]);
    }
    exit;
}

// ----------------------
// 2. إجراء التعديل UPDATE
// ----------------------
// if ($action === 'UPDATE') {
//     $id = $_POST['ID'] ?? '';
//     $newName = trim($_POST['NEW_NAME'] ?? ''); // مثلاً الاسم الجديد المراد تعديله

//     if (empty($id) || empty($newName)) {
//         echo json_encode([
//             'success' => false,
//             'message' => 'جميع البيانات مطلوبة للتعديل'
//         ]);
//         exit;
//     }

//     // تجهيز استعلام التحديث بناءً على id
//     $updateStmt = mysqli_prepare(
//         $conn, 
//         'UPDATE services1foundation SET foundation1name = ? WHERE id = ?'
//     );

//     // 'si' تعني: String (الاسم الجديد)، Integer (الـ id)
//     mysqli_stmt_bind_param($updateStmt, 'si', $newName, $id);
//     mysqli_stmt_execute($updateStmt);

//     // التحقق من أن هناك صفاً قد أُصيب بالتعديل
//     if (mysqli_stmt_affected_rows($updateStmt) > 0) {
//         echo json_encode([
//             'success' => true,
//             'message' => 'تم تعديل البيانات بنجاح'
//         ]);
//     } else {
//         echo json_encode([
//             'success' => false,
//             'message' => 'لم يتم إجراء أي تغيير، أو أن الـ ID غير موجود'
//         ]);
//     }

//     mysqli_stmt_close($updateStmt);
//     mysqli_close($conn);
//     exit;
// }

// ===================
// ===================
// ===================taber 
if (($_POST['ACTION'] ?? '') === 'GITTABER') {

    $id = $_POST['ID'] ?? '';

    if (empty($id)) {
        echo json_encode([
            'success' => false,
            'message' => 'المعرّف ID مطلوب'
        ]);
        exit;
    }

    // 1. استعلام جلب قيمة taber بناءً على id
    $stmt = mysqli_prepare(
        $conn, 
        'SELECT taber FROM services1foundation WHERE id = ? LIMIT 1'
    );

    // 2. استخدام 'i' لأن id من نوع integer
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);

    // 3. ربط النتيجة بالمتغير
    mysqli_stmt_bind_result($stmt, $fetched_taber);

    // 4. جلب السطر
    $has_data = mysqli_stmt_fetch($stmt);

    mysqli_stmt_close($stmt);
    mysqli_close($conn);

    // 5. إرجاع النتيجة
    if ($has_data) {
        echo json_encode([
            'success' => true,
            'taber'   => $fetched_taber
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'لم يتم العثور على السجل'
        ]);
    }
    exit;
}


// ===================
// ===================
// ===================

$NUsername = $_POST['NUSERNAME'] ?? '';
$NName = $_POST['NNAME'] ?? '';
$NEmail = $_POST['NEMAIL'] ?? '';
$NPassword = $_POST['NPASSWORD'] ?? '';

if ($NUsername === '' || $NName === '' || $NEmail === '' || $NPassword === '') {
    mysqli_close($conn);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

$check = mysqli_prepare($conn, 'SELECT * FROM services1foundation WHERE foundation1user = ? OR `e-mail` = ? LIMIT 1');
mysqli_stmt_bind_param($check, 'ss', $NUsername, $NEmail);
mysqli_stmt_execute($check);
mysqli_stmt_store_result($check);

if (mysqli_stmt_num_rows($check) > 0) {
    mysqli_stmt_close($check);
    mysqli_close($conn);
    echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
    exit;
}

$insert = mysqli_prepare($conn, 'INSERT INTO services1foundation (foundation1user, foundation1name, `e-mail`, password1) VALUES (?, ?, ?, ?)');
mysqli_stmt_bind_param($insert, 'ssss', $NUsername, $NName, $NEmail, $NPassword);
$success = mysqli_stmt_execute($insert);

if ($success) {
    $folderName = preg_replace('/[^\p{L}\p{N}._-]+/u', '_', trim($NUsername));
    $folderName = 'folder1data2' . $folderName;
    $folderPath = __DIR__ . DIRECTORY_SEPARATOR . 'ServicesFolder' . DIRECTORY_SEPARATOR . $folderName;

    if ($folderName === '' || (!is_dir($folderPath) && !mkdir($folderPath, 0755, true))) {
        mysqli_stmt_close($check);
        mysqli_stmt_close($insert);
        mysqli_close($conn);
        echo json_encode(['success' => false, 'message' => 'Registration succeeded but institution folder could not be created']);
        exit;
    }
}

mysqli_stmt_close($check);
mysqli_stmt_close($insert);
mysqli_close($conn);

if ($success) {
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful',
        'folder' => 'ServicesFolder/' . $folderName
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed']);
}

?>