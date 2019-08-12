import React from 'react';

export function convertDate(timestamp) {
    return new Date(timestamp).toLocaleString();
}
