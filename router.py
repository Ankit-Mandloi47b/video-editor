from fastapi import FastAPI, HTTPException, status, BackgroundTasks
from tasks import add_metadata
from celery import chain
from tasks import add_metadata
app = FastAPI()


@app.post("/metadata", status_code=status.HTTP_200_OK)
def get_data(data: dict):
    try:
        result = chain(add_metadata.s(data)).apply_async()
        print(result)
        return {'message': "successfully updated metadata on postgres"}
    except HTTPException:
        HTTPException(status_code=501, detail='error in updating metadata on postgres')
