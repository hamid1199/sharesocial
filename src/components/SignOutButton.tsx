import React from "react";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

const SignOutButton: React.FC = () => {
  return (
    <Button
      variant="outline"
      className="absolute top-4 right-4"
      onClick={() => auth.signOut()}
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;