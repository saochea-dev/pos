import React from 'react';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsPencilSquare } from 'react-icons/bs';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ReactPaginate from 'react-paginate';
import Navbar from '../Navbar';

const ProductUnit = () => {
  const [units, setUnits] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [unit, setUnit] = useState({
    unit: '',
    id: '',
  });
  // get id of units
  const [id, setId] = useState(0);

  // query client
  const queryClient = useQueryClient();

  const [msg, setMsg] = useState('');
  const [colorStyle, setColorStle] = useState('');
  const [spin, setSpin] = useState(false);
  //play sound
  function playAudio(url) {
    const audio = new Audio(url);
    audio.play();
  }
  // fetch units of product function
  const fetchUnits = async () => {
    const { data } = await axios.get(
      `http://54.91.229.70:3001/product-units?search=${keyword}&page=${page}&limit=${limit}`
    );
    return data;
  };

  const { data } = useQuery(['getUnits', keyword, page, limit], fetchUnits);
  console.log(data);

  useEffect(() => {
    if (data) {
      setUnits(data.result);
      setPage(data.page);
      setPages(data.totalPage);
      setRows(data.totalRows);
    }
    fetchUnits();
  }, [data]);

  // on change page change function
  const changePage = ({ selected }) => {
    setPage(selected + 1);
  };

  // handle change function
  const handleChange = (e) => {
    setUnit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // add unit function
  async function addUnit() {
    try {
      if (unit.unit === '') {
        setColorStle('bg-red-100 text-red-700');
        setMsg('សូម! បញ្ចូលឈ្មោះឯកតា');
      } else {
        setSpin(true);
        const res = await axios.post(
          'http://54.91.229.70:3001/product-units',
          unit
        );
        if (res.data.success) {
          setUnit({ unit: '' });
          setColorStle('bg-green-100 text-green-700');
          setMsg(res.data.message);
          fetchUnits();
        } else {
          setUnit({ unit: '' });
          setColorStle('bg-red-100 text-red-700');
          setMsg(res.data.message);
        }
        //console.log(res);
        setSpin(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // handle update function
  const handleUpdate = async () => {
    try {
      if (unit.unit.trim() !== '') {
        const res = await axios.put(
          `http://54.91.229.70:3001/product-units/${unit.id}`,
          unit
        );
        if (res.data.success) {
          setUnit({ unit: '' });
          setColorStle('bg-green-100 text-green-700');
          setMsg(res.data.message);
          fetchUnits();
        } else {
          setUnit({ unit: '', id: unit.id });
          setColorStle('bg-red-100 text-red-700');
          setMsg(res.data.message);
        }

        //console.log(res);
      } else {
        setColorStle('bg-red-100 text-red-700');
        setMsg('សូម! បញ្ចូលឈ្មោះឯកតា។');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://54.91.229.70:3001/product-units/${id}`
      );
      if (res.data.success) {
        playAudio('http://54.91.229.70:3001/audio/audio-notification-sound.mp3');
        toast.success('🦄 ឯកតាត្រូវបានលុបដោយជោគជ័យ!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        fetchUnits();
      } else {
        playAudio('http://54.91.229.70:3001/audio/audio-notification-sound.mp3');
        toast.error(`🦄 ${res.data.message}`, {
          position: 'top-right',
          autoClose: 3000,
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
  };

  // handle delete mutation
  const deleteMutaion = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      if (units.length - 1 === 0) {
        setPage(page - 1);
      }
      queryClient.invalidateQueries(['getUnits']);
    },
  });

  // mutation for update
  const updateMutation = useMutation({
    mutationFn: handleUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries(['getUnits']);
    },
  });

  const addMutaion = useMutation({
    mutationFn: addUnit,
    onSuccess: () => {
      queryClient.invalidateQueries(['getUnits']);
    },
  });

  return (
    <>
      <div className="flex-1 h-screen bg-gray-100 overflow-auto">
        <Navbar />
        <div className="p-5">
          <h1 className="text-xl mb-4 text-left">ឯកតាផលិតផល</h1>
          <div className="w-full h-1 bg-blue-400 mb-5 shadow-sm"></div>
          <div className="flex justify-between mb-3">
            <div className="flex">
              <button
                className="hidden md:block px-5 h-9 rounded-sm font-medium tracking-wider bg-teal-400 hover:bg-teal-500 text-white hover:shadow"
                data-bs-toggle="modal"
                data-bs-target="#addUnit">
                បន្ថែម
              </button>
              <div className="ml-5">
                <span className="text-bold">Show</span>
                <select
                  className=" border bg-transparent rounded-sm ml-2 mr-2 outline-none px-3 shadow py-[2px]"
                  onChange={(e) => {
                    setLimit(e.target.value);
                  }}>
                  <option value={10}>10</option>
                  <option value={5}>5</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>Entities</span>
              </div>
            </div>
            <input
              className="hidden md:block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm outline-none shadow-sm text-center p-2 hover:shadow"
              placeholder="ឈ្មោះឯកតា"
              type="text"
              style={{ width: '18rem' }}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {/* add unit model */}
            <div
              className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
              id="addUnit"
              tabIndex="-1"
              aria-labelledby="exampleModalLgLabel"
              aria-modal="true"
              role="dialog"
              onClick={(e) => {
                if (e.target.id === 'addUnit') {
                  setMsg('');
                  setUnit({ unit: '' });
                }
              }}>
              <div className="modal-dialog modal-lg relative w-auto pointer-events-none">
                <div className="modal-content border-none shadow-sm relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-sm outline-none text-current">
                  <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-sm">
                    <h5
                      className="text-xl font-medium leading-normal text-gray-800"
                      id="exampleModalLgLabel">
                      បន្ថែមឯកតា 
                    </h5>
                    <button
                      type="button"
                      className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setMsg('');
                        setUnit({ unit: '' });
                      }}></button>
                  </div>
                  <div className="modal-body relative p-4 mt-5 mb-5">
                    <label
                      htmlFor="unit"
                      className="form-label inline-block mb-2 text-gray-700">
                      ឯកតាផលិតផល <span className='text-red-500'>*</span>
                    </label>
                    <input
                      className="form-control
                  block
                  w-full
                  px-4
                  py-2
                  text-base
                  font-normal
                  text-gray-700
                  bg-white bg-clip-padding
                  border border-solid border-gray-300
                  rounded-sm
                  transition
                  ease-in-out
                  m-0
                  focus:text-gray-700 
                  focus:bg-white focus:border-blue-600 
                  focus:outline-none"
                      placeholder="ឈ្មោះឯកតា"
                      id="unit"
                      type="text"
                      onChange={handleChange}
                      value={unit.unit}
                      name="unit"
                    />
                    {/* ====== alert message ===== */}
                    {msg && (
                      <div
                        className={`rounded-sm py-1 text-center text-base mt-1 ${colorStyle}`}
                        role="alert">
                        {msg}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-gray-200 rounded-b-sm">
                    <button
                      type="button"
                      className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded-sm shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                      data-bs-dismiss="modal"
                      onClick={() => {
                        setUnit({ unit: '' });
                        setMsg('');
                      }}>
                      បោះបង់
                    </button>

                    {/* spin button */}
                    {spin ? (
                      <button
                        type="button"
                        className="inline-block px-8 py-1.5 bg-blue-700 text-white font-medium text-xs leading-tight uppercase rounded-sm shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1">
                        <div
                          className="spinner-border animate-spin inline-block w-5 h-5 border-4 rounded-full text-blue-100"
                          role="status"></div>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-sm shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                        onClick={addMutaion.mutate}>
                        បញ្ជូន
                      </button>
                    )}
                    {/* end of spin button */}
                  </div>
                </div>
              </div>
            </div>
            {/* end of add model */}
          </div>
          <div className="rounded-sm overflow-auto shadow-sm mt-3 h-[600px]">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 border-gray-200">
                <tr className="border-b bg-blue-100 border-blue-200">
                  <th className="p-3 text-md font-semibold tracking-wide text-center">
                    №
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-center ">
                    ឯកតា
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-center flex justify-end mr-20">
                    ប្រតិបត្តិការណ៍
                  </th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.result.map((item, index) => {
                    return (
                      <tr
                        className="text-center bg-white border-b"
                        key={index + 1}>
                        <td className="p-3 text-sm text-blue-500 font-bold whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                          {item.unit}
                        </td>
                        <td className="p-3 flex justify-end mr-20">
                          <button
                            className="mx-2 px-3 py-1.5 rounded-sm font-medium tracking-wider text-blue-700 bg-blue-200 hover:shadow"
                            data-bs-toggle="modal"
                            data-bs-target="#updateUnit"
                            onClick={async () => {
                              const res = await axios.get(
                                `http://localhost:3001/product-units/${item.id}`
                              );
                              //console.log(res.data)
                              setUnit(...res.data);
                              //console.log(unit)
                            }}>
                            <BsPencilSquare size={20} />
                          </button>
                          {/* edit model */}
                          <div
                            className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                            id="updateUnit"
                            tabIndex="-1"
                            aria-labelledby="exampleModalLgLabel"
                            aria-modal="true"
                            role="dialog"
                            onClick={(e) => {
                              if (e.target.id === 'updateUnit') {
                                setUnit({ unit: '' });
                                setMsg('');
                              }
                            }}>
                            <div className="modal-dialog modal-lg relative w-auto pointer-events-none">
                              <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-sm outline-none text-current">
                                <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-sm">
                                  <h5
                                    className="text-xl font-medium leading-normal text-gray-800"
                                    id="exampleModalLgLabel">
                                    កែប្រែឯកតា
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => {
                                      setUnit({ unit: '' });
                                      setMsg('');
                                    }}></button>
                                </div>
                                <div className="modal-body relative p-4 mt-5 mb-5 text-left">
                                  <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label inline-block mb-2 text-gray-700">
                                    ឯកតាផលិតផល <span className='text-red-500'>*</span>
                                  </label>
                                  <input
                                    className="form-control
                                block
                                w-full
                                px-4
                                py-2
                                text-sm
                                font-normal
                                text-gray-700
                                bg-white bg-clip-padding
                                border border-solid border-gray-300
                                rounded-sm
                                transition
                                ease-in-out
                                m-0
                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    placeholder="ឈ្មោះឯកតា"
                                    id="exampleFormControlInput1"
                                    value={unit.unit}
                                    onChange={handleChange}
                                    name="unit"
                                  />
                                  {/* ====== alert message ===== */}
                                  {msg && (
                                    <div
                                      className={`rounded py-1 text-center text-base mt-1 ${colorStyle}`}
                                      role="alert">
                                      {msg}
                                    </div>
                                  )}
                                </div>
                                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-gray-200 rounded-b-sm">
                                  <button
                                    type="button"
                                    className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded-sm shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                      setUnit({ unit: '' });
                                      setMsg('');
                                    }}>
                                    បោះបង់
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-sm shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                                    onClick={updateMutation.mutate}>
                                    កែប្រែ
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* end of edite model */}
                          <button
                            onClick={() => {
                              setId(item.id);
                              //console.log(id)
                            }}
                            className="px-3 py-1.5 rounded-sm font-medium tracking-wider text-red-600 bg-red-200 hover:shadow"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModalCenter">
                            <AiTwotoneDelete size={20} />
                          </button>
                          {/* delete model */}
                          <div
                            className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                            id="exampleModalCenter"
                            tabIndex="-1"
                            aria-labelledby="exampleModalCenterTitle"
                            aria-modal="true"
                            role="dialog">
                            <div className="modal-dialog modal-dialog-centered relative w-auto pointer-events-none">
                              <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-sm outline-none text-current">
                                <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-sm">
                                  <h5
                                    className="text-lg uppercase font-medium leading-normal text-red-500"
                                    id="exampleModalScrollableLabel">
                                    លុបឯកតា
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                                </div>
                                <div className="modal-body relative p-4">
                                  <h2 className="my-3">
                                    តើ​អ្នក​ប្រាកដ​ឬ​អត់? ចង់លុបឯកតា...!
                                  </h2>
                                </div>
                                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-sm">
                                  <button
                                    type="button"
                                    className="inline-block px-6 py-2.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded-sm shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                                    data-bs-dismiss="modal">
                                    បោះបង់
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-block px-6 py-2.5 bg-red-500 text-white font-light text-xs leading-tight uppercase rounded-sm shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                                    data-bs-dismiss={'modal'}
                                    aria-label="Close"
                                    onClick={() => {
                                      //console.log(item.id)
                                      deleteMutaion.mutate(id);
                                    }}>
                                    លុប
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* end of delete modal */}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {/* pagination */}
          <p className="my-3 text-xs text-gray-500">{`ជួរដេកសរុប : ${rows} ទំព័រ: ${
            rows ? page : 1
          } នែ ${pages}`}</p>
          <nav role="navigation" aria-label="pagination" key={rows}>
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              pageCount={pages}
              onPageChange={changePage}
              containerClassName={'flex my-3'}
              pageLinkClassName={'border text-gray-600 px-3 border-gray-400'}
              previousLinkClassName={
                'border mr-3 px-2 text-gray-800 border-gray-400'
              }
              nextLinkClassName={
                'border ml-3 px-2 text-gray-800 border-gray-400'
              }
              activeLinkClassName={'bg-blue-500 border border-gray-400'}
              disabledLinkClassName={
                'text-gray-300 cursor-auto border-gray-300 border'
              }
            />
          </nav>
        </div>
        {/* toast message */}
        <ToastContainer />
      </div>
    </>
  );
};

export default ProductUnit;
