import React from 'react';

export function convertDate(timestamp) {
    if (timestamp) {
        return new Date(timestamp).toLocaleString();
    }
    return "";
}
export function saveLogin(apiBearer) {
    localStorage.setItem("apiBearer", apiBearer);
}

export function getLogin() {
    return localStorage.getItem("apiBearer");
}

export function deleteLogin() {
    localStorage.clear("apiBearer")
}
