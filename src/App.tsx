import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';
import { 
  FiLock, 
  FiEye, 
  FiCopy, 
  FiShield, 
  FiKey, 
  FiTrash2,
  FiCheck
} from 'react-icons/fi';

const URL = "https://securepass-api.vercel.app/api";

export default function App() {
  const [plainTxt, setPlainTxt] = useState<string>("");
  const [encryptedTxt, setEncryptedTxt] = useState<string>("");
  const [encryptionLoading, setEncryptionLoading] = useState<boolean>(false);
  const [decryptionLoading, setDecryptionLoading] = useState<boolean>(false);
  const [showPlainText, setShowPlainText] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const handlePlainTxtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newPlainTxt = e.target.value.replace(/\s+/g, ""); // removing whitespaces.
    setPlainTxt(newPlainTxt);
  }

  const handleEncryptedTxtChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const newEncryptedTxt = e.target.value.replace(/\s+/g, ""); // removing whitespaces.
    setEncryptedTxt(newEncryptedTxt);
  }

  const doEncryption = async (text: string) => {
    setEncryptionLoading(true);
    try {
      // plus sign is treated as space in URL that's why converting plus sign into % sign
      const updatedPlainText = encodeURIComponent(text);
      const response = await axios(`${URL}/encrypt?plainText=${updatedPlainText}`);
      setEncryptionLoading(false);
      if (response.data?.msg === "encrypted successfully") {
        setEncryptedTxt(response.data.result);
      } else {
        toast.error("Something went wrong. Please try again", { toastId: "tryBlockErr" })
      }
    } catch (e) {
      setEncryptionLoading(false);
      toast.error('Server error: something went wrong. Please try again', { toastId: "catchBlockErr" });
    }

  }

  const generatePassword = () => {
    if (plainTxt?.length == 0 || plainTxt?.length < 3) {
      toast.warning("Please enter at least 3 characters in plain text field", { toastId: 'characters' });
    }
    else {
      doEncryption(plainTxt);
    }
  }


  const doDecryption = async (text: string) => {
    setDecryptionLoading(true);
    try {
      // plus sign is treated as space in URL that's why converting plus sign into % sign
      const updatedText = encodeURIComponent(text);
      const response = await axios(`${URL}/decrypt?encryptedText=${updatedText}`);
      setDecryptionLoading(false);
      if (response.data?.msg === "decrypted successfully") {
        setPlainTxt(response.data.result);
      } else {
        toast.error("Something went wrong. Please try again", { toastId: "tryBlockErrDecrypt" })
      }
    } catch (e: unknown) {
      setDecryptionLoading(false);
      if (axios.isAxiosError(e) && e.response?.data?.msg === "Encrypted text is not valid") {
        toast.error("Encrypted text is not valid. Please try again", { toastId: "invalid" })
      } else {
        toast.error('Server error: something went wrong. Please try again', { toastId: "catchBlockErrDecrypt" });
      }
    }

  }

  const decryptPassword = () => {
    if (encryptedTxt?.length == 0) {
      toast.warning("Please enter some value in encrypted text field", { toastId: 'encryptedTxtField' });
    }
    else {
      doDecryption(encryptedTxt);
    }
  }
  // copy to clipboard
  const copy = () => {
    navigator.clipboard.writeText(encryptedTxt)
      .then(() => {
        console.log('Text copied to clipboard:', encryptedTxt);
        setCopied(true);
        toast.success('Text copied to clipboard!', { toastId: "success" });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // console.error('Error copying text:', error);
        toast.error('Error copying text. Please try again.');
      });
  }
  const clear = () => {
    setPlainTxt("");
    setEncryptedTxt("");
  }

  // Calculate password strength
  const getPasswordStrength = (text: string) => {
    if (!text) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (text.length >= 8) strength++;
    if (text.length >= 12) strength++;
    if (/[A-Z]/.test(text)) strength++;
    if (/[a-z]/.test(text)) strength++;
    if (/[0-9]/.test(text)) strength++;
    if (/[^A-Za-z0-9]/.test(text)) strength++;
    
    const levels = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' },
      { label: 'Very Strong', color: 'bg-emerald-500' }
    ];
    return { strength: Math.min(strength, 5), ...levels[Math.min(strength, 5)] };
  }

  const passwordStrength = getPasswordStrength(encryptedTxt);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center min-w-80 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 border-b-2 border-indigo-300 p-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg border border-white/30">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                SecurePass
              </h1>
            </div>
            <p className="text-center text-indigo-100 text-sm font-medium">Advanced Password Generator & Encryptor</p>
          </div>

          <div className="p-6 space-y-5 bg-white">
            {/* Plain Text Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiKey className="w-4 h-4 text-indigo-600" />
                Plain Text
              </label>
              <div className="relative group">
                <input
                  type={showPlainText ? "text" : "password"}
                  value={plainTxt}
                  onChange={handlePlainTxtChange}
                  className="w-full px-4 py-3 pl-11 pr-11 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium"
                  placeholder="Enter your text here..."
                />
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
                <button
                  type="button"
                  onClick={() => setShowPlainText(!showPlainText)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <FiEye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Encrypted Text Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiShield className="w-4 h-4 text-indigo-600" />
                Encrypted Password
              </label>
              <div className="relative group">
                <textarea
                  rows={4}
                  value={encryptedTxt}
                  onChange={handleEncryptedTxtChange}
                  className="w-full px-4 py-3 pl-11 pr-4 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none font-mono text-sm"
                  placeholder="Encrypted password will appear here..."
                />
                <FiLock className="absolute left-3.5 top-3.5 w-5 h-5 text-indigo-600" />
              </div>
              
              {/* Password Strength Indicator */}
              {encryptedTxt.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-600">Strength</span>
                    <span className={`font-semibold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full`}
                      style={{ width: `${((passwordStrength.strength + 1) / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Copy Button */}
              <button
                onClick={copy}
                disabled={encryptedTxt?.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:shadow-none"
              >
                {copied ? (
                  <>
                    <FiCheck className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="w-4 h-4" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 bg-white pb-1">
              <button
                onClick={generatePassword}
                disabled={encryptionLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {encryptionLoading ? (
                  <ThreeDots
                    visible={true}
                    height="20"
                    width="40"
                    color="rgb(255 255 255)"
                    radius="9"
                    ariaLabel="three-dots-loading"
                  />
                ) : (
                  <>
                    <FiShield className="w-5 h-5" />
                    <span>Generate Password</span>
                  </>
                )}
              </button>

              <button
                onClick={decryptPassword}
                disabled={decryptionLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {decryptionLoading ? (
                  <ThreeDots
                    visible={true}
                    height="20"
                    width="40"
                    color="rgb(255 255 255)"
                    radius="9"
                    ariaLabel="three-dots-loading"
                  />
                ) : (
                  <>
                    <FiEye className="w-5 h-5" />
                    <span>Decrypt</span>
                  </>
                )}
              </button>

              <button
                onClick={clear}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all duration-200"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable={false}
        pauseOnHover
        theme="light"
        toastClassName="bg-white border-2 border-gray-200 shadow-lg"
      />
    </div>
  );
}
