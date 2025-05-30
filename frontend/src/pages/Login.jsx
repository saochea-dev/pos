import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../utls/auth';
import { Spin, Space } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import logo from '../assets/pss.png';
import bg from '../assets/bg.png';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import jwt_decode from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  // ========== message ==============
  const [msg, setMsg] = useState('');
  const [msgEmail, setMsgEmail] = useState('');
  const [msgPwd, setMsgPwd] = useState('');

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // show password hook
  const [isHidden, setHidden] = useState(true);

  const showPwd = () => {
    setHidden(!isHidden);
  };

  const EMAIL_REX = /^\S+$/;
  const PWD_REX = /^\S+$/;

  const emailRef = useRef();
  const pwdRef = useRef();

  const auth = useAuth();

  const delayPage = () => {
    setLoading(true);
  };

  //play sound
  function playAudio(url) {
    const audio = new Audio(url);
    audio.play();
  }

  const handleClick = async (e) => {
    e.preventDefault();

    if (email.trim() === '') {
      setMsgEmail('សូម! បញ្ចូលអ៊ីមែល/ឈ្មោះអ្នកប្រើប្រាស់');
      emailRef.current?.focus();
    } else if (password.trim() === '') {
      setMsgPwd('សូម! បញ្ចូលពាក្យសម្ងាត់របស់អ្នក');
      pwdRef.current?.focus();
    } else {
      if (validEmail && validPwd) {
        try {
          const res = await axios.post(
            'https://pos-api.reanhack.com:3001/login',
            {
              email,
              password,
            },
            { withCredentials: true }
          );
          //console.log(res.data.token)
          if (res.data.success) {
            const decode = jwt_decode(res.data.token);
            console.log(decode);
            auth.getUser(decode.username);
            auth.setAdmin(decode.role);
            auth.getId(decode.userid);
            sessionStorage.setItem('bool', true);
            auth.Loading(true);
            // const expirationTime = new Date(
            //   new Date().getTime() + 60 * 24 * 1000
            // );
            auth.login(res.data.token);
            // console.log(res.data.token)
            navigate('/', { replace: true });
          } else {
            setEmail('');
            setPassword('');
            playAudio(
              'https://pos-api.reanhack.com:3001/audio/audio-notification-sound.mp3'
            );
            toast.error(`${res.data.message}`, {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  //console.log(validEmail)

  useEffect(() => {
    setTimeout(() => {
      delayPage();
      emailRef.current?.focus();
    }, 1500);
  }, []);

  return (
    <>
      {loading ? (
        <section className="bg-gray-100 w-full h-screen absolute top-0">
          <div className="flex flex-row items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="drop-shadow-2xl">
              <img
                src={bg}
                alt="bg"
                className="h-[500px] w-[420px] drop-shadow-2xl rounded-l-md object-cover"
              />
            </div>
            <div className="w-full bg-[#fff] rounded-r-md drop-shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4 md:space-y-6 h-[500px] sm:p-8">
                <div className="flex justify-center">
                  <img
                    src={logo}
                    alt="logo"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>{msg}</div>
                <form className="space-y-4 md:space-y-6" action="#">
                  <div className="mt-14">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900">
                      អុីមែល<span className="font-bold text-md"> / </span>
                      ឈ្មោះ​អ្នកប្រើប្រាស់
                    </label>
                    <input
                      value={email.trim()}
                      ref={emailRef}
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded p-3 w-full outline-none"
                      placeholder="ឈ្មោះ / អីមែល"
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.code === 'Space') {
                          e.preventDefault();
                        }
                      }}
                      onKeyUp={() => {
                        if (email !== '') {
                          if (EMAIL_REX.test(email)) {
                            setMsgEmail('');
                            setValidEmail(true);
                          } else {
                            setMsgEmail('ឈ្មោះ / អីមែលមិនត្រឹមត្រូវ');
                            setValidEmail(false);
                          }
                        } else {
                          setMsgEmail('សូម! បញ្ចូលឈ្មោះ​/អុីមែល');
                          setValidEmail(false);
                        }
                      }}
                    />
                    {/* alert message */}
                    {msgEmail && (
                      <span className="text-red-500 text-xs mt-2">
                        {msgEmail}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      for="password"
                      className="block mb-2 text-sm font-medium text-gray-900">
                      ពាក្យសម្ងាត់
                    </label>
                    <div className="relative">
                      <input
                        ref={pwdRef}
                        onKeyDown={(e) => {
                          if (e.code === 'Space') {
                            e.preventDefault();
                          }
                        }}
                        onKeyUp={() => {
                          if (password !== '') {
                            if (PWD_REX.test(password)) {
                              setValidPwd(true);
                              setMsgPwd('');
                            } else {
                              setValidPwd(false);
                              setMsgPwd('ពាក្យសម្ងាត់មិនត្រឹមត្រូវ');
                            }
                          } else {
                            setMsgPwd('សូម! បញ្ចូលពាក្យសម្ងាត់របស់អ្នក');
                            setValidPwd(false);
                          }
                        }}
                        value={password.trim()}
                        onChange={(e) => setPassword(e.target.value)}
                        type={isHidden ? 'password' : 'text'}
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded p-3 w-full outline-none"
                        // required=""
                      />
                      <span onClick={showPwd} className="cursor-pointer">
                        {isHidden ? (
                          <AiOutlineEyeInvisible
                            className="absolute -mt-8 right-0 mr-2"
                            size={20}
                          />
                        ) : (
                          <AiOutlineEye
                            className="absolute -mt-8 right-0 mr-2"
                            size={20}
                          />
                        )}
                      </span>
                      <div
                        className={`flex ${
                          msgPwd ? 'justify-between' : 'justify-end'
                        } mt-1`}>
                        {msgPwd && (
                          <span className="text-red-500 text-xs">{msgPwd}</span>
                        )}
                        <a
                          href="#"
                          className="text-xs text-primary-600 text-blue-500 underline ml-1">
                          <Link to="/resetpassword">ភ្លេច​លេខសំងាត់​ ?</Link>
                        </a>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleClick}
                    type="submit"
                    className="w-full text-md text-[#fff] bg-blue-400 hover:bg-blue-300 p-3 rounded">
                    <Link to="/">ចូល</Link>
                  </button>
                </form>
              </div>
            </div>
            <p className="absolute uppercase bottom-32 text-gray-500 text-xs">
              រក្សាសិទ្ធិ <span className="text-md">&#169;</span> ២០២៣
              ដោយសិស្សITជំនាន់ទី១៥សកលវិទ្យាល័យបៀលប្រាយ
            </p>
          </div>
        </section>
      ) : (
        <div className="bg-[#ddd] w-full h-screen absolute top-0">
          <Space className="flex justify-center items-center h-screen bg-slate-50">
            <Spin tip="Loading..." size="large">
              <div className="mr-12" />
            </Spin>
          </Space>
        </div>
      )}
      {/* toast message */}
      <ToastContainer />
    </>
  );
};

export default Login;
