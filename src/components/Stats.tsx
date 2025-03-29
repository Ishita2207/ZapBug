import { BarChart2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface StatsProps {
  stats: {
    errors: number;
    warnings: number;
    info: number;
  };
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-800">
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-gray-300">Total Issues</span>
        </div>
        <p className="text-2xl font-bold text-white mt-2">
          {stats.errors + stats.warnings + stats.info}
        </p>
      </div>
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-gray-300">Errors</span>
        </div>
        <p className="text-2xl font-bold text-white mt-2">{stats.errors}</p>
      </div>
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-300">Warnings</span>
        </div>
        <p className="text-2xl font-bold text-white mt-2">{stats.warnings}</p>
      </div>
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-300">Info</span>
        </div>
        <p className="text-2xl font-bold text-white mt-2">{stats.info}</p>
      </div>
    </div>
  );
}