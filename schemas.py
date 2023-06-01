from sqlalchemy import Column, Integer, DateTime, JSON, ARRAY

from Connections.postgres_connection import base, engine


class video_metadata(base):
    __tablename__ = "video_metadata"
    id = Column(Integer, primary_key=True)
    metadata_info = Column(ARRAY(JSON), nullable=False)
    uploaded_time = Column(DateTime, nullable=False)
    edited_time = Column(DateTime, nullable=True)


base.metadata.create_all(engine)
