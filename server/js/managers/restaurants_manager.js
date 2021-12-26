const { response } = require("express");
const path = require("path");
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

const { FileSystemManager } = require("./file_system_manager");

const fileSystemManager = new FileSystemManager();

class RestaurantsJsonManager {
    constructor() {
        this.JSON_PATH = path.join(__dirname + "../../../data/restaurants.json");
    }

    async getAllMtlRestaurants(){
        const headers = {
            "App-Token": process.env.APP_TOKEN,
            "Content-Type": "application/json",
            "Accept-Language": "en",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Content-Type": "application/json"
           }
        const body = {
            "operationName":"QueryRestaurantsCuisinesList",
            "variables":{
                "city":"montreal",
                "province":"QC",
                "dateTime":0,
                "isDelivery":true,
                "search":"mcdonalds",
                "sortBy":{"index":-1,"value":null},
                "language":"en","address":{}
            },
            "extensions":{"persistedQuery":{"version":1,"sha256Hash":"7b26cd706d2cb6f061afbb257debd2d8172472a5a3f94059379c78767dde5954"}}
            }

        const response = await fetch(`${process.env.SKIP_URL}`,{
            method: "POST",
            headers,
            body : JSON.stringify(body)
        })
        return await response.json();
    }

    getAllMcdonaldsOpen = (data) => {
        const restaurantsList = []
        for(const restaurant of data["data"]["restaurantsList"]["openRestaurants"]){
            if(restaurant["cleanUrl"].includes("mcdonalds") && restaurant["location"]["position"]){
                const item = {
                    "name": restaurant["location"]["name"],
                    "url": restaurant["cleanUrl"],
                    "location": restaurant["location"]["position"],
                    "open": restaurant["isOpen"],
                }
                restaurantsList.push(item);
            }
        }
        return restaurantsList
    }

    async updateRestaurants() {
        const allMtl = await this.getAllMtlRestaurants();
        const newRestaurants = this.getAllMcdonaldsOpen(allMtl)
        if(newRestaurants){
            await fileSystemManager.writeToJsonFile(this.JSON_PATH,JSON.stringify({newRestaurants}))
        }
    }

    async getAllRestaurants() {
        const fileBuffer = await fileSystemManager.readFile(this.JSON_PATH);
        const restaurantsContainer = JSON.parse(fileBuffer);
        return restaurantsContainer["newRestaurants"];
    }

    async getAllMcdonaldsMenus() {
        const allOpenMcDonalds = await this.getAllRestaurants();
        const headers = {
            "App-Token": process.env.APP_TOKEN
        }

        const userPromises = allOpenMcDonalds.map(mcdo => fetch(`${process.env.SKIP_API}${mcdo["url"]}?fullMenu=true&language=en`,{headers}).then(response => response.json()))
        const menuList = Promise.all(userPromises).then(values=>values)

        const mcDonaldsInfo = []

        for (const menu of (await menuList)){
            const category = menu["menu"]["menuGroups"].slice(2)
            for(const cat of category){
                const data = this.getMcFlurryUnavailable(cat["menuItems"])
                if(data.length >= 1 ) menu["unavailable"] = data
            } 
            mcDonaldsInfo.push(menu)
        }
        return mcDonaldsInfo;
    }

    getMcFlurryUnavailable(menuitems) {
        const unavailableFlurr = []
        for(const item of menuitems) {
            if(!item["available"]){
                if(item["name"].includes("Flurr") && !item["name"].includes("Egg")){
                    unavailableFlurr.push(item["name"])
                    }
                }
            }
        return unavailableFlurr
    }
}

module.exports = { RestaurantsJsonManager };