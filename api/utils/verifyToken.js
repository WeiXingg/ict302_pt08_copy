import jwt from "jsonwebtoken"

export const verifyToken = async (req, res) => {
    const token = req.body.access_token || req.query.access_token;
    if (!token) {
        res.status(401).send("You are not authenticated!");
        return false;
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT);
        req.user = decodedToken;
        return true;
    } catch (e) {
        res.status(403).send("Token is not valid!")
        return false;
    }
}

export const verifyUser = (req, res, next) => {
    if (!verifyToken(req, res)) {
        return;
    }
    next();
}

export const verifyAdmin = (req, res, next) => {
    if (!verifyToken(req, res)) {
        return;
    }

    if (req.user.isAdmin) {
        next();
    } else {
        res.status(403).send("You are not authorised as admin!")
    }
}