import { z } from "zod";

export const personalSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().nullable().optional().or(z.literal("")),
  last_name: z.string().min(1, "Last name is required"),
  address: z
    .string()
    .nullable() 
    .refine((v) => v !== null && v.trim() !== "", {
      message: "Address is required",
    }),
  phone: z.string().nullable().optional().superRefine((v, ctx) => {
  const val = (v ?? "").trim();
  if (val.trim() === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Phone number is required",
    });
    return;
  }
  if (val.replace(/\D/g, "").length < 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Phone number must be at least 10 digits",
      });
    }
  }),
  date_of_birth: z
    .string()
    .nullable()
    .refine((v) => v !== null && v.trim() !== "", {
      message: "Date of birth is required",
    }),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a gender",
  }),
  blood_type: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    message: "Please select a blood type",
  }),
  preferred_hospital: z.string().nullable().optional().or(z.literal("")),
  emergency_contact_name: z
    .string()
    .nullable() 
    .refine((v) => v !== null && v.trim() !== "", {
      message: "Emergency contact name is required",
    }),
  emergency_contact_relationship: z
    .string()
    .nullable()
    .refine((v) => v !== null && v.trim() !== "", {
      message: "Emergency contact relationship is required",
    }),
  emergency_contact_phone: z.string().nullable().optional(),
});

export const allergySchema = z.object({
  id: z.number().optional(),
  allergen: z.string().min(1, "Allergen is required"),
  allergy_type: z.string().optional(),
  reaction: z.string(),
  severity: z.enum(["Mild", "Moderate", "Severe"], {
    message: "Please select a severity level",
  }),
});

export const medicationSchema = z.object({
  id: z.number().optional(),
  medication_name: z.string().min(1, "Medication name is required"),
  medication_purpose: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  route: z
    .enum(["Oral", "Injection", "Topical", "Inhalation", "Rectal"], {
      message: "Please select a route",
    })
    .nullable()
    .optional(),
  is_active: z
    .enum(["yes", "no"], { message: "Please choose an option" })
    .optional(),
  notes: z
  .string()
  .max(100, "Notes cannot exceed 100 characters")
  .optional()
  .nullable(),
});

export const conditionSchema = z.object({
  id: z.number().optional(),
  condition_name: z
    .string()
    .min(1, "Name of the medical condition is required"),
  is_chronic: z.enum(["yes", "no"], { message: "Please choose an option" }),
  notes: z
  .string()
  .max(300, "Notes cannot exceed 300 characters")
  .optional()
  .nullable(),
});

export type PersonalFormData = z.infer<typeof personalSchema>;
export type AllergyFormData = z.infer<typeof allergySchema>;
export type MedicationFormData = z.infer<typeof medicationSchema>;
export type ConditionFormData = z.infer<typeof conditionSchema>;
