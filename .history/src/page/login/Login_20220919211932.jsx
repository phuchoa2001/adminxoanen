import React, { useRef } from "react";
import styled from "styled-components";
import { useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "antd";

import InputForm from "../../components/form/Input";
import { InputFormPassword } from "../../components/form/Input";
import { doLogin } from "../../redux/authSlice";
import { useHistory } from "react-router-dom";
import { parseJwt } from "../../commons/parseJwt/parseJwt";

const LoginStyles = styled.div`
  display: flex;
  .text {
    font-size: 36px;
    margin-bottom: 10px;
    text-align: center;
    width: 100%;
  }
  .login {
    background: #fff;
    padding: 150px 120px;
    border-radius: 8px 0px 0px 8px;
  }
  .image {
    height: 600px;
    display: block;
  }
  @media only screen and (max-width: 960px) {
    flex-direction: column;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    justify-content: flex-start;
    .image {
      height: 250px;
      object-fit: cover;
      border-radius: 8px 8px 0px 0px;
    }
    .login {
      order: 2;
      border-radius: 0px 0px 8px 8px;
      padding: 100px 0px;
      width: 500px;
    }
  }
  .boxBtn {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  @media only screen and (max-width: 500px) {
    .login {
      width: 100%;
      padding: 20px 0px;
    }
  }
`;

function Login(props) {
  const formElemt = useRef();
  const { push } = useHistory();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.Auth.isLoggedIn);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const result = await dispatch(doLogin(values));
      unwrapResult(result);
    } catch (error) {
      setIsLoading(false);
    }
  };
  if (isLoggedIn || parseJwt(localStorage.getItem("token"))) {
    return push("/");
  }
  return (
    <LoginStyles>
      <div className="login">
        <Form
          name="control-hooks"
          onFinish={handleSubmit}
          className="form"
          ref={formElemt}
          initialValues={{
            username: "client",
            password: "client",
          }}
        >
          <h3 className="text">Đăng nhập</h3>
          <InputForm
            name="username"
            autoFocus={true}
            label="Tài khoản"
            placeholder="Nhập tài khoản"
          />
          <InputFormPassword
            name="password"
            label="Mất khẩu"
            placeholder="Nhập mất khẩu"
          />
          <div className="boxBtn">
            <Button type="primary" loading={isLoading} htmlType="submit">
              Đăng nhập
            </Button>
          </div>
        </Form>
      </div>
      <img
        src={process.env.PUBLIC_URL + "/image/login.jpg"}
        alt=""
        className="image"
      />
    </LoginStyles>
  );
}

export default Login;
