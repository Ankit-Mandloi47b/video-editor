from datetime import datetime

from fastapi import HTTPException
from playwright.sync_api import sync_playwright

from Connections.celery_connection import celery_app
from Connections.postgres_connection import session
from schemas import video_metadata
from logs import logger


@celery_app.task(queue='postgres_connection')
def add_metadata(data: dict):
    try:
        metadata_object = video_metadata(metadata_info=data, uploaded_time=datetime.now())
        session.add(metadata_object)
        session.commit()
        req_id = metadata_object.id
        logger.info('added metadata info in database')
        return req_id

    except ConnectionError:
        session.rollback()
        logger.error('error in adding metadata to database')
        raise HTTPException(status_code=501, detail='error in updating metadata on postgres')


@celery_app.task(queue='headless_browser')
def open_webpage(request_id):
    with sync_playwright() as p:
        logger.info('headless mode on')
        browser = p.firefox.launch(headless=False)
        page = browser.new_page()
        page.goto(f'http://localhost:3000/{request_id}')

        page.wait_for_selector('#mybtn')

        # Click the play button
        page.click('#mybtn')

        # Wait for the video to load
        # video_element = page.wait_for_selector('video')
        while not page.evaluate(' document.querySelector("video").ended'):
            continue

        browser.close()


@celery_app.task()
def get_json_from_db(req_id: int):
    try:
        result = session.query(video_metadata).get(req_id)
        logger.info('fetching metadata from database')
        return result
    except ConnectionError as e:
        logger.error('error in fetching data from database')
        HTTPException(status_code=501, detail=f'error in fetching details from database{e}')



# @celery_app.task(queue='minio')
# def add_video(req_id):
#     my_bucket = env.MINIO_BUCKET
#     bucket = minio_client.bucket_exists(my_bucket)
#     if not bucket:
#         minio_client.make_bucket(my_bucket)
#     try:
#         minio_client.fput_object(
#             bucket_name=my_bucket,
#             object_name=f'{req_id}/video.mp4',
#             file_path='videos/Welcome.mp4'
#         )
#         return req_id
#     except S3Error as e:
#         print('ERROR IN MINIO', e)
#         HTTPException(status_code=501, detail='error in updating video file in minio')


# @celery_app.task()
# def update_database(req_id):
#     print("Inside update_database")
#     session.query(video_metadata).filter(video_metadata.id == req_id).update()
#     session.commit()

