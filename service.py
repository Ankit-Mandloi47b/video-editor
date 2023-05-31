from datetime import datetime
from io import BytesIO
from time import sleep
from typing import List

from fastapi import HTTPException
from minio import S3Error
from playwright.sync_api import sync_playwright
from Connections.postgres_connection import session
from logs import logger
from schemas import video_metadata
import env
from Connections.minio_connection import minio_client


def add_metadata(data:List):
    try:
        metadata_object = video_metadata(metadata_info=data, uploaded_time=datetime.now())
        session.add(metadata_object)
        session.commit()
        req_id = metadata_object.id
        logger.info('added metadata info in database')
        return req_id

    except Exception as e:
        session.rollback()
        logger.error('error in adding metadata to database')
        raise HTTPException(status_code=502, detail=f'error in updating metadata on database ERROR: {e}')


def open_webpage(request_id):
    with sync_playwright() as p:
        logger.info('headless mode on')
        browser = p.firefox.launch(headless=False)
        page = browser.new_page()
        page.goto(f'http://localhost:3000/render/{request_id}')
        page.wait_for_selector('button')
        page.click('button')
        page.wait_for_selector('video')
        while not page.evaluate(' document.querySelector("video").ended'):
            continue

        browser.close()


def get_json_from_db(req_id):
    try:
        result = session.query(video_metadata).get(req_id)
        if result is None:
            raise HTTPException(status_code=404)
        return result.metadata_info

    except Exception:

        raise HTTPException(status_code=500)


def add_video(req_id, video_file):
    my_bucket = env.MINIO_BUCKET
    bucket = minio_client.bucket_exists(my_bucket)
    if not bucket:
        minio_client.make_bucket(my_bucket)
    try:
        minio_client.put_object(
            bucket_name=my_bucket,
            object_name=f'{req_id}/video.mp4',
            data=BytesIO(video_file),
            length=len(video_file)
        )
        return req_id
    except S3Error as e:
        print('ERROR IN MINIO', e)
        HTTPException(status_code=501, detail='error in updating video file in minio')


def update_database(req_id):
    try:
        print("Inside update_database")
        session.query(video_metadata).filter(video_metadata.id == req_id).update()
        session.commit()
    except Exception:
        raise HTTPException(status_code=501)
