import React, { useState, useEffect } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Form, Button, Switch, Spin } from "antd";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

import WrapperMaindash from "../../../components/WrapperMaindash";
import InputForm from "../../../components/form/Input";
import styled from "styled-components";
import AddImage from "./AddImage";
import AddIcon from "./AddIcon";
import AddCategory from "./AddCategory";
import FormItemForm from "../../../components/form/FormItem";
import { appApi } from "../../../api/appApi";
import Permission from "../../../components/permission/Permission";
import TextAreaForm from "../../../components/form/TextArea";

const WrapperStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  padding: 10px 0px;
`;

function AddApp() {
  const [form] = Form.useForm();
  const history = useHistory();
  const { id } = useParams();
  const [isloading, setIsloading] = useState(false);
  const [otherForm, setOtheForm] = useState({
    image: "",
    icon: "",
    category: [],
  });
  const [otherFormError, setOtheFormError] = useState({
    image: "",
    icon: "",
    category: "",
  });
  async function fetchApi(id) {
    const { data } = await appApi.getId(id);
    setIsloading(false);
    if (form) {
      form.setFieldsValue({ ...data });
    }
    setOtheForm({ ...data });
  }

  useEffect(() => {
    setIsloading(true);
    if (id) {
      fetchApi(id);
    } else {
      setIsloading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChangeImage = (imageObj) => {
    setOtheForm((prev) => ({
      ...prev,
      image: imageObj,
    }));
    setOtheFormError("image", "");
  };
  const handleChangeIcon = (IconObj) => {
    setOtheForm((prev) => ({
      ...prev,
      icon: IconObj,
    }));
    setOtheFormError("icon", "");
  };
  const SetError = (key, text) => {
    setOtheFormError((prev) => ({
      ...prev,
      [key]: "Không để trống trường này",
    }));
  };
  const handleChangeCategory = (CategoryArr) => {
    setOtheForm((prev) => ({
      ...prev,
      category: CategoryArr,
    }));
    setOtheFormError("category", "");
  };
  const onFinish = async (values) => {
    if (
      !!!otherForm.image ||
      !!!otherForm.image ||
      !!!otherForm.category.length
    ) {
      !!!otherForm.image && SetError("image", "Không để trống trường này");
      !!!otherForm.icon && SetError("icon", "Không để trống trường này");
      !!!otherForm.category.length &&
        SetError("category", "Không để trống trường này");
    } else {
      const newData = {
        ...values,
        category: otherForm.category.reduce(
          (initialValue, currentValue) => [
            ...initialValue,
            currentValue["_id"],
          ],
          []
        ),
        icon: otherForm.icon["_id"],
        image: otherForm.image["_id"],
      };
      id
        ? await appApi.patch({ data: newData, id })
        : await appApi.add(newData);
      history.goBack();
    }
  };

  return (
    <WrapperMaindash title={id ? "Sửa ứng dụng" : "Thêm ứng dụng"}>
      {!isloading ? (
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          className="form"
          initialValues={{ goverment: false }}
        >
          <InputForm
            name="name"
            label="Tên ứng dụng"
            placeholder="Nhập tên ứng dụng"
          />
          <TextAreaForm
            name="description"
            label="Mô tả ứng dụng"
            placeholder="Nhập mô tả ứng dụng"
          />
          <FormItemForm shouldUpdate>
            {(values) => {
              return (
                <FormItemForm
                  name="goverment"
                  label="Đây là bộ định tuyến của xoanen"
                >
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={values.getFieldValue("goverment")}
                    onChange={(value) =>
                      values.setFieldsValue({ goverment: value })
                    }
                  />
                </FormItemForm>
              );
            }}
          </FormItemForm>
          <InputForm
            name="url"
            label="Đường dẫn đến ứng dụng"
            placeholder="Nhập đường dẫn đến ứng dụng"
          />
          <InputForm
            name="github"
            label="Đường dẫn đến Github"
            placeholder="Nhập đường dẫn đến Github"
          />
          <AddImage
            value={otherForm.image}
            error={otherFormError.image}
            onChange={handleChangeImage}
          />
          <AddIcon
            value={otherForm.icon}
            error={otherFormError.icon}
            onChange={handleChangeIcon}
          />
          <AddCategory
            value={otherForm.category}
            error={otherFormError.category}
            onChange={handleChangeCategory}
          />
          <Permission roles={["ADMIN"]} noAccess={null}>
            <WrapperStyle>
              <Button type="primary" htmlType="submit">
                {id ? "Sửa ứng dụng" : "Thêm ứng dụng"}
              </Button>
            </WrapperStyle>
          </Permission>
        </Form>
      ) : (
        <Spin />
      )}
    </WrapperMaindash>
  );
}

export default AddApp;
