import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "../context/userContext";
import type { userType as User } from "../type";

// Import icons for better visual feedback
import { UserIcon, Mail, Phone, Save, Loader2, ArrowLeft } from 'lucide-react';


const schema = z.object({
  name: z.string().min(1, "Name is required").trim(), // Changed min(2) to min(1) and added trim()
  email: z.string().email("Enter a valid email").trim(),
  phone: z.string().length(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Phone number must contain only digits"), // Enhanced phone validation
});

type FormData = z.infer<typeof schema>;

interface Props {
  mode: "create" | "edit";
}

export default function UserForm({ mode }: Props) {
  const nav = useNavigate();
  const loc = useLocation();
  const { addUser, editUser } = useUserContext();
  const { id } = useParams();
  
  // Use a type assertion for safety if user type is definitely defined in state
  const initial: User = (loc.state as { user: User } | null)?.user || {
    name: "",
    email: "",
    phone: "",
  };
  
  const formTitle = mode === "create" ? "Create New User" : "Edit User Details";
  const submitText = mode === "create" ? "Create User" : "Save Changes";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial,
    mode: "onBlur" // Validate on blur for better UX
  });

  const onSubmit = async (values: FormData) => {
    try {
      if (mode === "create") {
        await addUser(values); 
        nav("/"); 
      } else {
        await editUser(Number(id), values); 
        nav("/"); 
      }
    } catch (err: any) {
      // Better error display
      console.error(err);
      alert(`Operation Failed: ${err.message || 'An unexpected error occurred'}`);
    }
  };

  return (
    // Updated container styling for a modern look
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 max-w-lg mx-auto mt-10 border border-gray-100">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          {formTitle}
        </h2>
        {/* Back button for navigation */}
        <button 
          onClick={() => nav('/')}
          className="inline-flex cursor-pointer items-center text-sm text-gray-600 hover:text-blue-600 transition duration-150"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to List
        </button>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        
        {/* Name Field */}
        <FormInput 
          id="name"
          label="Full Name"
          register={register}
          error={errors.name}
          placeholder="e.g. Jane Doe"
          icon={UserIcon}
        />

        {/* Email Field */}
        <FormInput 
          id="email"
          label="Email Address"
          register={register}
          error={errors.email}
          placeholder="e.g. jane.doe@example.com"
          type="email"
          icon={Mail}
        />

        {/* Phone Field */}
        <FormInput 
          id="phone"
          label="Phone Number"
          register={register}
          error={errors.phone}
          placeholder="e.g. 1234567890 (10 digits)"
          type="tel"
          icon={Phone}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || (mode === 'edit' && !isDirty)} // Disable edit button if no changes are made
          className={`
            mt-4 w-full inline-flex cursor-pointer items-center justify-center font-semibold px-4 py-3 rounded-xl transition duration-200 shadow-md 
            ${
              isSubmitting || (mode === 'edit' && !isDirty)
                ? 'bg-gray-400 cursor-not-allowed' // Disabled state
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              {submitText}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// Reusable Input Component for better structure and clarity
interface FormInputProps {
    id: keyof FormData;
    label: string;
    register: ReturnType<typeof useForm<FormData>>['register'];
    error: any;
    placeholder: string;
    type?: string;
    icon: React.ElementType; // Icon component
}

const FormInput: React.FC<FormInputProps> = ({ id, label, register, error, placeholder, type = 'text', icon: Icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                id={id}
                type={type}
                {...register(id)}
                placeholder={placeholder}
                className={`
                    w-full pl-10 pr-4 py-2.5 border rounded-xl shadow-sm text-gray-800 
                    focus:outline-none focus:ring-2 transition duration-150 
                    ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}
                `}
            />
        </div>
        {error && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
                {error.message}
            </p>
        )}
    </div>
);