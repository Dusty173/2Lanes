"use strict";

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const {
  ensureLoggedIn,
  ensureCorrectUserOrAdmin,
  ensureAdmin,
} = require("../middleware/auth");
const Drive = require("../models/drive");

const createDriveSchema = require("../schemas/createDrive.json");
const updateDriveSchema = require("../schemas/createDrive.json");
const searchDriveSchema = require("../schemas/searchDrive.json");
const joinDriveSchema = require("../schemas/joinDriveSchema.json");
const router = express.Router();

// User route for getting a list of Drives

router.get("/", ensureLoggedIn, async (req, res, next) => {
  const q = req.query;
  try {
    const validator = jsonschema.validate(q, searchDriveSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.message);
      throw new BadRequestError(errs);
    }
    const drives = await Drive.getDrives(q);
    return res.json({ drives });
  } catch (err) {
    return next(err);
  }
});

// User route for getting a certain drive

router.get("/:title", ensureLoggedIn, async (req, res, next) => {
  try {
    const drive = await Drive.getDrive(req.params.title);
    return res.json({ drive });
  } catch (err) {
    return next(err);
  }
});

// User/Admin route for updating a drive, only if user created this drive.

router.patch("/:title", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, updateDriveSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.message);
      throw new BadRequestError(errs);
    }

    const drive = await Drive.update(req.params.title, req.body);
    return res.json({ drive });
  } catch (err) {
    return next(err);
  }
});

// User/Admin route for removing a Drive

router.delete("/:title", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    await Drive.remove(req.params.title);
    return res.json({ deleted: req.params.title });
  } catch (err) {
    return next(err);
  }
});

// Admin Route for creating a drive

router.post("/", ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, createDriveSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.message);
      throw new BadRequestError(errs);
    }
    const drive = await Drive.create(req.body);
    return res.json(drive);
  } catch (err) {
    return next(err);
  }
});

// User route for joining a Drive

router.post("/:title/join", ensureLoggedIn, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, joinDriveSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.message);
      throw new BadRequestError(errs);
    }
    const join = await Drive.joinDrive(req.body);
    return res.json(join);
  } catch (err) {
    return next(err);
  }
});

// Background request for getting the list of user data which have joined a drive

router.get("/:title/party", ensureLoggedIn, async (req, res, next) => {
  try {
    const party = await Drive.getParty(req.params.title);
    return res.json({ party });
  } catch (err) {
    return next(err);
  }
});

// Route for a user to Leave a drive

router.delete("/:title/leave", ensureLoggedIn, async (req, res, next) => {
  try {
    console.log(req.body);
    const deleted = await Drive.leaveDrive(req.params.title, req.body);
    return res.json({ deleted });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
