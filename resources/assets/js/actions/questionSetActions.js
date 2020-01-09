import axios from "axios";

import { fetchDBConfigList } from "./dbConfigActions";
import { fetchUserList } from "./usersListActions";

const baseUrl = "/api/office/";

export function fetchOfficeList(office = null) {
  return function(dispatch) {
    dispatch({ type: "FETCHING_OFFICE_LIST" });
    const fetchURL = office ? `${baseUrl}list?oid=${office}` : `${baseUrl}list`;
    axios
      .get(fetchURL)
      .then(response => {
        const d = response.data;
        dispatch({ type: "REMOVE_OFFICE_LIST_ERROR" });
        dispatch({
          type: "FETCHING_OFFICE_LIST_FULFILLED",
          payload: d
        });
      })
      .catch(err => {
        dispatch({ type: "FETCHING_OFFICE_LIST_FAILED", payload: err });
      });
  };
}

export function addNewOffice(name, location) {
  return function(dispatch) {
    dispatch({ type: "ADDING_NEW_OFFICE" });

    axios
      .post(`${baseUrl}new?n=${name}&l=${location}`)
      .then(response => {
        const d = response.data;

        if (d.success) {
          dispatch({ type: "ADDING_NEW_OFFICE_FULFILLED", payload: d.message });
        } else {
          dispatch({ type: "FETCHING_OFFICE_LIST_FAILED", payload: d.error });
        }
      })
      .catch(err => {
        dispatch({ type: "FETCHING_OFFICE_LIST_FAILED", payload: err });
      });
  };
}

export function updateOfficeInfo(id, name, location) {
  console.log(name + ", " + location);
  return function(dispatch) {
    dispatch({ type: "UPDATING_OFFICE_INFO" });
    const updateUrl = `${baseUrl}update?id=${id}&n=${name}&l=${location}`;
    axios
      .post(updateUrl)
      .then(resp => {
        const d = resp.data;

        if (d.success) {
          dispatch({
            type: "UPDATING_OFFICE_INFO_FULFILLED",
            payload: d.message
          });
        } else {
          dispatch({ type: "OFFICE_INFO_ERROR", payload: err });
        }
      })
      .catch(err => {
        dispatch({ type: "OFFICE_INFO_ERROR", payload: err });
      });
  };
}

export function deleteOfficeInfo(id) {
  return function(dispatch) {
    dispatch({ type: "DELETE_OFFICE_INFO" });

    axios
      .delete(`${baseUrl}delete?id=${id}`)
      .then(resp => {
        const d = resp.data;

        if (d.success) {
          dispatch(fetchDBConfigList());
          dispatch(fetchUserList());
          dispatch({
            type: "DELETE_OFFICE_INFO_FULFILLED",
            payload: d.message
          });
        } else {
          dispatch({ type: "FETCHING_OFFICE_LIST_FAILED", payload: d.error });
        }
      })
      .catch(err => {
        dispatch({ type: "FETCHING_OFFICE_LIST_FAILED", payload: err.message });
      });
  };
}
