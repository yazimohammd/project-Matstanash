let num1page = 0;
let idfoundation1 = null;
let iduser = null;


document.addEventListener('DOMContentLoaded', function () {
// الواجهة الرسومية لشاشة البداية (Splash Screen) التي تظهر عند تحميل الصفحة

    setTimeout(() => {
        document.getElementById('splash-screen').classList.remove('active');
        document.getElementById('language-screen').classList.add('active');
    }, 3000); // عرض شاشة البداية لمدة ثانيتين
});
// alert('dddddddddd'); 
// شاشة اختيار اللغة مع دعم RTL و LTR
function language1begin(element1lang){
    const activeButton = typeof event !== 'undefined' ? event.currentTarget : null;

    document.querySelectorAll('.language-btn').forEach(btn => btn.classList.remove('active'));
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    document.documentElement.lang = element1lang;
    document.documentElement.dir = (element1lang === 'ar') ? 'rtl' : 'ltr';

    const translations = {
        en: { title: 'Select Language' },
        ar: { title: 'اختر اللغة' },
        fr: { title: 'Choisir la langue' }
    };

    const titleEl = document.querySelector('.lang-title');
    if (titleEl) {
        titleEl.innerText = translations[element1lang].title;
    }

    setTimeout(showLoginScreen, 300);
}
// شاشة تسجيل الدخول مع دعم RTL و LTR
function showLoginScreen() {
    document.getElementById('frame-content1').classList.remove('active');
    document.getElementById('frame-content3').classList.remove('active');
    document.getElementById('frame-content8').classList.remove('active');
    document.getElementById('frame-content2').classList.add('active');
    document.getElementById('bottom-nav').classList.add('active');
}

// 000000000000000000000000000000000000000000000000000
// 000000000000000000000000000000000000000000000000000
// 000000000000000000000000000000000000000000000000000

function moveToLoginScreen(frameId) {
    if (frameId === 'idlogin-card1') {
    document.getElementById('idlogin-card2').classList.remove('active');
    document.getElementById('idlogin-card1').classList.add('active');
    }else if (frameId === 'idlogin-card2') {
    document.getElementById('idlogin-card1').classList.remove('active');
    document.getElementById('idlogin-card2').classList.add('active');
    }
}

let folder1 = '';
// شاشة تسجيل الدخول مع التحقق من صحة الإدخال
function login1form(){
    let h = 0;
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    if (username.value.trim() === ''){
        h = 1;
        document.getElementById('msg-username').innerHTML = '*****';
    }
    else{
        document.getElementById('msg-username').innerHTML = '';
    }
    
    if (password.value.trim() === ''){
        h = 1;
        document.getElementById('msg-password').innerHTML = '*****';
    }
    else{
        document.getElementById('msg-password').innerHTML = '';
    }

    if(h===1){ return;}

    let bool1yn = 0;
    // console.log('ffffffff');
    
    const sdata = new URLSearchParams();
    // sdata.append('msg',text);
    sdata.append('USERNAME',username.value);
    sdata.append('PASSWORD',password.value);
    sdata.append('NEWACCONNT','false');

    fetch("data.php", {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: sdata
        })
        .then(async res => {
            const text = await res.text();
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error('Login response parse error:', text);
                return { success: false, message: 'Unexpected server response2' };
            }
        })
        .then(data => {
            if (data.success === true) {
                bool1yn = 1;
                folder1 = data.folder || '';
                iduser = data.iduser || '';
                
                // تحميل الإعدادات المحفوظة من السيرفر - Load saved settings from server
                setTimeout(() => {
                    loadSettingsFromServer();
                }, 200);

                setTimeout(() => {
                    num1page = 1;
                    document.getElementById('frame-content1').classList.remove('active');
                    document.getElementById('frame-content2').classList.remove('active');
                    document.getElementById('frame-content8').classList.remove('active');
                    // document.getElementById('frame-content3').classList.add('active');
                    document.getElementById('frame-content4').classList.add('active');
                    loadFoundationsFromDatabase();
                    document.getElementById('bottom-nav').classList.add('active');
                }, 300);
            } else {
                bool1yn = 0;
                alert(data.message || 'Login failed');
            }
        })
        .catch(error => {
            console.error('Login fetch error:', error);
            alert('Connection error during login');
        });
    // document.getElementById('frame-content1').classList.remove('active');
    // document.getElementById('frame-content2').classList.remove('active');
    // document.getElementById('frame-content3').classList.add('active');
    // document.getElementById('bottom-nav').classList.add('active');


}


function register1form(){
    let h = 0;

    const new1username = document.getElementById('new-username');
    const new1email = document.getElementById('new-email');
    const new1password = document.getElementById('new-password');
    const confirm1password = document.getElementById('confirm-password');

    if (new1username.value.trim() === ''){
        h = 1;
        document.getElementById('msg-new-username').innerHTML = '*****';
    }
    else{
        document.getElementById('msg-new-username').innerHTML = '';
    }

    if (new1email.value.trim() === ''){
        h = 1;
        document.getElementById('msg-new-email').innerHTML = '*****';
    }
    else{
        document.getElementById('msg-new-email').innerHTML = '';
    }
    
    if (new1password.value.trim() === ''){
        h = 1;
        document.getElementById('msg-new-password').innerHTML = '*****';
    }
    else{
        document.getElementById('msg-new-password').innerHTML = '';
    }

    if (confirm1password.value.trim() === ''){
        h = 1;
        document.getElementById('msg-confirm-password').innerHTML = '*****';
    }else if ( confirm1password.value !== new1password.value ) {
        h = 1;
        document.getElementById('msg-confirm-password').innerHTML = 'k';
    }
    else{
        document.getElementById('msg-confirm-password').innerHTML = '';
    }

    if(h===1){ return;}

    const sdata = new URLSearchParams();
    // sdata.append('msg',text);
    sdata.append('NUSERNAME',new1username.value);
    sdata.append('NEMAIL',new1email.value);
    sdata.append('NPASSWORD',new1password.value);
    sdata.append('NEWACCONNT','true');

    fetch("data.php", {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: sdata
        })
        .then(async res => {
            const text = await res.text();
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error('Register response parse error:', text);
                return { success: false, message: 'Unexpected server response3' };
            }
        })
        .then(data => {
            if (data.success === true) {
                alert(data.message || 'Registration successful');
                moveToLoginScreen('idlogin-card1');
            } else {
                alert(data.message || 'Registration failed');
            }
        })
        .catch(error => {
            console.error('Register fetch error:', error);
            alert('Connection error during registration');
        });

}


async function loadFoundationsFromDatabase() {

    try {
        const response = await fetch('dataf.php');
        const result = await response.json();

        if (!response.ok || result.success !== true) {
            throw new Error(result.message || 'Failed to load foundations');
        }

        window.foundationsData = result.data;

        document.getElementById('servicesGrid').innerHTML = result.data.map(service => `
            <button class="service-card" onclick="fticektselection(${service.id})" data-service-id="${service.id}">
                <span class="service-title">${service.foundation1name}</span>
            </button>
        `).join('');

        return result.data; 

    } catch (error) {
        console.error('Foundations load error:', error);
        window.foundationsData = [];
        return [];
    }
}
//  document.getElementById("login-form").addEventListener('submit',login1form());

// // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// // == ===== ===== ===== ===== ===== ===== ===== ===== ===== ==
// // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

let map, currentMarker;
let currentLatLng = [31.9493, 5.3250]; // ورقلة كقيمة افتراضية
let currentCityName = "ورقلة";

window.onload = () => initMap();

function initMap() {
    map = L.map('map', { zoomControl: false, attributionControl: false }).setView(currentLatLng, 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

    updateMarker(currentLatLng, currentCityName);

    // عند النقر على الخريطة
    map.on('click', (e) => {
        currentLatLng = [e.latlng.lat, e.latlng.lng];
        currentCityName = "موقع محدد";
        updateMarker(currentLatLng, currentCityName);
        updateUI(currentCityName);
    });
}

// تحديث العلامة على الخريطة
function updateMarker(latlng, label) {
    if (currentMarker) map.removeLayer(currentMarker);

    const customIcon = L.divIcon({
        className: '',
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;">
                <div style="background:#1e293b;color:#fff;font-size:10px;font-weight:bold;padding:2px 8px;border-radius:12px;border:1px solid #2dd4bf;white-space:nowrap;margin-bottom:4px;">
                    ${label}
                </div>
                <div style="width:20px;height:20px;background:#00bfa5;border-radius:50%;border:2px solid #fff;box-shadow:0 4px 6px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;">
                    <div style="width:8px;height:8px;background:#fff;border-radius:50%;"></div>
                </div>
            </div>`,
        iconSize: [80, 50],
        iconAnchor: [40, 45]
    });

    currentMarker = L.marker(latlng, { icon: customIcon }).addTo(map);
    map.setView(latlng, map.getZoom());
}

// تحديث نصوص الواجهة
function updateUI(name) {
    document.getElementById('currentStateText').innerText = name;
    document.getElementById('locationInput').value = name;
}

// إعادة التعيين لموقع ورقلة
function resetToDefaultLocation() {
    currentLatLng = [31.9493, 5.3250];
    currentCityName = "ورقلة";
    updateMarker(currentLatLng, currentCityName);
    updateUI(currentCityName);
}

// البحث عن موقع
function triggerSearch() {
    const val = document.getElementById('locationInput').value.trim();
    if (!val) return;
    currentCityName = val;
    updateMarker(currentLatLng, currentCityName);
    updateUI(currentCityName);
}

function handleSearch(e) {
    if (e.key === 'Enter') triggerSearch();
}

// تأكيد الموقع والتحويل
function confirmLocation() {
    showCustomModal("تم تأكيد الموقع", `لقد قمت باختيار ولاية <strong>${currentCityName}</strong> بنجاح.`);
}

// إظهار النافذة المنبثقة
function showCustomModal(title, text) {
    document.getElementById('modalTitle').innerHTML = title;
    document.getElementById('modalBody').innerHTML = text;
    document.getElementById('customModal').classList.add('active');
}

// إغلاق النافذة المنبثقة والانتقال للشاشة التالية
function closeModal() {
    document.getElementById('customModal').classList.remove('active');

    // إخفاء جميع الإطارات وتفعيل الإطار الرابع
    ['frame-content1', 'frame-content2', 'frame-content3', 'frame-content8'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    const f4 = document.getElementById('frame-content4');
    const nav = document.getElementById('bottom-nav');
    if (f4) f4.classList.add('active');
    if (nav) nav.classList.add('active');

    if (typeof loadFoundationsFromDatabase === 'function') {
        loadFoundationsFromDatabase();
    }
}

// =======================================================
// =======================================================
// =======================================================

// شاشة اختيار التذاكر مع دعم RTL و LTR
async function fticektselection(idfoundation){

    document.getElementById('frame-content1').classList.remove('active');
    document.getElementById('frame-content2').classList.remove('active');
    document.getElementById('frame-content3').classList.remove('active');
    document.getElementById('frame-content4').classList.remove('active');
    document.getElementById('frame-content8').classList.remove('active');
    document.getElementById('frame-contentrr4').classList.add('active');
    document.getElementById('bottom-nav').classList.add('active');

    idfoundation1 = idfoundation;

    
    const sdata = new URLSearchParams();
    // sdata.append('msg',text); 
    sdata.append('ID',idfoundation1);
    
    sdata.append('ACTION','GITT');

    fetch("gitsettaber.php", {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: sdata
        })
        .then(async res => {
            const text = await res.text();
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error('Login response parse error:', text);
                return { success: false, message: 'Unexpected server response4' };
            }
        })
        .then(data => {
            if (data.success === true) {
                
                document.getElementById('idrole').innerHTML = data.taber;
                document.getElementById('idnubernow').innerHTML = data.tabernow;
                console.log(data.data);

            } else {
                alert(data.message || 'Login failed');
            }
        })
        .catch(error => {
            console.error('Login fetch error:', error);
            alert('Connection error during login');
        });
    




}

async function gittabernumber(){
    if(idfoundation1 === null) { return;}
    console.log('Fetching taber number for foundation ID:', idfoundation1);
    try {
        const response = await fetch('dataf.php');
        const result = await response.json();

        if (!response.ok || result.success !== true) {
            throw new Error(result.message || 'Failed to load foundations');
        }

        window.foundationsData = result.data;

    } catch (error) {
        console.error('Foundations load error:', error);
        window.foundationsData = [];
        return [];
    }

}
// setInterval(gittabernumber, 10000); // استدعاء الدالة كل 10 ثوانٍ


function gittheroleandnumbernow(){

    document.getElementById('frame-content1').classList.remove('active');
    document.getElementById('frame-content2').classList.remove('active');
    document.getElementById('frame-content3').classList.remove('active');
    document.getElementById('frame-content4').classList.remove('active');
    document.getElementById('frame-content8').classList.remove('active');
    document.getElementById('frame-contentrr4').classList.remove('active');
    document.getElementById('frame-content5').classList.add('active');
    document.getElementById('bottom-nav').classList.add('active');

    const sdata = new URLSearchParams();
    // sdata.append('msg',text); 
    console.log(iduser);
    sdata.append('ID',idfoundation1);
    sdata.append('IDUSER',iduser);
    sdata.append('ACTION','SITT');

    fetch("gitsettaber.php", {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: sdata
        })
        .then(async res => {
            const text = await res.text();
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error('Login response parse error:', text);
                return { success: false, message: 'Unexpected server response1' };
            }
        })
        .then(data => { 
                
                console.log(data);

            
        })
        .catch(error => {
            console.error('Login fetch error:', error);
            alert('Connection error during login');
        });


}

// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================

// شاشة التنقل بين الصفحات مع دعم RTL و LTR
function fnavigation1bar(numberb){

    if(num1page!=0){
        const Home    = document.getElementById('home'); 
        const Ticket  = document.getElementById('ticket'); 
        const Bell    = document.getElementById('bell'); 
        const Setting = document.getElementById('setting'); 

        if(numberb===1){
            Ticket.classList.remove('active');
            Bell.classList.remove('active');
            Setting.classList.remove('active');
            Home.classList.add('active');


            document.getElementById('frame-content1').classList.remove('active');
            document.getElementById('frame-content2').classList.remove('active');
            document.getElementById('frame-content3').classList.remove('active');
            document.getElementById('frame-content5').classList.remove('active');
            document.getElementById('frame-content6').classList.remove('active');
            document.getElementById('frame-content7').classList.remove('active');
            document.getElementById('frame-content8').classList.remove('active');
            document.getElementById('frame-contentrr4').classList.remove('active');
            document.getElementById('frame-content4').classList.add('active');
            loadFoundationsFromDatabase();
            document.getElementById('bottom-nav').classList.add('active');

        }

        else if(numberb===2){
            Home.classList.remove('active');
            Bell.classList.remove('active');
            Setting.classList.remove('active');
            Ticket.classList.add('active');

            document.getElementById('frame-content1').classList.remove('active');
            document.getElementById('frame-content2').classList.remove('active');
            document.getElementById('frame-content3').classList.remove('active');
            document.getElementById('frame-content4').classList.remove('active');
            document.getElementById('frame-content5').classList.remove('active');
            document.getElementById('frame-content7').classList.remove('active');
            document.getElementById('frame-content8').classList.remove('active');
            document.getElementById('frame-contentrr4').classList.remove('active');
            document.getElementById('frame-content6').classList.add('active');
            document.getElementById('bottom-nav').classList.add('active');

        }
        
        else if(numberb===3){
            Home.classList.remove('active');
            Ticket.classList.remove('active');
            Setting.classList.remove('active');
            Bell.classList.add('active');


            document.getElementById('frame-content1').classList.remove('active');
            document.getElementById('frame-content2').classList.remove('active');
            document.getElementById('frame-content3').classList.remove('active');
            document.getElementById('frame-content4').classList.remove('active');
            document.getElementById('frame-content5').classList.remove('active');
            document.getElementById('frame-content6').classList.remove('active');
            document.getElementById('frame-content8').classList.remove('active');
            document.getElementById('frame-contentrr4').classList.remove('active');
            document.getElementById('frame-content7').classList.add('active');
            document.getElementById('bottom-nav').classList.add('active');
        }

        else if(numberb===4){

            Home.classList.remove('active');
            Ticket.classList.remove('active');
            Bell.classList.remove('active');
            Setting.classList.add('active');

            document.getElementById('frame-content1').classList.remove('active');
            document.getElementById('frame-content2').classList.remove('active');
            document.getElementById('frame-content3').classList.remove('active');
            document.getElementById('frame-content4').classList.remove('active');
            document.getElementById('frame-content5').classList.remove('active');
            document.getElementById('frame-content6').classList.remove('active');
            document.getElementById('frame-content7').classList.remove('active');
            document.getElementById('frame-contentrr4').classList.remove('active');
            document.getElementById('frame-content8').classList.add('active');
            document.getElementById('bottom-nav').classList.add('active');
            
            // تحديث واجهة الإعدادات - Update settings UI
            setTimeout(updateAppSettingsUI, 100);
        }
    }
    
}

// =======================================================
// نظام الترجمات المتكامل - Complete Translation System
// =======================================================

// كائن الترجمات الشامل - Complete Translations Object
const allTranslations = {
    ar: {
        // شاشة اختيار اللغة - Language Selection Screen
        selectLanguage: 'اختر اللغة',
        
        // شاشة تسجيل الدخول - Login Screen
        loginTitle: 'تسجيل الدخول',
        loginSubtitle: 'مرحبا بك مجددا في ماتستناش',
        usernameEmail: 'اسم المستخدم / البريد الإلكتروني',
        password: 'كلمة المرور',
        forgotPassword: 'نسيت كلمة المرور؟',
        loginButton: 'تسجيل الدخول',
        or: 'أو عبر',
        facebook: 'Facebook',
        google: 'Google',
        noAccount: 'ليس لديك حساب؟',
        createAccount: 'إنشاء حساب جديد',
        
        // شاشة إنشاء حساب - Registration Screen
        registerTitle: 'إنشاء حساب جديد',
        registerSubtitle: 'انضم إلى ماتستناش اليوم',
        username: 'اسم المستخدم',
        email: 'البريد الإلكتروني',
        createAccountButton: 'إنشاء الحساب',
        backToLogin: 'العودة إلى تسجيل الدخول',
        confirmPassword: 'تأكيد كلمة المرور',
        
        // بطاقات المعلومات - Info Cards
        securityTitle: 'أمان وحماية',
        securitySubtitle: 'مضمون',
        speedTitle: 'بسرعة في التنفيذ',
        speedSubtitle: 'فوري',
        
        // شاشة تحديد الموقع - Location Selection Screen
        chooseLocation: 'اختر موقعك',
        locationSubtitle: 'ساعدنا في تحديد موقعك لتقديم أفضل الخدمات',
        locationPlaceholder: 'اكتب اسم ولايتك هنا...',
        currentLocation: 'تم تحديد موقعك الحالي: ولاية',
        locationNote: 'يمكنك تغيير الموقع يدوياً عبر البحث أو اختيار ولاية من الخريطة.',
        confirmLocation: 'تأكيد المتابعة',
        
        // شاشة اختيار الخدمة - Service Selection Screen
        chooseService: 'اختر الخدمة',
        serviceNote: 'جميع الخدمات يتم تنفيذها في أسرع وقت ممكن وبأعلى معايير الدقة.',
        
        // أسماء الخدمات - Service Names
        algerianTelecom: 'اتصالات الجزائر',
        algerianPost: 'بريد الجزائر',
        insurance: 'شركات التأمين',
        court: 'المحكمة',
        privateClinics: 'العيادات الخاصة',
        hospitals: 'المستشفيات العمومية',
        banks: 'بنوك',
        mobilisAgency: 'وكالة موبيليس',
        
        // رسائل الخطأ والتحقق - Error Messages
        requiredField: '*****',
        loginError: 'فشل تسجيل الدخول',
        connectionError: 'خطأ في الاتصال أثناء تسجيل الدخول',
        passwordMismatch: 'كلمات المرور غير متطابقة',
        locationConfirmed: 'تم تأكيد الموقع',
        locationConfirmedMsg: 'لقد قمت باختيار ولاية',
        locationConfirmedMsgEnd: 'كموقعك الحالي للخدمات بنجاح.',
        notFound: 'عذراً، لم نتمكن من العثور على هذا الموقع بالجزائر. يرجى التحقق من الاسم المدخل.',
        alert: 'تنبيه',
        error: 'خطأ',
        searchError: 'حدث عطل أثناء الاتصال بخدمة البحث.',
        customLocation: 'موقع مخصص',
        
        // ترجمات الإعدادات - Settings Translations
        settings: 'الإعدادات',
        language: 'اللغة',
        theme: 'المظهر',
        light: 'فاتح',
        dark: 'داكن',
        fontSize: 'حجم الخط',
        small: 'صغير',
        medium: 'متوسط',
        large: 'كبير',
        xlarge: 'كبير جداً',
        notifications: 'الإشعارات',
        enableNotifications: 'تفعيل الإشعارات',
        emailNotifications: 'إشعارات البريد الإلكتروني',
        smsNotifications: 'إشعارات الرسائل النصية',
        highContrast: 'تباين عالي',
        soundEffects: 'المؤثرات الصوتية',
        autoSaveLocation: 'حفظ الموقع تلقائياً',
        additionalSettings: 'إعدادات إضافية',
        reset: 'إعادة تعيين',
        close: 'إغلاق',
        
        // القائمة السفلية - Footer
        precision: 'الدقة',
        urgency: 'السرعة',
        reliability: 'الموثوقية'
    },
    
    en: {
        // Language Selection Screen
        selectLanguage: 'Select Language',
        
        // Login Screen
        loginTitle: 'Sign In',
        loginSubtitle: 'Welcome back to Matstanash',
        usernameEmail: 'Username / Email',
        password: 'Password',
        forgotPassword: 'Forgot Password?',
        loginButton: 'Sign In',
        or: 'or via',
        facebook: 'Facebook',
        google: 'Google',
        noAccount: "Don't have an account?",
        createAccount: 'Create New Account',
        
        // Registration Screen
        registerTitle: 'Create New Account',
        registerSubtitle: 'Join Matstanash Today',
        username: 'Username',
        email: 'Email Address',
        createAccountButton: 'Create Account',
        backToLogin: 'Back to Sign In',
        confirmPassword: 'Confirm Password',
        
        // Info Cards
        securityTitle: 'Security & Protection',
        securitySubtitle: 'Guaranteed',
        speedTitle: 'Quick Execution',
        speedSubtitle: 'Instant',
        
        // Location Selection Screen
        chooseLocation: 'Choose Your Location',
        locationSubtitle: 'Help us identify your location to provide the best services',
        locationPlaceholder: 'Type your state name here...',
        currentLocation: 'Your current location is set to:',
        locationNote: 'You can change your location manually via search or by selecting a state from the map.',
        confirmLocation: 'Confirm & Continue',
        
        // Service Selection Screen
        chooseService: 'Select Service',
        serviceNote: 'All services are executed as quickly as possible with the highest standards of accuracy.',
        
        // Service Names
        algerianTelecom: 'Algerian Telecom',
        algerianPost: 'Algerian Post',
        insurance: 'Insurance Companies',
        court: 'Court',
        privateClinics: 'Private Clinics',
        hospitals: 'Public Hospitals',
        banks: 'Banks',
        mobilisAgency: 'Mobilis Agency',
        
        // Error Messages
        requiredField: '*****',
        loginError: 'Login failed',
        connectionError: 'Connection error during login',
        passwordMismatch: 'Passwords do not match',
        locationConfirmed: 'Location Confirmed',
        locationConfirmedMsg: 'You have successfully selected',
        locationConfirmedMsgEnd: 'as your current service location.',
        notFound: 'Sorry, we could not find this location in Algeria. Please check the entered name.',
        alert: 'Alert',
        error: 'Error',
        searchError: 'An error occurred while connecting to the search service.',
        customLocation: 'Custom Location',
        
        // Settings Translations
        settings: 'Settings',
        language: 'Language',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        fontSize: 'Font Size',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
        xlarge: 'Extra Large',
        notifications: 'Notifications',
        enableNotifications: 'Enable notifications',
        emailNotifications: 'Email notifications',
        smsNotifications: 'SMS notifications',
        highContrast: 'High Contrast',
        soundEffects: 'Sound Effects',
        autoSaveLocation: 'Auto-save Location',
        additionalSettings: 'Additional Settings',
        reset: 'Reset',
        close: 'Close',
        
        // Footer
        precision: 'PRECISION',
        urgency: 'URGENCY',
        reliability: 'RELIABILITY'
    },
    
    fr: {
        // Language Selection Screen
        selectLanguage: 'Choisir la langue',
        
        // Login Screen
        loginTitle: 'Connexion',
        loginSubtitle: 'Bienvenue à nouveau chez Matstanash',
        usernameEmail: 'Nom d\'utilisateur / Email',
        password: 'Mot de passe',
        forgotPassword: 'Mot de passe oublié?',
        loginButton: 'Se connecter',
        or: 'ou via',
        facebook: 'Facebook',
        google: 'Google',
        noAccount: "Vous n'avez pas de compte?",
        createAccount: 'Créer un nouveau compte',
        
        // Registration Screen
        registerTitle: 'Créer un nouveau compte',
        registerSubtitle: 'Rejoignez Matstanash aujourd\'hui',
        username: 'Nom d\'utilisateur',
        email: 'Adresse e-mail',
        createAccountButton: 'Créer un compte',
        backToLogin: 'Retour à la connexion',
        confirmPassword: 'Confirmer le mot de passe',
        
        // Info Cards
        securityTitle: 'Sécurité et protection',
        securitySubtitle: 'Garantie',
        speedTitle: 'Exécution rapide',
        speedSubtitle: 'Instantané',
        
        // Location Selection Screen
        chooseLocation: 'Choisissez votre localisation',
        locationSubtitle: 'Aidez-nous à identifier votre localisation pour fournir les meilleurs services',
        locationPlaceholder: 'Tapez le nom de votre wilaya ici...',
        currentLocation: 'Votre localisation actuelle est définie sur:',
        locationNote: 'Vous pouvez modifier votre localisation manuellement via la recherche ou en sélectionnant une wilaya sur la carte.',
        confirmLocation: 'Confirmer et continuer',
        
        // Service Selection Screen
        chooseService: 'Sélectionner le service',
        serviceNote: 'Tous les services sont exécutés aussi rapidement que possible avec les plus hauts standards de précision.',
        
        // Service Names
        algerianTelecom: 'Algérie Télécom',
        algerianPost: 'Poste Algérienne',
        insurance: 'Compagnies d\'assurance',
        court: 'Tribunal',
        privateClinics: 'Cliniques privées',
        hospitals: 'Hôpitaux publics',
        banks: 'Banques',
        mobilisAgency: 'Agence Mobilis',
        
        // Error Messages
        requiredField: '*****',
        loginError: 'Connexion échouée',
        connectionError: 'Erreur de connexion lors de la connexion',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        locationConfirmed: 'Localisation confirmée',
        locationConfirmedMsg: 'Vous avez sélectionné avec succès',
        locationConfirmedMsgEnd: 'comme votre localisation actuelle pour les services.',
        notFound: 'Désolé, nous n\'avons pas pu trouver cet emplacement en Algérie. Veuillez vérifier le nom saisi.',
        alert: 'Alerte',
        error: 'Erreur',
        searchError: 'Une erreur s\'est produite lors de la connexion au service de recherche.',
        customLocation: 'Localisation personnalisée',
        
        // Settings Translations
        settings: 'Paramètres',
        language: 'Langue',
        theme: 'Thème',
        light: 'Clair',
        dark: 'Sombre',
        fontSize: 'Taille de police',
        small: 'Petit',
        medium: 'Moyen',
        large: 'Grand',
        xlarge: 'Très grand',
        notifications: 'Notifications',
        enableNotifications: 'Activer les notifications',
        emailNotifications: 'Notifications par e-mail',
        smsNotifications: 'Notifications par SMS',
        highContrast: 'Contraste élevé',
        soundEffects: 'Effets sonores',
        autoSaveLocation: 'Sauvegarde automatique de la localisation',
        additionalSettings: 'Paramètres supplémentaires',
        reset: 'Réinitialiser',
        close: 'Fermer',
        
        // Footer
        precision: 'PRÉCISION',
        urgency: 'URGENCE',
        reliability: 'FIABILITÉ'
    }
};

// دالة للحصول على الترجمة - Get translation function
function t(key, lang = getCurrentLanguage()) {
    if (allTranslations[lang] && allTranslations[lang][key]) {
        return allTranslations[lang][key];
    }
    // Return English translation as fallback
    if (allTranslations.en && allTranslations.en[key]) {
        return allTranslations.en[key];
    }
    return key;
}

// دالة للحصول على اللغة الحالية - Get current language
function getCurrentLanguage() {
    return document.documentElement.lang || 'en';
}

// دالة لتطبيق الترجمات على الصفحة - Apply translations to page
function updatePageLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    
    // تحديث جميع حقول الإدخال - Update all input fields
    const inputMap = {
        'username': 'usernameEmail',
        'password': 'password',
        'new-username': 'username',
        'new-email': 'email',
        'new-password': 'password',
        'confirm-password': 'confirmPassword',
        'locationInput': 'locationPlaceholder'
    };
    
    Object.keys(inputMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.setAttribute('placeholder', t(inputMap[id], lang));
        }
    });
    
    // تحديث العناوين - Update headings
    const loginCard1 = document.getElementById('idlogin-card1');
    if (loginCard1) {
        const heading = loginCard1.querySelector('h2');
        if (heading) heading.textContent = t('loginTitle', lang);
        const subtitle = loginCard1.querySelector('.subtitle');
        if (subtitle) subtitle.textContent = t('loginSubtitle', lang);
    }
    
    const loginCard2 = document.getElementById('idlogin-card2');
    if (loginCard2) {
        const heading = loginCard2.querySelector('h2');
        if (heading) heading.textContent = t('registerTitle', lang);
        const subtitle = loginCard2.querySelector('.subtitle');
        if (subtitle) subtitle.textContent = t('registerSubtitle', lang);
    }
    
    // تحديث الأزرار - Update buttons
    document.querySelectorAll('button').forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (text.includes('نسيت') || text.includes('forgot')) {
            btn.innerHTML = t('forgotPassword', lang) + ' <i class="fas fa-question"></i>';
        } else if (text.includes('تسجيل الدخول') || text.includes('sign')) {
            btn.innerHTML = t('loginButton', lang) + ' <i class="fas fa-arrow-left"></i>';
        } else if (text.includes('إنشاء الحساب') || text.includes('create account')) {
            btn.innerHTML = t('createAccountButton', lang) + ' <i class="fas fa-arrow-left"></i>';
        } else if (text.includes('تأكيد المتابعة') || text.includes('confirm')) {
            btn.innerHTML = t('confirmLocation', lang) + ' <i class="fas fa-arrow-left"></i>';
        } else if (text.includes('العودة') || text.includes('back')) {
            btn.textContent = t('backToLogin', lang);
        }
    });
    
    // تحديث نص الفاصل - Update separator
    const separator = document.querySelector('.separator');
    if (separator) separator.textContent = t('or', lang);
    
    // تحديث نصوص البطاقات - Update card texts
    const langTitle = document.querySelector('.lang-title');
    if (langTitle) langTitle.textContent = t('selectLanguage', lang);
    
    // تحديث نص الخدمات - Update service titles
    document.querySelectorAll('.service-title').forEach(el => {
        const text = el.textContent.toLowerCase();
        if (text.includes('اتصالات') || text.includes('telecom')) {
            el.textContent = t('algerianTelecom', lang);
        } else if (text.includes('بريد') || text.includes('post')) {
            el.textContent = t('algerianPost', lang);
        } else if (text.includes('تأمين') || text.includes('insurance')) {
            el.textContent = t('insurance', lang);
        } else if (text.includes('محكمة') || text.includes('court')) {
            el.textContent = t('court', lang);
        } else if (text.includes('عيادات') || text.includes('clinic')) {
            el.textContent = t('privateClinics', lang);
        } else if (text.includes('مستشفيات') || text.includes('hospital')) {
            el.textContent = t('hospitals', lang);
        } else if (text.includes('بنوك') || text.includes('bank')) {
            el.textContent = t('banks', lang);
        } else if (text.includes('موبيليس') || text.includes('mobilis')) {
            el.textContent = t('mobilisAgency', lang);
        }
    });
    
    // تحديث نص التذييل - Update footer text
    const footerText = document.querySelector('.footer-text');
    if (footerText) {
        footerText.textContent = t('precision', lang) + ' • ' + t('urgency', lang) + ' • ' + t('reliability', lang);
    }
    
    // تحديث نصوص الموقع - Update location texts
    const chooseLocHeading = document.querySelector('.flex-col h2');
    if (chooseLocHeading && chooseLocHeading.textContent.includes('اختر')) {
        chooseLocHeading.textContent = t('chooseLocation', lang);
    }
    
    const chooseServiceHeading = document.querySelector('div.flex-grow h2');
    if (chooseServiceHeading && chooseServiceHeading.textContent.includes('خدمة')) {
        chooseServiceHeading.textContent = t('chooseService', lang);
    }
    
    // تحديث واجهة الإعدادات في التطبيق - Update app settings UI
    if (document.getElementById('appNotificationsToggle')) {
        updateAppSettingsUI();
    }
}

// تحديث دالة language1begin لاستخدام نظام الترجمة المتقدم - Updated language1begin function
const originalLanguage1begin = language1begin;
language1begin = function(element1lang) {
    const activeButton = typeof event !== 'undefined' ? event.currentTarget : null;

    document.querySelectorAll('.language-btn').forEach(btn => btn.classList.remove('active'));
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // تطبيق نظام الترجمة الشامل - Apply complete translation system
    updatePageLanguage(element1lang);

    setTimeout(showLoginScreen, 300);
};

// تطبيق الترجمات عند تحميل الصفحة - Apply translations on page load
document.addEventListener('DOMContentLoaded', function() {
    // تطبيق الترجمة الافتراضية (الإنجليزية) - Apply default translation (English)
    updatePageLanguage('en');
});

// =======================================================
// نظام إعدادات التطبيق - Application Settings System
// =======================================================

const AppSettings = {
    // إعدادات افتراضية - Default settings
    defaults: {
        language: 'en',
        theme: 'light',
        notifications: true,
        soundEnabled: true,
        saveLoginData: false,
        autoSaveLocation: true,
        fontSize: 'medium',
        highContrast: false,
        notifications_email: true,
        notifications_sms: false
    },

    // تخزين محلي - Local storage key
    storageKey: 'matstanashAppSettings',

    // الحصول على جميع الإعدادات - Get all settings
    getAll: function() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : this.defaults;
        } catch (error) {
            console.error('Error reading settings:', error);
            return this.defaults;
        }
    },

    // الحصول على إعداد واحد - Get single setting
    get: function(key) {
        const settings = this.getAll();
        return settings[key] !== undefined ? settings[key] : this.defaults[key];
    },

    // تعيين إعداد واحد - Set single setting
    set: function(key, value) {
        const settings = this.getAll();
        settings[key] = value;
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(settings));
            this.applySettings();
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    },

    // تعيين عدة إعدادات - Set multiple settings
    setMultiple: function(obj) {
        const settings = this.getAll();
        Object.assign(settings, obj);
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(settings));
            this.applySettings();
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    },

    // إعادة تعيين الإعدادات - Reset to defaults
    reset: function() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.defaults));
            this.applySettings();
            return true;
        } catch (error) {
            console.error('Error resetting settings:', error);
            return false;
        }
    },

    // تطبيق الإعدادات على الصفحة - Apply settings to page
    applySettings: function() {
        const settings = this.getAll();

        // تطبيق اللغة - Apply language
        if (settings.language && settings.language !== document.documentElement.lang) {
            updatePageLanguage(settings.language);
        }

        // تطبيق المظهر - Apply theme
        this.applyTheme(settings.theme);

        // تطبيق حجم الخط - Apply font size
        this.applyFontSize(settings.fontSize);

        // تطبيق التباين العالي - Apply high contrast
        this.applyHighContrast(settings.highContrast);

        // تحديث toggle المظهر - Update theme toggle
        const themeToggle = document.querySelector('.switch input');
        if (themeToggle) {
            themeToggle.checked = (settings.theme === 'dark');
        }
    },

    // تطبيق المظهر - Apply theme
    applyTheme: function(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#ffffff';
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#000000';
        }
    },

    // تطبيق حجم الخط - Apply font size
    applyFontSize: function(size) {
        const sizeMap = {
            'small': '12px',
            'medium': '14px',
            'large': '16px',
            'xlarge': '18px'
        };

        const fontSize = sizeMap[size] || sizeMap['medium'];
        document.body.style.fontSize = fontSize;
        document.documentElement.setAttribute('data-font-size', size);
    },

    // تطبيق التباين العالي - Apply high contrast
    applyHighContrast: function(enabled) {
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    },

    // تبديل المظهر - Toggle theme
    toggleTheme: function() {
        const currentTheme = this.get('theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.set('theme', newTheme);
        return newTheme;
    },

    // تبديل الإشعارات - Toggle notifications
    toggleNotifications: function() {
        const current = this.get('notifications');
        this.set('notifications', !current);
        return !current;
    },

    // تبديل صوت الإشعارات - Toggle notification sound
    toggleSound: function() {
        const current = this.get('soundEnabled');
        this.set('soundEnabled', !current);
        return !current;
    },

    // تحديث إعدادات الإشعارات - Update notification preferences
    updateNotifications: function(email, sms) {
        return this.setMultiple({
            notifications_email: email,
            notifications_sms: sms
        });
    },

    // الحصول على معلومات الإعدادات - Get settings info
    getInfo: function() {
        const settings = this.getAll();
        return {
            language: settings.language,
            theme: settings.theme,
            notifications: settings.notifications,
            soundEnabled: settings.soundEnabled,
            fontSize: settings.fontSize,
            highContrast: settings.highContrast,
            saveLoginData: settings.saveLoginData,
            autoSaveLocation: settings.autoSaveLocation,
            emailNotifications: settings.notifications_email,
            smsNotifications: settings.notifications_sms
        };
    }
};

// تطبيق الإعدادات عند تحميل الصفحة - Apply settings on page load
document.addEventListener('DOMContentLoaded', function() {
    // تحميل وتطبيق الإعدادات المحفوظة - Load and apply saved settings
    AppSettings.applySettings();

    // إعداد toggle المظهر - Setup theme toggle
    const themeToggle = document.querySelector('.switch input');
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            AppSettings.toggleTheme();
        });
    }
});

// دالة لتحديث واجهة الإعدادات داخل التطبيق - Update app settings UI
function updateAppSettingsUI() {
    const settings = AppSettings.getAll();

    // تحديث اللغات - Update language buttons
    document.querySelectorAll('[id^="settingLang"]').forEach(btn => {
        btn.style.borderColor = '#d1d5db';
        btn.style.backgroundColor = '#ffffff';
    });
    const langBtn = document.getElementById('settingLang' + settings.language.toUpperCase());
    if (langBtn) {
        langBtn.style.borderColor = '#3b82f6';
        langBtn.style.backgroundColor = '#eff6ff';
    }

    // تحديث المظهر - Update theme radio
    document.querySelectorAll('input[name="appTheme"]').forEach(radio => {
        radio.checked = (radio.value === settings.theme);
    });

    // تحديث حجم الخط - Update font size
    const fontSelect = document.querySelector('select');
    if (fontSelect) fontSelect.value = settings.fontSize;

    // تحديث الإشعارات - Update notifications
    const notifToggle = document.getElementById('appNotificationsToggle');
    const emailNotif = document.getElementById('appEmailNotifications');
    const smsNotif = document.getElementById('appSmsNotifications');
    if (notifToggle) notifToggle.checked = settings.notifications;
    if (emailNotif) emailNotif.checked = settings.notifications_email;
    if (smsNotif) smsNotif.checked = settings.notifications_sms;

    // تحديث الإعدادات الإضافية - Update additional settings
    const highContrast = document.getElementById('appHighContrast');
    const soundToggle = document.getElementById('appSoundToggle');
    const autoLocation = document.getElementById('appAutoLocation');
    if (highContrast) highContrast.checked = settings.highContrast;
    if (soundToggle) soundToggle.checked = settings.soundEnabled;
    if (autoLocation) autoLocation.checked = settings.autoSaveLocation;
}

// دالة حفظ الإعدادات على السيرفر - Save settings to server
function saveSettingsToServer() {
    // التحقق من وجود folder1 - Check if folder1 exists
    if (!folder1 || folder1.trim() === '') {
        showCustomModal('خطأ', 'يجب تسجيل الدخول أولاً لحفظ الإعدادات');
        return;
    }

    const settings = AppSettings.getAll();
    
    // إرسال الإعدادات إلى السيرفر - Send settings to server
    const sdata = new URLSearchParams();
    sdata.append('ACTION', 'SAVE_SETTINGS');
    sdata.append('FOLDER', folder1);
    sdata.append('SETTINGS', JSON.stringify(settings));

    fetch("data.php", {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: sdata
    })
    .then(async res => {
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch (error) {
            console.error('Settings save parse error:', text);
            return { success: false, message: 'فشل حفظ الإعدادات' };
        }
    })
    .then(data => {
        if (data.success === true) {
            showCustomModal('تم', 'تم حفظ الإعدادات بنجاح في السيرفر');
            console.log('Settings saved successfully:', data);
        } else {
            showCustomModal('خطأ', data.message || 'فشل حفظ الإعدادات');
            console.error('Settings save error:', data);
        }
    })
    .catch(error => {
        console.error('Settings save fetch error:', error);
        showCustomModal('خطأ', 'حدث عطل أثناء حفظ الإعدادات');
    });
}

// دالة تحميل الإعدادات من السيرفر - Load settings from server
function loadSettingsFromServer() {
    if (!folder1 || folder1.trim() === '') {
        console.warn('Cannot load settings: folder1 is not set');
        return;
    }

    const sdata = new URLSearchParams();
    sdata.append('ACTION', 'LOAD_SETTINGS');
    sdata.append('FOLDER', folder1);

    fetch("data.php", {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: sdata
    })
    .then(async res => {
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch (error) {
            console.error('Settings load parse error:', text);
            return { success: false };
        }
    })
    .then(data => {
        if (data.success === true && data.settings) {
            // تطبيق الإعدادات المحملة - Apply loaded settings
            const loadedSettings = JSON.parse(data.settings);
            AppSettings.setMultiple(loadedSettings);
            AppSettings.applySettings();
            console.log('Settings loaded from server:', loadedSettings);
        } else {
            console.log('No saved settings found on server, using defaults');
        }
    })
    .catch(error => {
        console.error('Settings load fetch error:', error);
    });
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModal'); // استبدل 'settingsModal' بالـ id الخاص بالنافذة لديك
    if (modal) {
        modal.classList.remove('active'); // أو modal.style.display = 'none'; بحسب تصميمك
    }
}
// تصدير AppSettings للاستخدام العام - Export AppSettings
window.AppSettings = AppSettings;
// window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
// window.updateSettingsUI = updateSettingsUI;
// window.updateSettingsLabels = updateSettingsLabels;
window.updateAppSettingsUI = updateAppSettingsUI;
window.saveSettingsToServer = saveSettingsToServer;
window.loadSettingsFromServer = loadSettingsFromServer;


