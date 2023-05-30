from datetime import datetime

from fastapi import HTTPException
from playwright.sync_api import sync_playwright

from Connections.celery_connection import celery_app
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
        raise HTTPException(status_code=501, detail='error in updating metadata on postgres')


@celery_app.task(queue='headless_browser')
def open_webpage():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.wait_for_selector('video')
        page.goto('file:///home/billion/PycharmProjects/Movie_editor/index.html')

        # for downloading video
        # import urllib.request
        # video = page.query_selector('video')
        # video_url = video.get_property('src')
        # urllib.request.urlretrieve(str(video_url), 'videoname.mp4')
        browser.close()
