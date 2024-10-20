
import Form from '../components/Form';


function Login(){
    return(
        <div className='parent-container'>
        <Form route="/api/token/" type='Login'/> 
        </div>  
        
    ) 
    
    
}

export default Login;