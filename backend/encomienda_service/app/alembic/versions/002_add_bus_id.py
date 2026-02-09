"""add bus_id to encomiendas

Revision ID: 002
Revises: 001
Create Date: 2024-02-09 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '987654321abc' # Asegúrate que coincida con tu migración anterior
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column('encomiendas', sa.Column('bus_id', sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column('encomiendas', 'bus_id')