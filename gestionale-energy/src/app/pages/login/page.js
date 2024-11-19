/**
 * Login page
 * @author Andrea Storci
 */
'use client';

import getEnv from '@/app/config';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css'; // Optional CSS styling (create styles if needed)
import getEnv from '@/app/config';
import md5 from 'md5';

const URL = getEnv('srvurl');
const PORT = getEnv('srvport');
const srvurl = `${URL}:${PORT}`;

const URL = getEnv('REACT_APP_URL', 'http://localhost');
const PORT = getEnv('REACT_APP_PORT', 3070);
const srvurl = URL + ":" + PORT; 

export default function LoginPage() {

    const router = useRouter();

    const [implant, setImplant] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic form validation
        if (!username || !password || !implant) {
            setError('Please fill in both fields.');
            return;
        } else {

            // Crypting the password with innested md5
            let crypted_pw = md5(md5(password));

            try {
                
                const resp = await fetch(srvurl + '/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username, password: crypted_pw}),
                });
                const res = await resp.json();

                if (res[0].code) {
                    setError(`Errore: ${res[0].message}`);
                } else {

                    let json = {
                        name: res[0].username, implant: implant, type: res[0].type
                    };
                    Cookies.set('user-info', JSON.stringify(json), { expires: 1 });

                    // console.log(res[0].type);

                    switch (res[0].type) {
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
                
            } catch (error) {
                setError(`Errore: ${error}`)
            }
        }
    };

    const handleChange = (e) => {
        setImplant(e.target.value);
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
