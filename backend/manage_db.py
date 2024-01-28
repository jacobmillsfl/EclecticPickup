from datetime import datetime
import sqlite3
import argparse
from Utils.CryptoManager import CryptoManager


#########################
# Changelog
#########################
class ChangelogEntry:
    def __init__(self, name, routine, description):
        self.name = name
        self.routine = routine
        self.description = description

class ChangelogRunner:
    def __init__(self, db_file, username, email, password):

        self.conn = sqlite3.connect(db_file)
        self.username = username
        self.email = email
        self.password = password
        self.changelog_entries = [
            ChangelogEntry("INSERT_ADMIN_USER", self.insert_admin_user, "Creates an admin user"),
            ChangelogEntry("INITIAL_EVENTS", self.insert_events, "Creates the initial events"),
            ChangelogEntry("INITIAL_SETTINGS", self.insert_settings, "Creates the initial settings"),
        ]

    def run(self):
        for entry in self.changelog_entries:
            if not self.change_exists(entry.name):
                entry.routine()
                self.insert_changelog(entry.name, entry.description)
                print(f"Change complete: {entry.name}")
            else:
                print(f"Skipping existing change: {entry.name}")

    def change_exists(self, name):
        """ Check if a changelog exist """
        sql = ''' SELECT COUNT(*) FROM changelog WHERE name = ? '''
        cur = self.conn.cursor()
        cur.execute(sql, (name,))
        count = cur.fetchone()[0]
        return count > 0

    def insert_changelog(self, name, description):
        """ Insert a change event into the changelog"""
        cursor = self.conn.cursor()
        cursor.execute(
            'INSERT INTO changelog (name, description) VALUES (?, ?)',
            (name, description)
        )
        self.conn.commit()

    def insert_admin_user(self):
        hashed_password = CryptoManager.hash_password(self.password)
        active = True
        scope = "admin"
        description = "Automatically created administrative user"
        created_date = datetime.utcnow()
        user_data = (self.username, self.email, hashed_password, active, scope, description, created_date)
        sql = '''   INSERT INTO user (username, email, password, active, scope, about, created_date)
                    VALUES (?, ?, ?, ?, ?, ?, ?) '''
        cur = self.conn.cursor()
        cur.execute(sql, user_data)
        self.conn.commit()
        return cur.lastrowid
    
    def insert_events(self):
        global events_to_insert
        cursor = self.conn.cursor()
        for event in events_to_insert:
            date = event['date']
            time = event['time']
            venue = event['venue']
            address = event['address']
            created_by_user_id = 1
            created_date = datetime.utcnow()

            cursor.execute(
                'INSERT INTO event (date, time, venue, address, created_by_user_id, created_date) VALUES (?, ?, ?, ?, ?, ?)',
                (date, time, venue, address, created_by_user_id, created_date)
            )
        self.conn.commit()

    def insert_settings(self):
        global settings_to_insert
        cursor = self.conn.cursor()
        for event in settings_to_insert:
            name = event['name']
            value = event['value']
            created_by_user_id = 1
            created_date = datetime.utcnow()

            cursor.execute(
                'INSERT INTO settings (name, value, created_by_user_id, created_date) VALUES (?, ?, ?, ?)',
                (name, value, created_by_user_id, created_date)
            )
        self.conn.commit()

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
    },
    {
        'name': "BAND_MOTTO",
        'value': "Dedication To The Groove"
    }
]


#########################
# Custom Args
#########################

class StoreUserDetails(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        if len(values) != 3:
            parser.error(f"{option_string} requires exactly three values: Username, Password, Email")
        else:
            setattr(namespace, self.dest, values)

#########################
# Main
#########################


def main():
    parser = argparse.ArgumentParser(description='Manage Database Script')
    parser.add_argument("--database", type=str, help='The location of the database file')
    parser.add_argument('--user', nargs=3, action=StoreUserDetails, required=True, metavar=('Username', 'Email', 'Password'), help='Create admin user with provided username, email, and password')
    args = parser.parse_args()

    database = args.database
    username = args.user[0]
    email = args.user[1]
    password = args.user[2]

    runner = ChangelogRunner(database, username, email, password)
    runner.run()

if __name__ == '__main__':
    main()
