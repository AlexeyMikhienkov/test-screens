import React, {useRef} from "react";
import LabelInput from "../baseComponents/gui/form/LabelInput";
import {required} from "../../constants/form";
import Form from "../baseComponents/gui/form/Form";
import {post} from "../../utils/api/api";

export default function PasswordRestore() {
  const onSubmit = useRef((data) => {
    post("/user/password-restore", data);
  });
  return (
    <Form onSubmit={onSubmit.current}>
      <LabelInput
        name="email"
        label="email: "
        defaultValue="asd@asd.as"
        register={required("e-mail")}
      />
      <br/>
      <button type="submit">Отправить</button>
    </Form>
  );
}
