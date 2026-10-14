const express   = require("express");
const router    = express.Router();
const mongoose  = require("mongoose");
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "advantage_jwt_2025";

const User = mongoose.models.User || mongoose.model("User",
  new mongoose.Schema({
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    phone:    { type: String, default: "" },
    password: { type: String, required: true },
  }, { timestamps: true })
);

function sign(id){ return jwt.sign({id}, JWT_SECRET, {expiresIn:"7d"}); }

function authMiddleware(req,res,next){
  const h = req.headers.authorization;
  if(!h||!h.startsWith("Bearer ")) return res.status(401).json({error:"No token"});
  try{
    const decoded = jwt.verify(h.split(" ")[1], JWT_SECRET);
    req.userId = decoded.id;
    next();
  }catch{ res.status(401).json({error:"Invalid token"}); }
}

// POST /api/auth/register
router.post("/register", async (req,res)=>{
  try{
    const {name,email,phone,password} = req.body;
    if(!name||!email||!password) return res.status(400).json({error:"Name, email and password required"});
    const exists = await User.findOne({email:email.toLowerCase()});
    if(exists) return res.status(400).json({error:"Email already registered. Please sign in."});
    const hash = await bcrypt.hash(password,10);
    const user = await User.create({name,email,phone,password:hash});
    res.status(201).json({token:sign(user._id),user:{id:user._id,name:user.name,email:user.email,phone:user.phone}});
  }catch(err){ res.status(500).json({error:err.message}); }
});

// POST /api/auth/login
router.post("/login", async (req,res)=>{
  try{
    const {email,password} = req.body;
    if(!email||!password) return res.status(400).json({error:"Email and password required"});
    const user = await User.findOne({email:email.toLowerCase()});
    if(!user) return res.status(401).json({error:"No account found with this email"});
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({error:"Incorrect password"});
    res.json({token:sign(user._id),user:{id:user._id,name:user.name,email:user.email,phone:user.phone}});
  }catch(err){ res.status(500).json({error:err.message}); }
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req,res)=>{
  try{
    const user = await User.findById(req.userId).select("-password");
    if(!user) return res.status(404).json({error:"User not found"});
    res.json(user);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// GET /api/auth/my-enquiries — customer sees their own enquiries by email
router.get("/my-enquiries", authMiddleware, async (req,res)=>{
  try{
    const user = await User.findById(req.userId).select("email");
    if(!user) return res.status(404).json({error:"User not found"});
    const InquiryModel = mongoose.models.Inquiry;
    if(!InquiryModel) return res.json([]);
    const list = await InquiryModel.find({email:user.email}).sort({createdAt:-1}).limit(20);
    res.json(list);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// GET /api/auth/all-users — admin sees all registered customers
router.get("/all-users", async (req,res)=>{
  try{
    const token = (req.headers["x-admin-token"]||"").trim();
    const expected = (process.env.ADMIN_TOKEN||"advantage_admin_secret_2025").trim();
    if(token!==expected) return res.status(401).json({error:"Unauthorized"});
    const users = await User.find().select("-password").sort({createdAt:-1});
    res.json(users);
  }catch(err){ res.status(500).json({error:err.message}); }
});

module.exports = router;