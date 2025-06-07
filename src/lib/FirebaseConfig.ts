// FirebaseConfig.ts

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// 環境変数からFirebase設定を読み込む
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_APIKEY || "",
    authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_PROJECTID || "",
    storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID || "",
    appId: process.env.NEXT_PUBLIC_APPID || "",
};

// 明確な型定義を使った変数宣言（nullで初期化）
let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

// クライアントサイドのみで初期化（SSR対策）
if (typeof window !== "undefined" && !getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
}

// エクスポート時にnullの可能性があるため、呼び出し元でnullチェックを推奨
export { firebaseApp, auth, firestore };
