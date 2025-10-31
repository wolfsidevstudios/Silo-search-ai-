import React, { useState, useEffect } from 'react';
import type { Space, FileRecord, NoteRecord } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { LinkIcon } from './icons/LinkIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CheckIcon } from './icons/CheckIcon';

interface SpaceEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (space: Partial<Space>) => void;
  spaceToEdit: Partial<Space> | null;
  allFiles: FileRecord[];
  allNotes: NoteRecord[];
}

export const SpaceEditorModal: React.FC<SpaceEditorModalProps> = ({ isOpen, onClose, onSave, spaceToEdit, allFiles, allNotes }) => {
  const [name, setName] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [dataSources, setDataSources] = useState<{ type: 'file' | 'note'; id: number; name: string }[]>([]);
  const [websites, setWebsites] = useState<string[]>([]);
  const [newWebsite, setNewWebsite] = useState('');

  useEffect(() => {
    if (spaceToEdit) {
      setName(spaceToEdit.name || '');
      setSystemInstruction(spaceToEdit.systemInstruction || '');
      setDataSources(spaceToEdit.dataSources || []);
      setWebsites(spaceToEdit.websites || []);
    } else {
      // Reset form for new space
      setName('');
      setSystemInstruction('');
      setDataSources([]);
      setWebsites([]);
    }
  }, [spaceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      id: spaceToEdit?.id,
      name,
      systemInstruction,
      dataSources,
      websites,
    });
  };
  
  const handleDataSourceToggle = (type: 'file' | 'note', id: number, name: string) => {
    const existingIndex = dataSources.findIndex(ds => ds.type === type && ds.id === id);
    if (existingIndex > -1) {
        setDataSources(dataSources.filter((_, index) => index !== existingIndex));
    } else {
        setDataSources([...dataSources, { type, id, name }]);
    }
  };
  
  const handleAddWebsite = () => {
    if (newWebsite.trim() && !websites.includes(newWebsite.trim())) {
        try {
            // Basic URL validation
            new URL(newWebsite);
            setWebsites([...websites, newWebsite.trim()]);
            setNewWebsite('');
        } catch (_) {
            alert('Please enter a valid URL (e.g., https://example.com)');
        }
    }
  };

  const handleRemoveWebsite = (urlToRemove: string) => {
    setWebsites(websites.filter(url => url !== urlToRemove));
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <header className="p-4 flex justify-between items-center border-b flex-shrink-0">
          <h2 className="text-lg font-bold">{spaceToEdit ? 'Edit Space' : 'Create New Space'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><CloseIcon /></button>
        </header>
        <main className="flex-grow overflow-y-auto p-6 space-y-6">
            <div>
                <label htmlFor="space-name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="space-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., My Research Project" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
            </div>
            <div>
                <label htmlFor="system-instruction" className="block text-sm font-medium text-gray-700">System Instruction</label>
                <textarea id="system-instruction" value={systemInstruction} onChange={e => setSystemInstruction(e.target.value)} rows={4} placeholder="e.g., You are a helpful research assistant. Be concise and factual." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm resize-none"></textarea>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-700">Data Sources</h3>
                    <div className="mt-2 p-3 border rounded-md h-48 overflow-y-auto space-y-2 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-500">Files</p>
                        {allFiles.map(file => (
                            <button key={`file-${file.id}`} onClick={() => handleDataSourceToggle('file', file.id, file.name)} className="w-full flex items-center space-x-2 text-left text-sm p-1.5 rounded hover:bg-gray-200">
                                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 ${dataSources.some(ds => ds.type === 'file' && ds.id === file.id) ? 'bg-black border-black' : 'border-gray-300'}`}>
                                    {dataSources.some(ds => ds.type === 'file' && ds.id === file.id) && <CheckIcon className="text-white w-3 h-3" />}
                                </div>
                                <span>{file.name}</span>
                            </button>
                        ))}
                        <p className="text-xs font-semibold text-gray-500 pt-2">Notes</p>
                        {allNotes.map(note => (
                             <button key={`note-${note.id}`} onClick={() => handleDataSourceToggle('note', note.id, note.title)} className="w-full flex items-center space-x-2 text-left text-sm p-1.5 rounded hover:bg-gray-200">
                                 <div className={`w-4 h-4 rounded border-2 flex-shrink-0 ${dataSources.some(ds => ds.type === 'note' && ds.id === note.id) ? 'bg-black border-black' : 'border-gray-300'}`}>
                                    {dataSources.some(ds => ds.type === 'note' && ds.id === note.id) && <CheckIcon className="text-white w-3 h-3" />}
                                </div>
                                <span>{note.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="text-sm font-medium text-gray-700">Website References</h3>
                     <div className="mt-2 p-3 border rounded-md h-48 overflow-y-auto space-y-2 bg-gray-50">
                        {websites.map(url => (
                            <div key={url} className="flex items-center justify-between text-sm bg-white p-1.5 rounded">
                                <span className="truncate">{url}</span>
                                <button onClick={() => handleRemoveWebsite(url)} className="p-1 text-gray-400 hover:text-red-500 rounded-full"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 flex space-x-2">
                        <input type="url" value={newWebsite} onChange={e => setNewWebsite(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddWebsite()} placeholder="https://example.com" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
                        <button onClick={handleAddWebsite} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300">Add</button>
                    </div>
                </div>
            </div>
        </main>
        <footer className="p-4 border-t flex justify-end flex-shrink-0">
          <button onClick={handleSave} disabled={!name.trim()} className="px-6 py-2 bg-black text-white font-semibold rounded-full hover:bg-gray-800 disabled:bg-gray-400">
            Save Space
          </button>
        </footer>
      </div>
    </div>
  );
};
