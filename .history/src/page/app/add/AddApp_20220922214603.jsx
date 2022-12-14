import React, { useRef, useState, useEffect } from "react";
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

const WrapperStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  padding: 10px 0px;
`;

function AddApp() {
  const formElemt = useRef(null);
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
    console.log("data", data , "formElemt" , formElemt);
    formElemt.current.setFieldsValue({ ...data });
    setOtheForm({ ...data });
    setIsloading(false);
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
      [key]: "Kh??ng ????? tr???ng tr?????ng n??y",
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
      !!!otherForm.image && SetError("image", "Kh??ng ????? tr???ng tr?????ng n??y");
      !!!otherForm.icon && SetError("icon", "Kh??ng ????? tr???ng tr?????ng n??y");
      !!!otherForm.category.length &&
        SetError("category", "Kh??ng ????? tr???ng tr?????ng n??y");
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
    <WrapperMaindash title="Th??m ???ng d???ng">
      {!isloading ? (
        <Form
          ref={formElemt}
          name="control-hooks"
          onFinish={onFinish}
          className="form"
        >
          <InputForm
            name="name"
            label="T??n ???ng d???ng"
            placeholder="Nh???p t??n ???ng d???ng"
          />
          <FormItemForm shouldUpdate>
            {(values) => {
              return (
                <FormItemForm
                  name="goverment"
                  label="????y l?? b??? ?????nh tuy???n c???a xoanen"
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
            label="???????ng d???n ?????n ???ng d???ng"
            placeholder="Nh???p ???????ng d???n ?????n ???ng d???ng"
          />
          <InputForm
            name="github"
            label="???????ng d???n ?????n Github"
            placeholder="Nh???p ???????ng d???n ?????n Github"
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
                Th??m ???ng d???ng
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
