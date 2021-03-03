import * as types from "../../types/actionTypes";
import { shrinkDropElements } from "./packageMinifier";

var actionsPackage = [];

export const addAction = (action) => {
  actionsPackage.push(action);
};

export const flushPackage = (actionType) => {
  const packageToReturn = actionsPackage;
  actionsPackage = [];

  switch (actionType) {
    case types.BOARD_DROP_ELEMENTS:
      return shrinkDropElements(packageToReturn);
    default:
      break;
  }
  //fazer o tratamento das actions antes do flush
  //quais actions?
  //// select and move -> manter todos os select e incluir apenas ultimo drag?
  //// resize -> se drop, busca todos os drags e condensa em dois drags nos limites max e min
  //// connector drawing -> retornar apenas start e end se end for bem sucedido
  //// select connector?????

  return packageToReturn;
};
