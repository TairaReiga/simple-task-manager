# Simple Task Manager

## 概要
Firebase認証・Firestore・Cloud Functions・Herokuデプロイを活用したタスク管理アプリです。

## 主な機能
- ユーザー認証（Firebase Auth）
- タスクの作成・編集・削除・ステータス管理
- ステータスごとのフィルタリング
- メール通知（Cloud Functions + Gmail）
- Herokuデプロイ

## システム構成
- フロントエンド：React
- バックエンド：Node.js + Express
- データベース：Firebase Firestore
- 認証：Firebase Authentication
- 通知：Firebase Cloud Functions + Gmail
- デプロイ：Heroku

## セットアップ手順

### 1. リポジトリのクローン
```sh
git clone <リポジトリURL>
cd 最終レポート
```

### 2. Firebase認証情報の設定
- `backend/serviceAccountKey.json` をFirebaseコンソールから取得して配置

### 3. 依存パッケージのインストール
```sh
cd backend
npm install
cd ../frontend
npm install
```

### 4. 開発サーバー起動
- バックエンド: `npm start`（ポート5001）
- フロントエンド: `npm start`（ポート3000）

### 5. Herokuデプロイ
- Heroku CLIで`backend`ディレクトリからデプロイ

## 操作マニュアル

### ログイン・新規登録
- メールアドレスとパスワードでログイン・新規登録

### タスクの作成
- タイトル・詳細・期限を入力し「作成」ボタン

### タスクの編集・削除
- 各タスクの「編集」「削除」ボタンで操作

### ステータス変更・フィルタリング
- ステータスプルダウンで変更
- フィルターで表示切り替え

### 通知
- 新しいタスク追加時にメール通知

## ライセンス
MIT 