'use client'; // Next.js App Routerを使っている場合

import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useAuth } from '@/context/AuthContext';
import { getAuth, createUserWithEmailAndPassword, User, deleteUser, UserInfo } from "firebase/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "@/lib/FirebaseConfig"; // 初期化だけであれば使われている前提
import "@/app/components/apifetch";
import { apiFetch } from "@/app/components/apifetch";

import { redirect } from 'next/navigation';

// export default function Register() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const doRegister = () => {




//         // const auth = getAuth();
//         // createUserWithEmailAndPassword(auth, email, password)
//         //     .then((userCredential) => {
//         //         const user = userCredential.user;
//         //         alert('登録完了！');
//         //         console.log(user);
//         //     })
//         //     .catch((error) => {
//         //         console.error("登録エラー:", error);
//         //         alert(`登録失敗: ${error.message}`);
//         //     });
//     };

//     return (
//         <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
//             <h1>新規登録</h1>
//             <Form>
//                 <Form.Group className="mb-3" controlId="formEmail">
//                     <Form.Label>メールアドレス：</Form.Label>
//                     <Form.Control
//                         type="email"
//                         placeholder="example@example.com"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         style={{ height: 50, fontSize: "1.2rem" }}
//                     />
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formPassword">
//                     <Form.Label>パスワード：</Form.Label>
//                     <Form.Control
//                         type="password"
//                         placeholder="パスワード"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         style={{ height: 50, fontSize: "1.2rem" }}
//                     />
//                 </Form.Group>

//                 <Button
//                     variant="primary"
//                     onClick={doRegister}
//                     style={{ width: "100%", fontSize: "1.2rem" }}
//                 >
//                     登録
//                 </Button>
//             </Form>
//         </div>
//     );
// }
// スキーマ定義（Yup）
const schema = Yup.object().shape({
    email: Yup.string().email("正しいメールアドレスを入力してください").required("必須です"),
    password: Yup.string().min(8, "8文字以上で入力してください").required("必須です")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "大文字、小文字、数字を含めて入力してください"),
    displayName: Yup.string().min(4, "4文字以上で入力してください").required("必須です")
});

type FormData = {
    email: string;
    password: string;
    displayName: string;
};

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data: FormData) => {
        console.log("フォーム送信:", data);
        // Firebase登録処理などここに
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                createUserBackend(user, data.email, data.displayName);
            })
            .catch((error) => {
                alert(`登録失敗: ${error.message}`);
            });
    };

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <>
                読み込み中
            </>
        )
    }
    if (user != null && !loading) {
        redirect('/');
    }
    return (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <h2>新規登録</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        メールアドレス
                        <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                        // type="email"
                        {...register("email")}
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        パスワード
                        <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                        type="password"
                        {...register("password")}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        表示名
                        <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {...register("displayName")}
                        isInvalid={!!errors.displayName}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="primary" style={{ width: "100%" }}>
                    登録
                </Button>
            </Form>
        </div>
    );
}
async function createUserBackend(user: User, email: string, displayName: string) {
    let uid = user.uid;
    let url: string = "http://localhost:8080/api/user";
    try {
        const data = await apiFetch(
            url,
            user,
            {
                method: "POST",
                body: JSON.stringify({ uid, email, displayName })
            }
        )
        return data;
    } catch (err) {
        await deleteUser(user);
    }
}