import { useState } from "react";
import axios, { HttpStatusCode } from 'axios'
import './front.css'

function Front(){
    const [formData,setFormData] = useState({
        "key":"",
        "value":"",
        "expiration":""
    })
    const [key,setKey] = useState('')
    const [data,setData] = useState({})
    const [err,setErr] = useState('')
    
    const submitHandler = (event) => {
        event.preventDefault()
       
        const data = new FormData()
        data.append("key",formData.key)
        data.append("value",formData.value)
        data.append("expiration",formData.expiration)
       
        axios.post(`http://localhost:8080/post`,data).then(res => {
           setData(res.data)
           setErr(``)
        }).catch((e) => {
            setData({})
            if(e.response.status === HttpStatusCode.BadRequest || e.response.status === HttpStatusCode.NotFound){
                setErr(e.response.data)
            }
            else{
                console.log(e)
            }
        })
    }

    const onChange = (event) => {
        const {name,value} = event.target;
        setFormData((prevState)=> ({...prevState,[name]:value}))
    }

    const getHandler = (event) => {
        event.preventDefault()

        let param = "?key="+key

        axios.get(`http://localhost:8080/get`+param).then(res => {
            setData(res.data)
            setErr(``)
        }).catch((e) => {
            setData({})
            if(e.response.status === HttpStatusCode.BadRequest || e.response.status === HttpStatusCode.NotFound){
                setErr(e.response.data)
            }
            else{
                console.log(e)
            }
        })
    }

    return(
     <>  
     <div className="Main">
        <div className="input">
            <h4> POST a Record </h4>
            <form onSubmit={submitHandler}> 
               <label id="key"> Enter the Key
                 <input type="number" name="key" value={formData.key} required onChange={onChange} />
               </label><br />  
               <label id="value"> Enter the Value
                 <input type="number" name="value" value={formData.value} required onChange={onChange} />
               </label> <br /> 
               <label id="expiration"> Enter the Expiration Time
                 <input type="number" name="expiration" value={formData.expiration} required onChange={onChange} />
               </label> <br />   
               <button type="submit"> Submit </button>         
            </form>
        </div>
        <div className="input">
            <h4> GET a Record </h4>
            <form onSubmit={getHandler}>
                <label id="key"> Enter the key
                    <input type="number" name="key" value={key} required onChange={(e)=> setKey(e.target.value)} />
                </label><br />
                <button type="submit"> Submit </button>
            </form>
        </div>
     </div>
    <div className="resp">
        <h4> RESPONSE </h4>
            {Object.keys(data).length > 0 && (
                <>
                <p> key : {data.key} </p>
                <p> value : {data.value} </p>
                <p> expiration : {data.expiration} </p>
                </>
            )}
        <h4> Error </h4>
            <p> {err} </p>
    </div>
     </>
    );
}

export default Front;