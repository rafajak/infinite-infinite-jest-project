import requests
from flask_app import app #, db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model import Sequence
#db.create_all()
print(app.config["DATA_URL"])
uploads_json = dict(requests.get(app.config["DATA_URL"]).json())

uploads = []
for k in uploads_json:
    row = {}
    row['id'] = k
    row['content'] = uploads_json[k]
    uploads.append(row)

engine = create_engine(
    app.config["SQLALCHEMY_DATABASE_URI"],
    isolation_level="READ UNCOMMITTED", pool_recycle=280, echo=True)

Session = sessionmaker(bind=engine)
session = Session()

for upload in uploads:
    row = Sequence(**upload)
    session.add(row)
session.commit()
session.close()
