import '../styles/AuthContainer.css';

interface LoginProps {
    active: boolean;
    switchTab: () => void;
    boxActive: boolean;
}

const Login: React.FC<LoginProps> = ({ active, switchTab, boxActive }) => {
    return (
        <div className="login-box">
            <div className="login-tab" style={{ zIndex: boxActive ? 4 : 2 }}>
                <button
                    className='login-btn'
                    onClick={switchTab}
                >
                    Login
                </button>
            </div>
            <div className={`login-body p-7 ${active ? "active" : ""}`}>
                <form className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Enter email"
                        className="border border-white focus:outline-none focus:border-gray-500 rounded p-2"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border border-white focus:outline-none focus:border-gray-500 rounded p-2"
                        required
                    />
                    <button
                        type="submit"
                        className="text-gray-500 border border-white active:bg-white focus:outline-none p-2 rounded"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
