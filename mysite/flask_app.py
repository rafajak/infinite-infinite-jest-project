
from sqlalchemy.orm import sessionmaker
from flask import Flask, render_template, request, url_for
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
import os
from config import Config

app = Flask(__name__, template_folder=os.path.abspath("/home/infiniteinfinitejest/mysite/templates/"),
            static_folder=os.path.abspath("/home/infiniteinfinitejest/mysite/templates/"))
app.config.from_object(Config)
db = SQLAlchemy(app)

cors = CORS(app, origins="*")


@app.route("/", methods=["GET", "POST"])
def index():
    x = request.form.get('contents', 0)
    x = read_id_x(x)

    return render_template("main_page.html", comments=x, css="empty.css")


@app.route("/gallery", methods=["GET", "POST"])
@app.route("/gallery/", methods=["GET", "POST"])
def gallery():
    x = request.form.get('contents', 0)
    x = read_id_x(x)

    return render_template("main_page.html", comments=x, css="gallery.css")


@app.route("/generate", methods=["GET", "POST"])
@cross_origin()
def generate():

    if request.method == "GET":
        x = request.args['next_page']
        x = read_id_x(int(x)+1)

    return dict({'data': x})


from model import *
def read_id_x(x):
    len_of_table = Sequence.query \
        .filter() \
        .with_entities(Sequence.content) \
        .count()

    if x >= len_of_table:
        x = x - ((x//len_of_table) * len_of_table) + 2

    line = Sequence.query \
        .filter(Sequence.id == x) \
        .with_entities(Sequence.content) \
        .all() \

    return line
