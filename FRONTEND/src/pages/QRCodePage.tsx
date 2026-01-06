import QRCode from "react-qr-code";
import { useAuth } from "../hook/useAuth";

const QRCodePage = () => {
  const { qrURL } = useAuth();

  // testing URL
  const displayURL = qrURL || "https://www.google.com";

  return (
    <div className="text-center mt-10">
      <h3 className="mb-3">This is your personal QR Code!</h3>
      <p className="mb-2">Scan to open the emergency responder AI chatbot.</p>

      <div className="mx-auto w-fit p-4 bg-white">
        <QRCode value={displayURL} size={500} />
      </div>

      <p className="mt-4 break-all text-xl">
        {displayURL}
      </p>

      <div className="mt-4 mb-12">
        <button
          onClick={() => window.print()}
          className="bg-[#81c784] hover:bg-[#2e7d32] text-white px-6 py-2 rounded"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default QRCodePage;
