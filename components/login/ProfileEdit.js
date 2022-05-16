import React from "react";
import LabelInput from "../baseComponents/gui/form/LabelInput";
import UserForm from "./UserForm";
import {email, required} from "../../constants/form";
import {logout, update, useUser} from "../../redux/reducer/user";
import {useDispatch} from "react-redux";

export default function ProfileEdit(args) {
  const {userInfo} = useUser();
  const dispatch = useDispatch();
  return (
    <>
      <UserForm action={update} {...args}>
        <LabelInput
          name="username"
          label="username : "
          defaultValue={userInfo?.username}
          register={required("username")}
        />
        <br/>
        <LabelInput
          name="first_name"
          label="Имя : "
          defaultValue={userInfo?.first_name}
          register={required("Имя")}
        />
        <br/>
        <LabelInput
          name="last_name"
          label="Фамилия : "
          defaultValue={userInfo?.last_name}
          register={required("Фамилия")}
        />
        <br/>
        <LabelInput
          name="email"
          label="email : "
          defaultValue={userInfo?.email}
          register={email("email")}
        />
        <br/>
        <button type="submit">Отправить</button>
      </UserForm>
      <hr/>
      <UserForm>
        <h3>Сменить пароль</h3>
        <LabelInput
          name="password"
          label="Текущий пароль: "
          register={required("")}
        />
        <br/>
        <LabelInput
          name="new_password"
          label="Новый пароль: "
          register={required("")}
        />
        <br/>
        <LabelInput
          name="new_password"
          label="Ещё раз новый пароль: "
          register={required("")}
        />
        <br/>
        <button type="submit">Отправить</button>
      </UserForm>

      <hr/>

      <button onClick={() => dispatch(logout())}>Выйти</button>

    </>
  );
}
