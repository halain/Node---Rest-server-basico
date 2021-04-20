const { request, response } = require("express");



const usersGet = (req = request, res = response) => {
    //query params api/usuarios?q=hello&nombre=paco&apikey=125478
    const {q, nombre, apikey} = req.query;

  res.json({
    message: "Get OK from controller",
    q,
    nombre,
    apikey
  });
};



const usersPut = (req = request, res = response) => {

    //parametro de segmento URL users/10
    const {id} = req.params;

  res.json({
    message: "Put OK from controller",
    id
  });
};


const usersPost = (req = request, res = response) => {
    /**
     * data de forms { name: "Fulano", edad: 15}
     *  const { name, edad} = body
     */
    const body = req.body;

  res.json({
    message: "Post OK from controller",
    body
  });

};


const usersDelete = (req = request, res = response) => {
  res.json({
    message: "Delete OK from controller",
  });
};




module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersDelete
};
