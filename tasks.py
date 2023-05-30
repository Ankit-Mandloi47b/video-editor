from Connections.postgres_connection import session, base
from schemas import video_metadata
from datetime import datetime
from fastapi import HTTPException
from Connections.celery_connection import celery_app


# from playwright.async_api import async_playwright

@celery_app.task(queue='postgres_connection')
def add_metadata(data: dict):
    try:
        metadata_object = video_metadata(metadata_info=data, uploaded_time=datetime.now())
        session.add(metadata_object)
        session.commit()

    except ConnectionError:
        raise HTTPException(status_code=501, detail='error in updating metadata on postgres')

# def open_webpage():
#     async def take_screenshots():
#         async with async_playwright() as p:
#             driver = await p.chromium.launch(headless=False, args=['--disable-gpu'])
#             page = await driver.new_page()
#
#             # Reduce the viewport size to speed up rendering
#             await page.set_viewport_size({'width': 800, 'height': 600})
#
#             await page.goto(
#                 "file:///home/billion/PycharmProjects/Movie_editor/index.html")
#
#             await page.wait_for_selector("video[src='http://upload.wikimedia.org/wikipedia/commons/7/79"
#                                          "/Big_Buck_Bunny_small.ogv']")
#
#             # await page.evaluate('document.querySelector("video").play()')
#
#             # to download the video
#             import urllib.request
#             video = await page.query_selector('video')
#             video_url = await video.get_property('src')
#             urllib.request.urlretrieve(str(video_url), 'videoname.mp4')
