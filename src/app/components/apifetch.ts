import { User } from "firebase/auth";

// 共通APIリクエスト関数
export async function apiFetch(
    url: string,
    user: User,
    options: RequestInit = {}
) {
    // Firebaseトークン取得
    const idToken = await user.getIdToken();

    // headers設定
    const headers: HeadersInit = {
        ...options.headers,
        "Authorization": `Bearer ${idToken}`,
        "Content-Type": "application/json",
    };

    const fetchOptions: RequestInit = {
        ...options,
        headers,
    };
    console.log(headers);


    const res = await fetch(url, fetchOptions);

    // エラー処理など共通化もここでできる
    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res.json();
}
