"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTasks = exports.readTasks = void 0;
const fs = __importStar(require("fs")); // Import modul file system Node.js
const path = __importStar(require("path")); // Import modul path Node.js
const task_1 = require("./task"); // Import TaskList dan TASKS_FILE dari task.ts
// Dapatkan path lengkap ke file tasks.json di direktori saat ini
const tasksFilePath = path.join(process.cwd(), task_1.TASKS_FILE);
/**
 * Membaca daftar tugas dari file JSON.
 * Jika file tidak ada, kosong, atau isinya tidak valid, mengembalikan array kosong.
 * @returns Promise<TaskList> - Daftar tugas yang dibaca dari file.
 */
const readTasks = async () => {
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
        const tasks = JSON.parse(fileContent);
        // Lakukan validasi sederhana untuk memastikan isinya adalah array
        if (!Array.isArray(tasks)) {
            console.error("Error: File tasks.json contains invalid data. Resetting file.");
            await fs.promises.writeFile(tasksFilePath, JSON.stringify([]), 'utf8');
            return [];
        }
        return tasks;
    }
    catch (error) {
        // Tangani kesalahan saat membaca atau memparsing file
        console.error(`Error reading tasks file: ${error}`);
        // Jika terjadi kesalahan, kembalikan array kosong untuk mencegah crash
        return [];
    }
};
exports.readTasks = readTasks;
/**
 * Menulis daftar tugas ke file JSON.
 * Menimpa isi file yang sudah ada.
 * @param tasks - Daftar tugas yang akan ditulis.
 * @returns Promise<void>
 */
const writeTasks = async (tasks) => {
    try {
        // Konversi daftar tugas menjadi string JSON dengan indentasi 2 spasi agar mudah dibaca
        const jsonString = JSON.stringify(tasks, null, 2);
        // Tulis string JSON ke file
        await fs.promises.writeFile(tasksFilePath, jsonString, 'utf8');
    }
    catch (error) {
        // Tangani kesalahan saat menulis file
        console.error(`Error writing tasks file: ${error}`);
    }
};
exports.writeTasks = writeTasks;
