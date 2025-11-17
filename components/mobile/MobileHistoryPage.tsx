import React from 'react';
import { TrashIcon } from '../icons/TrashIcon';
import type { HistoryRecord } from '../types';
import { SearchIcon } from '../icons/SearchIcon';

interface MobileHistoryPageProps {
  history: HistoryRecord[];
  onSearch: (query: string) => void;
  onClear: () => void;
}

const HistoryCard: React.FC<{ record: HistoryRecord; onSearch: (query: string) => void; }> = ({ record, onSearch }) => (
    <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
        <div className="p-3 border-b">
             <div className="flex items-center w-full p-1 pl-3 rounded-full bg-gray-100">
                <SearchIcon className="text-gray-400 w-4 h-4" />
                <p className="ml-2 text-gray-700 text-sm flex-grow text-left truncate">{record.query}</p>
            </div>
        </div>
        <div className="p-4">
            <p className="text-sm text-gray-600 line-clamp-3">{record.summary}</p>
        </div>
        {record.videos && record.videos.length > 0 && (
            <div className="p-4 border-t">
                <div className="grid grid-cols-4 gap-2">
                    {record.videos.slice(0, 4).map(video => (
                        <img key={video.id} src={video.thumbnailUrl} alt={video.title} className="w-full aspect-video object-cover rounded-md" />
                    ))}
                </div>
            </div>
        )}
        <div className="p-3 bg-gray-50 border-t flex justify-between items-center">
            <p className="text-xs text-gray-400">{record.timestamp.toLocaleDateString()}</p>
            <button onClick={() => onSearch(record.query)} className="px-3 py-1 text-xs font-medium bg-black text-white rounded-full">Re-Search</button>
        </div>
    </div>
);


export const MobileHistoryPage: React.FC<MobileHistoryPageProps> = ({ history, onSearch, onClear }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold">Smart History</h1>
        {history.length > 0 && (
          <button onClick={onClear} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
            <TrashIcon />
            <span>Clear</span>
          </button>
        )}
      </header>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {history.length > 0 ? (
          history.map((record) => (
              <HistoryCard key={record.id} record={record} onSearch={onSearch} />
          ))
        ) : (
          <p className="text-gray-500 text-center mt-16">No search history yet.</p>
        )}
      </div>
    </div>
  );
};