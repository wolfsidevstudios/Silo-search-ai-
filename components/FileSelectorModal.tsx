import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { FileIcon } from './icons/FileIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import type { FileRecord, NoteRecord, SummarizationSource } from '../types';

interface FileSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileRecord[];
  notes: NoteRecord[];
  onSelect: (source: SummarizationSource) => void;
}

export const FileSelectorModal: React.FC<FileSelectorModalProps> = ({ isOpen, onClose, files, notes, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <header className="p-4 flex justify-between items-center border-b flex-shrink-0">
          <h2 className="text-lg font-bold">Select a Source to Summarize</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><CloseIcon /></button>
        </header>
        <main className="flex-grow overflow-y-auto p-4">
          <section>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">My Files</h3>
            <div className="space-y-2">
              {files.length > 0 ? files.map(file => (
                <button
                  key={`file-${file.id}`}
                  onClick={() => onSelect({ id: file.id, name: file.name, type: 'file' })}
                  className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                >
                  <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">{file.name}</span>
                </button>
              )) : <p className="text-sm text-gray-500 p-3">No files found.</p>}
            </div>
          </section>
          <section className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">My Notes</h3>
            <div className="space-y-2">
              {notes.length > 0 ? notes.map(note => (
                <button
                  key={`note-${note.id}`}
                  onClick={() => onSelect({ id: note.id, name: note.title, type: 'note' })}
                  className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                >
                  <FileTextIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">{note.title}</span>
                </button>
              )) : <p className="text-sm text-gray-500 p-3">No notes found.</p>}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
