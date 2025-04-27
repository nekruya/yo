import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Что-то пошло не так. Попробуйте обновить страницу.</h1>
                </div>
            );
        }
        return this.props.children;
    }
} 