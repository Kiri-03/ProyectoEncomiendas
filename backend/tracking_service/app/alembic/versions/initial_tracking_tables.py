"""initial_tracking_tables

Revision ID: 1234567890ab
Revises: 
Create Date: 2024-02-05 22:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1234567890ab'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Tabla Rutas
    op.create_table('rutas',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('origen', sa.String(), nullable=False),
        sa.Column('destino', sa.String(), nullable=False),
        sa.Column('duracion', sa.String(), nullable=False),
        sa.Column('precio_base', sa.Float(), nullable=False),
        sa.Column('estado', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Tabla Tracking Events
    op.create_table('tracking_events',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('tracking_code', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('message', sa.String(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tracking_events_tracking_code'), 'tracking_events', ['tracking_code'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_tracking_events_tracking_code'), table_name='tracking_events')
    op.drop_table('tracking_events')
    op.drop_table('rutas')