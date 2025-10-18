import { useState } from 'react';
import { CheckSquare, Square, FileText, Mail, Download, UserPlus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface BatchItem {
  id: string;
  type: 'calibration' | 'certificate' | 'equipment';
  name: string;
  client?: string;
  status?: string;
}

interface BatchOperationsPanelProps {
  items: BatchItem[];
  onClose?: () => void;
}

export const BatchOperationsPanel = ({ items = [], onClose }: BatchOperationsPanelProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(item => item.id));
    }
  };

  const handleToggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleBatchAction = async (action: string) => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Batch ${action} for items:`, selectedIds);
    setIsProcessing(false);
    setSelectedIds([]);
  };

  const selectedCount = selectedIds.length;
  const allSelected = selectedIds.length === items.length && items.length > 0;

  return (
    <div className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-indigo-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleAll}
            className="p-1 hover:bg-indigo-100 rounded transition-colors"
            disabled={items.length === 0}
          >
            {allSelected ? (
              <CheckSquare className="h-5 w-5 text-indigo-600" />
            ) : (
              <Square className="h-5 w-5 text-gray-400" />
            )}
          </button>
          <div>
            <h3 className="font-semibold text-gray-900">Batch Operations</h3>
            <p className="text-xs text-gray-600">
              {selectedCount > 0 
                ? `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`
                : 'Select items to perform batch actions'
              }
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Items List */}
      <div className="max-h-64 overflow-y-auto p-2">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Square className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No items available for batch operations</p>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                  selectedIds.includes(item.id)
                    ? 'bg-indigo-50 border-2 border-indigo-200'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => handleToggleItem(item.id)}
              >
                <div className="flex-shrink-0">
                  {selectedIds.includes(item.id) ? (
                    <CheckSquare className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  {item.client && (
                    <p className="text-xs text-gray-500">{item.client}</p>
                  )}
                </div>
                <Badge variant="outline" className="flex-shrink-0">
                  {item.type}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {selectedCount > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => handleBatchAction('generate-certificates')}
              disabled={isProcessing}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <FileText className="h-3 w-3 mr-1" />
              Generate Certificates ({selectedCount})
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBatchAction('email-clients')}
              disabled={isProcessing}
            >
              <Mail className="h-3 w-3 mr-1" />
              Email Clients
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBatchAction('download-all')}
              disabled={isProcessing}
            >
              <Download className="h-3 w-3 mr-1" />
              Download All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBatchAction('assign-technician')}
              disabled={isProcessing}
            >
              <UserPlus className="h-3 w-3 mr-1" />
              Assign Technician
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBatchAction('delete')}
              disabled={isProcessing}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>

          {isProcessing && (
            <div className="mt-3 flex items-center gap-2 text-sm text-indigo-600">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              Processing {selectedCount} item{selectedCount > 1 ? 's' : ''}...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
