from sqlalchemy import Column, Integer, DateTime, JSON, ARRAY, String, BOOLEAN

from Connections.postgres_connection import base, engine


class video_metadata(base):
    __tablename__ = "video_metadata"
    id = Column(Integer, primary_key=True)
    metadata_info = Column(ARRAY(JSON), nullable=False)
    video_path = Column(String, nullable=True)
    bucket_name = Column(String, nullable=True)
    status = Column(String, nullable=True)


base.metadata.create_all(engine)
