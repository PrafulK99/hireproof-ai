import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // This exchanges OAuth code for session
      const { data } = await supabase.auth.getSession();

      console.log("Session:", data.session);

      if (data.session) {
        navigate("/candidate-scan", { replace: true });
      } else {
        navigate("/recruiter-login", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <div>Signing you in...</div>;
}
