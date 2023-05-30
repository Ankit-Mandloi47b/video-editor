import os

MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY', 'minioadmin')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY', 'minioadmin')
MINIO_HOST = 'localhost'
MINIO_PORT = '9000'
MINIO_BUCKET = 'videos-collection'

DB = os.getenv('POSTGRES_DB', 'editor')
DB_USER = os.getenv('POSTGRES_USER', 'postgres')
DB_PASSWORD = os.getenv('POSTGRES_PASSWORD', 'postgres')
DB_PORT = '5432'
DB_HOST = 'localhost'

RABBITMQ_USER = os.getenv('RABBITMQ_DEFAULT_USER', 'guest')
RABBITMQ_PASSWORD = os.getenv('RABBITMQ_DEFAULT_USER', 'guest')
RABBITMQ_PORT = '5672'
RABBITMQ_HOST = 'localhost'
