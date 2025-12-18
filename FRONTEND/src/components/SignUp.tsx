import '../styles/AuthContainer.css';

interface SignUpProps {
    active: boolean;
    switchTab: () => void;
    boxActive: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ active, switchTab, boxActive }) => {
    return (
        <div className="signup-box">
            <div className="signup-tab" style={{ zIndex: boxActive ? 4 : 2 }}>
                <button
                    className='signup-btn'
                    onClick={switchTab}
                >
                    Sign Up
                </button>
            </div>
            <div className={`signup-body p-7 ${active ? "active" : ""}`}>
                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="First Name"
                        className="border border-white focus:outline-none focus:border-gray-500 rounded p-2"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="border border-white focus:outline-none focus:border-gray-500 rounded p-2"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="border border-white focus:outline-none focus:border-gray-500 rounded p-2"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Create a Password"
                        className="border border-white focus:outline-none focus:border-gray-500 rounded p-2"
                        required
                    />
                    <button
                        type="submit"
                        className="text-gray-500 border border-white active:bg-white focus:outline-none p-2 rounded"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
