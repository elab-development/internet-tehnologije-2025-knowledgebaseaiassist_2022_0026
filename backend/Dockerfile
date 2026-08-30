FROM python:3.13-slim

WORKDIR /app 

# mora jedna linija da bi se sve desavalo u jednom docker sloju
RUN apt-get update \
    && apt-get install -y build-essential pkg-config \
    && rm -rf /var/lib/apt/lists/*

    # instaliranje requirements pre pokretanja
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt 

COPY . . 
#kopira backend u /app

EXPOSE 8000

CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000