const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const { id } = req.params;
  const { userID } = req.user;

  const singleJob = await Job.findOne({ _id: id, createdBy: userID });

  res.status(StatusCodes.OK).json({ singleJob });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { userID } = req.user;
  const { company, position, status } = req.body;

  if (!company || !position || !status) {
    throw new BadRequestError("Company position and status cannot be empty");
  }

  const updatedJob = await Job.findOneAndUpdate(
    { _id: id, createdBy: userID },
    req.body,
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const { userID } = req.user;

  const deletedJob = await Job.deleteOne({ _id: id, createdBy: userID });

  res.status(StatusCodes.OK).json({ deletedJob });
};

module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
};
