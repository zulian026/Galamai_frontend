import { createContext, useContext, useState } from "react";

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  const confirm = (message, callback) => {
    setMessage(message);
    setOnConfirm(() => callback);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (onConfirm) await onConfirm();
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setMessage("");
    setOnConfirm(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Konfirmasi Hapus
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">{message}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:bg-red-400"
                  disabled={loading}
                >
                  {loading ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
