import { SignIn } from "@clerk/react";

function Auth() {
  return (
    <div>
      <SignIn signUpUrl="/sign-up" />
    </div>
  );
}

export default Auth;