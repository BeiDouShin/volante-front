'use client';

import { useAuth } from '@/context/AuthContext';
// import { use } from 'react';

export default function Dashboard() {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <>
                読み込み中
            </>
        )
    }
    return (
        <div>
            {user ? (
                <p>{user.email} でログイン中</p>
            ) : (
                <p>ログインしていません</p>
            )}
        </div>
    );
}