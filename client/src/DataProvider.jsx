import React, { useState,createContext } from 'react';
import axios from 'axios';

const ClassContext = createContext();

const ClassProvider = ({children}) => {
    const defaultInfos = {
        loading:false,
        data:{},
        error:false,
        errorRes:null,
        date:null
    }

    const [data, setData] = useState(defaultInfos)

    const updateData = async () => {
        try {
            setData({loading:true})
            const res = await axios.get(`/api/v1/restaurants`)
            const currentdate = new Date()
            const datetime = "Last Data Update: " + currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/" 
            + currentdate.getFullYear() + " @ "  
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes()
            setData({loading: false,data:res.data.mcdosUpdated,date:datetime})
        } catch (err) {
            setData({loading: false, errorRes: err.response.data.message, error: true})
        }
    }

    return(
        <ClassContext.Provider value={{data,updateData}}>
            {children}
        </ClassContext.Provider>
    )
}

export {ClassContext,ClassProvider}