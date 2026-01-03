import { z } from "zod";

export const personalSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  blood_type: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  preferred_hospital: z.string().optional(),
  emergency_contact_name: z
    .string()
    .min(1, "Emergency contact name is required"),
  emergency_contact_relationship: z
    .string()
    .min(1, "Emergency contact relationship is required"),
});

export const allergySchema = z.object({
    allergen: z.string().min(1, "Allergen is required"),
    allergy_type: z.string().optional(),
    reaction: z.string().optional(),
    severity: z.enum(["Mild", "Moderate", "Severe"]).optional(),
});

export const medicationSchema = z.object({
    medication_name: z.string().min(1, "Medication name is required"),
    medication_purpose: z.string().optional(),
    dosage: z.string().optional(),
    frequency: z.string().optional(),
    route: z.enum(["Oral", "Injection", "Topical", "Inhalation"]).optional(),
    isActive: z.boolean({ message: "The active status must be a boolean (true or false)." }),
    notes: z.string().optional(),
})

export const conditionSchema = z.object({
    condition_name: z.string().min(1, "Name of the medical condition is required"),
    isChronic: z.boolean({ message: "The chronic status must be a boolean (true or false)." }),
    notes: z.string().optional(),
})


export type PersonalFormData = z.infer<typeof personalSchema>;
export type AllergyFormData = z.infer<typeof allergySchema>;
export type MedicationFormData = z.infer<typeof medicationSchema>;
export type ConditionFormData = z.infer<typeof conditionSchema>;
