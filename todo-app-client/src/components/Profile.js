import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { logoutAction } from '../redux/actions/authAction';
import Loading from './Loading';

const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const stateUser = useSelector(state=>state.auth.user)
    const [user,setUser] = useState({})
    const [errMsg,setErrMsg] = useState('')
    console.log(process.env.REACT_APP_BASE_URL);
    useEffect(()=>{
       const getUser =async()=>{
         await fetch(process.env.REACT_APP_BASE_URL+`/user/profile/${stateUser.id}`)
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.status === 'failed'){
                    setErrMsg(data.message)
                }else{
                    // setUser(data.user)
                    setUser(data.data)
                }
            })
            .catch(err=>setErrMsg('Please ensure connection is established'))
        }
        getUser()
    },[stateUser.id])
    const deleteAccount =()=>{
        fetch(process.env.REACT_APP_BASE_URL+`/user/profile/${stateUser.id}`,{
            method:'DELETE'
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.status==='success'){
                navigate('/')
                dispatch(logoutAction())
            }
        })
        .catch(err=>console.log(err));
    }
    return (
        <>
        { !user?.name ? <Loading/>:
        <div className='my-10 mx-4 md:w-4/12 md:mx-auto shadow-md border p-4 space-y-2 rounded'>
            {errMsg && <p>{errMsg}</p>}
            <img src={process.env.REACT_APP_BASE_URL+`/upload/${user?.profileImage}`} alt="" className='w-32 h-32 mx-auto rounded-full'/>
            <p className='p-2 bg-gray-50 rounded'>Name: {user?.name}</p>
            <p className='p-2 bg-gray-50 rounded'>Email: {user?.email}</p>
            <p className='p-2 bg-gray-50 rounded'>Total Todos: {user?.todos?.length}</p>
            <button className='p-2 bg-red-400 text-white hover:bg-red-500 rounded' onClick={()=>deleteAccount()}>Delete Account</button>

        </div>
        }
        </>
    );
};

export default Profile;