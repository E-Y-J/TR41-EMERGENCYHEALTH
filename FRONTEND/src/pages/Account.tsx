import { useState } from 'react';
import Allergies from '../components/Forms/Allergies';
import Conditions from '../components/Forms/Conditions';
import Medications from '../components/Forms/Medications';
import PersonalInfo from '../components/Forms/PersonalInfo';
import PersonalInfoDisplay from '../components/Display/PersonalInfoDisplay';
//import AllergiesDisplay from '../components/Display/AllergiesDisplay';
//import MedicationsDisplay from '../components/Display/MedicationsDisplay';
//import ConditionsDisplay from '../components/Display/ConditionsDisplay';

const Account = () => {
    const [editingPersonalInfo, setEditingPersonalInfo] = useState(false);
    //const [editingAllergies, setEditingAllergies] = useState(false);
    //const [editingMedications, setEditingMedications] = useState(false);
    //const [editingConditions, setEditingConditions] = useState(false);

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-10">Account</h1>
            <div className="grid grid-cols-5 gap-8">
                <div className="col-span-2">
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 sticky top-6">
                        {editingPersonalInfo ? (
                            <PersonalInfo onCancel={() => setEditingPersonalInfo(false)} />
                        ) : (
                            <PersonalInfoDisplay onEdit={() => setEditingPersonalInfo(true)} />
                        )}
                    </div>
                </div>
                <div className="col-span-3 space-y-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <div>
                        <Allergies onCancel={() => {}} />
                        {/* {editingAllergies ? (
                            <Allergies onCancel={() => setEditingAllergies(false)} />
                        ) : (
                            <AllergiesDisplay
                                onAdd={() => setEditingAllergies(true)}
                                onEdit={() => setEditingAllergies(true)}
                            />
                        )} */}
                    </div>
                    <div>
                        <Medications onCancel={() => { }} />
                        {/* {editingMedications ? (
                            <Medications onCancel={() => setEditingMedications(false)} />
                        ) : (
                            <MedicationsDisplay
                                onAdd={() => setEditingMedications(true)}
                                onEdit={() => setEditingMedications(true)}
                            />
                        )} */}
                    </div>
                    <div>
                        <Conditions onCancel={() => { }} />
                        {/* {editingConditions ? (
                            <Conditions onCancel={() => setEditingConditions(false)} />
                        ) : (
                            <ConditionsDisplay
                                onAdd={() => setEditingConditions(true)}
                                onEdit={() => setEditingConditions(true)}
                            />
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;