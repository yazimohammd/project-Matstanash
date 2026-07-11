

setTimeout(() => {
    document.getElementById('splash-screen').classList.remove('active');
    document.getElementById('language-screen').classList.add('active');
}, 3000); // عرض شاشة البداية لمدة ثانيتين

function language1begin(element1lang){
    // تحديث حالة الأزرار النشطة
    document.querySelectorAll('.language-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    document.documentElement.lang = element1lang;
    document.documentElement.dir = (element1lang === 'ar') ? 'rtl' : 'ltr';

    // ترجمة واجهة المستخدم بناءً على اللغة
    const translations = {
        en: { title: 'Select Language' },
        ar: { title: 'اختر اللغة' },
        fr: { title: 'Choisir la langue' }
    };
    
    document.querySelector('.lang-title').innerText = translations[element1lang].title;

    // الانتظار قليلاً قبل الانتقال للشاشة التالية
    setTimeout(showLoginScreen, 300);
}

function showLoginScreen() {
    document.getElementById('frame-content1').classList.remove('active');
    document.getElementById('frame-content3').classList.remove('active');
    document.getElementById('frame-content2').classList.add('active');
    document.getElementById('bottom-nav').classList.add('active');
}

// 000000000000000000000000000000000000000000000000000
// 000000000000000000000000000000000000000000000000000
// 000000000000000000000000000000000000000000000000000

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
        document.getElementById('msg-password').innerHTML = '*****';
        h = 1;
    }
    else{
        document.getElementById('msg-password').innerHTML = '';
    }

    if(h===1){ return;}

    

    document.getElementById('frame-content1').classList.remove('active');
    document.getElementById('frame-content2').classList.remove('active');
    document.getElementById('frame-content3').classList.add('active');
    document.getElementById('bottom-nav').classList.add('active');

}

//  document.getElementById("login-form").addEventListener('submit',login1form());

// ==============================================================
// ==============================================================
// ==============================================================
let map;
let currentMarker;
let currentLatLng = [31.9493, 5.3250]; // ورقلة كقيمة افتراضية
let currentCityName = "ورقلة";

// تهيئة الخريطة عند تحميل الصفحة
window.onload = function() {
    initMap();
};

function initMap() {
    // إعداد خريطة هادئة وجميلة تحاكي المظهر المتناسق للصورة (CartoDB Positron)
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView(currentLatLng, 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    updateMarker(currentLatLng, currentCityName);

    // تفعيل ميزة النقر على الخريطة لتغيير الموقع تلقائياً
    map.on('click', async function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        currentLatLng = [lat, lng];
        
        // محاولة جلب اسم المكان من الإحداثيات (Reverse Geocoding) باستخدام API مجاني
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`);
            const data = await response.json();
            if (data && data.address) {
                const city = data.address.state || data.address.city || data.address.town || "موقع مخصص";
                currentCityName = city.replace("ولاية ", "");
            } else {
                currentCityName = "موقع مخصص";
            }
        } catch (error) {
            currentCityName = "موقع محدد";
        }

        updateMarker(currentLatLng, currentCityName);
        updateUIForLocation(currentCityName);
    });
}

// تحديث العلامة المخصصة على الخريطة
function updateMarker(latlng, label) {
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    // أيقونة مخصصة رائعة تتطابق مع لون التصميم الفيروزي وعلامة ورقلة بالصورة
    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div class="relative flex flex-col items-center">
                <div class="bg-[#1e293b] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md whitespace-nowrap mb-1 border border-teal-400">
                    ${label}
                </div>
                <div class="relative flex items-center justify-center">
                    <div class="pulse-ring"></div>
                    <div class="w-5 h-5 bg-[#00bfa5] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <div class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>
        `,
        iconSize: [80, 50],
        iconAnchor: [40, 45]
    });

    currentMarker = L.marker(latlng, { icon: customIcon }).addTo(map);
    map.setView(latlng, map.getZoom());
}

// تحديث نصوص الواجهة
function updateUIForLocation(name) {
    document.getElementById('currentStateText').innerText = name;
    document.getElementById('locationInput').value = name;
}

// إعادة التعيين للموقع الافتراضي (ورقلة) عند الضغط على زر الكروسهير
function resetToDefaultLocation() {
    currentLatLng = [31.9493, 5.3250];
    currentCityName = "ورقلة";
    map.setView(currentLatLng, 12);
    updateMarker(currentLatLng, currentCityName);
    updateUIForLocation(currentCityName);
}

// البحث عن مكان وتحريك الخريطة إليه (Geocoding)
async function triggerSearch() {
    const query = document.getElementById('locationInput').value.trim();
    if (!query) return;

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', الجزائر')}&accept-language=ar&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            currentLatLng = [lat, lon];
            
            // استخلاص الاسم بطريقة أنظف
            let name = data[0].display_name.split(',')[0];
            currentCityName = name.replace("ولاية ", "");
            
            updateMarker(currentLatLng, currentCityName);
            updateUIForLocation(currentCityName);
            map.setView(currentLatLng, 11);
        } else {
            showCustomModal("تنبيه", "عذراً، لم نتمكن من العثور على هذا الموقع بالجزائر. يرجى التحقق من الاسم المدخل.");
        }
    } catch (error) {
        showCustomModal("خطأ", "حدث عطل أثناء الاتصال بخدمة البحث.");
    }
}

function handleSearch(e) {
    if (e.key === 'Enter') {
        triggerSearch();
    }
}

// نافذة تأكيد مخصصة ومصقولة عند النقر على "تأكيد المتابعة"
function confirmLocation() {
    showCustomModal("تم تأكيد الموقع", `لقد قمت باختيار ولاية <strong>${currentCityName}</strong> كموقعك الحالي للخدمات بنجاح.`);
}

function showCustomModal(title, text) {
    const modal = document.getElementById('customModal');
    const container = document.getElementById('modalContainer');
    document.getElementById('modalTitle').innerHTML = title;
    document.getElementById('modalBody').innerHTML = text;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        container.classList.remove('scale-95');
        container.classList.add('scale-100');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('customModal');
    const container = document.getElementById('modalContainer');
    modal.classList.add('opacity-0');
    container.classList.remove('scale-100');
    container.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);

    document.getElementById('frame-content1').classList.remove('active');
    document.getElementById('frame-content2').classList.remove('active');
    document.getElementById('frame-content3').classList.remove('active');
    document.getElementById('frame-content4').classList.add('active');
    document.getElementById('bottom-nav').classList.add('active');


}

// =======================================================
// =======================================================
// =======================================================

function fticektselection(){

    document.getElementById('frame-content1').classList.remove('active');
    document.getElementById('frame-content2').classList.remove('active');
    document.getElementById('frame-content3').classList.remove('active');
    document.getElementById('frame-content4').classList.remove('active');
    document.getElementById('frame-content5').classList.add('active');
    document.getElementById('bottom-nav').classList.add('active');

}













// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================

function fnavigation1bar(numberb){

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
        // document.getElementById('frame-content4').classList.remove('active');
        document.getElementById('frame-content5').classList.remove('active');
        document.getElementById('frame-content6').classList.remove('active');
        document.getElementById('frame-content7').classList.remove('active');
        document.getElementById('frame-content4').classList.add('active');
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
        document.getElementById('frame-content7').classList.add('active');
        document.getElementById('bottom-nav').classList.add('active');
    }

    else{
        Home.classList.remove('active');
        Ticket.classList.remove('active');
        Bell.classList.remove('active');
        Setting.classList.add('active');

    }

    
}


