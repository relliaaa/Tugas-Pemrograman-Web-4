// State / Data Aplikasi
let tasks = [];

// Elemen DOM
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskCategoryInput = document.getElementById('task-category');
const taskPriorityInput = document.getElementById('task-priority');
const taskDeadlineInput = document.getElementById('task-deadline');
const taskListEl = document.getElementById('task-list');

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// Format Tanggal dan Jam agar ramah dibaca pengguna Indonesia
function formatDateTime(dateTimeString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(dateTimeString).toLocaleDateString('id-ID', options);
}

// Fungsi Menghitung Skor & Mengupdate Grafik Performa
function calculateProductivity() {
    const totalTasks = tasks.length;
    
    if (totalTasks === 0) {
        progressBar.style.width = '0%';
        progressText.innerText = '0% Tugas Selesai';
        return;
    }

    const completedTasks = tasks.filter(task => task.completed).length;
    const percentage = Math.round((completedTasks / totalTasks) * 100);

    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${percentage}% Tugas Selesai (${completedTasks}/${totalTasks})`;
}

// Fungsi Merender Daftar Tugas ke UI
function renderTasks() {
    taskListEl.innerHTML = '';

    if (tasks.length === 0) {
        taskListEl.innerHTML = `<li style="text-align: center; color: #a0aec0; padding: 15px; font-size: 14px;">Belum ada rencana tugas hari ini. Yuk tambah tugas!</li>`;
        calculateProductivity();
        return;
    }

    const now = new Date(); // Objek waktu sistem saat ini

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        // Cek status apakah tugas telah melewati tenggat waktu
        const deadlineDate = new Date(task.deadline);
        const isOverdue = !task.completed && now > deadlineDate;

        // Pasangkan teks emoji dekoratif berdasarkan tipe kategori kegiatan
        let emoji = '✨';
        if (task.category === 'Belajar') emoji = '📚';
        else if (task.category === 'Ngopi') emoji = '☕';
        else if (task.category === 'Belanja') emoji = '🛒';
        else if (task.category === 'Olahraga') emoji = '🏃‍♂️';

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
                <div class="task-details">
                    <span class="task-text">${task.name}</span>
                    <span class="task-time">⏰ Batas: ${formatDateTime(task.deadline)}</span>
                    <div class="task-meta">
                        <span class="badge cat-badge ${task.category}">${emoji} ${task.category}</span>
                        <span class="badge p-badge ${task.priority}">${task.priority}</span>
                        ${isOverdue ? '<span class="badge overdue">Terlambat ⚠️</span>' : ''}
                    </div>
                </div>
            </div>
            <button class="btn-delete" onclick="deleteTask(${task.id})">Hapus</button>
        `;

        taskListEl.appendChild(li);
    });

    calculateProductivity();
}

// Event Listener saat menambahkan tugas baru
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newTask = {
        id: Date.now(),
        name: taskNameInput.value,
        category: taskCategoryInput.value,
        priority: taskPriorityInput.value,
        deadline: taskDeadlineInput.value, // Menyimpan string tanggal & jam
        completed: false
    };

    tasks.push(newTask);
    renderTasks();

    // Reset isi input teks & batas waktu setelah disimpan
    taskNameInput.value = '';
    taskCategoryInput.value = 'Belajar';
    taskPriorityInput.value = 'Tinggi';
    taskDeadlineInput.value = '';
});

// Fungsi mengubah status tugas (Belum Selesai <-> Selesai)
window.toggleTask = function(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    renderTasks();
};

// Fungsi menghapus baris tugas dari daftar rencana
window.deleteTask = function(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
};

// Melakukan pengecekan status waktu "Terlambat" otomatis setiap 30 detik
setInterval(renderTasks, 30000);

// Inisialisasi awal saat dimuat
renderTasks();
