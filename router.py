from celery import chain
from fastapi import FastAPI, HTTPException, status

from tasks import add_metadata, open_webpage, get_json_from_db

app = FastAPI()


@app.post("/metadata", status_code=status.HTTP_200_OK)
def get_data(data: dict):
    try:
        res = chain(add_metadata.s(data), open_webpage.s()).apply_async()
        return {'data updated': res.parent.get()}
    except HTTPException:
        HTTPException(status_code=501, detail='error in updating metadata on postgres')


@app.get("/json/{request_id}")
def get_json(request_id: int):
    return get_json_from_db(request_id)
