from celery import Celery
import env

celery_app = Celery(
    'video_editor',
    # broker=f'amqp://{env.RABBITMQ_USER}:{env.RABBITMQ_PASSWORD}@{env.RABBITMQ_HOST}:{env.RABBITMQ_PORT}',
    broker="amqp://guest:guest@VE-RabbitMQ:5672//",
    result_backend='rpc://'
)
celery_app.autodiscover_tasks(['tasks.py'])
