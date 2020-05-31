# selenium-container

Selenium環境コンテナ  
Selenium Server実行コンテナとスクリプト実行コンテナで構成

## Setup

`client/config.json.sample` をコピーして修正

```sh
cp config.json.sample config.json
vi config.json
```

コンテナのビルドと起動

```sh
docker-compose build
docker-compose up -d
```

## 実行

コンテナで `*.ts` はビルド済み

```sh
docker-compose exec selenium-client node xxx.js
```


