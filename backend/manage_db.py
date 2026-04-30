from datetime import datetime
import argparse
import sqlite3

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
        # Match what users type at /login (no accidental leading/trailing space from .env).
        self.username = (username or "").strip()
        self.email = (email or "").strip()
        self.password = (password or "").strip()
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
        """
        Idempotent for production deploys: if this username or email already exists
        (e.g. admin was created on a prior deploy), skip insert. Changelog is still
        recorded afterward by run(), so we do not retry every boot.
        """
        cur = self.conn.cursor()
        cur.execute(
            "SELECT COUNT(*) FROM user WHERE username = ? OR email = ?",
            (self.username, self.email),
        )
        if cur.fetchone()[0] > 0:
            print(
                "INSERT_ADMIN_USER: user already exists for this username or email; "
                "skipping INSERT — the password in the DB is unchanged (ADMIN_PASSWORD from env is NOT applied). "
                "Use --diagnose-login USER PASS to verify the stored hash, or --set-password to fix."
            )
            return

        hashed_password = CryptoManager.hash_password(self.password)
        active = True
        scope = "admin"
        description = "Automatically created administrative user"
        created_date = datetime.utcnow()
        user_data = (self.username, self.email, hashed_password, active, scope, description, created_date)
        sql = """INSERT INTO user (username, email, password, active, scope, about, created_date)
                 VALUES (?, ?, ?, ?, ?, ?, ?)"""
        try:
            cur.execute(sql, user_data)
            self.conn.commit()
            return cur.lastrowid
        except sqlite3.IntegrityError:
            self.conn.rollback()
            print(
                "INSERT_ADMIN_USER: insert skipped due to DB constraint "
                "(user likely created concurrently); safe to continue."
            )
            return None
    
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
# Password maintenance
#########################


def diagnose_login(db_file: str, username: str, plaintext: str) -> None:
    """
    Show whether the DB row matches the given password (same bcrypt check as /login).
    Does not print the full hash.
    """
    conn = sqlite3.connect(db_file)
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT username, email, password FROM user WHERE username = ?",
            (username,),
        )
        row = cur.fetchone()
        if not row:
            cur.execute("SELECT username FROM user")
            names = [r[0] for r in cur.fetchall()]
            print(f"No user with username={username!r} (exact match). Usernames in DB: {names}")
            return
        db_user, email, stored = row
        print(f"Row found: username={db_user!r}, email={email!r}")
        if not stored:
            print("Stored password field is empty — login will fail.")
            return
        slen = len(stored)
        prefix = stored[:7]
        print(f"Stored password field: length={slen}, prefix={prefix!r} (bcrypt hashes are usually 60 chars, prefix like '$2b$12$')")
        if not (
            stored.startswith("$2a$")
            or stored.startswith("$2b$")
            or stored.startswith("$2y$")
        ):
            print(
                "WARNING: stored value does not look like bcrypt. "
                "CryptoManager only verifies bcrypt; legacy schemes will always FAIL."
            )
        ok = CryptoManager.check_password(plaintext, stored)
        print(f"bcrypt.checkpw (same as API /login): {'MATCH' if ok else 'NO MATCH'}")
        if not ok:
            # Same check with stripped plaintext (common .env / copy-paste issue).
            stripped = plaintext.strip()
            if stripped != plaintext:
                ok2 = CryptoManager.check_password(stripped, stored)
                print(
                    f"Retry with .strip() on plaintext: {'MATCH' if ok2 else 'NO MATCH'} "
                    f"(if this matches, your env or form had leading/trailing spaces)"
                )
            print(
                "If NO MATCH but you are sure the password was 'password' at creation time, "
                "the admin row may have been created earlier with a different hash "
                "(bootstrap skips INSERT when the user already exists, but still records the changelog)."
            )
    finally:
        conn.close()


def update_user_password(db_file: str, username: str, plaintext: str) -> None:
    """Overwrite bcrypt hash for an existing user (bootstrap skips insert when user already exists)."""
    hashed = CryptoManager.hash_password(plaintext.strip())
    conn = sqlite3.connect(db_file)
    try:
        cur = conn.cursor()
        cur.execute(
            "UPDATE user SET password = ? WHERE username = ?",
            (hashed, username),
        )
        if cur.rowcount == 0:
            raise SystemExit(f"No user updated: username {username!r} not found.")
        conn.commit()
    finally:
        conn.close()
    print(f"Password updated for user {username!r}.")


#########################
# Main
#########################


def main():
    parser = argparse.ArgumentParser(description="Manage Database Script")
    parser.add_argument(
        "--database",
        type=str,
        required=True,
        help="Path to SQLite database file (e.g. instance/database.db)",
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--user",
        nargs=3,
        action=StoreUserDetails,
        metavar=("Username", "Email", "Password"),
        help="Bootstrap: changelog + seed (skips admin insert if username/email already exist)",
    )
    group.add_argument(
        "--set-password",
        nargs=2,
        metavar=("USERNAME", "PLAINTEXT"),
        help="Set bcrypt password for an existing user (use when login fails after env/password changes)",
    )
    group.add_argument(
        "--diagnose-login",
        nargs=2,
        metavar=("USERNAME", "PLAINTEXT"),
        help="Print whether the DB bcrypt hash matches the plaintext (same as /login); use to debug 'Incorrect password'",
    )
    args = parser.parse_args()

    database = args.database
    if args.diagnose_login:
        u, p = args.diagnose_login
        diagnose_login(database, u, p)
        return
    if args.set_password:
        username, plaintext = args.set_password
        update_user_password(database, username, plaintext)
        return

    username = args.user[0]
    email = args.user[1]
    password = args.user[2]

    runner = ChangelogRunner(database, username, email, password)
    runner.run()

if __name__ == '__main__':
    main()
