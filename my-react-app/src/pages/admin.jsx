import { FaSuitcaseRolling } from 'react-icons/fa';
import { useLoaderData } from 'react-router-dom';
import { customFetch } from '../utils/customFetch';
import { toast } from 'react-toastify';


export const loader = async () =>{
    try{
        const response = await customFetch.get('/users/admin/app-stats')
    }
    catch(error)
    {
        
    }
}

const admin = () => {
  return (
    <div>
      
    </div>
  )
}

export default admin
