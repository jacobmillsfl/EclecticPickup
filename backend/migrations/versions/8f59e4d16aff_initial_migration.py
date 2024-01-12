"""Initial migration

Revision ID: 8f59e4d16aff
Revises: 
Create Date: 2024-01-09 12:00:11.614779

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8f59e4d16aff'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('bandimage',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('src', sa.String(length=256), nullable=False),
    sa.Column('description', sa.String(length=64), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bandmember',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=False),
    sa.Column('img_url', sa.String(length=256), nullable=True),
    sa.Column('text', sa.String(length=128), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bandvideo',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('src', sa.String(length=256), nullable=False),
    sa.Column('description', sa.String(length=64), nullable=True),
    sa.Column('youtube', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('changelog',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('description', sa.String(length=256), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('event',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.String(length=32), nullable=False),
    sa.Column('time', sa.String(length=32), nullable=False),
    sa.Column('venue', sa.String(length=256), nullable=False),
    sa.Column('address', sa.String(length=256), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('settings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=256), nullable=False),
    sa.Column('value', sa.String(length=256), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('sociallink',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('href_url', sa.String(length=256), nullable=True),
    sa.Column('img_url', sa.String(length=256), nullable=True),
    sa.Column('text', sa.String(length=64), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('song',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=128), nullable=False),
    sa.Column('artist', sa.String(length=128), nullable=True),
    sa.Column('album', sa.String(length=128), nullable=True),
    sa.Column('url', sa.String(length=256), nullable=True),
    sa.Column('art_url', sa.String(length=256), nullable=True),
    sa.Column('trackNumber', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=32), nullable=False),
    sa.Column('email', sa.String(length=256), nullable=False),
    sa.Column('password', sa.String(length=64), nullable=False),
    sa.Column('active', sa.Boolean(), nullable=True),
    sa.Column('scope', sa.String(length=32), nullable=True),
    sa.Column('about', sa.String(length=512), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    op.drop_table('song')
    op.drop_table('sociallink')
    op.drop_table('settings')
    op.drop_table('event')
    op.drop_table('changelog')
    op.drop_table('bandvideo')
    op.drop_table('bandmember')
    op.drop_table('bandimage')
    # ### end Alembic commands ###
