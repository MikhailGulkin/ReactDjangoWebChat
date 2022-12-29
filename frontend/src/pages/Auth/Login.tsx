import { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { user, login } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { username, password } = values;
      const res = await login(username, password);
      if (res.error || res.data) {
        if (res.data && res.data.detail) {
          setError(res.data.detail);
        }
      } else {
        navigate("/");
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="base-container flex justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 text-center">
            Sign in to your account
          </h1>
        </div>

        <form className="mt-8 space-y-2" onSubmit={formik.handleSubmit}>
          {error && <div>{JSON.stringify(error)}</div>}

          <input
            value={formik.values.username}
            onChange={formik.handleChange}
            type="text"
            name="username"
            autoComplete=""
            placeholder="Username"
            className="base-input"
          />
          <input
            value={formik.values.password}
            onChange={formik.handleChange}
            type="password"
            autoComplete=""
            name="password"
            className="base-input"
            placeholder="Password"
          />

          <button
            type="submit"
            className="w-full base-button"
          >
            {formik.isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};
