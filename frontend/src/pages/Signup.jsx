import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Signup is now merged into Login's auth card.
// This redirect ensures old /signup links still work.
function Signup() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/login", { replace: true });
  }, [navigate]);
  
  return null;
}

export default Signup;