import Allergies from '../components/Forms/Allergies'
import Conditions from '../components/Forms/Conditions';
import Medications from '../components/Forms/Medications';
import PersonalInfo from '../components/Forms/PersonalInfo';

const Account = () => {
    return (
        <div className="text-center">
            <p>Account coming soon</p>
            <div>
                <PersonalInfo />
            </div>
            <div>
                <Allergies />
            </div>
            <div>
                <Medications />
            </div>
            <div>
                <Conditions />
            </div>
        </div>
    );
};

export default Account;