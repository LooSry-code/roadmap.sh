import * as fs from 'fs'; // Import modul file system Node.js
import * as path from 'path'; // Import modul path Node.js
import { TaskList, TASKS_FILE } from './task'; // Import TaskList dan TASKS_FILE dari task.ts

// Dapatkan path lengkap ke file tasks.json di direktori saat ini
const tasksFilePath = path.join(process.cwd(), TASKS_FILE);

/**
 * Membaca daftar tugas dari file JSON.
 * Jika file tidak ada, kosong, atau isinya tidak valid, mengembalikan array kosong.
 * @returns Promise<TaskList> - Daftar tugas yang dibaca dari file.
 */
export const readTasks = async (): Promise<TaskList> => {
  try {
    // Periksa apakah file ada
    if (!fs.existsSync(tasksFilePath)) {
      // Jika tidak ada, buat file dengan array kosong
      await fs.promises.writeFile(tasksFilePath, JSON.stringify([]), 'utf8');
      return [];
    }

    // Baca isi file
    const fileContent = await fs.promises.readFile(tasksFilePath, 'utf8');

    // Jika file kosong, kembalikan array kosong
    if (fileContent.trim() === '') {
      return [];
    }

    // Parse isi file JSON
    const tasks: TaskList = JSON.parse(fileContent);

    // Lakukan validasi sederhana untuk memastikan isinya adalah array
    if (!Array.isArray(tasks)) {
        console.error("Error: File tasks.json contains invalid data. Resetting file.");
        await fs.promises.writeFile(tasksFilePath, JSON.stringify([]), 'utf8');
        return [];
    }

    return tasks;

  } catch (error) {
    // Tangani kesalahan saat membaca atau memparsing file
    console.error(`Error reading tasks file: ${error}`);
    // Jika terjadi kesalahan, kembalikan array kosong untuk mencegah crash
    return [];
  }
};

/**
 * Menulis daftar tugas ke file JSON.
 * Menimpa isi file yang sudah ada.
 * @param tasks - Daftar tugas yang akan ditulis.
 * @returns Promise<void>
 */
export const writeTasks = async (tasks: TaskList): Promise<void> => {
  try {
    // Konversi daftar tugas menjadi string JSON dengan indentasi 2 spasi agar mudah dibaca
    const jsonString = JSON.stringify(tasks, null, 2);
    // Tulis string JSON ke file
    await fs.promises.writeFile(tasksFilePath, jsonString, 'utf8');
  } catch (error) {
    // Tangani kesalahan saat menulis file
    console.error(`Error writing tasks file: ${error}`);
  }
};
