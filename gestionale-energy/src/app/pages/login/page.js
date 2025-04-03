'use client';

// import getEnv from '@/app/config';
import React, { useRef, useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css'; // Optional CSS styling (create styles if needed)
import { getServerRoute } from '@@/config';
import md5 from 'md5';
import SelectImplants from '@/app/components/main/select-implant';

/**
 * Login page
 * 
 * @author Andrea Storci from Oppimittinetworking
 */
export default function LoginPage() {

    // Router
    const router = useRouter();

    // Reference
    const selectRef = useRef();

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
                const url = await getServerRoute("login");
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username, password: crypted_pw}),
                });
                const res = await resp.json();

                if (res.code) {
                    setError(`${res.message}`);
                } else {
                    const json = {
                        id_user: res[0].id,
                        name: res[0].name,
                        surname: res[0].surname,
                        username: res[0].username, 
                        id_implant: implant.id_implant,
                        implant: implant.text_implant, 
                        type: res[0].type,
                        last_a: res[0].last_access,
                    };
                    Cookies.set('user-info', JSON.stringify(json), { sameSite: 'Strict', path: '/', expires: 1 });
                    router.push('/pages/panel');
                }
            } catch (error) {
                setError(`Errore: ${error}`);
            }
        }
    }

    const handleChange = () => {
        const value = selectRef.current.value;
        const text = selectRef.current.options[selectRef.current.selectedIndex].text;
        setImplant({ id_implant: value, text_implant: text });
    }

    return (
        <div className={styles.container}>
            <div className="w-full ">
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
                    <SelectImplants 
                        ref={selectRef}
                        onChange={handleChange}
                        required
                    />
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
