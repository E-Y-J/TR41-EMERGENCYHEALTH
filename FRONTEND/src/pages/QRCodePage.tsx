import QRCode from "react-qr-code";
import { useAuth } from "../hook/useAuth";

const QRCodePage = () => {
  const { qrURL } = useAuth();

  // testing URL
  const displayURL = qrURL || "https://www.google.com";

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Emergency QR Code</h2>
      <p>Scan to open the emergency responder AI chatbot.</p>

      <div
        style={{
          margin: "0 auto",
          width: "fit-content",
          padding: 16,
          background: "white",
        }}
      >
        <QRCode value={displayURL} size={500} />
      </div>

      <p style={{ marginTop: 16, wordBreak: "break-all", fontSize: 20 }}>
        {displayURL}
      </p>

      <div
        style={{
          marginTop: 16,
          background: "green",
          display: "inline-block",
          padding: 8,
        }}
      >
        <button onClick={() => window.print()}>Print</button>
      </div>
    </div>
  );
};

export default QRCodePage;
