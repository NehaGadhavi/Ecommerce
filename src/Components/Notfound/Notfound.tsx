import React from "react";
import './Notfound.scss'
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function Notfound() {
  const navigate = useNavigate()
  return <div className="notfound-wrapper">
   <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary" onClick={()=> navigate('/')}>Back Home</Button>}
  />
  </div>;
}

export default Notfound;
