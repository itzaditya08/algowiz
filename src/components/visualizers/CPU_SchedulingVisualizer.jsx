import React from 'react';
import { getProcessColor } from '../../utils/helpers';
import { Timer, Rss, Clock } from 'lucide-react';

const MetricCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-center gap-4 border border-slate-200 dark:border-slate-700">
        <div className={`p-3 rounded-full bg-opacity-10 ${colorClass.bg} ${colorClass.text}`}>
            {icon}
        </div>
        <div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
            <span className={`block text-2xl font-bold ${colorClass.text}`}>{value}</span>
        </div>
    </div>
);

const GanttChart = ({ chartData, totalExecutionTime }) => (
    <div>
        <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-200">Gantt Chart</h3>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
            <div className="relative flex w-full h-12">
                {chartData.map((block, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-center text-white text-sm font-semibold rounded-sm border-2 border-white/20 ${getProcessColor(block.processId)}`}
                        style={{ width: `${(block.end - block.start) / totalExecutionTime * 100}%` }}
                        title={`${block.processId}: ${block.start}ms - ${block.end}ms`}
                    >
                        {block.processId !== 'Idle' && block.processId}
                    </div>
                ))}
            </div>
            <div className="relative flex w-full h-6">
                {chartData.map((block, index) => (
                    <div
                        key={index}
                        className="relative"
                        style={{ width: `${(block.end - block.start) / totalExecutionTime * 100}%` }}
                    >
                        {index === 0 && (
                            <div className="absolute top-0 left-0 -translate-x-1/2 flex flex-col items-center">
                                <div className="h-2 w-0.5 bg-slate-400"></div>
                                <span className="text-xs text-slate-500">{block.start}</span>
                            </div>
                        )}
                        <div className="absolute top-0 right-0 translate-x-1/2 flex flex-col items-center">
                            <div className="h-2 w-0.5 bg-slate-400"></div>
                            <span className="text-xs text-slate-500">{block.end}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const ProcessTable = ({ metrics }) => {
    const headers = ["Process", "Arrival", "Burst", "Completion", "Waiting", "Turnaround", "Response"];
    return (
        <div>
            <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-200">Process Metrics</h3>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                        <tr>
                            {headers.map(header => (
                                <th key={header} className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900/50 divide-y divide-slate-200 dark:divide-slate-700">
                        {metrics.map((p) => (
                            <tr key={p.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">{p.name}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{p.arrivalTime}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{p.burstTime}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{p.completionTime}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{p.waitingTime}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{p.turnaroundTime}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{p.responseTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CPU_SchedulingVisualizer = ({ data }) => {
    if (!data) return null;

    const { ganttChart, processMetrics, avgWaitingTime, avgTurnaroundTime, totalExecutionTime } = data;

    return (
        <div className="w-full space-y-6">
            {/* Top Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title="Avg Waiting Time" value={avgWaitingTime.toFixed(2)} icon={<Clock size={20} />} colorClass={{ text: 'text-indigo-500', bg: 'bg-indigo-500' }} />
                <MetricCard title="Avg Turnaround Time" value={avgTurnaroundTime.toFixed(2)} icon={<Rss size={20} />} colorClass={{ text: 'text-emerald-500', bg: 'bg-emerald-500' }} />
                <MetricCard title="Total Execution Time" value={totalExecutionTime} icon={<Timer size={20} />} colorClass={{ text: 'text-amber-500', bg: 'bg-amber-500' }} />
            </div>

            {/* Gantt Chart Section */}
            <GanttChart chartData={ganttChart} totalExecutionTime={totalExecutionTime} />

            {/* Process Metrics Table */}
            <ProcessTable metrics={processMetrics} />
        </div>
    );
};

export default CPU_SchedulingVisualizer;
