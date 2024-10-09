// // import { Sequelize } from 'sequelize';
// // // Option 1: Passing a connection URI

// import { Sequelize, DataTypes } from 'sequelize';

// const sequelize = new Sequelize('postgresql://postgres:VcyPseEmuzrcyzLPjcFEPMOMULTduaUz@junction.proxy.rlwy.net:53873/railway') // Example for postgres

// const Network = sequelize.define('network', {
//     id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
//     firstName: { type: DataTypes.STRING(100),   allowNull: false },
//     lastName: { type: DataTypes.STRING(100),    allowNull: false },
//     email: { type: DataTypes.STRING(100),       allowNull: false, unique: true},
//     phone: { type: DataTypes.STRING(10),        allowNull: true  },
//     job: { type: DataTypes.STRING(100),         allowNull: true  },
//     education: { type: DataTypes.STRING(100),   allowNull: true  },
//     dateOfBirth: { type: DataTypes.DATEONLY,    allowNull: true  },
//     invitedBy: { type: DataTypes.UUID,          allowNull: true  },

//     }, { tableName: 'network', timestamps: true,}
// );

// module.exports = Network;

// // async function conectar(){
// //     try {
// //         await sequelize.authenticate();
// //         console.log('Connection has been established successfully.');
// //       } catch (error) {
// //         console.error('Unable to connect to the database:', error);
// //     }
// // }

// export async function GET() {
//     sequelize.sync()
//     .then(() => Response.json({ message: 'Database seeded successfully' }))
//     .catch(error => Response.json({ error }, { status: 500 }));    
//   }





// // /lib/db.js
// import {Sequelize} from 'sequelize';

// // Configuración de la conexión a la base de datos PostgreSQL
// const sequelize = new Sequelize('mysql://root:WsVWsLFweZHcIAMsIiLdqCkWOsWqaAzn@autorack.proxy.rlwy.net:16773/railway');

// // Definición del modelo 'Network'


// // Sincronización con la base de datos
// const connectToDatabase = async () => {
//   try {
//     await sequelize.authenticate();
//     await sequelize.sync(); // Sincroniza el modelo con la base de datos
//     console.log('Connection has been established and models are synced.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     throw error;
//   }
// };

// // export default Network;

// export async function GET() {
//   try {
//     await connectToDatabase();

//     // Puedes realizar operaciones con el modelo Network aquí si es necesario
//     return new Response(JSON.stringify({ message: 'Database synced successfully' }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'error.message '}), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }


// Get the client

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usa DATABASE_URL en lugar de PGHOST
  ssl: {
    rejectUnauthorized: false, // Necesario si Railway requiere SSL
  },
});

const queryDatabase = async (query: string, params = []) => {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query(query, params);
    return res.rows; // Devuelve las filas del resultado
  } catch (err) {
    console.error("Error al ejecutar la consulta", err);
    throw err; // Lanza el error para que pueda ser manejado por la función llamadora
  } finally {
    if (client) {
      client.release(); // Libera la conexión
    }
  }
};



export async function GET() {
  try {
    const db = await queryDatabase(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
      CREATE TABLE if not exists peopleNetwork (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(10),
        job VARCHAR(100),
        education VARCHAR(100),
        dateOfBirth DATE,
        invitedBy UUID,
        createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    
      console.log(db); // results contains rows returned by server
      return Response.json({ message: 'Database seeded successfully' });
    } catch (err) {
      console.log();
      return Response.json({ err }, { status: 500 });
    }
}