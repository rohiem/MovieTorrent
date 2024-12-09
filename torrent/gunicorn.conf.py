workers = 3
bind = '0.0.0.0:8000'
worker_class = 'sync'  # Or 'gevent', 'eventlet', etc.
timeout = 30
loglevel = 'info'