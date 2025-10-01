import { createContext, useContext, useState, useCallback } from "react";

const ConfirmModalContext = createContext();

export function ConfirmModalProvider({ children }) {
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const confirm = useCallback((title, message, onConfirm) => {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  }, []);

  const handleClose = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    handleClose();
  };

  return (
    <ConfirmModalContext.Provider value={{ confirm }}>
      {children}

      {modal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay dengan blur */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleClose}
          ></div>

          {/* Modal Box */}
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6 z-10">
            <h2 className="text-lg font-bold text-gray-900">{modal.title}</h2>
            <p className="mt-2 text-gray-600">{modal.message}</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmModalContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmModalContext);
