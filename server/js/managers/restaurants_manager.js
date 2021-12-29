const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));


class RestaurantsJsonManager {
    constructor() {}

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

    async getRestaurants() {
        const allMtl = await this.getAllMtlRestaurants();
        const newRestaurants = this.getAllMcdonaldsOpen(allMtl)
        return newRestaurants;
    }


    async getAllMcdonaldsMenus() {
        const allOpenMcDonalds = await this.getRestaurants();
        const headers = {
            "App-Token": process.env.APP_TOKEN
        }

        const userPromises = allOpenMcDonalds.map(mcdo => fetch(`${process.env.SKIP_API}${mcdo["url"]}?fullMenu=true&language=en`,{headers}).then(response => response.json()))
        const menuList = Promise.all(userPromises).then(values=>values)

        const mcDonaldsInfo = []


        for (const menu of (await menuList)){
            const category = menu["menu"]["menuGroups"].slice(2)
            for(const cat of category){
                if(cat["name"] === "Desserts"){
                    const data = this.getSundaesUnavailable(cat["menuItems"])
                    if(data.length >= 1 ) menu["unavailable"] = data
                }
                
            }
            const menuCopy = {
                name:menu["name"],
                lat: menu["location"]["latitude"],
                lng:menu["location"]["longitude"],
                unavailable: menu["unavailable"]

            }
            mcDonaldsInfo.push(menuCopy)
        }
        return mcDonaldsInfo;
    }

    getSundaesUnavailable(menuitems) {
        const unavailableFlurr = []
        for(const item of menuitems) {
            if(!item["available"]){
                if(item["name"].includes("Coupe")){
                    const newItemName = item["name"].includes("caramel") ? "Hot Caramel Sundae" : "Hot Fudge Sundae"
                    unavailableFlurr.push(newItemName)
                    }
                }
            }
        return unavailableFlurr
    }
}

module.exports = { RestaurantsJsonManager };