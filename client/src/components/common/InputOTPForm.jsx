import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function InputOTPForm({ onSubmitOTP }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  // Update OTP array values
  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const otpString = otp.join(""); // Join OTP array into a single string

    // Validate OTP length
    if (otpString.length !== 6) {
      setError("OTP must be 6 characters.");
      return;
    }

    setError("");
    onSubmitOTP(otpString); // Pass OTP to parent component for verification
  };

  return (
    <Form>
      <form onSubmit={handleSubmit} className="w-2/3 space-y-6">
        <FormItem>
          <FormLabel>One-Time Password</FormLabel>
          <FormControl>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                {otp.map((slotValue, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    value={slotValue}
                    onChange={(e) => handleChange(e.target.value, index)}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormMessage>{error}</FormMessage>
        </FormItem>
        <Button type="submit">Verify OTP</Button>
      </form>
    </Form>
  );
}
