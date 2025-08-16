import { useState } from "react";
import toast from "react-hot-toast";
import { forgetPassword } from "../../Api/userApiCalls/userApi";

interface forgetPasswordModal {
    isOpen: boolean;
    onClose: () => void;
}

export const ForgetPassword = ({
    isOpen,
    onClose,

}: forgetPasswordModal) => {
    const [email, setEmail] = useState('')

    const handleSubmit = async () => {
        try {
            await forgetPassword(email)
            onClose()
            toast.success('Forget Password successfully')
        } catch (error: any) {
            toast.error(error.message || 'ForgetPassword failed');
        }
    }
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

            {/* Modal container with glass effect */}
            <div className="relative bg-white/80 backdrop-blur-[8px] p-6 rounded-xl border border-white/20 shadow-2xl max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Forgot Password?</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 mb-4 rounded-lg bg-white/70 border border-white/30"
                        placeholder="your@email.com"
                    />
                    <div className="flex gap-3 justify-end">
                        <button className="px-4 py-2 rounded-lg bg-white/80 hover:bg-white">
                            Cancel
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-orange-400/90 text-white hover:bg-orange-500">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
