const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const User= require("../../models/user");

const transformBooking = booking => {
    return  {...booking._doc, 
        _id: booking.id,
        user : user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt : dateToString(booking._doc.createdAt),
        updatedAt : dateToString(booking._doc.updatedAt)
    }
}

module.exports = {
    createUser:async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
              throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            });
      
            const result = await user.save();
      
            return { ...result._doc, password: null, _id: result.id };
          } catch (err) {
            throw err;
          }
    },
    login : async({email , password}) =>{
      const user = await User.findOne({email});

      if(!user) {
        throw new Error("User does not exists!");
      }

      let isEqual = await bcrypt.compare(password, user.password);
      console.log(isEqual)
      if(!isEqual){
        throw new Error("Password is incorrect!")
      }

      const token = jwt.sign({userId : user.id, email : user.email}, "somesupersecretkey",{
        expiresIn: "1h"
      })

      return {userId : user.id, token : token, tokenExpiration : 1}
    }          
}