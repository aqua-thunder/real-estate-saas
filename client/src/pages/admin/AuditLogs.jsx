import React from 'react';
import { History, FileText } from 'lucide-react';

const logs = [
    { id: 1, user: "John Doe", action: "Updated System Settings", target: "General Config", time: "2 mins ago", status: "Success" },
    { id: 2, user: "Jane Smith", action: "Deleted User Account", target: "user_1234", time: "1 hour ago", status: "Warning" },
    { id: 3, user: "System", action: "Backup Completed", target: "Database", time: "3 hours ago", status: "Success" },
    { id: 4, user: "Emily Davis", action: "Exported Reports", target: "Financial Q1", time: "1 day ago", status: "Success" },
];

const AuditLogs = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <History size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Audit Logs</h2>
                        <p className="text-slate-500 text-sm mt-1">Track system activities and events.</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 text-sm font-medium border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50">
                    <FileText size={16} />
                    <span>Export Logs</span>
                </button>
            </div>

            <div className="p-6">
                <div className="flow-root">
                    <ul className="-mb-8">
                        {logs.map((log, idx) => (
                            <li key={log.id}>
                                <div className="relative pb-8">
                                    {idx !== logs.length - 1 && (
                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                                    )}
                                    <div className="relative flex space-x-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-amber-500'
                                            }`}>
                                            <span className="text-white text-xs font-bold">{log.user.charAt(0)}</span>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p className="text-sm text-slate-800">
                                                    <span className="font-medium text-slate-900">{log.user}</span> {log.action}{" "}
                                                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1 py-0.5 rounded">{log.target}</span>
                                                </p>
                                            </div>
                                            <div className="text-right text-sm whitespace-nowrap text-slate-500">
                                                <time>{log.time}</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
