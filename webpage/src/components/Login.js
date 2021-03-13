import React, { useState } from 'react';
import {Redirect} from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../context/auth";
import { Card, Form, Input, Button, Error } from "../components/AuthForms";

function Login() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();

  function postLogin() {
    axios.post("https://localhost:8765/evcharge/api/login",{
        username:userName,
        password:password
      }
      ).then(result => {
      if (result.status === 200) { // if successfull login
        setAuthTokens(result.data.token); //AuthTokens=token provided
        console.log("Token provided is:\n" + result.data.token);
        setLoggedIn(true);
      } else {
        setIsError(true); 
      }
    }).catch(e => {
      setIsError(true);
    });
  }

  if (isLoggedIn) {
    return <Redirect to="/MainPage" />;
  }

  return (
    <label><div>Login</div>
      <Card>
         <Form>
           <Input
             type="username"
             value={userName}
             onChange={e => {
               setUserName(e.target.value);
             }}
             placeholder="username"
           />
           <Input
             type="password"
             value={password}
             onChange={e => {
               setPassword(e.target.value);
             }}
             placeholder="password"
           />
           <Button onClick={postLogin}>Login</Button>
         </Form>
           {isError &&<Error>The username or password provided were incorrect!</Error> }
       </Card>
       </label>
     );
}
export default Login;