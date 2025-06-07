'use client';

import { Navbar, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useAuth } from '@/context/AuthContext';
import { getAuth, signOut } from "firebase/auth";
import Link from 'next/link';


const handleLogout = async () => {
    const auth = getAuth();
    try {
        await signOut(auth);
        // サインアウト後の処理（例: ページ遷移、アラート表示など）
    } catch (error) {
        console.error("ログアウト失敗:", error);
    }
};

export default function DefaultNavbar() {
    const { user, loading } = useAuth();
    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/sample">sample
                </Navbar.Brand>
                <Navbar.Brand href="/micro-blog">micro blog
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    {loading ? (
                        <>
                            <Navbar.Text>
                                読み込み中
                            </Navbar.Text>
                        </>
                    ) : user ? (
                        <>
                            <Navbar.Text>
                                {user.email}
                            </Navbar.Text>
                            <Navbar.Text>
                                <Button onClick={handleLogout} variant="outline-secondary" size="sm" style={{ marginLeft: 10 }}>
                                    ログアウト
                                </Button>
                            </Navbar.Text>
                        </>
                    ) : (
                        <>
                            <Navbar.Text>
                                <Nav.Link as={Link} href="/user/login">
                                    ログイン
                                </Nav.Link>
                            </Navbar.Text>
                            <Navbar.Text>
                                <Nav.Link as={Link} href="/user/register" style={{ marginLeft: 10 }}>
                                    登録
                                </Nav.Link>
                            </Navbar.Text>
                        </>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
