from celery import chain
from fastapi import FastAPI, HTTPException, status
from tasks import add_metadata, open_webpage

app = FastAPI()


@app.post("/metadata", status_code=status.HTTP_200_OK)
def get_data(data: dict):
    try:
        res = chain(add_metadata.s(data), open_webpage.s()).apply_async()
        return {'data updated': res.parent.get()}
    except HTTPException:
        HTTPException(status_code=501, detail='error in updating metadata on postgres')
