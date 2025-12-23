import { useAuth } from "../hook/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <>
      {user && (
        <ul>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      )}
    </>
  );
};

export default Header;
