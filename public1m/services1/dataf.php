<?php
// 1. إرسال الهيدر وإخفاء أخطاء PHP المباشرة لمنع إفساد صيغة JSON
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(E_ALL);

// 2. الاتصال بقاعدة البيانات
$conn = mysqli_connect('localhost', 'matstanash2', '12AA@@test', 'matstanash1');

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// تحديد نوع الإجراء المطلوبة (ACTION)
$action = $_POST['ACTION'] ?? '';

switch ($action) {

    // ==========================================
    // 1. تسجيل الدخول (LOGIN)
    // ==========================================
    case 'LOGIN':
        $username = trim($_POST['USERNAME'] ?? '');
        $password = $_POST['PASSWORD'] ?? '';

        $login = mysqli_prepare(
            $conn, 
            'SELECT id, foundation1user, foundation1name FROM services1foundation WHERE foundation1user = ? AND password1 = ? LIMIT 1'
        );

        mysqli_stmt_bind_param($login, 'ss', $username, $password);
        mysqli_stmt_execute($login);
        mysqli_stmt_bind_result($login, $fetched_id, $fetched_user, $fetched_name);
        $has_user = mysqli_stmt_fetch($login);

        mysqli_stmt_close($login);
        mysqli_close($conn);

        if ($has_user) {
            echo json_encode([
                'success' => true,
                'message' => 'تم تسجيل الدخول بنجاح',
                'id'      => $fetched_id,
                'user'    => $fetched_user,
                'name'    => $fetched_name
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'اسم المستخدم أو كلمة المرور غير صحيحة'
            ]);
        }
        exit;

    // ==========================================
    // 2. جلب قيمة taber (GITTABER)
    // ==========================================
    case 'GITTABER':
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
            'SELECT taber FROM services1foundation WHERE id = ? LIMIT 1'
        );

        if ($stmt) {
            mysqli_stmt_bind_param($stmt, 'i', $id);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_bind_result($stmt, $fetched_taber);
            $has_data = mysqli_stmt_fetch($stmt);

            mysqli_stmt_close($stmt);
            mysqli_close($conn);

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
        } else {
            mysqli_close($conn);
            echo json_encode([
                'success' => false,
                'message' => 'خطأ في الاستعلام'
            ]);
        }
        exit;

    // ==========================================
    // 3. تعديل البيانات (UPDATE)
    // ==========================================
    case 'UPDATE':
        $id = $_POST['ID'] ?? '';
        $newName = trim($_POST['NEW_NAME'] ?? '');

        if (empty($id) || empty($newName)) {
            mysqli_close($conn);
            echo json_encode([
                'success' => false,
                'message' => 'جميع البيانات مطلوبة للتعديل'
            ]);
            exit;
        }

        $updateStmt = mysqli_prepare(
            $conn, 
            'UPDATE services1foundation SET foundation1name = ? WHERE id = ?'
        );

        mysqli_stmt_bind_param($updateStmt, 'si', $newName, $id);
        mysqli_stmt_execute($updateStmt);

        if (mysqli_stmt_affected_rows($updateStmt) > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'تم تعديل البيانات بنجاح'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'لم يتم إجراء أي تغيير، أو أن الـ ID غير موجود'
            ]);
        }

        mysqli_stmt_close($updateStmt);
        mysqli_close($conn);
        exit;

    // ==========================================
    // 4. إنشاء حساب جديد (REGISTER)
    // ==========================================
    case 'REGISTER':
        $NUsername = trim($_POST['NUSERNAME'] ?? '');
        $NName     = trim($_POST['NNAME'] ?? '');
        $NEmail    = trim($_POST['NEMAIL'] ?? '');
        $NPassword = $_POST['NPASSWORD'] ?? '';

        if ($NUsername === '' || $NName === '' || $NEmail === '' || $NPassword === '') {
            mysqli_close($conn);
            echo json_encode(['success' => false, 'message' => 'All fields are required']);
            exit;
        }

        $check = mysqli_prepare($conn, 'SELECT id FROM services1foundation WHERE foundation1user = ? OR `e-mail` = ? LIMIT 1');
        mysqli_stmt_bind_param($check, 'ss', $NUsername, $NEmail);
        mysqli_stmt_execute($check);
        mysqli_stmt_store_result($check);

        if (mysqli_stmt_num_rows($check) > 0) {
            mysqli_stmt_close($check);
            mysqli_close($conn);
            echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
            exit;
        }
        mysqli_stmt_close($check);

        $insert = mysqli_prepare($conn, 'INSERT INTO services1foundation (foundation1user, foundation1name, `e-mail`, password1) VALUES (?, ?, ?, ?)');
        mysqli_stmt_bind_param($insert, 'ssss', $NUsername, $NName, $NEmail, $NPassword);
        $success = mysqli_stmt_execute($insert);

        $folderName = '';
        if ($success) {
            $folderName = preg_replace('/[^\p{L}\p{N}._-]+/u', '_', trim($NUsername));
            $folderName = 'folder1data2' . $folderName; 
            $folderPath = __DIR__ . DIRECTORY_SEPARATOR . 'ServicesFolder' . DIRECTORY_SEPARATOR . $folderName;

            if ($folderName === '' || (!is_dir($folderPath) && !mkdir($folderPath, 0755, true))) {
                mysqli_stmt_close($insert);
                mysqli_close($conn);
                echo json_encode(['success' => false, 'message' => 'Registration succeeded but institution folder could not be created']);
                exit;
            }
        }

        mysqli_stmt_close($insert);
        mysqli_close($conn);

        if ($success) {
            echo json_encode([
                'success' => true,
                'message' => 'Registration successful',
                'folder'  => 'ServicesFolder/' . $folderName
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Registration failed']);
        }
        exit;

    // حالة إذا تم إرسال ACTION غير معرف
    default:
        mysqli_close($conn);
        echo json_encode([
            'success' => false,
            'message' => 'إجراء غير معروف (Invalid Action)'
        ]);
        exit;
}
?>