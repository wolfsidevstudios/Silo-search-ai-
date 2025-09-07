
import React from 'react';

const AnalyticsIcon = () => (<svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>);
const SalesIcon = () => (<svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>);
const AudienceIcon = () => (<svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>);
const SettingsIcon = () => (<svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>);

const CustomerRow = ({ name, email, img }: {name: string, email: string, img: string}) => (
    <div className="flex items-center space-x-2 p-1.5 text-xs">
        <div className="w-3 h-3 border border-gray-300 rounded-sm"></div>
        <img src={img} className="w-5 h-5 rounded-full" />
        <div className="flex-1">
            <p className="font-medium text-gray-800">{name}</p>
            <p className="text-gray-500">{email}</p>
        </div>
        <div className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-medium">Enrolled</div>
    </div>
);

const AnimatedChart = () => (
    <svg viewBox="0 0 300 120" className="w-full h-full">
        <defs>
            <style>
                {`
                    @keyframes draw-chart-1 {
                        to { stroke-dashoffset: 0; }
                    }
                     @keyframes draw-chart-2 {
                        to { stroke-dashoffset: 0; }
                    }
                    .chart-line-1 {
                        stroke-dasharray: 1000;
                        stroke-dashoffset: 1000;
                        animation: draw-chart-1 2.5s 0.2s ease-out forwards;
                    }
                    .chart-line-2 {
                        stroke-dasharray: 1000;
                        stroke-dashoffset: 1000;
                        animation: draw-chart-2 2s ease-out forwards;
                    }
                `}
            </style>
        </defs>
        <path d="M 0 80 Q 30 40, 60 60 T 120 70 T 180 50 T 240 80 T 300 60" fill="none" stroke="#C4B5FD" strokeWidth="2" className="chart-line-2" />
        <path d="M 0 90 Q 30 70, 60 80 T 120 60 T 180 90 T 240 70 T 300 100" fill="none" stroke="#8B5CF6" strokeWidth="2" className="chart-line-1" />
    </svg>
);


export const AppPreviewAnimation: React.FC = () => {
    return (
      <div className="w-[800px] h-[550px] bg-white rounded-xl shadow-2xl flex scale-75 md:scale-90 lg:scale-100 transform transition-transform duration-500 will-change-transform border border-gray-200">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-50 p-3 border-r border-gray-200 flex flex-col space-y-1 text-sm">
            <div className="flex items-center space-x-2 p-1.5">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center ring-4 ring-purple-50">
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                </div>
                <span className="font-semibold">My Store</span>
            </div>
            <div className="h-4"></div>
            <div className="flex items-center space-x-3 p-1.5 bg-gray-200/70 rounded-md font-semibold text-gray-900">
                <AnalyticsIcon /> <span>Analytics</span>
            </div>
            <div className="flex items-center space-x-3 p-1.5 text-gray-600 hover:bg-gray-200/50 rounded-md">
                <SalesIcon /> <span>Sales</span>
            </div>
             <div className="flex items-center space-x-3 p-1.5 text-gray-600 hover:bg-gray-200/50 rounded-md">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
                <span>Insights</span>
            </div>
            <div className="flex items-center space-x-3 p-1.5 text-gray-600 hover:bg-gray-200/50 rounded-md">
                <AudienceIcon /> <span>Audience</span>
            </div>
            <div className="flex-grow"></div>
            <div className="flex items-center space-x-3 p-1.5 text-gray-600 hover:bg-gray-200/50 rounded-md">
                <SettingsIcon /> <span>Settings</span>
            </div>
            <div className="flex items-center space-x-2 p-1.5 border-t mt-2 pt-2">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="w-8 h-8 rounded-full" alt="avatar" />
                <div>
                    <p className="font-medium text-xs">Olivia Rhye</p>
                    <p className="text-gray-500 text-[10px]">olivia@untitled.com</p>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-4 flex flex-col bg-white">
            <h2 className="text-xl font-bold text-gray-800">Analytics</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50/80 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Sales</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">8,224</p>
                </div>
                <div className="bg-gray-50/80 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">32,640</p>
                </div>
            </div>

            <div className="flex-grow mt-4 bg-gray-50/80 rounded-lg border border-gray-200 p-3 flex flex-col">
                <p className="text-sm font-medium text-gray-700">Store traffic</p>
                <div className="flex-grow mt-2 -ml-2">
                    <AnimatedChart />
                </div>
            </div>

            <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Recent customers</p>
                <div className="space-y-1">
                    <CustomerRow name="Olivia Rhye" email="olivia@rhye.com" img="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    <CustomerRow name="Phoenix Baker" email="phoenix@baker.com" img="https://i.pravatar.cc/150?u=a042581f4e29026704e" />
                    <CustomerRow name="Lana Steiner" email="lana@steiner.com" img="https://i.pravatar.cc/150?u=a042581f4e29026704f" />
                </div>
            </div>
        </div>
      </div>
    );
};
