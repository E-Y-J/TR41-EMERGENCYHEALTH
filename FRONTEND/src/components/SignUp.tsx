import '../styles/AuthContainer.css'

const SignUp = () => {
    return (
        <>
            <div className="signup-box">
                <div className="signup-tab">
                    <button>Sign Up</button>
                </div>
                <div className="signup-body p-7">
                    <form className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="border border-white rounded p-2"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="border border-white rounded p-2"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="border border-white rounded p-2"
                        />
                        <input
                            type="password"
                            placeholder="Create a Password"
                            className="border border-white rounded p-2"
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
        </>
    )
}

export default SignUp