const allowRoles =
  (...roles) =>
  (req, res, next) => {
    if (
      !roles.includes(
        req.user.role
      )
    ) {
      console.log(req.user.role)
      console.log(roles)
      return res.status(403).json({
        message: "You are not Authorized to Perform This Action",
      });
    }

    next();
  };

export default allowRoles;