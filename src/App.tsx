import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const URL = "http://localhost:3000/api";

export default function App() {
  const [plainTxt, setPlainTxt] = useState<string>("");
  const [encryptedTxt, setEncryptedTxt] = useState<string>("");

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
    try {
      // plus sign is treated as space in URL that's why converting plus sign into % sign
      const updatedPlainText = encodeURIComponent(text);
      const response = await axios(`${URL}/encrypt?plainText=${updatedPlainText}`);
      if (response.data?.msg === "encrypted successfully") {
        setEncryptedTxt(response.data.result);
      } else {
        toast.error("Something went try again. Please try again", { toastId: "tryBlockErr" })
      }
    } catch (e) {
      toast.error('Server error: something went try again. Please try again', { toastId: "catchBlockErr" });
    }

  }

  const generatePassword = () => {
    if (plainTxt?.length == 0 || plainTxt?.length < 3) {
      toast.warning("please enter atleast 3 characters in plain text field", { toastId: 'characters' });
    }
    else {
      doEncryption(plainTxt);
    }
  }


  const doDecryption = async (text: string) => {
    try {
      // plus sign is treated as space in URL that's why converting plus sign into % sign
      const updatedText = encodeURIComponent(text);
      const response = await axios(`${URL}/decrypt?encryptedText=${updatedText}`);
      if (response.data?.msg === "decrypted successfully") {
        setPlainTxt(response.data.result);
      } else {
        toast.error("Something went try again. Please try again", { toastId: "tryBlockErrDecrypt" })
      }
    } catch (e: any) {
      if (e.response?.data?.msg === "Encrypted text is not valid") {
        toast.error("Encrypted text is not valid. Please try again", { toastId: "invalid" })
      } else toast.error('Server error: something went try again. Please try again', { toastId: "catchBlockErrDecrypt" });
    }

  }

  const decryptPassword = () => {
    if (encryptedTxt?.length == 0) {
      toast.warning("please enter some value in encrypted text field", { toastId: 'encryptedTxtField' });
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
        toast.success('Text copied to clipboard!', { toastId: "success" });
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
  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center min-w-96 font-mono">
      <div className="relative bg-gray-950 w-full mx-3 md:w-96">
        <div className="p-6">
          <h3 className="text-5xl text-customYellow text-center">Secure Pass</h3>
          <h5 className="text-xl text-slate-300 text-center mt-2">A password generator</h5>
          <div className="mt-5">
            <input type="text" value={plainTxt} className="p-2 mb-4 w-full border-2 border-slate-300 rounded-sm bg-gray-950 text-customAqua focus:outline-none focus:border-customAqua" placeholder="Enter plain text here"
              onChange={handlePlainTxtChange} />
            <textarea rows={6} value={encryptedTxt} className="p-2 w-full border-2 border-slate-300 rounded-sm bg-gray-950 text-customAqua focus:outline-none focus:border-customAqua resize-none"
              placeholder="Encrypted Password will come here" onChange={handleEncryptedTxtChange} />
            <div className="flex justify-end">
              <button className="text-black bg-customAqua hover:bg-opacity-50 mt-2 text-md px-4 py-2 border-none rounded-md disabled:bg-opacity-20" onClick={copy} disabled={encryptedTxt?.length == 0 ? true : false}>copy</button>
            </div>
          </div>
          <div className="mt-4">
            <button className="text-black font-bold bg-customYellow hover:bg-opacity-50 mt-2 text-md w-full px-4 py-2 border-none rounded-md" onClick={generatePassword}>Generate (Encrypt)</button>
            <button className="text-white bg-customRed hover:bg-opacity-50 mt-2 text-md w-full px-4 py-2 border-none rounded-md" onClick={decryptPassword}>Decrypt (Generate original text)</button>
            <button className="text-white bg-slate-600 hover:bg-opacity-50 mt-2 text-md w-full px-4 py-2 border-none rounded-md" onClick={clear}> Clear All</button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable={false}
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
