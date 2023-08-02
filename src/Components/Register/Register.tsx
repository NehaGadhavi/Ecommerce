import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Radio } from "antd";
import "./Register.scss";
import img from "../../Assets/Images/register.png";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { register } from "../../Redux/Action/Action";

function Register() {
  const dispatch = useDispatch()
  const nameValidate = [
    { required: true, message: "Please input your username!" },
    { min: 2, message: "must be at least 3 characters" },
  ];
  const emailValidate: any = [
    { required: true, message: "Please input your email" },
    { type: "email", message: "Please enter your valid email" },
  ];
  const passwordValidate = [
    { required: true, message: "Please input your password!" },
    { min: 8, message: "minimum length is 8 characters" },
  ];

  const confirmPassword = [
    { required: true, message: "Please enter confirmation password" },
  ];
  const combine = [{ required: true, message: "Please  fill required field" }];
  const onFinish = (values: any) => {
    // console.log("Success:", values);
    dispatch(register(values))
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(()=>{
    // toast.success("Success")
  },[])
  return (
    <div className="register-wrapper">
      <div className="register-form-wrapper">
        <img src={img} />
        <div className="register-form">
          <Form
            name="basic"
            layout="vertical"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="addAdmin-Form"
          >
            <Form.Item label="Username" name="username" rules={nameValidate}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={emailValidate}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={passwordValidate}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="ConfirmPassword"
              name="confirmPassword"
              rules={confirmPassword}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select your gender" }]}
            >
              <Radio.Group 
              >
                <Radio value="male"> Male </Radio>
                <Radio value="female"> Female </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Birthday" name="birthday" rules={combine}>
              <DatePicker />
            </Form.Item>
            <Form.Item label="Address" name="address" rules={combine}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
