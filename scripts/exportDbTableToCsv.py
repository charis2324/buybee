import sqlite3
import pandas as pd

conn = sqlite3.connect(r"app\data\buybee.db")
cursor = conn.cursor()
clients = pd.read_sql("SELECT * FROM side_categories", conn)
clients.to_csv("side_categories.csv", index=False)
