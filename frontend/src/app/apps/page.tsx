'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, DollarSign, Download } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import envConfig from '@/src/constants/envConfig';
import { Plugin, PluginStat } from '@/src/types/plugin';

export default function PluginPage() {
  const { id } = useParams();
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [stat, setStat] = useState<PluginStat | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const pluginResponse = await fetch(`${envConfig.API_URL}/v1/approved-apps/${id}?include_reviews=true`);
      const pluginData = await pluginResponse.json();
      setPlugin(pluginData);

      const statsResponse = await fetch("https://raw.githubusercontent.com/BasedHardware/omi/refs/heads/main/community-plugin-stats.json");
      const statsData = await statsResponse.json();
      setStat(statsData.find((s: PluginStat) => s.id === id) || null);
    };

    fetchData();
  }, [id]);

  if (!plugin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex items-center">
          <img
            src={plugin.image}
            alt={plugin.name}
            className="mr-4 h-16 w-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{plugin.name}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">by {plugin.author}</p>
          </div>
        </div>
        <div className="mb-4 flex space-x-4 text-sm">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400" />
            <span className="font-semibold text-gray-800 dark:text-white">
              {plugin.rating_avg?.toFixed(1) ?? 'N/A'}
            </span>
            <span className="ml-1 text-gray-600 dark:text-gray-400">
              ({plugin.rating_count ?? 0})
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {(stat?.money ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center">
            <Download className="mr-1 h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              {plugin.installs.toLocaleString()}
            </span>
          </div>
        </div>
        <p className="mb-6 text-gray-700 dark:text-gray-300">{plugin.description}</p>
        <div className="flex justify-center">
          <Button className="w-1/3 bg-black text-white hover:bg-gray-800">Try it</Button>
        </div>
      </div>
    </div>
  );
}
