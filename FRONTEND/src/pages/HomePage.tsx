
const HomePage = () => {
  return (
    <div className="text-center">
      <h1 className="mb-4">Welcome to EmergyScan</h1>
      <h4>Your emergency health companion</h4>
      <div className="flex items-center gap-6 max-w-7xl mx-auto mt-8 px-4">
        <img src="/paramedics.jpg" alt="Paramedics" className="w-1/2 rounded-lg" />
        <p className="w-1/2 text-lg text-left">
          Sign up and enter your medical information to receive a personal QR code.
          In an emergency, responders can scan your code to access AI-powered assistance
          that helps them make informed decisions based on your allergies, medications,
          and medical conditions.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
