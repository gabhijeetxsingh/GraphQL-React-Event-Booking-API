const mongoose = require("mongoose");
const Event= require("../../models/event");
const User= require("../../models/user");
const {transformEvent}= require("./merge");

module.exports = {
    events :async () => {
        try {

            let events = await Event.find()

            return events.map(event=> {
                return transformEvent(event);
            });

        }catch(err){
            throw err;
        };
    },
    createEvent: async (args, req) => {

        if(!req.isAuth) {
            throw new Error("Unauthenticated!")
        }
        try {

            const event = new Event({
                title : args.eventInput.title,
                description : args.eventInput.description,
                price : +args.eventInput.price,
                date : new Date(args.eventInput.date),
                creator : mongoose.Types.ObjectId(req.userId)             
            })
            
            let createdEvent;

            let result = await event.save()

            createdEvent = transformEvent(result);
            let creator = await User.findById(mongoose.Types.ObjectId(req.userId))

            if(!creator) {
                throw new Error("User does not exists")
            }

            creator.createdEvents.push(event);

            await creator.save();
            return createdEvent;
        }
        catch(err){
            console.log(err);
            throw err;
        };
    }       
}