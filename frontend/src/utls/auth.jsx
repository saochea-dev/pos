
import { createContext, useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const AuthContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => { },
  logout: () => { },
  username: '',
  getUser: () => { },
  getId: () => { },
  id: '',
  isLoading: '',
  Loading: () => { },
  isAdmin: false,
  open: true,
  setOpen: () => { },
  setAdmin: (role) => { },
  isUpdate: false,
  setIsUpdate: (bool) => { },
  sale_id: 0,
  setSaleId: (id) => { }
});

let logoutTimer;

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 2 * 3600) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthProvider = ({ children }) => {

  // ====== ======== ====== ========
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [user, setUser] = useState("");
  const [token, setToken] = useState(initialToken);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [sale_id, set_sale_id] = useState(0);

  const [isUpdate, setIsUpdate] = useState(false);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("https://pos-api.reanhack.com:3001/token", {
        withCredentials: true,
      });
      //console.log(response)
      setToken(response.data.access_token);
      const decoded = jwt_decode(response.data.access_token);
      setId(decoded.userid)
      getUser(decoded.username)
      setAdmin(decoded.role)
    } catch (error) {
      if (error.response) {
        logoutHandler()
      }
    }
    if (sessionStorage.getItem("bool") === null) {
      logoutHandler()
    }
  };

  // const loginHandler = (token, expirationTime) => {
  //   setToken(token);
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('expirationTime', expirationTime);

  //   const remainingTime = calculateRemainingTime(expirationTime);

  //   logoutTimer = setTimeout(logoutHandler, remainingTime);
  // };

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };


  const setAdmin = (role) => {
    if (role === 'Admin') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', true);
    } else {
      setIsAdmin(false)
      localStorage.setItem('isAdmin', false);
    }
  }

  const getUser = (username) => {
    setUser(username);
  }

  const getId = (id) => {
    setId(id);
  }

  const Loading = (result) => {
    setIsLoading(result);
  }

  const setOpen = (bool) => {
    setIsOpen(bool)
  }
  // ======== update btn =======
  const setIsUpdateSale = (bool) => {
    setIsUpdate(bool);
  }

  // ======= set sale id ==========
  const setSaleId = (id) => {
    set_sale_id(id);
  }

  useEffect(() => {

    refreshToken();

  }, [tokenData]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    username: user,
    getUser: getUser,
    Loading: Loading,
    isLoading: isLoading,
    getId: getId,
    id: id,
    isAdmin: isAdmin,
    open: isOpen,
    setOpen: setOpen,
    setAdmin: setAdmin,
    isUpdate: isUpdate,
    setIsUpdate: setIsUpdateSale,
    sale_id: sale_id,
    setSaleId: setSaleId
  };

  localStorage.setItem("token", "true");


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};