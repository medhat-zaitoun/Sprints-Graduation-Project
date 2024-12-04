import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { forgotPasswordFormControls } from "@/config";
import { forgotPassword } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
};

function ForgotPassword() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate()

  function onSubmit(event) {
    event.preventDefault();

    dispatch(forgotPassword(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        console.log(formData.email)
        navigate(`/auth/reset-password?email=${formData.email}`)
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Email of your account
        </h1>
      </div>
      <CommonForm
        formControls={forgotPasswordFormControls}
        buttonText={"Update"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default ForgotPassword;
