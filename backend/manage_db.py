import sqlite3
import argparse
from getpass import getpass
from Utils.CryptoManager import CryptoManager


#########################
# Data
#########################
events_to_insert = [
    {
        'date': '2023-09-23',
        'time': '2 - 4pm',
        'venue': 'Funkwerks Brewing',
        'address': '1900 E Lincoln Ave, Fort Collins',
    },
    {
        'date': '2023-10-14',
        'time': '4 - 6pm',
        'venue': 'Funkwerks Brewing',
        'address': '1900 E Lincoln Ave, Fort Collins',
    },
    {
        'date': '2023-04-22',
        'time': '12 - 4pm',
        'venue': 'Jessup Farm Barrel House',
        'address': '1921 Jessup Dr, Fort Collins, CO 80525',
    },
    {
        'date': '2023-08-25',
        'time': '6 - 8pm',
        'venue': 'Purpose Brewing and Cellars',
        'address': '4025 S Mason St unit c, Fort Collins, CO 80525',
    },
    {
        'date': '2023-06-23',
        'time': '6 - 8pm',
        'venue': 'Purpose Brewing and Cellars',
        'address': '4025 S Mason St unit c, Fort Collins, CO 80525',
    },
    {
        'date': '2023-07-22',
        'time': '1 - 4pm',
        'venue': 'Rock Bottom Resaurant & Brewery',
        'address': '6025 Sky Pond Dr, Loveland, CO 80538',
    },
    {
        'date': '2023-12-15',
        'time': '7 - 10pm',
        'venue': 'Black and Blues Music and Brews',
        'address': '423 N Cleveland Ave, Loveland, CO 80537',
    },
    {
        'date': '2024-01-12',
        'time': '7:30 - 10pm',
        'venue': 'Black and Blues Music and Brews',
        'address': '423 N Cleveland Ave, Loveland, CO 80537',
    },
    {
        'date': '2024-06-06',
        'time': '7 - 9pm',
        'venue': 'Black and Blues Music and Brews',
        'address': '423 N Cleveland Ave, Loveland, CO 80537',
    }
]

settings_to_insert = [
    {
        'name': "BAND_BIO",
        'value': "It's a jam, but this isn't your typical jam band. While the music is rooted in rock, blues, and funk, the shows are a jazz-like experience. The songs, whether original or covers, are always fresh reinterpretations, depending on the players and the chemistry that session.",
    }
]

#########################
# MISC
#########################

def create_connection(db_file):
    """ Create a database connection to the SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except sqlite3.Error as e:
        print(e)
    return conn

def prompt_for_credentials():
    admin_username = input("Enter admin username: ")
    admin_email = input("Enter admin email: ")
    admin_password = getpass(prompt="Enter admin password: ")
    return admin_username, admin_email, admin_password

#########################
# User Creation
#########################

class StoreUserDetails(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        if len(values) != 3:
            parser.error(f"{option_string} requires exactly three values: Username, Password, Email")
        else:
            setattr(namespace, self.dest, values)

def check_existing_user(conn, username):
    """ Check if a user with the given username already exists """
    sql = ''' SELECT COUNT(*) FROM user WHERE username = ? '''
    cur = conn.cursor()
    cur.execute(sql, (username,))
    count = cur.fetchone()[0]
    return count > 0

def insert_user(conn, user):
    """ Insert a new user into the user table if username doesn't exist """
    username = user[0]  # Assuming the username is the first element in the user tuple

    if check_existing_user(conn, username):
        print(f"User with username '{username}' already exists. Not inserting.")
        return None  # User already exists, return None or appropriate response
    else:
        sql = ''' INSERT INTO user (username, email, password, active, scope, about)
                  VALUES (?, ?, ?, ?, ?, ?) '''
        cur = conn.cursor()
        cur.execute(sql, user)
        conn.commit()
        return cur.lastrowid

def create_admin_user(conn, username, email, password, active, scope, description):
    hashed_password = CryptoManager.hash_password(password)
    user_data = (username, email, hashed_password, active, scope, description)
    user_id = insert_user(conn, user_data)
    if user_id:
        print("\nAdmin user added successfully")

#########################
# Event Creation
#########################

def check_existing_events(conn):
    """ Check if a user with the given username already exists """
    sql = ''' SELECT COUNT(*) FROM event '''
    cur = conn.cursor()
    cur.execute(sql)
    count = cur.fetchone()[0]
    return count > 0


def populate_events(conn, events_data):
    if check_existing_events(conn):
        print(f"Events already exist. Not inserting.")
    else:
        cursor = conn.cursor()
        for event in events_data:
            date = event['date']
            time = event['time']
            venue = event['venue']
            address = event['address']

            cursor.execute(
                'INSERT INTO event (date, time, venue, address) VALUES (?, ?, ?, ?)',
                (date, time, venue, address)
            )
        print("\nEvents added successfully")
        conn.commit()

#########################
# Settings
#########################

def check_existing_settings(conn):
    """ Check if a user with the given username already exists """
    sql = ''' SELECT COUNT(*) FROM settings '''
    cur = conn.cursor()
    cur.execute(sql)
    count = cur.fetchone()[0]
    return count > 0

def populate_settings(conn, settings_data):
    if check_existing_settings(conn):
        print(f"Settings already exist. Not inserting.")
    else:
        cursor = conn.cursor()
        for event in settings_data:
            name = event['name']
            value = event['value']

            cursor.execute(
                'INSERT INTO settings (name, value) VALUES (?, ?)',
                (name, value)
            )
        print("\nSettings added successfully")
        conn.commit()

#########################
# Menu
#########################

def menu(conn):
    while True:
        print("""
-----------------------------
Manage Database Script
-----------------------------

Choose an option:
- [C]reate admin user
- Populate [E]vents
- Populate [S]ettings
- E[x]it
""")
        choice = input("Enter your choice: ").upper()
        if choice == 'C':
            admin_username, admin_email, admin_password = prompt_for_credentials()
            active = True
            scope = "admin"
            description = "Manually created administrative user"
            create_admin_user(conn, admin_username, admin_email, admin_password, active, scope, description)
        elif choice == 'E':
            global events_to_insert
            populate_events(conn, events_to_insert)
        elif choice == 'S':
            global settings_to_insert
            populate_settings(conn, settings_to_insert)
        elif choice == 'X':
            break
        else:
            print("Invalid choice. Please select a valid option.")

#########################
# Main
#########################

def main():
    parser = argparse.ArgumentParser(description='Manage Database Script')
    parser.add_argument('--user', nargs=3, action=StoreUserDetails, metavar=('Username', 'Password', 'Email'), help='Create admin user with provided username, password, and email')
    parser.add_argument('--events', action='store_true', help='Populate events')
    parser.add_argument('--settings', action='store_true', help='Populate settings')
    args = parser.parse_args()

    database = '/home/appuser/app/instance/database.db'
    conn = create_connection(database)
    if conn:
        if args.user:
            username = args.user[0]
            email = args.user[1]
            password = args.user[2]
            active = True
            scope = "admin"
            description = "Automatically created administrative user"
            create_admin_user(conn, username, email, password, active, scope, description)
        if args.events:
            global events_to_insert
            populate_events(conn, events_to_insert)
        if args.settings:
            global settings_to_insert
            populate_settings(conn, settings_to_insert)
        if not args.user and not args.events and not args.settings:
            menu(conn)
    else:
        print("Error! Cannot create the database connection.")

if __name__ == '__main__':
    main()
