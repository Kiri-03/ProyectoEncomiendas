"""seed_initial_users

Revision ID: 570dd448462a
Revises: 
Create Date: 2026-02-04 23:40:42.824350

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from passlib.context import CryptContext
import uuid


# revision identifiers, used by Alembic.
revision: str = '570dd448462a'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def upgrade() -> None:
    # 1. Crear la tabla 'user' (Esquema)
    op.create_table('user',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('email', sa.String(length=320), nullable=False),
        sa.Column('hashed_password', sa.String(length=1024), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('is_superuser', sa.Boolean(), nullable=False),
        sa.Column('is_verified', sa.Boolean(), nullable=False),
        sa.Column('nombre', sa.String(), nullable=True),
        sa.Column('apellido', sa.String(), nullable=True),
        sa.Column('rol', sa.String(), nullable=True),
        sa.Column('telefono', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)

    # 2. Insertar usuarios iniciales (Seed)
    user_table = sa.table('user',
        sa.column('id', sa.UUID),
        sa.column('email', sa.String),
        sa.column('hashed_password', sa.String),
        sa.column('is_active', sa.Boolean),
        sa.column('is_superuser', sa.Boolean),
        sa.column('is_verified', sa.Boolean),
        sa.column('nombre', sa.String),
        sa.column('apellido', sa.String),
        sa.column('rol', sa.String),
        sa.column('telefono', sa.String)
    )

    op.bulk_insert(
        user_table,
        [
            {
                'id': uuid.uuid4(),
                'email': 'admindoc@translog.com',
                'hashed_password': get_password_hash('admin123'),
                'is_active': True,
                'is_superuser': True,
                'is_verified': True,
                'nombre': 'Admin',
                'apellido': 'Principal',
                'rol': 'administrador',
                'telefono': '0991234567'
            },
            {
                'id': uuid.uuid4(),
                'email': 'empleado@translog.com',
                'hashed_password': get_password_hash('user123'),
                'is_active': True,
                'is_superuser': False,
                'is_verified': True,
                'nombre': 'Juan',
                'apellido': 'Pérez',
                'rol': 'empleado',
                'telefono': '0987654321'
            }
        ]
    )

def downgrade() -> None:
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')