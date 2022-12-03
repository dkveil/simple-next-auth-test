import React from 'react';
import styles from '../styles/Home.module.css';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Router from 'next/router';

interface User {
    email: string;
    password: string;
}

async function createUser(user: User) {
    if (!user.email || !user.password) {
        return;
    }

    const res = await fetch('api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email: user.email, password: user.password }),
        headers: {
            'Content-type': 'application/json',
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong!');
    }

    return data;
}

export default function Home() {
    const [message, setMessage] = React.useState<string>('');
    const emailInputRef = React.useRef<HTMLInputElement | null>(null);
    const passwordInputRef = React.useRef<HTMLInputElement | null>(null);
    const { status, data: session } = useSession();

    const [isLogin, setIsLogin] = React.useState<boolean>(false);

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const enteredEmail = emailInputRef?.current?.value || null;
        const enteredPassword = emailInputRef?.current?.value || null;

        if (!enteredEmail || !enteredPassword) {
            return;
        }

        if (isLogin) {
            const result = await signIn('credentials', {
                redirect: false,
                email: enteredEmail,
                password: enteredPassword,
            });

            if (!result?.error) {
                Router.replace('/profile');
            }
            if (result?.error) {
                setMessage(result.error);
            }
        } else {
            try {
                const { message } = await createUser({ email: enteredEmail, password: enteredPassword });
                setMessage(message);
            } catch ({ message }) {
                if (typeof message === 'string') {
                    setMessage(message);
                }
            }
        }
    };

    const handleLogout = () => signOut();

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100px',
                    backgroundColor: 'white',
                    color: 'black',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 30,
                }}
            >
                <span>{status}</span>
                {status === 'authenticated' && session.user ? <Link href="/profile">Profile</Link> : null}
            </div>
            <div className={styles.container} style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
                {status === 'authenticated' && session.user ? (
                    <div>
                        <span style={{ display: 'block' }}>{session.user.email}</span>
                        <button onClick={handleLogout}>Log out</button>
                    </div>
                ) : null}
                {status === 'unauthenticated' ? (
                    <div>
                        {message ? <div style={{ color: 'white', fontSize: 40 }}>{message}</div> : null}
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                            <input type="text" id="email" name="email" ref={emailInputRef} required></input>
                            <input type="password" id="password" name="password" ref={passwordInputRef} required></input>
                            <button type="submit">{isLogin ? 'Log in' : 'Register'}</button>
                            <button type="button" onClick={() => setIsLogin((prev) => !prev)}>
                                {isLogin ? 'Create new account' : 'Login to your account'}
                            </button>
                        </form>
                    </div>
                ) : null}
                {status === 'loading' && <div style={{ color: 'white', fontSize: 200 }}>loading...</div>}
            </div>
        </>
    );
}
