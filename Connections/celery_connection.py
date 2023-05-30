from celery import Celery

celery_app = Celery(
    'video_editor',
    broker='amqp://user:password@rabbitmq:5672//',
    result_backend='rpc://'
)
celery_app.autodiscover_tasks(['tasks.py'])
