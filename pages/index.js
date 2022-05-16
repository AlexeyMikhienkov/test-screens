import React, {useEffect, useState} from 'react';
import PageDescription from "../components/baseComponents/head/pageDescription/PageDescription";
import defaultPage from "../constants/page-description";
import App from "../components/app/App";
import {
  loadThunk,
  setImportPromise,
  useApp
} from "../redux/reducer/app";
import {useDispatch} from "react-redux";
import Preloader from "../components/baseComponents/gui/preloader/Preloader";

export default function Home() {
  const dispatch = useDispatch();
  const {loadingComplete} = useApp();

  useEffect(() => {
    const promise = import('../components/app/AppController');
    setImportPromise(promise);
    dispatch(loadThunk());
  }, []);

  return (
    <div className="container">
      <PageDescription {...defaultPage}/>
      {loadingComplete ? <App/> : <Preloader/>}
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}

//TODO: Есть 6 экранов, у каждого есть состояние: show cycle hide hidden.
// Каждый экран - какой-то уникальный компонент со своим контентом.
// Нужно реализовать без роутинга переход между экранами (вызов перехода осуществляется по кнопке внутри экрана).
// Страницы переключаются последовательно,
// т.е. текущий переходит в состояние hide -> текущий переходит в состояние hidden и новый переходит в состояние show,
// по окончании анимации показа переход в состояние cycle.
// Состояния должны храниться в redux,
// переход инициируется путем передачи экшена с данными: какой экран надо выбрать.
