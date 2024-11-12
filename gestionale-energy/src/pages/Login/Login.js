/**
 * Login page
 * @author Andrea Storci
 */
'use client';

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './Login.module.css'; // Optional CSS styling (create styles if needed)

const LoginPage = () => {

    const router = useRouter();

    const [facility, setFacility] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic form validation (you can add more robust validation)
        if (!username || !password) {
            setError('Please fill in both fields.');
            return;
        } else {
            Cookies.set('user-type', username, { expires: 1 });
            router.push('../Pressista');
        }
    };

    return (
        <div className={styles.container}>
            <div className="w-full">
                <Image 
                    src="/logo-oe.webp"
                    width={400}
                    height={400}
                    alt='Oppimitti Energy Logo'
                />
            </div>
            <h1 className={styles.title}>Login</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="email">Impianto:</label>
                    <select
                        className={styles.input}
                        required
                    >
                        <option value="Impianto A">Impianto A</option>
                        <option value="Impianto B">Impianto B</option>
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="email">Username:</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="password">Password:</label>
                    <input
                        className={styles.input}
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.button}>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
