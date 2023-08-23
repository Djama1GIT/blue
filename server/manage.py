import psycopg2

from app.config import DATABASE_URL


def add_initial_data(connection):
    try:
        cursor = connection.cursor()
        categories_list = [
            {
                "id": 1001,
                "name": "Test Category"
            },
        ]
        for category_item in categories_list:
            cursor.execute(
                "INSERT INTO categories (id, name) VALUES (%s, %s)",
                (category_item["id"], category_item["name"])
            )
        connection.commit()
    except Exception as exc:
        connection.rollback()
        print("[Add initial data]: Failed to add initial data")
        print(exc)
    finally:
        cursor.close()
        connection.close()


if __name__ == '__main__':
    connection = psycopg2.connect(DATABASE_URL)
    add_initial_data(connection)
