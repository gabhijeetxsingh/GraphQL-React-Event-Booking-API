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
    createEvent: async (args) => {
        try {

            const event = new Event({
                title : args.eventInput.title,
                description : args.eventInput.description,
                price : +args.eventInput.price,
                date : new Date(args.eventInput.date),
                creator : mongoose.Types.ObjectId('5e20bddde4c0cc1f31cff656')             
            })
            
            let createdEvent;

            let result = await event.save()

            createdEvent = transformEvent(result);
            let creator = await User.findById(mongoose.Types.ObjectId('5e20bddde4c0cc1f31cff656'))

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