const Job = require("./../models/job.model");

const create = (req, res, next) => {
  const handleError = (err) => {
    console.log(err);
  };
  // This would create new entry into MongoDB every time the POST is called
  // hence the reason it's commented out, but it works.

  // const job1 = new Job({
  //   startingDate: "1998-12-03",
  //   status: "done",
  //   algorithmId: 221,
  //   datasetId: 335,
  //   userId: "ABC123",
  // });
  // job1.save(function (err, job1) {
  //   console.log(job1);
  //   if (err) return handleError(err);
  // });

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
