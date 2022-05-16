import {useSelector} from "react-redux";
import React from "react";
import {array} from "prop-types";
import {CSSTransition, TransitionGroup} from "react-transition-group";

export default function ModalController({modalStorage}) {
  useSelector(data => data.modalReducer);
  const modals = modalStorage ? modalStorage.map((val) =>
    <CSSTransition classNames='custom-modal' timeout={{enter: 500, exit: 500}} key={val.id}>
      {val.modal}
    </CSSTransition>
  ) : <></>;

  return (
    <TransitionGroup component={null}>
      {modals}
    </TransitionGroup>
  )
}

ModalController.propTypes = {
  modalStorage: array,
};
