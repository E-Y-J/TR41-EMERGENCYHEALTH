import QRCode from "react-qr-code";
import { useAuth } from "../hook/useAuth";
import { api } from "../api/http";

const QRCodePage = () => {
  const { qrURL, isRevoked, setIsRevoked } = useAuth();

  const handleRevoke = async() => {
    try {
      const response = await api.post("patients/me/revoke_qr");
      if (response.status === 200) {
        alert("QR Code revoked successfully. Please log in again to get a new QR code.");
        setIsRevoked(true);
      } else {
        alert("Failed to revoke QR Code. Please try again.");
      }
    } catch (error) {
      console.error("Error revoking QR Code:", error);
      alert("An error occurred while revoking the QR Code.");
    }
    
  };

  return (
    <div className="text-center mt-10">
      <h3 className="mb-3 print:hidden">This is your personal QR Code!</h3>
      <p className="mb-2 print:hidden">Scan to open the emergency responder AI chatbot.</p>

      <div className="mx-auto w-fit p-4 bg-white">
        {qrURL && isRevoked===false &&  <QRCode value={qrURL} size={250} />}
      </div>

      <p className="mt-4 break-all text-xl print:hidden">
        {isRevoked ? (
          <span className="text-center bg-red-500 text-white px-4 py-2 rounded block">
            This QR Code has been revoked. Please log in again to get a new QR code.
          </span>
        ) : (
          qrURL
        )}
      </p>
        {isRevoked? null : (
                <div className="mt-4 mb-12 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-[#81c784] hover:bg-[#2e7d32] text-white px-6 py-2 rounded"
        >
          Print
        </button>
        <button
          onClick={handleRevoke}
          className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded ml-4"
        >
          Revoke
        </button>
      </div>
        )}
    </div>
  );
};

export default QRCodePage;
