const jwt = require('jsonwebtoken');
const {authenticateToken} = require('../../utils')

module.exports = {
    getUserCookie: async(req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            const userDTO = {
                email: decodedToken.email,
                address: decodedToken.address,
                city: decodedToken.city,
                type: decodedToken.type,
                fullname: decodedToken.fullname,
                phone: decodedToken.phone
            };
            return res.status(200).json(userDTO)
        }
        else return res.status(401).json({ Msg: "Session Is Expired" });
    }
}