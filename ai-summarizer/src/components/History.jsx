import { useState, useMemo } from 'react';

const History = ({ history, handleDelete, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter history based on search term
  const filteredHistory = useMemo(() => {
    if (!searchTerm.trim()) {
      return history;
    }
    
    return history.filter(item => 
      item.inputText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summaryText.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!history.length) {
    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Riwayat Ringkasan</h2>
        <p className="text-gray-500 text-center py-8">
          Belum ada riwayat ringkasan. Mulai buat ringkasan pertama Anda!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Riwayat Ringkasan</h2>
        <button
          onClick={onRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Refresh
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari dalam riwayat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Menampilkan {filteredHistory.length} dari {history.length} ringkasan
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left">Tanggal</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Input Text</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Ringkasan</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Model</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2 text-sm">
                  {formatDate(item.createdAt)}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <div className="max-w-xs">
                    <p className="text-sm" title={item.inputText}>
                      {truncateText(item.inputText)}
                    </p>
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <div className="max-w-xs">
                    <p className="text-sm" title={item.summaryText}>
                      {truncateText(item.summaryText)}
                    </p>
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-2 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {item.modelUsed}
                  </span>
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredHistory.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada hasil yang ditemukan untuk "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default History;