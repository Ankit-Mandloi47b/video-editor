import logging

logging.basicConfig(filename="mylog.log", filemode="w", format="%(name)s %(asctime)s-->%(message)s %(lineno)s")
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)