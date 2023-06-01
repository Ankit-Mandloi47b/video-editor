import io
from io import BytesIO
from typing import List
from fastapi import FastAPI, HTTPException, status, BackgroundTasks, UploadFile, Form, File
import env
from Connections.minio_connection import minio_client
from service import add_metadata, open_webpage, get_json_from_db, add_video, update_database
from fastapi.middleware.cors import CORSMiddleware
import magic

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/metadata", status_code=status.HTTP_200_OK)
def get_data(data: List, background_tasks: BackgroundTasks):
    try:
        req_id = add_metadata(data)
        background_tasks.add_task(open_webpage, req_id)
        return {'request_id': req_id}
    except HTTPException:
        raise HTTPException(status_code=502, detail='error in adding metadata in database')


@app.get("/metadata/{request_id}")
def get_json(request_id: int):
    try:
        return get_json_from_db(request_id)

    except HTTPException:
        raise HTTPException(status_code=404)


@app.post("/video/{req_id}")
def save_video(req_id: int, video_file: bytes = File(...)):

    add_video(req_id, video_file)
    # update_database(req_id)

# @app.post("/video/{request_id}")
# def save_video(request_id: int, video_file: UploadFile = Form(...)):
#     try:
#         print(video_file.content_type)
#         add_video(request_id, video_file)
#         # update_database(request_id)
#     except Exception as e:
#         raise HTTPException(status_code=501, detail=f'error in minio{e}')
