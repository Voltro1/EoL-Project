import express from "express";
import cors from "cors";


const app = express();

app.use(cors({origin: process.env.VITE_API_URL, credentials: true}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb'}));

app.get("/api/password/username/:username", async (req, res) =>{
    try{
        const pass = await getUserPasswordName(req.params.username);
        res.json(pass);
        console.log(pass);
    }catch (err){
        console.error(err);
        res.status(500).json({error: "Database query failure"});
    }
});

app.listen(3000, () => console.log("server running on port 3000"));
