

module.exports = {
    getUserCookie: async(req, res) => {
        console.log(req.session);
        if (req.session.user) {
            const userDTO = {
                email: req.session.user.email,
                address: req.session.user.address,
                city: req.session.user.city,
                type: req.session.user.type,
                fullname: req.session.user.fullname,
                phone: req.session.user.phone
            };
            return res.status(200).json(userDTO)
        }
        else return res.status(401).json({ Msg: "Session Is Expired" });
    }
}