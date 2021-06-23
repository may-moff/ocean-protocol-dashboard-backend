const Job = require("./../models/job.model");

const create = async (req, res, next) => {
  console.log(req.body);

  try {
    const job = new Job({ ...req.body });
    await job.save();
    res.send(job);
    res.status(201);
  } catch {
    res.status(403);
    res.send({ error: "Something went wrong, nothing was saved" });
  }

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

const show = async (req, res, next) => {
  console.log("Controller --> Show - all");
  let dbFind = await Job.find({}).exec();
  console.log(dbFind);
};

const index = async (req, res, next) => {
  console.log("Controller --> Show - one");
  console.log(req.params);

  try {
    let result = await Job.find({ _id: req.params.id }).exec();
    res.send(result);
    res.status(204);
    console.log(result);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
};

const update = async (req, res, next) => {
  console.log("Controller --> Update");
  console.log(req.params);

  try {
    const postToUpdate = await Job.findOne({ _id: req.params.id }).exec();

    if (req.body.startingDate) {
      postToUpdate.startingDate = req.body.startingDate;
    }
    if (req.body.status) {
      postToUpdate.status = req.body.status;
    }
    if (req.body.algorithmId) {
      postToUpdate.algorithmId = req.body.algorithmId;
    }
    if (req.body.datasetId) {
      postToUpdate.datasetId = req.body.datasetId;
    }
    if (req.body.userId) {
      postToUpdate.userId = req.body.userId;
    }

    await postToUpdate.save();
    res.send(postToUpdate);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
};

const destroy = async (req, res, next) => {
  console.log("Controller --> Destroy");

  try {
    await Job.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
};

module.exports = {
  create,
  show,
  index,
  update,
  destroy,
};
