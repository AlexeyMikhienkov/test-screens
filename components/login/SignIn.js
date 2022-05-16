import React from "react";
import LabelInput from "../baseComponents/gui/form/LabelInput";
import {signIn} from "../../redux/reducer/user";
import UserForm from "./UserForm";
import {required} from "../../constants/form";

export default function SignIn(args) {
  return (
    <UserForm action={signIn} {...args}>
      <LabelInput
        name="email"
        label="email: "
        defaultValue="asd@asd.as"
        register={required("e-mail")}
      />
      <br/>
      <LabelInput
        name="password"
        label="Пароль: "
        defaultValue="111111"
        register={required("пароль")}
      />
      <br/>
      <button type="submit">Отправить</button>
    </UserForm>
  );
}
