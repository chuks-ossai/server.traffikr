exports.profileController = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  return res.status(200).json({
    Success: true,
    ErrorMessage: null,
    Results: [req.profile],
  });
};
