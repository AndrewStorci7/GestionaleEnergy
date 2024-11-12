/**
 * Login page
 * @author Andrea Storci
 */
'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css'; // Optional CSS styling (create styles if needed)

export default function LoginPage() {

    const router = useRouter();

    const [facility, setFacility] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic form validation (you can add more robust validation)
        if (!username || !password || !facility) {
            setError('Please fill in both fields.');
            return;
        } else {
            let json = {
                name: username, facility: facility
            };
            Cookies.set('user-info', JSON.stringify(json), { expires: 1 });
            switch (username) {
                case "admin":
                    router.push('/pages/admin');
                    break;
                case "pressista":
                    router.push('/pages/pressista');
                    break;
                case "carrellista":
                    router.push('/pages/carrellista');
                    break;
                default:
                    router.push('/pages/pressista');
                    break;
            }
        }
    };

    const handleChange = (e) => {
        setFacility(e.target.value);
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
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleziona un&apos;impianto</option>
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
