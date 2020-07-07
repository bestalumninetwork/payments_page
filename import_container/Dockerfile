FROM python:3-slim

RUN pip install --no-cache-dir stripe

COPY stripe_webdata.py stripe_webdata.py

CMD [ "python", "./stripe_webdata.py" ]
