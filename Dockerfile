# Base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt .

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libglib2.0-0 \
    libfontconfig1 \
    libfreetype6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxi6 \
    libxtst6 \
    libatk1.0-0 \
    libdbus-1-3 \
    libdbus-glib-1-2 \
    libasound2 \
    xvfb \
    xauth \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Playwright
RUN pip install playwright && \
    playwright install-deps

RUN playwright install
# Install Python dependencies
RUN pip install -r requirements.txt

# Copy your FastAPI code
COPY . .

# Expose the port
EXPOSE 8000

ENV DISPLAY=:99

CMD xvfb-run -s "-screen 0 1280x1024x24" uvicorn router:app --host 0.0.0.0 --port 8000
