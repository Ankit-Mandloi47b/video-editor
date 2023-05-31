from fastapi import FastAPI, HTTPException, status, BackgroundTasks


from service import add_metadata, open_webpage, get_json_from_db

app = FastAPI()


@app.post("/metadata", status_code=status.HTTP_200_OK)
def get_data(data: dict, background_tasks: BackgroundTasks):
    try:
        req_id = add_metadata(data)
        background_tasks.add_task(open_webpage, req_id)
        return {'request_id': req_id}
    except HTTPException:
<<<<<<< HEAD
        raise HTTPException(status_code=502, detail='error in adding metadata in database')
=======
        raise HTTPException(status_code=502, detail=f'error in updating metadata on database {e}')
>>>>>>> 8247d720ad40e6e7654427f64e0670737bd2dd2c


@app.get("/json/{request_id}")
def get_json(request_id: int):
    try:
        return get_json_from_db(request_id)
<<<<<<< HEAD
    except HTTPException:
        raise HTTPException(status_code=404)
=======
    except Exception:
        raise HTTPException(status_code=502, detail='error in fetching json from database')
>>>>>>> 8247d720ad40e6e7654427f64e0670737bd2dd2c


@app.post("/video/{request_id}")
def save_video(request_id):
    pass
