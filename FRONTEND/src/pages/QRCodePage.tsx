import QRCode from "react-qr-code";
import { useAuth } from "../hook/useAuth";

const QRCodePage = () => {
  const { qrURL } = useAuth();

  return (
    <div className="text-center mt-10">
      <h3 className="mb-3 print:hidden">This is your personal QR Code!</h3>
      <p className="mb-2 print:hidden">Scan to open the emergency responder AI chatbot.</p>

      <div className="mx-auto w-fit p-4 bg-white">
        {qrURL && <QRCode value={qrURL} size={250} />}
      </div>

      <p className="mt-4 break-all text-xl print:hidden">
        {qrURL}
      </p>

      <div className="mt-4 mb-12 print:hidden">
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
