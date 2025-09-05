import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';

// attach global fetch wrapper to automatically include Authorization header from localStorage
const _originalFetch = window.fetch.bind(window);
// use 'any' cast to avoid strict function type mismatch with built-in fetch overloads
;(window as any).fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    try {
        const token = localStorage.getItem('accessToken');
        init = init || {};
        // ensure headers is a Headers instance
        const headers = new Headers(init.headers as HeadersInit || {});
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        init.headers = headers;
    } catch (e) {
        // ignore
        console.error('fetch wrapper error', e);
    }
    return _originalFetch(input as RequestInfo, init);
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);
