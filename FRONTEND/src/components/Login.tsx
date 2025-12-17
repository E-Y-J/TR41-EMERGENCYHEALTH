import '../styles/AuthContainer.css'

const Login = () => {
    return (
        <>
            <div className="login-box">
                <div className="login-tab">
                    <button>Login</button>
                </div>
                <div className="login-body p-7">
                    <form className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="border border-white rounded p-2 focus:outline-none focus:border-white"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="border border-white rounded p-2 focus:outline-none focus:border-white"
                        />
                        <button
                            type="submit"
                            className="text-gray-500 border border-white active:bg-white focus:outline-none p-2 rounded "
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login