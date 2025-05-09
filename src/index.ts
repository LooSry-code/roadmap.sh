import * as fs from 'fs';
import * as path from 'path';

// Definisikan interface untuk struktur data tugas
interface Task {
  id: number;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string; // Menggunakan string untuk format ISO 8601
  updatedAt: string; // Menggunakan string untuk format ISO 8601
}

// Definisikan interface untuk struktur data file JSON secara keseluruhan
interface TaskData {
    tasks: Task[];
    nextId: number; // Untuk melacak ID berikutnya yang akan digunakan
}

// Nama file JSON tempat tugas akan disimpan
const TASKS_FILE = path.join(__dirname, '../tasks.json'); // Menggunakan path.join untuk kompatibilitas OS

// Fungsi untuk membaca data tugas dari file JSON
function readTasks(): TaskData {
  try {
    // Baca isi file
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    // Parse JSON
    const taskData: TaskData = JSON.parse(data);
    // Pastikan struktur data valid (minimal ada array tasks dan nextId)
    if (!Array.isArray(taskData.tasks) || typeof taskData.nextId !== 'number') {
        console.error('Error: File data tasks.json tidak valid.');
        // Jika tidak valid, kembalikan struktur default
        return { tasks: [], nextId: 1 };
    }
    return taskData;
  } catch (error: any) {
    // Jika file tidak ada atau ada error saat membaca/parsing
    if (error.code === 'ENOENT') {
      // File tidak ada, kembalikan struktur default
      return { tasks: [], nextId: 1 };
    } else {
      // Error lain saat membaca atau parsing
      console.error(`Error membaca file tasks.json: ${error.message}`);
      // Dalam kasus error serius, mungkin lebih baik keluar atau kembalikan struktur default kosong
      return { tasks: [], nextId: 1 };
    }
  }
}

// Fungsi untuk menulis data tugas ke file JSON
function writeTasks(taskData: TaskData): void {
  try {
    // Stringify data menjadi format JSON dengan indentasi 2 spasi agar mudah dibaca
    const data = JSON.stringify(taskData, null, 2);
    // Tulis data ke file
    fs.writeFileSync(TASKS_FILE, data, 'utf-8');
  } catch (error: any) {
    console.error(`Error menulis ke file tasks.json: ${error.message}`);
    // Dalam aplikasi CLI, mungkin kita tidak perlu keluar, tapi beri tahu pengguna
  }
}

// --- Fungsi untuk memproses argumen CLI ---
function main() {
    // process.argv[0] = node executable path
    // process.argv[1] = script file path (dist/index.js)
    // process.argv[2] = command (e.g., 'add', 'list')
    // process.argv[3...] = command arguments
  
    const args = process.argv.slice(2); // Ambil argumen mulai dari indeks 2
  
    if (args.length === 0) {
      // Jika tidak ada argumen, tampilkan pesan penggunaan
      showHelp();
      return;
    }
  
    const command = args[0].toLowerCase(); // Ambil perintah pertama dan ubah ke huruf kecil
    const commandArgs = args.slice(1); // Ambil sisa argumen untuk perintah
  
    // Panggil fungsi yang sesuai berdasarkan perintah
    switch (command) {
      case 'add':
        addTask(commandArgs);
        break;
      case 'list':
        listTasks(commandArgs);
        break;
      case 'update':
        updateTask(commandArgs);
        break;
      case 'delete':
        deleteTask(commandArgs);
        break;
      case 'mark-in-progress':
        markTaskStatus(commandArgs, 'in-progress');
        break;
      case 'mark-done':
        markTaskStatus(commandArgs, 'done');
        break;
      case 'help':
        showHelp();
        break;
      default:
        console.error(`Error: Perintah tidak dikenal "${command}". Gunakan 'help' untuk melihat daftar perintah.`);
        showHelp();
        process.exit(1); // Keluar dengan kode error
    }
  }
  
  // --- Fungsi placeholder untuk setiap perintah (akan diimplementasikan nanti) ---
  
//   function addTask(args: string[]): void {
//     console.log('Perintah ADD dipanggil dengan argumen:', args);
//     // Implementasi logika tambah tugas di sini
//   }
  
// --- Implementasi Perintah ADD ---
function addTask(args: string[]): void {
    // Perintah 'add' membutuhkan satu argumen: deskripsi tugas
    if (args.length === 0) {
      console.error('Error: Perintah "add" membutuhkan deskripsi tugas.');
      console.log('Penggunaan: task-cli add "<deskripsi>"');
      process.exit(1);
    }
  
    // Gabungkan semua argumen menjadi satu string deskripsi
    // Ini penting jika deskripsi mengandung spasi dan dikutip
    const description = args.join(' ').trim();
  
    if (!description) {
         console.error('Error: Deskripsi tugas tidak boleh kosong.');
         console.log('Penggunaan: task-cli add "<deskripsi>"');
         process.exit(1);
    }
  
  
    const taskData = readTasks(); // Baca data yang sudah ada
  
    // Buat objek tugas baru
    const newTask: Task = {
      id: taskData.nextId, // Gunakan ID berikutnya yang tersedia
      description: description,
      status: 'todo', // Status default adalah 'todo'
      createdAt: new Date().toISOString(), // Tanggal pembuatan saat ini (ISO 8601)
      updatedAt: new Date().toISOString(), // Tanggal update awal (sama dengan createdAt)
    };
  
    taskData.tasks.push(newTask); // Tambahkan tugas baru ke array
  
    taskData.nextId++; // Naikkan nilai nextId untuk tugas berikutnya
  
    writeTasks(taskData); // Tulis data yang diperbarui kembali ke file
  
    console.log(`Task added successfully (ID: ${newTask.id})`);
  }

  function listTasks(args: string[]): void {
      //console//.log('Perintah LIST dipanggil dengan argumen:', args);
      // Implementasi logika daftar tugas di sini
      const taskData = readTasks();
      const tasksToList = taskData.tasks;
  
      let filterStatus: string | undefined = undefined;
      if (args.length > 0) {
          // Ambil argumen pertama sebagai status filter
          filterStatus = args[0].toLowerCase();
          // Validasi status filter
          if (filterStatus !== 'all' && filterStatus !== 'todo' && filterStatus !== 'in-progress' && filterStatus !== 'done') {
              console.error(`Error: Status filter tidak valid "${args[0]}". Gunakan 'all', 'todo', 'in-progress', atau 'done'.`);
              console.log('Penggunaan: task-cli list [status]');
              process.exit(1);
          }
      } else {
          // Jika tidak ada argumen, defaultnya tampilkan semua
          filterStatus = 'all';
      }
  
      let filteredTasks: Task[] = [];
  
      if (filterStatus === 'all') {
          filteredTasks = tasksToList;
      } else {
          // Filter tugas berdasarkan status
          filteredTasks = tasksToList.filter(task => task.status === filterStatus);
      }
  
      // Tampilkan daftar tugas
      if (filteredTasks.length === 0) {
          if (filterStatus === 'all') {
               console.log('Tidak ada tugas yang ditemukan.');
          } else {
               console.log(`Tidak ada tugas dengan status '${filterStatus}' ditemukan.`);
          }
      } else {
          console.log(`Daftar Tugas (${filterStatus}):`);
          filteredTasks.forEach(task => {
              console.log(`ID: ${task.id}, Status: ${task.status.padEnd(12)}, Deskripsi: ${task.description}`);
              // Opsional: Tampilkan tanggal
              // console.log(`  Dibuat: ${new Date(task.createdAt).toLocaleString()}, Diperbarui: ${new Date(task.updatedAt).toLocaleString()}`);
          });
      }
  }


// --- Implementasi Perintah UPDATE ---
function updateTask(args: string[]): void {
    // Perintah 'update' membutuhkan 2 argumen: ID dan deskripsi baru
    if (args.length < 2) {
        console.error('Error: Perintah "update" membutuhkan ID dan deskripsi baru.');
        console.log('Penggunaan: task-cli update <id> "<deskripsi>"');
        process.exit(1);
    }

    const id = parseInt(args[0], 10); // Ambil argumen pertama sebagai ID (string ke number)
    const newDescription = args.slice(1).join(' ').trim(); // Ambil sisa argumen sebagai deskripsi baru

    // Validasi ID
    if (isNaN(id) || id <= 0) {
        console.error(`Error: ID tugas tidak valid "${args[0]}". ID harus berupa angka positif.`);
        console.log('Penggunaan: task-cli update <id> "<deskripsi>"');
        process.exit(1);
    }

     if (!newDescription) {
       console.error('Error: Deskripsi tugas baru tidak boleh kosong.');
       console.log('Penggunaan: task-cli update <id> "<deskripsi>"');
       process.exit(1);
    }


    const taskData = readTasks();
    const taskIndex = taskData.tasks.findIndex(task => task.id === id); // Cari indeks tugas berdasarkan ID

    // Periksa apakah tugas dengan ID tersebut ditemukan
    if (taskIndex === -1) {
        console.error(`Error: Tugas dengan ID ${id} tidak ditemukan.`);
        process.exit(1);
    }

    // Perbarui deskripsi dan tanggal update
    taskData.tasks[taskIndex].description = newDescription;
    taskData.tasks[taskIndex].updatedAt = new Date().toISOString();

    writeTasks(taskData); // Tulis data yang diperbarui kembali ke file

    console.log(`Task with ID ${id} updated successfully.`);
}

// --- Implementasi Perintah DELETE ---
function deleteTask(args: string[]): void {
    // Perintah 'delete' membutuhkan 1 argumen: ID tugas
    if (args.length === 0) {
        console.error('Error: Perintah "delete" membutuhkan ID tugas.');
        console.log('Penggunaan: task-cli delete <id>');
        process.exit(1);
    }

    const id = parseInt(args[0], 10); // Ambil argumen pertama sebagai ID

    // Validasi ID
    if (isNaN(id) || id <= 0) {
        console.error(`Error: ID tugas tidak valid "${args[0]}". ID harus berupa angka positif.`);
        console.log('Penggunaan: task-cli delete <id>');
        process.exit(1);
    }

    const taskData = readTasks();
    const initialTaskCount = taskData.tasks.length; // Jumlah tugas sebelum dihapus

    // Filter array tasks, hanya simpan tugas yang ID-nya BUKAN ID yang akan dihapus
    taskData.tasks = taskData.tasks.filter(task => task.id !== id);

    // Periksa apakah ada tugas yang dihapus (bandingkan jumlah tugas sebelum dan sesudah filter)
    if (taskData.tasks.length === initialTaskCount) {
        console.error(`Error: Tugas dengan ID ${id} tidak ditemukan.`);
        process.exit(1);
    }

    writeTasks(taskData); // Tulis data yang diperbarui kembali ke file

    console.log(`Task with ID ${id} deleted successfully.`);
}


// --- Implementasi Perintah MARK STATUS ---
function markTaskStatus(args: string[], status: 'in-progress' | 'done'): void {
    // Perintah mark membutuhkan 1 argumen: ID tugas
    if (args.length === 0) {
        console.error(`Error: Perintah "mark-${status}" membutuhkan ID tugas.`);
        console.log(`Penggunaan: task-cli mark-${status} <id>`);
        process.exit(1);
    }

    const id = parseInt(args[0], 10); // Ambil argumen pertama sebagai ID

    // Validasi ID
    if (isNaN(id) || id <= 0) {
        console.error(`Error: ID tugas tidak valid "${args[0]}". ID harus berupa angka positif.`);
        console.log(`Penggunaan: task-cli mark-${status} <id>`);
        process.exit(1);
    }

    const taskData = readTasks();
    const taskIndex = taskData.tasks.findIndex(task => task.id === id); // Cari indeks tugas

    // Periksa apakah tugas ditemukan
    if (taskIndex === -1) {
        console.error(`Error: Tugas dengan ID ${id} tidak ditemukan.`);
        process.exit(1);
    }

    // Periksa apakah status sudah sesuai
    if (taskData.tasks[taskIndex].status === status) {
         console.log(`Task with ID ${id} is already marked as ${status}.`);
         return; // Keluar tanpa melakukan perubahan
    }

    // Perbarui status dan tanggal update
    taskData.tasks[taskIndex].status = status;
    taskData.tasks[taskIndex].updatedAt = new Date().toISOString();

    writeTasks(taskData); // Tulis data yang diperbarui kembali ke file

    console.log(`Task with ID ${id} marked as ${status} successfully.`);
}
  
  function showHelp(): void {
    console.log(`
  Penggunaan: task-cli <perintah> [argumen]
  
  Perintah yang tersedia:
    add "<deskripsi>"         Menambah tugas baru
    list [status]             Menampilkan daftar tugas (status: all, todo, in-progress, done)
    update <id> "<deskripsi>" Mengubah deskripsi tugas berdasarkan ID
    delete <id>               Menghapus tugas berdasarkan ID
    mark-in-progress <id>     Menandai tugas sebagai 'in-progress' berdasarkan ID
    mark-done <id>            Menandai tugas sebagai 'done' berdasarkan ID
    help                      Menampilkan bantuan ini
    `);
  }
  
  // Panggil fungsi utama untuk memulai aplikasi
  main();
  



// --- Contoh penggunaan (akan dihapus nanti setelah fungsi utama CLI dibuat) ---
// // Baca tugas (akan menginisialisasi jika file tidak ada)
// const initialData = readTasks();
// console.log('Data awal:', initialData);

// // Tambahkan tugas baru (contoh sederhana, belum pakai argumen CLI)
// const newTask: Task = {
//     id: initialData.nextId,
//     description: "Contoh tugas pertama",
//     status: 'todo',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
// };
// initialData.tasks.push(newTask);
// initialData.nextId++; // Naikkan ID berikutnya

// // Tulis kembali data
// writeTasks(initialData);
// console.log('Data setelah ditambah:', readTasks());

// // Hapus file tasks.json untuk menguji inisialisasi ulang
// // fs.unlinkSync(TASKS_FILE);
// // console.log('File tasks.json dihapus.');
// // console.log('Data setelah dihapus file:', readTasks());
