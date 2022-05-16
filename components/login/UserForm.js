import React from "react";
import Form from "../baseComponents/gui/form/Form";
import {useDispatch} from "react-redux";
import {clearError, useUser} from "../../redux/reducer/user";
import {func, node, object} from "prop-types";

export default function UserForm({children, action, form, ...args}) {
  const dispatch = useDispatch();
  const user = useUser();

  const onSubmit = (data) => {
    dispatch(action(data));
  };

  return (
    <Form
      {...args}
      form={form}
      onSubmit={onSubmit}
      errors={{
        clearError(payload) {
          dispatch(clearError(payload))
        },
        errors: user?.error?.fields
      }}
    >
      {children}
    </Form>
  );
}

UserForm.propTypes = {
  children: node,
  action: func,
  form: object,
};
