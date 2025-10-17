// firebase-init.js

// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyD679ryCf1TzFBnE98wvIy1UfjwgQA3W1M",
    authDomain: "management-rt-52832.firebaseapp.com",
    databaseURL: "https://management-rt-52832-default-rtdb.firebaseio.com",
    projectId: "management-rt-52832",
    storageBucket: "management-rt-52832.firebasestorage.app",
    messagingSenderId: "699563155359",
    appId: "1:699563155359:web:4128db71713014fcaae7aa"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// --- Fungsi-fungsi Helper untuk Mempermudah ---

// Fungsi untuk mengecek apakah user sudah login
function checkAuth() {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            // Jika belum login, arahkan ke halaman login
            window.location.href = 'index.html';
        } else {
            // Jika sudah login, ambil data user dari database
            database.ref('users/' + user.uid).once('value').then((snapshot) => {
                const userData = snapshot.val();
                if (userData && document.querySelector('.user-info strong')) {
                    document.querySelector('.user-info strong').innerText = userData.namaLengkap;
                }
            });
        }
    });
}

// Fungsi login
function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Ambil data user lengkap dari database
            return database.ref('users/' + userCredential.user.uid).once('value');
        })
        .then((snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                // Simpan data user di sessionStorage agar bisa diakses di halaman lain
                sessionStorage.setItem('user', JSON.stringify(userData));
                alert(`Login berhasil! Selamat datang, ${userData.namaLengkap}.`);
                window.location.href = 'dashboard.html';
            } else {
                alert("Data pengguna tidak ditemukan.");
            }
        });
}

// Fungsi logout
function logout() {
    auth.signOut().then(() => {
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}
