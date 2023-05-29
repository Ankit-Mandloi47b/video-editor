from minio import Minio

import env

minio_client = Minio(
    endpoint=f"{env.MINIO_HOST}:{env.MINIO_PORT}",
    access_key=env.MINIO_ACCESS_KEY,
    secret_key=env.MINIO_SECRET_KEY,
    secure=False
)
