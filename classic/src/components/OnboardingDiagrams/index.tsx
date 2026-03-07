import React from 'react';

export function OverviewDiagram(): React.JSX.Element {
    return (
        <div className="w-full">
            <div className="flex items-center justify-center gap-4 flex-wrap">
                {/* Devices */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                        {['Camera', 'Panel', 'Sensor'].map((label) => (
                            <div
                                key={label}
                                className="text-center p-3 rounded-lg border border-gray-600 bg-gray-800"
                                style={{ minWidth: '70px' }}
                            >
                                <div className="text-gray-300 text-xs font-mono">{label}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-gray-500 text-xs uppercase tracking-wide">On-Site Devices</div>
                </div>

                {/* Arrow */}
                <div className="text-gray-500 text-2xl">→</div>

                {/* Talos */}
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="p-4 rounded-lg border-2 border-primary-500 bg-gray-800"
                        style={{ minWidth: '80px', textAlign: 'center' }}
                    >
                        <div className="text-primary-400 text-sm font-bold font-mono">Talos</div>
                        <div className="text-gray-400 text-xs mt-1">Edge</div>
                    </div>
                    <div className="text-gray-500 text-xs uppercase tracking-wide">Edge Device</div>
                </div>

                {/* Arrow */}
                <div className="text-gray-500 text-2xl">→</div>

                {/* GCXONE Cloud */}
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="p-4 rounded-lg border-2 border-yellow-500 bg-gray-800"
                        style={{ minWidth: '100px', textAlign: 'center' }}
                    >
                        <div className="text-yellow-400 text-sm font-bold font-mono">GCXONE</div>
                        <div className="text-gray-400 text-xs mt-1">Cloud Platform</div>
                    </div>
                    <div className="text-gray-500 text-xs uppercase tracking-wide">Cloud</div>
                </div>

                {/* Arrow */}
                <div className="text-gray-500 text-2xl">→</div>

                {/* Operators */}
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="p-4 rounded-lg border border-gray-600 bg-gray-800"
                        style={{ minWidth: '80px', textAlign: 'center' }}
                    >
                        <div className="text-gray-300 text-sm font-mono">Ops</div>
                        <div className="text-gray-400 text-xs mt-1">Team</div>
                    </div>
                    <div className="text-gray-500 text-xs uppercase tracking-wide">Operations</div>
                </div>
            </div>
        </div>
    );
}

export function NetworkDiagram(): React.JSX.Element {
    const ports = [
        { port: '443 TCP', label: 'HTTPS Dashboard', color: '#E8B058' },
        { port: '554 TCP', label: 'RTSP Video', color: '#60a5fa' },
        { port: '123 UDP', label: 'NTP Time Sync', color: '#34d399' },
        { port: 'TCP', label: 'Gateway 18.185.17.113', color: '#a78bfa' },
    ];

    return (
        <div className="w-full">
            <div className="text-center mb-4 text-gray-400 text-xs uppercase tracking-widest font-mono">
                Required Network Ports
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ports.map((item) => (
                    <div
                        key={item.port}
                        className="p-3 rounded border border-gray-700 bg-gray-900 text-center"
                    >
                        <div
                            className="font-mono font-bold text-sm mb-1"
                            style={{ color: item.color }}
                        >
                            {item.port}
                        </div>
                        <div className="text-gray-400 text-xs">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
