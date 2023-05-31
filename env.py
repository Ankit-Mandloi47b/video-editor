import os

MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY', 'minioadmin')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY', 'minioadmin')
MINIO_HOST = os.getenv('MINIO_HOST', 'localhost')
MINIO_PORT = os.getenv('MINIO_PORT', '9000')
MINIO_BUCKET = 'videos-collection'

DB = os.getenv('POSTGRES_DB', 'editor')
DB_USER = os.getenv('POSTGRES_USER', 'postgres')
DB_PASSWORD = os.getenv('POSTGRES_PASSWORD', 'postgres')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_HOST = os.getenv('DB_HOST', 'localhost')

RABBITMQ_USER = os.getenv('RABBITMQ_DEFAULT_USER', 'guest')
RABBITMQ_PASSWORD = os.getenv('RABBITMQ_DEFAULT_USER', 'guest')
RABBITMQ_PORT = os.getenv('RABBITMQ_PORT', '5672')
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
