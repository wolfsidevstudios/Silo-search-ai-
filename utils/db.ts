import type { FileRecord, NoteRecord } from '../types';

const DB_NAME = 'KyndraDB';
const DB_VERSION = 1;
const FILE_STORE = 'files';
const NOTE_STORE = 'notes';

let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('Error opening database.');
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = () => {
      const dbInstance = request.result;
      if (!dbInstance.objectStoreNames.contains(FILE_STORE)) {
        dbInstance.createObjectStore(FILE_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!dbInstance.objectStoreNames.contains(NOTE_STORE)) {
        dbInstance.createObjectStore(NOTE_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const deleteDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject('Error deleting database.');
    request.onblocked = () => {
      console.warn('Delete DB blocked');
      resolve();
    };
  });
};

// --- File Operations ---

export const addFile = (file: File): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction(FILE_STORE, 'readwrite');
    const store = transaction.objectStore(FILE_STORE);
    const fileRecord = {
      name: file.name,
      type: file.type,
      size: file.size,
      content: file, // Store blob directly
      createdAt: new Date(),
    };
    const request = store.add(fileRecord);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject('Error adding file.');
  });
};

export const getFiles = (): Promise<FileRecord[]> => {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction(FILE_STORE, 'readonly');
    const store = transaction.objectStore(FILE_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result.sort((a,b) => b.id - a.id));
    request.onerror = () => reject('Error fetching files.');
  });
};

export const getFile = (id: number): Promise<FileRecord | null> => {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction(FILE_STORE, 'readonly');
    const store = transaction.objectStore(FILE_STORE);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject('Error fetching file.');
  });
};

export const deleteFile = (id: number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction(FILE_STORE, 'readwrite');
    const store = transaction.objectStore(FILE_STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject('Error deleting file.');
  });
};

// --- Note Operations ---

export const saveNote = (note: Partial<NoteRecord>): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction(NOTE_STORE, 'readwrite');
    const store = transaction.objectStore(NOTE_STORE);
    
    let request;
    if (note.id) {
        const existingNote = await getNote(note.id);
        const updatedNote = { ...existingNote, ...note, updatedAt: new Date() };
        request = store.put(updatedNote);
    } else {
        const newNote: Omit<NoteRecord, 'id'> = {
            title: note.title || 'Untitled Note',
            content: note.content || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        request = store.add(newNote);
    }

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject('Error saving note.');
  });
};


export const getNotes = (): Promise<NoteRecord[]> => {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction(NOTE_STORE, 'readonly');
    const store = transaction.objectStore(NOTE_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result.sort((a,b) => b.updatedAt - a.updatedAt));
    request.onerror = () => reject('Error fetching notes.');
  });
};

export const getNote = (id: number): Promise<NoteRecord | null> => {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction(NOTE_STORE, 'readonly');
    const store = transaction.objectStore(NOTE_STORE);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject('Error fetching note.');
  });
};


export const deleteNote = (id: number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction(NOTE_STORE, 'readwrite');
    const store = transaction.objectStore(NOTE_STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject('Error deleting note.');
  });
};
