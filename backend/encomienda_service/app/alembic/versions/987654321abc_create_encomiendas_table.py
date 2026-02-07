"""create_encomiendas_table

Revision ID: 987654321abc
Revises: 
Create Date: 2024-02-05 21:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '987654321abc'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Tabla Encomiendas
    op.create_table('encomiendas',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('tracking_code', sa.String(), nullable=False),
        sa.Column('remitente_nombre', sa.String(), nullable=False),
        sa.Column('destinatario_nombre', sa.String(), nullable=False),
        sa.Column('destino_direccion', sa.String(), nullable=False),
        sa.Column('peso', sa.Float(), nullable=False),
        sa.Column('tipo', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('subtotal', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('tracking_code')
    )

def downgrade() -> None:
    op.drop_table('encomiendas')