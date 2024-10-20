import Form from '../components/Form';

function Register(){
    return(
    <div className='parent-container'>
        <div className= "Intro-Box">
        <h1 className='WhatIsStonky'>What is Stonky?</h1>

        <h3 className="Stonky-Intro">
        Stonky is a stock market web application that allows users to search for stocks 
        and view real-time financial data. With Stonky, you can track stock performance, analyze historical trends, 
        receive next-day price predictions, and engage in insightful conversations with Meta's LLaMA 3.2 model, updated with latest stock market news.
        </h3>
        </div>
        <Form route="api/user/register/" type='Register'/>  
    </div>
    ) 
}

export default Register;