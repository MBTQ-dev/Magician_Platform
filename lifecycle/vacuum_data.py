# lifecycle/vacuum_data.py
import pandas as pd
import psycopg2

def fetch_data():
    conn = psycopg2.connect(
        host="127.0.0.1",
        user="your_user",
        password="your_password",
        dbname="your_database",
        port=5432
    )

    query = "SELECT * FROM users;"
    df = pd.read_sql(query, conn)
    conn.close()
    return df

if __name__ == "__main__":
    df = fetch_data()
    df.to_csv("resources/data/raw/users.csv", index=False)
    print("Vacuum complete.")
