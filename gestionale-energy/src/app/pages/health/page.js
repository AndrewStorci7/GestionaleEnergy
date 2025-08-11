'use client'
import React, { useEffect, useState } from 'react'
import { getServerRoute } from '@config'


/**
 * Converte i byte in unità leggibili (KB, MB, GB)
 * @param {number} bytes - Numero di bytes
 * @param {number} decimals - Numero di decimali (default 2)
 * @returns {string} Formato leggibile
 */
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Converte i secondi in formato leggibile (giorni, ore, minuti, secondi)
 * @param {number} seconds - Numero di secondi
 * @returns {string} Formato leggibile
 */
const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    let result = [];
    
    if (days > 0) result.push(`${days}g`);
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    if (secs > 0 || result.length === 0) result.push(`${secs}s`);
    
    return result.join(' ');
}

/**
 * Formatta la data in formato italiano
 * @param {string} isoDate - Data in formato ISO
 * @returns {string} Data formattata
 */
const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Rome'
    };
    
    return date.toLocaleString('it-IT', options);
}

/**
 * Determina lo stato della memoria
 * @param {number} heapUsed - Memoria heap utilizzata in bytes
 * @param {number} heapTotal - Memoria heap totale in bytes
 * @returns {object} Stato e colore
 */
const getMemoryStatus = (heapUsed, heapTotal) => {
    const usagePercent = (heapUsed / heapTotal) * 100;
    
    if (usagePercent < 60) {
        return { percentage: usagePercent, status: 'Ottimo', color: 'green', icon: '✅' };
    } else if (usagePercent < 80) {
        return { percentage: usagePercent, status: 'Buono', color: 'yellow', icon: '⚠️' };
    } else {
        return { percentage: usagePercent, status: 'Critico', color: 'red', icon: '❌' };
    }
}


export default function HealthServer() {

    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    
    const checkHealthServer = () => {
        fetch(getServerRoute('health-check'))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Health check successful:', data);
            setResponse(data);
        })
        .catch(error => {
            console.error('Health check failed:', error);
            setError(error);
        });
    }

    useEffect(() => {
        checkHealthServer();

        // Imposta l'intervallo ogni 60000 ms (1 minuto)
        const intervalId = setInterval(() => {
            checkHealthServer();
        }, 60000);

        // Pulisce l'intervallo quando il componente si smonta
        return () => clearInterval(intervalId);
    }, []);
    
    return (
        <div className='m-4'>
            <h1 className='text-2xl font-bold pb-4'>Server Status</h1>
            {error ? (
                <div className="text-red-500">
                    <p>Error: {error.message}</p>
                </div>
            ) : response ? (
                <div className="">
                    <p><span className='font-bold'>Status:</span> {response.status} <span>{response.status === 'ok' ? '✅' : '❌'}</span></p>
                    <p><span className='font-bold'>Timestamp:</span> {formatDate(response.timestamp)}</p>
                    <p><span className='font-bold'>Uptime:</span> {formatUptime(response.uptime)}</p>
                    <p><span className='font-bold'>Database Connection:</span> {response.database} <span>{response.database === 'connected' ? '✅' : '❌'}</span></p>
                    <div>
                        <h2 className='font-bold text-xl pt-3'>Memory Usage:</h2>
                        <div className='ml-3'>
                            <p><span className='font-bold'>RSS:</span> {formatBytes(response.memory.rss)}</p>
                            <p><span className='font-bold'>Heap Total:</span> {formatBytes(response.memory.heapTotal)}</p>
                            <p><span className='font-bold'>Heap Used:</span> {getMemoryStatus(response.memory.heapUsed, response.memory.heapTotal).percentage}% | {getMemoryStatus(response.memory.heapUsed, response.memory.heapTotal).status} {getMemoryStatus(response.memory.heapUsed, response.memory.heapTotal).icon}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-gray-500">
                    <p>Loading...</p>
                </div>
            )}
            <button onClick={checkHealthServer}>Ricarica manualmente</button>
        </div>
    )
}
