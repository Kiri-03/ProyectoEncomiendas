"""seed routes

Revision ID: 002
Revises: 001
Create Date: 2024-02-08 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import uuid

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '1234567890ab'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Generar IDs fijos para las rutas
    route_uio_gye = str(uuid.uuid4())
    route_gye_uio = str(uuid.uuid4())
    route_gye_cue = str(uuid.uuid4())
    route_uio_man = str(uuid.uuid4())

    # Insertar Rutas
    op.execute(f"""
        INSERT INTO rutas (id, origen, destino, duracion, precio_base, estado) VALUES
        ('{route_uio_gye}', 'Quito', 'Guayaquil', '8h', 12.00, 'activa'),
        ('{route_gye_uio}', 'Guayaquil', 'Quito', '8h', 12.00, 'activa'),
        ('{route_gye_cue}', 'Guayaquil', 'Cuenca', '4h', 8.00, 'activa'),
        ('{route_uio_man}', 'Quito', 'Manta', '7h', 10.00, 'activa')
    """)

    # Insertar Checkpoints - Quito a Guayaquil
    op.execute(f"""
        INSERT INTO checkpoints (id, ruta_id, nombre, orden, lat, lng) VALUES
        ('{str(uuid.uuid4())}', '{route_uio_gye}', 'Peaje Alóag', 1, -0.423, -78.567),
        ('{str(uuid.uuid4())}', '{route_uio_gye}', 'Santo Domingo', 2, -0.253, -79.175),
        ('{str(uuid.uuid4())}', '{route_uio_gye}', 'Quevedo', 3, -1.023, -79.462),
        ('{str(uuid.uuid4())}', '{route_uio_gye}', 'Babahoyo', 4, -1.801, -79.534),
        ('{str(uuid.uuid4())}', '{route_uio_gye}', 'Durán', 5, -2.167, -79.833)
    """)

    # Insertar Checkpoints - Guayaquil a Quito
    op.execute(f"""
        INSERT INTO checkpoints (id, ruta_id, nombre, orden, lat, lng) VALUES
        ('{str(uuid.uuid4())}', '{route_gye_uio}', 'Durán', 1, -2.167, -79.833),
        ('{str(uuid.uuid4())}', '{route_gye_uio}', 'Babahoyo', 2, -1.801, -79.534),
        ('{str(uuid.uuid4())}', '{route_gye_uio}', 'Quevedo', 3, -1.023, -79.462),
        ('{str(uuid.uuid4())}', '{route_gye_uio}', 'Santo Domingo', 4, -0.253, -79.175),
        ('{str(uuid.uuid4())}', '{route_gye_uio}', 'Peaje Alóag', 5, -0.423, -78.567)
    """)

    # Insertar Checkpoints - Guayaquil a Cuenca
    op.execute(f"""
        INSERT INTO checkpoints (id, ruta_id, nombre, orden, lat, lng) VALUES
        ('{str(uuid.uuid4())}', '{route_gye_cue}', 'Puerto Inca', 1, -2.567, -79.550),
        ('{str(uuid.uuid4())}', '{route_gye_cue}', 'Molleturo', 2, -2.767, -79.417),
        ('{str(uuid.uuid4())}', '{route_gye_cue}', 'Parque Nacional Cajas', 3, -2.833, -79.217)
    """)

    # Insertar Checkpoints - Quito a Manta
    op.execute(f"""
        INSERT INTO checkpoints (id, ruta_id, nombre, orden, lat, lng) VALUES
        ('{str(uuid.uuid4())}', '{route_uio_man}', 'Calacalí', 1, -0.001, -78.513),
        ('{str(uuid.uuid4())}', '{route_uio_man}', 'Los Bancos', 2, 0.023, -78.897),
        ('{str(uuid.uuid4())}', '{route_uio_man}', 'La Concordia', 3, 0.012, -79.395),
        ('{str(uuid.uuid4())}', '{route_uio_man}', 'El Carmen', 4, -0.271, -79.463),
        ('{str(uuid.uuid4())}', '{route_uio_man}', 'Chone', 5, -0.696, -80.093),
        ('{str(uuid.uuid4())}', '{route_uio_man}', 'Rocafuerte', 6, -0.923, -80.451)
    """)

def downgrade() -> None:
    op.execute("DELETE FROM checkpoints")
    op.execute("DELETE FROM rutas")