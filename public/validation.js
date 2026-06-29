// ننتظر حتى يتم تحميل محتوى الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {

    // الحصول على عناصر النموذج
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // إضافة مستمع حدث عند محاولة إرسال النموذج
    form.addEventListener('submit', function(event) {
        // منع السلوك الافتراضي للنموذج (إعادة تحميل الصفحة)
        event.preventDefault();

        // التحقق من صحة الحقول
        const isUsernameValid = validateField(usernameInput, 'الرجاء إدخال اسم المستخدم أو البريد الإلكتروني');
        const isPasswordValid = validateField(passwordInput, 'الرجاء إدخال كلمة المرور');

        // إذا كانت جميع الحقول صالحة، يمكنك إرسال النموذج هنا
        if (isUsernameValid && isPasswordValid) {
            alert('تم التحقق بنجاح! جاهز للإرسال إلى الخادم.');
            // في تطبيق حقيقي، ستقوم بإرسال البيانات هنا باستخدام fetch أو XMLHttpRequest
            // form.submit(); 
        }
    });

    // دالة للتحقق من حقل معين وعرض رسالة الخطأ
    function validateField(inputElement, errorMessage) {
        const errorDiv = inputElement.nextElementSibling; // العنصر التالي لـ input هو div الخطأ
        
        // إزالة أي مسافات بيضاء من البداية والنهاية
        const value = inputElement.value.trim();

        if (value === '') {
            // إذا كان الحقل فارغًا، أظهر الخطأ
            errorDiv.textContent = errorMessage;
            inputElement.classList.add('is-invalid'); // إضافة كلاس للتنسيق
            return false;
        } else {
            // إذا كان الحقل يحتوي على قيمة، قم بإخفاء الخطأ
            errorDiv.textContent = '';
            inputElement.classList.remove('is-invalid'); // إزالة كلاس التنسيق
            return true;
        }
    }

});