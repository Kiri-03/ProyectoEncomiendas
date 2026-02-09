"""seed drivers

Revision ID: 002
Revises: 001
Create Date: 2024-02-09 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import uuid
from passlib.context import CryptContext

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '570dd448462a' # IMPORTANTE: Verifica que este ID coincida con tu migración anterior de auth
branch_labels = None
depends_on = None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def upgrade() -> None:
    # Hash bcrypt para la contraseña "123456"
    # Generamos el hash real usando passlib
    hashed_pwd = pwd_context.hash("123456")
    
    # Insertar Conductores que coinciden con los buses simulados
    # Carlos Ruiz, Luis Gomez, Ana Torres, Pedro Diaz
    op.execute(f"""
        INSERT INTO "user" (id, email, hashed_password, is_active, is_superuser, is_verified, nombre, apellido, rol, telefono) VALUES
        ('{str(uuid.uuid4())}', 'carlos@translog.com', '{hashed_pwd}', true, false, true, 'Carlos', 'Ruiz', 'conductor', '0991111111'),
        ('{str(uuid.uuid4())}', 'luis@translog.com', '{hashed_pwd}', true, false, true, 'Luis', 'Gomez', 'conductor', '0992222222'),
        ('{str(uuid.uuid4())}', 'ana@translog.com', '{hashed_pwd}', true, false, true, 'Ana', 'Torres', 'conductor', '0993333333'),
        ('{str(uuid.uuid4())}', 'pedro@translog.com', '{hashed_pwd}', true, false, true, 'Pedro', 'Diaz', 'conductor', '0994444444')
    """)

def downgrade() -> None:
    op.execute("DELETE FROM \"user\" WHERE email IN ('carlos@translog.com', 'luis@translog.com', 'ana@translog.com', 'pedro@translog.com')")