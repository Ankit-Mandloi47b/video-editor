FROM python:3.8
WORKDIR /app
COPY . .
COPY requirements.txt .
RUN python3 -m pip install --upgrade pip
RUN pip install -r requirements.txt
CMD celery -A tasks worker -Q postgres_connection,headless_browser -l info