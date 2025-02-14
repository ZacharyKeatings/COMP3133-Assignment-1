const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userResolvers = {
    Mutation: {
        async signup(_, { username, email, password }) {
    
          if (typeof password !== "string" || password.trim().length === 0) {
            throw new Error("Invalid password: Password must be a non-empty string.");
          }
    
          const existingUser = await User.findOne({ email });
          if (existingUser) throw new Error("Email already in use");
    
          try {
            console.log("before hashing Password:");
            const hashedPassword = bcrypt.hashSync(password, 10);
            console.log("Hashed Password:", hashedPassword);
    
            const user = new User({
              username,
              email,
              password: hashedPassword,
              created_at: new Date(),
              updated_at: new Date(),
            });
    
            await user.save();
            return user;
          } catch (error) {
            console.error("Error hashing password:", error);
            throw new Error("Internal Server Error while hashing password.");
          }
        },
  },
  Query: {
    async login(_, { email, password }) {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return { token, user };
    },
  },
};

module.exports = userResolvers;
