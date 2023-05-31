from datetime import datetime
from time import sleep

from fastapi import HTTPException
from playwright.sync_api import sync_playwright

from Connections.postgres_connection import session
from logs import logger
from schemas import video_metadata


def add_metadata(data: dict):
    try:
        metadata_object = video_metadata(id=5, metadata_info=data, uploaded_time=datetime.now())
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
        # video_element = page.wait_for_selector('video')
        # while not page.evaluate(' document.querySelector("video").ended'):
        #     continue
        sleep(10)
        browser.close()


def get_json_from_db(req_id):
    try:
        result = session.query(video_metadata).get(req_id)
        return result.metadata_info
    except Exception as e:
        logger.error(f'error in fetching json from database {e}')
        raise HTTPException(status_code=502, detail='error in fetching json from database')
