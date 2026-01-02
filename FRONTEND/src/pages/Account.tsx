import Allergies from '../components/Forms/Allergies'
import Conditions from '../components/Forms/Conditions';
import Medications from '../components/Forms/Medications';
import PersonalInfo from '../components/Forms/PersonalInfo';

const Account = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6">Account</h1>
            <div className="grid grid-cols-5 gap-6">
                <div className="col-span-2">
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 sticky top-6">
                        <PersonalInfo />
                    </div>
                </div>
                <div className="col-span-3 space-y-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <div>
                        <Allergies />
                    </div>
                    <div>
                        <Medications />
                    </div>
                    <div >
                        <Conditions />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;