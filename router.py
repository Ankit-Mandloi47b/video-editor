from fastapi import FastAPI
import requests
import json

app = FastAPI()


@app.get("/metadata/{request_id}")
def get_data(data: json):
    pass
    # requests.post()
