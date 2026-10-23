// Dashboard Interactivity

// alert('cc');
// let loinuser = {
//     user : '',
//     pass : ''
// };

let idfoundation = null;
let boollogin = 0
document.addEventListener('DOMContentLoaded', function () {
    // if(loinuser.user!=='' & loinuser.pass!==''){
    //     document.getElementById('foundation-username').value = loinuser.user;
    //     document.getElementById('foundation-password').value = loinuser.pass;
    // }
    const loginButton = document.getElementById('foundation-login-button');
    if (!loginButton) {
        
        return;
    }

    loginButton.addEventListener('click', async function () {
        const username = document.getElementById('foundation-username').value.trim();
        const password = document.getElementById('foundation-password').value;
        const message = document.getElementById('login-message');

        if (username === '' || password === '') {
            message.textContent = 'يرجى إدخال اسم المستخدم وكلمة المرور';
            message.className = 'error';
            return;
        }

        const loginData = new URLSearchParams({
            ACTION: 'LOGIN',
            USERNAME: username,
            PASSWORD: password
        });

        loginButton.disabled = true;
        message.textContent = 'جارٍ التحقق...';
        message.className = '';

        try {
            const response = await fetch('dataf.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: loginData
            });
            const responseData = await response.json();

            if (!responseData.success) {
                throw new Error(responseData.message || 'بيانات الدخول غير صحيحة');
            }

            // alert(responseData.id+responseData.user+responseData.name);
            idfoundation = responseData.id;

            document.getElementById('w-s').classList.remove('active');
            boollogin = 1;
            document.getElementById('protected-content').classList.add('active');
            message.textContent = responseData.message;
            message.className = 'success';
        } catch (error) {
            message.textContent = error.message || 'تعذر الاتصال بالخادم';
            message.className = 'error';
        } finally {
            loginButton.disabled = false;
        }
    });
});


// Initialize the dashboard
// إضافة مستمع حدث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded successfully');
    initializeEventListeners();
    updateDashboard();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', handleActionButton);
    });

    // Menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });

    // Header icons
    const headerIcons = document.querySelectorAll('.header-icon');
    headerIcons.forEach((icon, index) => {
        icon.addEventListener('click', function() {
            handleHeaderIcon(index);
        });
    });

    // Table rows
    // إضافة مستمعات نقر على صفوف الجدول
    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', handleTableRowClick);
    });
}

// Handle action button clicks
// الوظيفة لمعالجة نقرات أزرار الإجراءات
function handleActionButton(event) {
    const button = event.currentTarget;
    const buttonText = button.textContent.trim();
    
    showNotification(`تم النقر على: ${buttonText}`);
    
    // Add visual feedback
    button.style.transform = 'scale(0.98)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// Handle menu item clicks
function handleMenuClick(event) {
    const menuItem = event.currentTarget;
    const menuText = menuItem.querySelector('span:last-child').textContent.trim();
    
    showNotification(`فتح: ${menuText}`);
}

// Handle header icon clicks
function handleHeaderIcon(index) {
    const iconNames = ['الإعدادات', 'الإشعارات', 'حسابي'];
    showNotification(`${iconNames[index]}`);
}

// Handle table row clicks
function handleTableRowClick(event) {
    const row = event.currentTarget;
    const cells = row.querySelectorAll('td');
    const rowData = Array.from(cells).map(cell => cell.textContent.trim()).join(' - ');
    
    // Highlight the row
    row.style.backgroundColor = '#e3f2fd';
    setTimeout(() => {
        row.style.backgroundColor = '';
    }, 1000);
}

// Show notification
function showNotification(message) {
    // Remove existing notification if any
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    // Create notification element
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #0033cc;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
    `;

    document.body.appendChild(notif);

    // Remove after 3 seconds
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notif.remove();
        }, 300);
    }, 3000);
}

// Update dashboard data
function updateDashboard() {
    // Simulate real-time data updates
    updateStatsCards();
    updateCharts();
}

// Update statistics cards with animated numbers
function updateStatsCards() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((stat, index) => {
        stat.style.cursor = 'default';
        stat.addEventListener('mouseenter', function() {
            this.style.color = '#0033cc';
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'all 0.3s ease';
        });
        
        stat.addEventListener('mouseleave', function() {
            this.style.color = '#333';
            this.style.transform = 'scale(1)';
        });
    });
}

// Animate chart bars on load
function updateCharts() {
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
        const currentHeight = bar.style.height;
        bar.style.height = '0';
        bar.style.transition = `height 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            bar.style.height = currentHeight;
        }, 10);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .stat-card {
        animation: fadeIn 0.5s ease-out;
    }
`;
document.head.appendChild(style);

async function gittaber() {
    // التأكد من أن الـ idfoundation موجود وله قيمة قبل إرسال الطلب
    if (!idfoundation) return;
    // console.log('القيمة الحالية لـ taber:',idfoundation);
    // if(boollogin) return;


    // const requestData = new URLSearchParams({
    //     ACTION: 'GITTABER',
    //     ID: idfoundation   
    // });

    // try {
    //     const response = await fetch('dataf.php', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //         body: requestData
    //     });

    //     const responseData = await response.json();

    //     if (responseData.success) {
    //         // تحديث قيمة taber في الواجهة (مثال: داخل عنصر في الصفحة)
    //         console.log('القيمة الحالية لـ taber:', responseData.taber);
            
    //         // يمكنك عرضها داخل عنصر بالصفحة هكذا:
    //         // document.getElementById('taber-display').textContent = responseData.taber;
    //     } else {
    //         console.error('خطأ من السيرفر:', responseData.message);
    //     }
    // } catch (error) {
    //     console.error('حدث خطأ أثناء الاتصال:', error);
    // }

    const sdata = new URLSearchParams();
    // sdata.append('msg',text); 
    sdata.append('ID',idfoundation);
    console.log('ooooooo = ',idfoundation);
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
                // return { success: false, message: 'Unexpected server response4' };
            }
        })
        .then(data => {
            if (data.success === true) {
                
                document.getElementById('idqueue-number').innerHTML = data.tabernow;
                document.getElementById('idqueue-number-w').innerHTML = data.taber;
                console.log(data.data,'iii');

            } else {
                alert(data.message || 'Login failed');
            }
        })
        .catch(error => {
            console.error('Login fetch error:', error);
            // alert('Connection error during login');
        });


}

// تشغيل الدالة تلقائياً كل ثانية واحدة
setInterval(gittaber, 5000);

function nextQueuenumber(_bool){
    const sdata = new URLSearchParams();
    // sdata.append('msg',text); 
    sdata.append('ID',idfoundation);
    console.log('ooooooo sit=',idfoundation);
    if(_bool){
        sdata.append('ACTION','SITT');
    }else{
        sdata.append('ACTION','SITTRUT');
    }

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
                
                // document.getElementById('idqueue-number').innerHTML = data.tabernow;
                // document.getElementById('idqueue-number-w').innerHTML = data.taber;
                console.log(data.data,'iii54343');

            } else {
                alert(data.message || 'Login failed');
            }
        })
        .catch(error => {
            console.error('Login fetch error:', error);
            alert('Connection error during login');
        });
}

// Refresh data every 30 seconds (simulating real-time updates)
setInterval(function() {
    // Update timestamp or refresh data here
    console.log('Dashboard data refreshed at', new Date().toLocaleTimeString('ar-SA'));
}, 30000);

// Log when page is about to unload
window.addEventListener('beforeunload', function() {
    console.log('Leaving dashboard');
});