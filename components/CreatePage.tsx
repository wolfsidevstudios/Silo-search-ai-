import React, { useState, useRef } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import type { UserProfile, FileRecord, NoteRecord, Space } from '../types';
import { FileIcon } from './icons/FileIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { PlusSquareIcon } from './icons/PlusSquareIcon';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { LayersIcon } from './icons/LayersIcon';
import { AiHomePage } from './AiHomePage';
import { HomeIcon } from './icons/HomeIcon';

interface CreatePageProps {
  files: FileRecord[];
  notes: NoteRecord[];
  spaces: Space[];
  onFileUpload: (file: File) => void;
  onDeleteFile: (id: number) => void;
  onSaveNote: (note: Partial<NoteRecord>) => void;
  onDeleteNote: (id: number) => void;
  onOpenSpaceEditor: (space: Partial<Space> | null) => void;
  navigate: (path: string) => void;
  onSearch: (query: string, options: any) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

type ActiveView = 'ai-home' | 'files' | 'notes' | 'pdfs' | 'spaces';

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const NoteEditor: React.FC<{ note: NoteRecord | null; onSave: (note: Partial<NoteRecord>) => void; onBack: () => void; }> = ({ note, onSave, onBack }) => {
    const [title, setTitle] = useState(note?.title || 'New Note');
    const [content, setContent] = useState(note?.content || '');
    const isNewNote = !note?.id;

    const handleSave = () => {
        onSave({ id: note?.id, title, content });
        if(isNewNote) onBack();
    };
    
    return (
        <div className="flex flex-col h-full">
            <header className="flex-shrink-0 p-4 flex justify-between items-center border-b">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeftIcon /></button>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="text-lg font-bold bg-transparent focus:outline-none focus:ring-0 border-none w-full mx-4" />
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800">Save</button>
            </header>
            <div className="flex-grow p-4">
                <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-full resize-none border-none focus:outline-none focus:ring-0 text-lg" placeholder="Start writing..."></textarea>
            </div>
        </div>
    );
};


export const CreatePage: React.FC<CreatePageProps> = ({ files, notes, spaces, onFileUpload, onDeleteFile, onSaveNote, onDeleteNote, onOpenSpaceEditor, navigate, onSearch, ...headerProps }) => {
    const [activeView, setActiveView] = useState<ActiveView>('ai-home');
    const [selectedNote, setSelectedNote] = useState<NoteRecord | null>(null);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            Array.from(event.target.files).forEach(onFileUpload);
        }
    };
    
    const handleNewNote = () => {
        setSelectedNote(null);
        setIsEditingNote(true);
    };

    const handleEditNote = (note: NoteRecord) => {
        setSelectedNote(note);
        setIsEditingNote(true);
    };

    const renderMainContent = () => {
        if (isEditingNote) {
            return <NoteEditor note={selectedNote} onSave={onSaveNote} onBack={() => setIsEditingNote(false)} />
        }
        
        switch (activeView) {
            case 'ai-home':
                return <AiHomePage onSearch={onSearch} />;
            case 'files':
                return (
                    <div className="p-6">
                        <header className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">My Files</h2>
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800"><UploadCloudIcon className="w-4 h-4" /><span>Upload File</span></button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                        </header>
                        <div className="space-y-2">
                            {files.length > 0 ? files.map(file => (
                                <div key={file.id} className="group flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                        <FileIcon className="w-6 h-6 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-800">{file.name}</p>
                                            <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => onDeleteFile(file.id)} className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon /></button>
                                </div>
                            )) : <p className="text-center text-gray-500 py-12">No files uploaded yet.</p>}
                        </div>
                    </div>
                );
            case 'notes':
                 return (
                    <div className="p-6">
                        <header className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">My Notes</h2>
                            <button onClick={handleNewNote} className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800"><PlusSquareIcon className="w-4 h-4" /><span>New Note</span></button>
                        </header>
                         <div className="space-y-2">
                            {notes.length > 0 ? notes.map(note => (
                                <div key={note.id} className="group flex items-center justify-between p-3 bg-white rounded-lg border">
                                    <button onClick={() => handleEditNote(note)} className="flex items-center space-x-3 text-left w-full">
                                        <FileTextIcon className="w-6 h-6 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-800">{note.title}</p>
                                            <p className="text-xs text-gray-500 line-clamp-1">{note.content || 'No content'}</p>
                                        </div>
                                    </button>
                                    <button onClick={() => onDeleteNote(note.id)} className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"><TrashIcon /></button>
                                </div>
                            )) : <p className="text-center text-gray-500 py-12">No notes created yet.</p>}
                        </div>
                    </div>
                );
            case 'pdfs':
                return (
                     <div className="p-6">
                        <header className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">My PDFs</h2>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800"><PlusSquareIcon className="w-4 h-4" /><span>Create PDF</span></button>
                        </header>
                         <p className="text-center text-gray-500 py-12">PDF creation coming soon.</p>
                    </div>
                );
            case 'spaces':
                return (
                    <div className="p-6">
                        <header className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">My Spaces</h2>
                            <button onClick={() => onOpenSpaceEditor(null)} className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800"><PlusSquareIcon className="w-4 h-4" /><span>New Space</span></button>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {spaces.length > 0 ? spaces.map(space => (
                                <button key={space.id} onClick={() => navigate(`/space/${space.id}`)} className="text-left p-4 bg-white rounded-lg border hover:shadow-md hover:-translate-y-0.5 transition-all">
                                    <h3 className="font-bold text-gray-800">{space.name}</h3>
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{space.systemInstruction || 'No system instruction'}</p>
                                    <div className="text-xs text-gray-500 mt-3">
                                        <p>{space.dataSources.length} data sources</p>
                                        <p>{space.websites.length} websites</p>
                                    </div>
                                </button>
                            )) : (
                                <div className="md:col-span-2 lg:col-span-3 text-center text-gray-500 py-12">
                                    <p>Create a Space to build a custom search agent.</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    };

    const SidebarButton: React.FC<{ view: ActiveView, icon: React.ReactNode, label: string }> = ({ view, icon, label }) => (
        <button onClick={() => setActiveView(view)} className={`flex flex-col items-center space-y-1 p-2 rounded-lg w-full transition-colors ${activeView === view ? 'bg-gray-200' : 'hover:bg-gray-100'}`} aria-label={label}>
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header {...headerProps} activeTab="create" onNavigate={navigate} />
            <main className="flex-grow flex min-h-0">
                <aside className="w-20 bg-white border-r flex-shrink-0 p-2 space-y-2">
                    <SidebarButton view="ai-home" icon={<HomeIcon />} label="AI Home" />
                    <SidebarButton view="files" icon={<FileIcon className="w-6 h-6" />} label="My Files" />
                    <SidebarButton view="notes" icon={<FileTextIcon className="w-6 h-6" />} label="Notes" />
                    <SidebarButton view="spaces" icon={<LayersIcon className="w-6 h-6" />} label="Spaces" />
                    <SidebarButton view="pdfs" icon={<FileIcon className="w-6 h-6" />} label="PDFs" />
                </aside>
                <div className="flex-grow overflow-y-auto">
                    {renderMainContent()}
                </div>
            </main>
            <Footer onOpenLegalPage={headerProps.onOpenLegalPage} />
        </div>
    );
};