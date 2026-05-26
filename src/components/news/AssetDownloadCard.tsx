import { Download } from 'lucide-react';
import type { AssetCategory } from '@/types/media-kit';

interface AssetDownloadCardProps {
  category: AssetCategory;
}

export function AssetDownloadCard({ category }: AssetDownloadCardProps) {
  const getFormatBadgeColor = (format: string) => {
    switch (format) {
      case 'SVG':
        return 'bg-blue-100 text-blue-800';
      case 'PNG':
        return 'bg-green-100 text-green-800';
      case 'PDF':
        return 'bg-red-100 text-red-800';
      case 'ZIP':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4">
        <h3 className="mb-2 text-xl font-bold text-[#1C1C1E]">{category.title}</h3>
        <p className="text-sm text-gray-600">{category.description}</p>
      </div>

      <div className="space-y-3">
        {category.assets.map(asset => (
          <div
            key={asset.id}
            className="flex items-start justify-between gap-4 rounded-md border border-gray-100 bg-gray-50 p-3"
          >
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1C1C1E]">{asset.name}</span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${getFormatBadgeColor(asset.format)}`}
                >
                  {asset.format}
                </span>
              </div>
              <p className="text-xs text-gray-600">{asset.description}</p>
              {asset.size && <p className="mt-1 text-xs text-gray-500">{asset.size}</p>}
            </div>

            <a
              href={asset.fileUrl ? `/api/download?url=${encodeURIComponent(asset.fileUrl)}` : '#'}
              download={!!asset.fileUrl}
              className="flex items-center gap-1 rounded-md bg-[#C8102E] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#A00D25]"
              aria-label={`Download ${asset.name}`}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
