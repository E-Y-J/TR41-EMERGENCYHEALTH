
import  {useAuth} from "../hook/useAuth";

const HomePage = () => {
  const { user } = useAuth();
  return (
    <>
      <div className="text-center">HomePage</div>
      {user && <div>Welcome, {user.first_name}!</div>}
    </>
  );
};

export default HomePage;
