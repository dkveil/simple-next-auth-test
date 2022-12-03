import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import styles from '../styles/Home.module.css';
import { Session } from 'next-auth';
import { GetServerSideProps } from 'next';
import Router from 'next/router';

const UserProfile = ({ testSession }: { testSession: Session | null }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [session, setSession] = React.useState<Session | null>();

    const handleLogout = () => signOut();

    React.useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                Router.replace('/');
                return;
            }
            setIsLoading(false);
            setSession(session);
        });
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    console.log(testSession);

    if (session?.user) {
        return (
            <div className={styles.container}>
                <div>
                    <Link href="/">Back</Link>
                    <h1 style={{ display: 'block' }}>User proflie</h1>
                    <span style={{ display: 'block' }}>{session.user.email}</span>
                    <button onClick={handleLogout}>Log out</button>
                </div>
            </div>
        );
    }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            props: {},
            redirect: {
                destination: '/',
                parmament: false,
            },
        };
    }

    return {
        props: {
            testSession: session,
        },
    };
};

export default UserProfile;
