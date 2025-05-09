/**
 * Interface yang mendefinisikan struktur data untuk sebuah tugas.
 */
export interface Task {
    id: number; // ID unik untuk tugas
    description: string; // Deskripsi singkat tugas
    status: 'todo' | 'in-progress' | 'done'; // Status tugas (harus salah satu dari nilai ini)
    createdAt: string; // Tanggal dan waktu pembuatan tugas (dalam format string, e.g., ISO 8601)
    updatedAt: string; // Tanggal dan waktu terakhir pembaruan tugas (dalam format string)
  }
  
  /**
   * Tipe untuk daftar tugas.
   */
  export type TaskList = Task[];
  
  /**
   * Nama file JSON tempat tugas akan disimpan.
   */
  export const TASKS_FILE = 'tasks.json';