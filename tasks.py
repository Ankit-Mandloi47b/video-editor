from datetime import datetime

from fastapi import HTTPException
from minio.error import S3Error
from playwright.sync_api import sync_playwright

import env
from Connections.celery_connection import celery_app
from Connections.minio_connection import minio_client
from Connections.postgres_connection import session
from schemas import video_metadata


@celery_app.task(queue='postgres_connection')
def add_metadata(data: dict):
    try:
        metadata_object = video_metadata(metadata_info=data, uploaded_time=datetime.now())
        session.add(metadata_object)
        session.commit()
        req_id = metadata_object.id
        return req_id

    except ConnectionError:
        session.rollback()
        raise HTTPException(status_code=501, detail='error in updating metadata on postgres')


@celery_app.task(queue='headless_browser')
def open_webpage(request_id):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto('file:///home/billion/PycharmProjects/Movie_editor/index.html')

        page.wait_for_selector("video[src='http://upload.wikimedia.org/wikipedia/commons/7/79"
                               "/Big_Buck_Bunny_small.ogv']")

        page.evaluate('document.querySelector("video").play()')

        # while not page.evaluate(' document.querySelector("video").ended'):
        #     continue

        # for downloading video
        # import urllib.request
        # video = page.query_selector('video')
        # video_url = video.get_property('src')
        # urllib.request.urlretrieve(str(video_url), 'videoname.mp4')
        browser.close()


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


@celery_app.task()
def get_json_from_db(req_id: int):
    try:
        result = session.query(video_metadata).get(req_id)
        return result
    except Exception as e:
        HTTPException(status_code=501, detail='error in fetching details from database')
