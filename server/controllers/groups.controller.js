const dbconnection = require("../dbconnection");

exports.getAllGroups = async (req, res) => {
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute("SELECT * FROM grupos");
    //console.log(results);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los grupos");
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.getGroupById = async (req, res) => {
  const id = req.params.idgrupo;
  let connection;
  try {
    connection = await dbconnection.getConnection();
    const [results] = await connection.execute(
      "SELECT * FROM grupos WHERE idgrupo = ?",
      [id]
    );
    if (results.length === 0) {
      return res.status(404).send(`Grupo con id ${id} no encontrado`);
    }
    res.json(results[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al obtener el grupo con id ${id}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
