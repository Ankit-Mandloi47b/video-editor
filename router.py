from celery import chain
from fastapi import FastAPI, HTTPException, status
from tasks import add_metadata, open_webpage

app = FastAPI()


@app.post("/metadata", status_code=status.HTTP_200_OK)
def get_data(data: dict):
    try:
        req_id = add_metadata(data)
        chain(open_webpage.s()).apply_async()
        return {'message': "Database updated ",
                'request id': req_id}
    except HTTPException:
        HTTPException(status_code=501, detail='error in updating metadata on postgres')
