import "@/config/environment";
import { config } from "@/config/environment";
import app from "@/app";
import { connectMongoDB } from "@/config/mongodb";

const PORT = config.server.port;

(async () => {
    await connectMongoDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
