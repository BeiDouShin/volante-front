'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/FirebaseConfig';
import { Form, Button, Alert } from 'react-bootstrap';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const doLogin = async () => {
        setError('');
        try {
            if (!auth) {
                return;
            }
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("ログイン成功:", userCredential.user);

            // ログイン後の遷移（例：ホームへ）
            router.push('/');
        } catch (err: any) {
            console.error("ログインエラー:", err);
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 60 }}>
            <h2>ログイン</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>メールアドレス</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>パスワード</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" onClick={doLogin} style={{ width: '100%' }}>
                    ログイン
                </Button>
            </Form>
        </div>
    );
}
