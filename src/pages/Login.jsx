import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AiOutlineCloseCircle } from "react-icons/ai";
const background1 = `${process.env.PUBLIC_URL}/assets/acopio.jpg`;
const background2 = `${process.env.PUBLIC_URL}/assets/carbon.jpg`;
const logo = `${process.env.PUBLIC_URL}/assets/Logo.png`;


const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { login, authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoginSuccess(true);
      navigate('/inicio');
    } else if (authError) {
      setLoginSuccess(false);
    }
  }, [isAuthenticated, authError, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    login(credentials);
  };

  return (
    <div className="flex justify-start">
      <div className="w-1/2">
        <div
          className="flex items-center justify-center h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${background1})` }}
        ></div>
      </div>

      <div className="w-1/2">
        <div
          className="flex items-center justify-center h-screen bg-cover opacity-80"
          style={{ backgroundImage: `url(${background2})` }}
        >
          <div className="bg-opacity-60 bg-gray-50 rounded-3xl backdrop-blur-sm text-white shadow-lg shadow-white w-5/6 h-auto p-10 content-center">
            <div className="flex justify-center">
              <img src={logo} alt="Logo" />
            </div>

            <div className="flex justify-center">
              <div className="flex flex-col items-center w-5/6 rounded-lg space-y-10">
                <form className="w-5/6 flex flex-col" onSubmit={handleLogin}>
                  <label
                    htmlFor="username"
                    className="text-lg font-bold text-white font-montserrat"
                  >
                    USUARIO
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="USUARIO"
                    className="px-3 py-2  text-gray-700 font-montserrat text-sm bg-gray-200 rounded focus:outline-none focus:bg-white"
                  />
                  <label
                    htmlFor="password"
                    className="text-lg font-bold text-white font-montserrat mt-4"
                  >
                    CONTRASEÑA
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="CONTRASEÑA"
                    className="px-3 py-2 text-gray-700 font-montserrat text-sm bg-gray-200 rounded focus:outline-none focus:bg-white"
                  />
                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      className="w-4/5 mt-6 font-montserrat text-[#182540] bg-[#F2F2F2] shadow-lg hover:shadow-[#182540] font-bold py-2 px-4 rounded"
                    >
                      INGRESAR
                    </button>
                  </div>
                </form>
                {authError && (
                  <div className="flex items-center mt-4 text-red-500">
                    <AiOutlineCloseCircle className="mr-2" />
                    {authError}
                  </div>
                )}                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
