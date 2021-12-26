const express = require("express");
const { RestaurantsJsonManager } = require("../js/managers/restaurants_manager");
const router = express.Router();

const restaurantManager = new RestaurantsJsonManager()


router.get("/restaurants", async(req, res) => {
    try {
        const data = await restaurantManager.getAllMcdonaldsMenus()
        if (data.errors && data.errors.length > 0) {
            return res.status(404).json({
                message: "No restaurants were found !",
            })
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error !"
        })

    }
})

router.put("/restaurants", async(req,res) => {
    try {
        await restaurantManager.updateRestaurants()
        res.status(200).json({
            message: "Json Updated !"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error !"
        })
    }
})


module.exports = router;