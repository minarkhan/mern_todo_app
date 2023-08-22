import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TodoUpdate = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [data,setData] = useState({})
    const fetchData =async (url,setFunction) => {
        const res = await fetch(url)
        const data = await res.json()
        setFunction(data.data)
    }
    useEffect(() =>{
        fetchData(process.env.REACT_APP_BASE_URL+`/todo/${id}`,setData)
    },[id])
    const handleInput = (e) => {
        const input = { ...data };
        input[e.target.name] = e.target.value;
        setData(input);
      };

    const todo = async (e) => {
        e.preventDefault();
        await fetch(process.env.REACT_APP_BASE_URL+`/todo/${id}`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data),
        })
        .then(res=>res.json())
        .then(data=>console.log(data))
        .catch(err=>console.log(err))
        e.target.reset()
        navigate('/todos')
    };
    console.log(data)
    return (
        <div className="todoupdate">
            <form onSubmit={todo}>
                <input type="text" name="title" value={data.title} className="input" required onChange={handleInput}/>
                <textarea type="text" name="details" value={data.details} className="input" required onChange={handleInput}/>
                <select name='status' className="input" required onChange={handleInput}>
                    <option value={data.status}>{data.status}</option>
                    <option value="Continue">Continue</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
                <input type="submit" value="Post"/>
            </form>
        </div>
    );
};

export default TodoUpdate;