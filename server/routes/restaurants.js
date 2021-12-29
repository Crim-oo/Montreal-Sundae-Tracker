const express = require("express");
const { RestaurantsJsonManager } = require("../js/managers/restaurants_manager");
const router = express.Router();

const restaurantManager = new RestaurantsJsonManager()

router.get("/restaurants", async(req, res) => {
    try {
        const mcdosUpdated = await restaurantManager.getAllMcdonaldsMenus();
        if (mcdosUpdated.errors && mcdosUpdated.errors.length > 0) {
            return res.status(404).json({
                message: "No mcDonalds found!",
            })
        }
        res.status(200).json({mcdosUpdated})
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error !"
        })

    }
})


module.exports = router;