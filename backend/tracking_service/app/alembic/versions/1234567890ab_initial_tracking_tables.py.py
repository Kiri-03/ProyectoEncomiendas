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
    # Rutas
    op.create_table('rutas',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('origen', sa.String(length=100), nullable=False),
        sa.Column('destino', sa.String(length=100), nullable=False),
        sa.Column('duracion', sa.String(length=50), nullable=True),
        sa.Column('precio_base', sa.Float(), nullable=True),
        sa.Column('estado', sa.String(length=20), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    # Checkpoints
    op.create_table('checkpoints',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('ruta_id', sa.String(length=36), nullable=True),
        sa.Column('nombre', sa.String(length=100), nullable=False),
        sa.Column('orden', sa.Integer(), nullable=True),
        sa.Column('lat', sa.Float(), nullable=True),
        sa.Column('lng', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['ruta_id'], ['rutas.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    # Tracking Events (si no existía)
    op.create_table('tracking_events',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('tracking_code', sa.String(length=50), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('location', sa.String(length=100), nullable=True),
        sa.Column('message', sa.String(length=255), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tracking_events_tracking_code'), 'tracking_events', ['tracking_code'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_tracking_events_tracking_code'), table_name='tracking_events')
    op.drop_table('tracking_events')
    op.drop_table('checkpoints')
    op.drop_table('rutas')