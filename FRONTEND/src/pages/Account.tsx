import { useState } from 'react';
import Allergies from '../components/Forms/Allergies';
import Conditions from '../components/Forms/Conditions';
import Medications from '../components/Forms/Medications';
import PersonalInfo from '../components/Forms/PersonalInfo';
import PersonalInfoDisplay from '../components/Display/PersonalInfoDisplay';
import AllergiesDisplay from '../components/Display/AllergiesDisplay';
import MedicationsDisplay from '../components/Display/MedicationsDisplay';
import ConditionsDisplay from '../components/Display/ConditionsDisplay';
import type { AllergyFormData, MedicationFormData, ConditionFormData } from '../schemas/healthSchema';

const Account = () => {
    const [editingPersonalInfo, setEditingPersonalInfo] = useState(false);
    const [editingAllergy, setEditingAllergy] = useState(false);
    const [editingMedication, setEditingMedication] = useState(false);
    const [editingCondition, setEditingCondition] = useState(false);

    const [selectedAllergy, setSelectedAllergy] = useState<AllergyFormData | null>(null);
    const [selectedMedication, setSelectedMedication] = useState<MedicationFormData | null>(null);
    const [selectedCondition, setSelectedCondition] = useState<ConditionFormData | null>(null);

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
                        {editingAllergy ? (
                            <Allergies onCancel={() => {
                                setSelectedAllergy(null);
                                setEditingAllergy(false);
                            }}
                                initialData={selectedAllergy}
                            />
                        ) : (
                            <AllergiesDisplay
                                onAdd={() => {
                                    setSelectedAllergy(null);
                                    setEditingAllergy(true);
                                }}
                                onEdit={(allergy) => {
                                    setSelectedAllergy(allergy);
                                    setEditingAllergy(true);
                                }}
                            />
                        )}
                    </div>
                    <div>
                        {editingMedication ? (
                            <Medications onCancel={() => {
                                setSelectedMedication(null);
                                setEditingMedication(false)
                            }}
                                initialData={selectedMedication}
                            />
                        ) : (
                            <MedicationsDisplay
                                onAdd={() => {
                                    setSelectedMedication(null);
                                    setEditingMedication(true);
                                }}
                                onEdit={(medication) => {
                                    setSelectedMedication(medication);
                                    setEditingMedication(true)
                                }}
                            />
                        )}
                    </div>
                    <div>
                        {editingCondition ? (
                            <Conditions onCancel={() => {
                                setSelectedCondition(null);
                                setEditingCondition(false)
                            }}
                                initialData={selectedCondition}
                            />
                        ) : (
                            <ConditionsDisplay
                                onAdd={() => {
                                    setSelectedCondition(null);
                                    setEditingCondition(true)
                                }}
                                onEdit={(condition) => {
                                    setSelectedCondition(condition);
                                    setEditingCondition(true)
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;