import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "../context/userContext";
import type { userType as User } from "../type";
import { useParams } from "react-router-dom";



const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Phone number required").max(10, "Enter a valid phone number"),
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
console.log(id,"hjkl");

  const initial: User = (loc.state as any)?.user || {
    name: "",
    email: "",
    phone: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial,
  });

  const onSubmit = async (values: FormData) => {
    try {
      if (mode === "create") {
        await addUser(values); // use context
        nav("/"); // go back to list
      } else {
        await editUser(Number(id), values); // use context
        nav("/"); // go back to list
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">
        {mode === "create" ? "Create User" : "Edit User"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <div>
          <input
            {...register("name")}
            placeholder="Name"
            className="border p-2 rounded w-full"
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="border p-2 rounded w-full"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("phone")}
            placeholder="Phone"
            className="border p-2 rounded w-full"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
