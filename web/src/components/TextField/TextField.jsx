import React from 'react';
import {ErrorMessage, useField} from "formik";

export const TextField = ({label, ...props}) => {
    const [filed, meta] = useField(props);
    return (
        <div className="text-field">
            <label htmlFor={filed.name}>{label}</label>
            <input
                className={`form-control shadow-none ${meta.touched && meta.error && 'is-invalid'}`}
                {...filed}{...props}
                autoComplete="off"
            />
            <ErrorMessage component="div" name={filed.name} className="error"/>
        </div>
    )
}