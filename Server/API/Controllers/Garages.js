const mongoose = require('mongoose');
const Garages = require('../Models/Garages');
const {authenticateToken} = require('../../utils')

module.exports = {
    addNewGarage: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            const { gname, gemail, gdesc, gaddress, gcity, ghours,gimg,gphone } = req.body;

            const Garage = new Garages({
                _id: new mongoose.Types.ObjectId(),
                gname, gemail, gdesc, gaddress, gcity, ghours, greview: [],gimg,gphone
            });

            Garages.save().then(() => {
                return res.status(200).json({ Msg: 'Added successfully' })
            }).catch(err => { console.error(err) })
        }
        else return res.status(401).json({ Msg: "Session Is Expired" });
    },
    updateGarage: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            Garages.updateOne({ _id: req.params.gid }, req.body).then(() => {
                return res.status(200).json({ Msg: "Garage id: " + req.params.gid + " Updated" });
            }).catch(err =>{console.error(err)});
        }
        else return res.status(401).json({ Msg: "Session Is Expired" });
    },
    getGarages:(req,res)=>{
        Garages.find({}).then((garages) => {return res.status(200).json(garages)})
        .catch(err=>{console.error(err)})
    },
    deleteGarage:(req,res)=>{
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            Garages.deleteOne({ _id: req.params.gid }).then(() => {
                return res.status(200).json({ Msg: "Deleted Garage:" + " " + req.params.gid });
            }).catch(err=>{console.error(err)})
        } else return res.status(401).json({ Msg: "Session Is Expired" })
    }
};
