'use client';

import { useAuth } from '@/context/AuthContext';
import { User } from 'firebase/auth';
import { Button } from "react-bootstrap";
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
                <>
                    <p>{user.email} でログイン中</p>
                    <Button onClick={() => test(user)}>
                        テスト
                    </Button>
                </>
            ) : (
                <p>ログインしていません</p>
            )}
        </div>
    );
}
async function test(user: User) {
    console.log(user);

    // let uid = user.uid;
    // const user = firebase.auth().currentUser;
    const idToken = await user.getIdToken();
    console.log(idToken);
    let url: string = "http://127.0.0.1:8080/api/sample";
    const res = await fetch(url, {
        method: "Get",
        headers: {
            'Authorization': `Bearer ${idToken}`,
            "Content-Type": "application/json"
        },
        // body: JSON.stringify({})
    });

    if (!res.ok) {
        console.log('失敗');

    }
    const data = await res.json();
}