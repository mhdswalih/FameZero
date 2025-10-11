
interface PreviewModalProps {
    previewImg: string;
    onClose: () => void;
    open: boolean;
}

const PreviewModal = ({ previewImg, onClose, open }: PreviewModalProps) => {
    if (!open) return null;

    return (
        <div 
            className="fixed inset-0   bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-pointer"
            onClick={onClose}
        >
            <div className="relative max-w-5xl w-100  ">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white text-2xl font-bold hover:text-orange-400 transition-colors"
                >
                    ✕
                </button>
                <img
                    src={previewImg}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()} 
                />
            </div>
        </div>
    );
}

export default PreviewModal;