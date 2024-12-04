
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { resetPasswordFormControls, otpFormControls } from "@/config"; // Assuming `otpFormControls` exists
import { resetPassword ,verifyOTP } from "@/store/auth-slice"; // Assuming you have actions for verifying OTP and updating the password
import { useState , useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate} from "react-router-dom";

const initialState = {
  email: "",
  otp:"",
  newPassword: "",
  confirmPassword: ""
};
const State= {
  email:"",
  password:"",
}



function ResetPassword() {
  
  const otpVerified = useSelector((state) => state.auth.otpVerified);
  const navigate = useNavigate()
  const [otp, setOtp] = useState(false); // Tracks if OTP is verified
  const dispatch = useDispatch();
  const { toast } = useToast();
  const location = useLocation();

  // Extract email from the query string
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  const [formData, setFormData] = useState({
    email: email || "",
    otp:"",
    newPassword: "",
    confirmPassword: ""
  });

  const [formDataPass, setFormDataPass] = useState({
    email: email || "",
    password: "",
    confirmPassword:""
  });
  useEffect(() => {
    console.log("OTP state updated:", otp);
  }, [otpVerified]); // This will log whenever the otp state changes
  function onOTPSubmit(event) {
    event.preventDefault();
    
    dispatch(verifyOTP(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "OTP Verified. Please enter your new password.",
        });
      } else {
        toast({
          title: "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  // New password form submission
  function onPasswordSubmit(event) {
    event.preventDefault();

    if (formDataPass.password !== formDataPass.confirmPassword) {
      toast({
        title: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }
    dispatch(resetPassword(formDataPass)).then((data) => {
      if (data?.payload?.status =="success") {
        toast({
          title: "Password updated successfully.",
        });
        navigate("/auth/login")
      } else {
        toast({
          title: "Failed to update password.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {otpVerified ? "Update Your Password" : "Verify OTP"}
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>

      {!otpVerified ? (
        <CommonForm
          formControls={otpFormControls} // Form to handle OTP input
          buttonText={"Verify OTP"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onOTPSubmit}
        />
      ) : (
      <>
        <CommonForm
          formControls={resetPasswordFormControls} // Form to handle new password
          buttonText={"Update Password"}
          formData={formDataPass}
          setFormData={setFormDataPass}
          onSubmit={onPasswordSubmit}
        />
      </>
      )}
    </div>
  );
}

export default ResetPassword;
