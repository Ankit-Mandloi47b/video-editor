from datetime import datetime

from fastapi import HTTPException

from Connections.celery_connection import celery_app
from Connections.postgres_connection import session
from schemas import video_metadata


# from playwright.async_api import async_playwright

@celery_app.task(queue='postgres_connection')
def add_metadata(data: dict):
    try:
        metadata_object = video_metadata(metadata_info=data, uploaded_time=datetime.now())
        session.add(metadata_object)
        session.commit()
        req_id = metadata_object.id
        return req_id

    except ConnectionError:
        raise HTTPException(status_code=501, detail='error in updating metadata on postgres')


@celery_app.task(queue='headless_browser')
def open_webpage():
    print("Inside celery chaining")
