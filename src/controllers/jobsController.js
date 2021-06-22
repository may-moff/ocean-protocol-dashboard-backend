const create = (req, res, next) => {
  console.log("Controller --> Create");
};
const show = (req, res, next) => {
  console.log("Controller --> Show");
};
const index = (req, res, next) => {
  console.log("Controller --> Show");
};
const update = (req, res, next) => {
  console.log("Controller --> Update");
};
const destroy = (req, res, next) => {
  console.log("Controller --> Destroy");
};

module.exports = {
  create,
  show,
  index,
  update,
  destroy,
};
