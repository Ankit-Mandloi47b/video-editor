import io
from datetime import datetime
from time import sleep
from typing import List
import magic
from fastapi import HTTPException, File
from playwright.sync_api import sync_playwright
from Connections.postgres_connection import session
from logs import logger
from schemas import video_metadata
import env
from Connections.minio_connection import minio_client


def add_metadata(data: List):
    try:
        metadata_object = video_metadata(metadata_info=data)
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
        sleep(5)
        browser.close()


def get_json_from_db(req_id):
    try:
        result = session.query(video_metadata).get(req_id)
        if result is None:
            raise HTTPException(status_code=404)
        return result.metadata_info

    except Exception:

        raise HTTPException(status_code=500)


def add_video(req_id: int, video_file: bytes = File(...)):
    my_bucket = env.MINIO_BUCKET

    # Create the bucket if it doesn't exist
    if not minio_client.bucket_exists(my_bucket):
        minio_client.make_bucket(my_bucket)
    content_type = magic.from_buffer(video_file, mime=True)
    video_path = f"{req_id}/video.mp4"
    try:
        # Save the video to MinIO

        minio_client.put_object(
            bucket_name=my_bucket,
            object_name=video_path,
            data=io.BytesIO(video_file),
            length=len(video_file),
            content_type=content_type
        )
        update_database(req_id, video_path, my_bucket, 'successful')
    except Exception as e:
        update_database(req_id, video_path, my_bucket, "failed")
        return {"message": "Error uploading video", "error": str(e)}


def update_database(req_id, video_path: str, bucket_name: str, status: str):
    try:
        session.query(video_metadata).filter(video_metadata.id == req_id).update(
            {
                video_metadata.video_path: video_path,
                video_metadata.bucket_name: bucket_name,
                video_metadata.status: status

            })
        # object = session.query(video_metadata).filter(video_metadata.id == req_id).first()
        # object.video_path = video_path,
        # object.bucket_name = bucket_name,
        # object.status = status
        # session.add()
        session.commit()
    except Exception as e:
        raise HTTPException(status_code=501,detail=str(e))
