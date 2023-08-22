import React, { useEffect, useState } from 'react';
import { BiRun } from 'react-icons/bi';
import { FaCheckCircle } from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import NotTodoAvailable from './NotTodoAvailable';


const Todos = () => {
    const user = useSelector(state=>state.auth.user)
    const navigate = useNavigate()
    const [data,setData] = useState([])
    // const [singleData,setSingleData] = useState({})
    const [msg,setMsg] = useState(false)
    const [loading,setLoading] = useState(true)
    const [deleteId,setDeleteId] = useState('')
    const [todoDeleteMsg,setTodoDeleteMsg] = useState({})
    const fetchData =async (url,setFunction) => {
        const res = await fetch(url)
        const data = await res.json()
        setFunction(data.data)
        setLoading(false)
    }
    useEffect(() =>{
        fetchData(process.env.REACT_APP_BASE_URL+`/todo/all/${user.id}`,setData)
        // fetchData(process.env.REACT_APP_BASE_URL+'/todo/6323003f5f8b4489435f7c15',setSingleData)
    },[user.id])
    const deleteTodo =async(id)=>{
        fetch(process.env.REACT_APP_BASE_URL+`/todo/${id}`,{
            method:'DELETE'
        })
        .then(res=>res.json())
        .then(data=>{
            setTodoDeleteMsg(data)
            setTimeout(()=>setTodoDeleteMsg({}),5000)
        })
        .catch(err=>console.log(err));
        setMsg(!msg)
        setDeleteId('')
    }
    const update = (id)=>{
        navigate(`/todo/${id}`)
    }
    const setDelete = (id) => {
        setMsg(!msg)
        setDeleteId(id)
    }
    return (
        <>
            {loading ? <Loading/>:
            <div>
                {
                   todoDeleteMsg.status ? <div className={todoDeleteMsg.status === 'Success' ? 'border boder-green-500 p-2 mx-4 text-green-500' : 'border boder-red-500 p-2 text-red-500'}>{todoDeleteMsg.status} ! {todoDeleteMsg.msg}</div>:''
               }

                <div className='todos'>
               {
                data.length === 0 && <NotTodoAvailable/>
               }
               {
                   data.map(d=><div key={d._id} className='todo'>
                       <p className='title'>
                            <span>{d.title}</span>
                            {d.status === 'Completed' ? <FaCheckCircle className='text-green-500'/>:''}
                        </p>

                       <p className='details'>{d.details}</p>

                       <p className='status'>
                            {
                                d.status ==='Pending' ?
                                <div className='flex items-center space-x-2'>
                                    <MdPendingActions className='animate-pulse' size={20}/>
                                    <span className='text-xs'>Your task is now {d.status}</span>
                                </div> :
                                d.status ==='Continue' ?
                                <div className='flex items-center space-x-2 text-blue-500'>
                                    <BiRun className='animate-ping'/>
                                    <span className='text-xs'>Your task is now {d.status}</span>
                                </div> :
                                d.status ==='Completed'? <div className='flex items-center space-x-2 text-green-500'>
                                <FaCheckCircle className='animate-pulse' size={15}/>
                                <span className='text-xs'>Your task is successfully {d.status}</span>
                            </div> : ''
                            }
                       </p>

                       <button onClick={()=>setDelete(d._id)} className='delete'>Delete</button>
                       <button onClick={()=>update(d._id)} className='update'>Update</button>
                   </div>)

               }
               {
                   msg && <div className="deletemsg">
                   <div className="msg">
                       <h1>Delete Task</h1>
                       <p className='msg_details'>
                           Are sure want to delete?<br />
                           its will permanently delete the task and can't restore its.
                       </p>
                       <p className='msg_button'>
                           <button onClick={()=>setMsg(!msg)} className='cancel'>Cancel</button>
                           <button onClick={()=>deleteTodo(deleteId)} className='delete'>Delete</button>
                       </p>
                   </div>
               </div>
               }
           </div>
           </div>
            }
        </>
    );
};

export default Todos;