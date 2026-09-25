// middleware to test if authenticated
function isAuthenticated(req, res, next) {
    if (req.session.uid) next();
    else res.status(401).json({ message: "You aren't logged in lol" });
}

function attachAuthStatus(req, res, next) {
    req.isLoggedIn = !!(req.session.uid);
    console.log(`user of id: ${req.session.uid} is authenticated`);
    next();
}

export {attachAuthStatus};
export default isAuthenticated;