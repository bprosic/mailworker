const fs = require('fs');

// Rate limit middleware
const BlockRouteMiddleware = (req, res, next) => {
  const filepath = 'stop_service';
  if (fs.existsSync(filepath)) {
    return res.sendStatus(503); // service unavailable
  }
  next();
};
module.exports = BlockRouteMiddleware;
